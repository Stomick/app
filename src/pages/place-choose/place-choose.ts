import {Component, ViewChild, ElementRef} from '@angular/core';
import {NavController, NavParams, LoadingController} from 'ionic-angular';
import {Place} from "../../models/place.model";
import {DashboardPage} from "../dashboard/dashboard";
import {PlacePage} from "../place/place";
import {SportCenterService} from "../../providers/sport-center.service";
import {redirectToAuthPage} from "../../components/Redirects/authRedirect";
import map from 'lodash/map';
import * as moment from 'moment';
// HARDCODE mock places
import Places from "../../mock-data/places"

@Component({
  selector: 'page-place-choose',
  templateUrl: 'place-choose.html'
})
export class PlaceChoosePage {

  @ViewChild('map') mapElement: ElementRef;
  segment: string = "list";
  map: any;
  places: Place[];
  time: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public sportCenters: SportCenterService,
    private loadingCtrl: LoadingController
  ) {}

  /**
   * loads map on view shown
   */
  ionViewDidLoad() {

    let loading = this.loadingCtrl.create({
      content: "Пожалуйста, подождите..."
    });
    loading.present();

    // this.time = this.navParams.get('date');
    // let date = new Date(this.navParams.get('date'));
    let date = new Date(moment(moment().add(1,'day').format(), moment.ISO_8601).format());

    this.sportCenters.getSportCenters(date).subscribe((res) => {
      this.places = res;
      loading.dismissAll();
    }, (err) => {
      loading.dismissAll();
      redirectToAuthPage(err, this.navCtrl);
    });

    // let loading = this.loadingCtrl.create({
    //   content: "Пожалуйста, подождите..."
    // });
    // loading.present();

    // // HARDCODE mock places
    // setTimeout(() => {
    //   this.places = map(Places, (place) => {return new Place(place)});
    //   loading.dismissAll();
    // }, 1000);
  }

  getPlaces() {
    const date = new Date();
    return this.sportCenters.getSportCenters(date);
  }
  /**
   * check tab on type
   * @return {boolean}
   */
  isList(): boolean {
    return this.segment === 'list';
  }

  /**
   * go to previos page
   */
  goBack(): void {

    this.navCtrl.pop(function () {
      window.location.reload();
    });
  }

  /**
   * redirect to dashboard page
   */
  goToDashboard(): void {
    this.navCtrl.push(DashboardPage);
  }

  /**
   * redirect to place page by id that stored in place
   * @param place
   */
  goToPlace(place: Place): void {
    this.navCtrl.push(PlacePage, {place: place});
  }

  /**
   * map event emitter listener
   * @param place
   */
  mapClick(place : any) {
    this.navCtrl.push(PlacePage, {place: place, time: this.time});
  }
}
