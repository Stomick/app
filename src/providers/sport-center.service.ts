import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import * as config from '../config/prod.config';
import {Http, Headers, Response, URLSearchParams} from "@angular/http";
import 'rxjs';
import {Place} from "../models/place.model";
import {AuthService} from "./auth.service";
import {Order} from "../models/order.model";
import {Geolocation} from '@ionic-native/geolocation';
import {Platform} from 'ionic-angular';


@Injectable()
export class SportCenterService {

  private API_URL: string = config.default.API_PATH;
  private API_ERR: string = config.default.API_ERROR;
  private headers: Headers = new Headers();
  private token: string = AuthService.getCurrentUser().token;
  public position: { lat: number, lng: number };


  constructor(private  http: Http, private platform: Platform, public geolocation: Geolocation) {
    this.headers.append("Authorization", `Bearer ${this.token}`);
    this.position = { lat: 0, lng: 0 };
  }

  parseData(response) {
    return response.json();
  }

  public schedule(id, startDate, endDate) {
    return this.http
      .get(this.API_URL + 'bookings/schedule?id=' + id + '&startDate=' + startDate + '&endDate=' + endDate, {headers: this.headers}).map(this.parseData)
  }

  /**
   * GET request
   * @param date
   * @return {Observable<Place[]>}
   */
  public getSportCenters(date: Date): Observable<Place[]> {
    //this.position = { lat: position.lat, lng: position.lng };

    if (this.platform.ready()) {

      let params = new URLSearchParams();
      params = this.divideDate(params, date);

      return this.http.get(`${this.API_URL}sport-centers/list`, {headers: this.headers, search: params})
        .map(this.parseSportCenters)
        .map((places: Place[]) => {
          if(this.position.lat == 0 && this.position.lng == 0 ){
            this.getPosition();
          }
          return this.updateDistance(places);
        })
        .catch(this.handleError);
    };
  }

  public getPosition(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.position = {lat: position.coords.latitude, lng: position.coords.longitude};
          window.console.log(this.position, 'navi');
        },
        (error) => {

        },
        {
          enableHighAccuracy: true,
          timeout: 50000,
          maximumAge: 0
        }
      );
    } else if(this.geolocation) {
      this.geolocation.getCurrentPosition().then(
        (res) => {

          this.position = {lat: res.coords.latitude, lng: res.coords.longitude};
          window.console.log(this.position, 'geo');

        }).catch(error => {
        window.console.log(error);
      });
    }else{
      const watch = this.geolocation.watchPosition().subscribe(pos => {
        window.console.log('lats: ' + pos.coords.latitude + ', lons: ' + pos.coords.longitude);
        this.position= {lat: pos.coords.latitude, lng: pos.coords.longitude};
        window.console.log(this.position, 'watch');
      });

      // to stop watching
      watch.unsubscribe();
    }
  }
  /**
   * GET request
   * @param date
   * @param place {Place}
   * @return {Observable<Place>}
   */
  public checkSportCenter(date: Date, place: Place): Observable<Place> {

    let params = new URLSearchParams();
    params.append('id', '' + place.id);
    params = this.divideDate(params, date);

    return this.http.get(`${this.API_URL}sport-centers/sport-center`, {headers: this.headers, search: params})
      .map((res: Response) => {
        return new Place(res.json());
      })
      .map((place: Place) => {
        if (this.position && place.latitude != 0 && place.longitude != 0) {
          place.distance =
            this.getDistanceFromLatLonInKm(this.position.lat, this.position.lng, place.latitude, place.longitude);
        } else {
          place.distance = null;
        }
        return place;
      })
      .catch(this.handleError);
  }

  /**
   * Divide date to many items
   * @param params
   * @param date
   * @return {URLSearchParams}
   */
  private divideDate(params: URLSearchParams, date): URLSearchParams {

    params.append('year', '' + date.getFullYear());
    params.append('month', '' + (parseInt(date.getMonth()) + 1));
    params.append('day', '' + date.getDate());
    /*
    params.append('hour', '' + date.getHours());
    params.append('start_hour', '' + 'date.getHours());
    params.append('end_hour', '' + '24');
    */
    date.getDay() < 6 && date.getDay() > 0 ? params.append('type', 'work') : params.append('type', 'weekend');

    return params;
  }

  private parseSportCenters(res: Response) {

    let arr = [];
    let respData = res.json();

    if (respData != null) {
      respData.forEach((item) => {
        arr.push(new Place(item))
      });
    }

    return arr;
  }

  public placeOrder(order: Order): Observable<string> {

    let orderRequest = this.transformOrderForRequest(order);
    return this.http.post(`${this.API_URL}bookings/create-booking`, orderRequest, {headers: this.headers})
      .map((res: Response) => {
        return res.json().id;
      })
      .catch(this.handleError);
  }

  private transformOrderForRequest(order: Order): Object {

    // get time id
    let availableTimeId = order.avaid;
    //date parse

    let date = order.time.split('T')[0].split('-');
    //services
    let serviceIds = [];
    order.orderList.forEach((orderItem) => {
      order.place.services.forEach((service) => {
        if (service.name == orderItem) {
          serviceIds.push({'id': service.id});
        }
      });
    });

    return {
      'availableTimeId': availableTimeId,
      'year': date[0],
      'month': date[1],
      'day': date[2],
      'serviceIds': serviceIds,
      'start_hour': order.sTime,
      'end_hour': order.eTime,
      'price': order.price,
      'comment': order.comment,
      'phone': order.user.phone
    };
  }

  public updateDistance(places: Place[]): Place[] {
    let arr = Array.from(places);

    if (this.position) {
      arr.forEach((item) => {
        if (item.latitude != 0 && item.longitude != 0) {
          item.distance =
            this.getDistanceFromLatLonInKm(this.position.lat, this.position.lng, item.latitude, item.longitude);
        } else {
          item.distance = 0;
        }
      });
    }

    return arr;
  }

  private getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2): number {

    let R = 6371; // Radius of the earth in km
    let dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    let dLon = this.deg2rad(lon2 - lon1);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
    return d;
  }

  private deg2rad(deg): number {
    return deg * (Math.PI / 180)
  }

  private handleError(error: Response | any) {
    console.log('error', error)
    let errMsg: string;
    let status: number;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      status = error.status;
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    // console.log(errMsg);

    return Observable.throw(status);
  }
}
