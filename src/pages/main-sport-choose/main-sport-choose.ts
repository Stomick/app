import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {DashboardPage} from "../dashboard/dashboard";
import {TimeSelectPage} from "../time-select/time-select";

/*
 Generated class for the MainSportChoose page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-main-sport-choose',
  templateUrl: 'main-sport-choose.html'
})
export class MainSportChoosePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainSportChoosePage');
  }

  goToDashboard() {
    this.navCtrl.push(DashboardPage);
  }

  goToSport() {
    this.navCtrl.push(TimeSelectPage);
  }
}
