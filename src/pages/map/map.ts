import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Place} from "../../models/place.model";
import {SportCenterService} from "../../providers/sport-center.service";

declare var ymaps;

@Component({
  selector: 'page-map',
  templateUrl: 'map.html'
})
export class MapPage {

  place: Place;
  point: GeoPoint = {
    lat: 0,
    lng: 0
  };
  pointB: GeoPoint;
  map;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public sportCenter: SportCenterService) {
    console.log(this.navParams.data);
  }

  /**
   * check logic type: draw single place or route
   */
  ionViewDidLoad() {
    this.place = this.navParams.get('place') ? this.navParams.get('place') : null;
    this.pointB = this.navParams.get('pointB');

    if (this.place != null) {
      this.point.lat = this.place.latitude;
      this.point.lng = this.place.longitude;

      ymaps.ready(() => {
        this.drawPlace(this.point, this.place.imageLogo)
      });

    } else if (this.pointB != null) {
      ymaps.ready(() => {this.drawRoute() });
    }
  }

  /**
   * draws single placemark on map
   */
  drawPlace(point: GeoPoint, logoURL ?: string): void {
    this.map = new ymaps.Map('map1', {
      center: [point.lat, point.lng], // Москва
      zoom: 12,
      controls: []
    }, {
      searchControlProvider: 'yandex#search'
    });

    this.map.controls.add('zoomControl');

    this.map.geoObjects.add(this.createPlacemark(point , logoURL));
  }

  /**
   * sets route to map from start point(user location) to end point
   */
  drawRoute(): void {

    console.debug('darw route');
    this.map = new ymaps.Map('map1', {
      center: [55.734876, 37.59308], // Москва will be owerride by map route generator
      zoom: 5,
      controls: []
    }, {
      searchControlProvider: 'yandex#search'
    });

    this.map.controls.add('zoomControl');

    let multiRoute = new ymaps.multiRouter.MultiRoute({
      // Описание опорных точек мультимаршрута.
      referencePoints: [
        [this.sportCenter.position.lat, this.sportCenter.position.lng],
        [this.pointB.lat, this.pointB.lng]
      ],
      params: {
        results: 3
      }
    }, {
      boundsAutoApply: true
    });
    this.map.geoObjects.add(multiRoute);
  }

  /**
   * generate placemark
   * @param place
   * @return {ymaps.Placemark}
   */
  createPlacemark(point: GeoPoint, logoURL ?: string): any {
    return new ymaps.Placemark([point.lat, point.lng], {}, {
      iconImageHref: logoURL || 'assets/images/map-marker.png',
      preset: 'islands#governmentCircleIcon',
      iconLayout: 'default#image',
      iconImageSize: [40, 40],
      iconImageOffset: [-20, -20],
      iconColor: '#3b5998'
    });
  }
}

interface GeoPoint {
  lat: number;
  lng: number;
}
