import {Injectable} from '@angular/core';
import * as config from '../../config/prod.config';
import {Http, Headers, Response, URLSearchParams} from "@angular/http";
import 'rxjs';
import {AuthService} from "../../providers/auth.service";
import {Observable} from "rxjs";
import {Booking} from "../../models/Booking";

@Injectable()
export class DashboardService {

  private API_URL: string = config.default.API_PATH;
  private headers: Headers = new Headers();
  private token: string = AuthService.getCurrentUser().token;

  constructor(private  http: Http) {

   /* this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Access-Control-Allow-Headers', "*");
    */
    this.headers.append("Authorization", `Bearer ${this.token}`);
  }

  getOwnBookings(): Observable<Booking[]> {
    return this.http.get(`${this.API_URL}bookings/my-bookings`, {headers: this.headers})
      .map(this.parseBookings)
      .catch(this.handleError);
  }

  getBooking(id: string): Observable<Booking> {

    let urlParams = new URLSearchParams();
    urlParams.append('id', id);

    return this.http.get(`${this.API_URL}bookings/my-booking`, {headers: this.headers, search: urlParams})
      .map((res) => {
        return new Booking(res.json());
      })
      .catch(this.handleError);
  }

  getBookingRoute(id: string): Observable<any> {
    let urlParams = new URLSearchParams();
    urlParams.append('id', id);

    return this.http.get(`${this.API_URL}playing-fields/create-route`, {headers: this.headers, search: urlParams})
      .map(res => res.json())
      .catch(this.handleError);
  }

  parseBookings(res: Response) {

    let data = res.json();
    let arr = [];
    data.forEach((item) => {
      arr.push(new Booking(item));
    });

    return arr;
  }

  parseData(res: Response) {
    let data = res.json();
    return data;
  }

  private handleError(error: Response | any) {
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
