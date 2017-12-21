import {
  Component, ViewChild, ElementRef, OnInit, Input, OnChanges, SimpleChanges, EventEmitter,
  Output
} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Geolocation} from '@ionic-native/geolocation';
import {Place} from "../../../models/place.model";
import {PlacePage} from "../../place/place";
import * as config from "../../../config/prod.config";
declare var ymaps;

@Component({
  selector: 'yandex-map',
  templateUrl: 'map.template.html'
})

export class YandexMap implements OnInit, OnChanges {

  @ViewChild('map') mapElement: ElementRef;
  @Input() places: Place[];
  @Output() placemarkClick: EventEmitter<Place> = new EventEmitter();

  private yamapsLoad: boolean = false;
  map: any;
  time: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public geolocation: Geolocation) {
  }

  marketClick(place : any) {
    this.navCtrl.push(PlacePage, {place: this.places[place], time: this.navParams.get('date')});
  }

  initializeMap(latid, longit) {

    let options = {
      center: {lat: latid, lng: longit},
      zoom: 9,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(document.getElementById("map"), options);
    //google.maps.event.trigger(this.map, 'resize');
    //this.map.getCenter(latid, longit);
    /* We can show our location only if map was previously initialized */
    //this.showMyLocation();
    this.drawMarket();
  }

  drawMarket() {
    if (this.places != null) {
      var index = 0;
      this.places.forEach((place) => {
        if (place.latitude === 0 && place.longitude === 0) {
          console.debug('Map ignored place ---- bacause of coordinates', place);
        } else {
          this.addMarker(place , index);
          index = index + 1;
        }
      });
    }
  }
  addMarker(place: Place, index) {

    var position = new google.maps.LatLng(place.latitude, place.longitude);
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: position,
      icon:  'http://weev.ru/assets/images/google-marker.png'
    });

    let markerInfo = `<div class="balloon">
                      <div class="balloon__col1">
                      <img class="balloon__logo" src="${place.imageLogo}">
                        </div>
                        <div class="balloon__col2">
                      <h2 class="balloon__header">${place.name}</h2>
                        <p class="balloon__address"><i class="img-icon img-icon_coins"></i> от ${place.minPrice} <span>руб.</span>/час</p>
                      <p class="balloon__address"><i class="img-icon img-icon_map-point"></i>${place.address}</p>
                      <p class="balloon__distance">${(place.distance != null )?place.distance.toFixed(0):0} км от Вас</p>
                      </div>
                      </div>
                      <div onclick="marketClick(${index})" class="balloon__button">
                        Выбрать площадку
                      </div>`;

    let infoModal = new google.maps.InfoWindow({
      content: markerInfo
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoModal.open(this.map, marker);
    });

  }


  /**
   * loads map on view shown
   */
  ngOnInit(): void {
    //я думаю что по замыслу предыдущих разработчиков надо было получать геолокацию
    //и показывать текущую позицию но что-то пошло не так, фактически всегда стоял центр москвы
    // мб челы натолкнулись на то что методы Geolocation не работают на андройде 4.4


      this.initializeMap(55.7347176, 37.6956664);

      //this.loadMap(, )
      //this.drawPointers();


    /*Geolocation.getCurrentPosition().then((resp) => {
        //ymaps.ready(this.loadMap(resp.coords.latitude, resp.coords.longitude));
        ymaps.ready(() => {
          this.loadMap(55.76, 37.64);
          this.drawPointers();
        });
      }
    ).catch((error) => {
      ymaps.ready(() => {
        this.loadMap(55.76, 37.64)
        this.drawPointers();
      });
    });*/
  }

  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    //if (this.yamapsLoad) {
      //this.clearMap();
      //this.drawPointers();
    //}
  }


  loadMap(latitude = 55.76, longitude = 37.64): void {
    this.map = new ymaps.Map('map', {
      center: [latitude, longitude], // Москва
      zoom: 9,
      controls: []
    }, {
      searchControlProvider: 'yandex#search'
    });

    this.map.controls.add('zoomControl');

    this.yamapsLoad = true;
  }

  drawPointers() {
    if (this.places != null) {
      this.places.forEach((place) => {
        if (place.latitude === 0 && place.longitude === 0) {
          console.debug('Map ignored place ---- bacause of coordinates', place);
        } else {
          this.map.geoObjects.add(this.createPlacemark(place, this.placemarkClick));
        }
      });

      console.log('map');
      this.map.events.add('click', (e) => {
        console.log(e.get('domEvent'));
      });
    }
  }

  clearMap() {
    this.map.geoObjects.removeAll();
  }


  /**
   * @return {ymaps.Placemark}
   */
  createPlacemark(place: Place, eventEmitter: any): any {

    let placemark = new ymaps.Placemark([place.latitude, place.longitude], {
      balloonContent: `<div class="balloon">
                            <div class="balloon__col1">
                              <img class="balloon__logo" src="${place.imageLogo}">
                            </div>
                            <div class="balloon__col2">
                               <h2 class="balloon__header">${place.name}</h2>
                               <p class="balloon__address"><i class="img-icon img-icon_coins"></i> от ${place.minPrice} <span>руб.</span>/час</p>
                               <p class="balloon__address"><i class="img-icon img-icon_map-point"></i>${place.address}</p>
                               <p class="balloon__distance">${place.distance.toFixed(0)} км от Вас</p>
                            </div>
                       </div>
                       <div class="balloon__button">
                          Выбрать площадку
                       </div>`
    }, {
      preset: 'islands#governmentCircleIcon',
      iconLayout: 'default#image',
      iconImageHref: place.imageLogo,
      iconImageSize: [40, 40],
      iconImageOffset: [-20, -20],
      iconColor: '#3b5998'
    });

    // addign property
    // placemark.balloon.letMeSportPlace = place;

    //adding events for placemark redirect
    placemark.balloon.events.add('click', function (e) {
      // e.preventDefault();
      // e.stopPropagation();
      // eventEmitter.emit(e.get('target').balloon.letMeSportPlace);
      eventEmitter.emit(place);
      console.log(e);
      console.log(e.get('target').balloon);
      // console.log(e.get('domEvent').originalEvent.button);
    });

    return placemark;
  }
}
