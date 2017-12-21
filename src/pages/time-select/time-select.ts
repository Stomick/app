import {Component} from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {PlaceChoosePage} from "../place-choose/place-choose";
import {DashboardPage} from "../dashboard/dashboard";
import {SportCenterService} from "../../providers/sport-center.service";
import * as moment from 'moment';
import {names} from '../../config/russian-time';

@Component({
  selector: 'page-time-select',
  templateUrl: 'time-select.html'
})
export class TimeSelectPage {

  day: string = moment(moment().add(1,'day').format(), moment.ISO_8601).format(); // timezone bug fixed
  minDate: string = new Date().toISOString();
  maxDate: string;
  dayShortNames: string = 'Вс, Пн, Вт, Ср, Чт, Пт, Сб';
  dayNames: string = names.dayNamesIn;
  monthNames : string = names.monthNamesIn;
  minuteValues : number[] = [0];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public toastCtrl: ToastController,
              public sportCenters: SportCenterService) {
    /**
     * setting max date
     * @type {Date}
     */
    let today = new Date();
    if (today.getMonth() == 11) {
      this.maxDate = new Date(today.getFullYear() + 1, 1, 1).toISOString();
    } else {
      this.maxDate = new Date(today.getFullYear(), today.getMonth() + 2, today.getDay() - 1).toISOString();
    }
  }

  ionViewDidLoad() {
  }

  goToDashboard() {
    this.navCtrl.push(DashboardPage);
  }

  goToPlaceChoose() {
    let selectedTime = new Date(this.day);
    let minDate = new Date(this.minDate);

    if (minDate.getDate() >= selectedTime.getDate()
      && minDate.getMonth() >= selectedTime.getMonth()
      && minDate.getHours() >= (selectedTime.getHours() - 1)) {

      let toast = this.toastCtrl.create({
        message: 'Дата не может быть выбрана. Выберите дату, не ранее, чем через 1 час',
        duration: 2000
      });
      toast.present();

    } else {
      this.navCtrl.push(PlaceChoosePage, {date: this.day});
    }
  }
}
