import {Component, OnInit, ViewChild} from '@angular/core';
import {NavController, NavParams, LoadingController, ToastController , ModalController , ViewController} from 'ionic-angular';
import moment from 'moment';
import reduce from 'lodash/reduce';
import isUndefined from 'lodash/isUndefined';
import find from 'lodash/find';
import {Place} from "../../models/place.model";
import {DashboardPage} from "../dashboard/dashboard";
import '../../config/russian-time';
import {names} from "../../config/russian-time";
import {OrderSubmitPage} from "../order-submit/order-submit";
import {SportCenterService} from "../../providers/sport-center.service";
import {Order} from "../../models/order.model";
import {AuthService} from "../../providers/auth.service";
import {Slides} from 'ionic-angular';
import {MapPage} from "../map/map";
import {ModalPage} from "../modal-info/modal-info"

@Component({
  selector: 'page-place',
  templateUrl: 'place.html',

})

export class PlacePage implements OnInit {
  get slides(): Slides {
    return this._slides;
  }

  set slides(value: Slides) {
    this._slides = value;
  }

  place: Place;
  avaid: number;
  limit: number;
  date: string;
  time: string;
  sTime: string;
  eTime: string;
  times: string[] = [];
  startTimes: string[] = [];
  endTimes: string[] = [];
  dayShortNames: string = names.dayShortNames;
  monthNames: string = names.monthNames;
  dayNames: string = names.dayNames;
  minDate: string = moment().format();
  maxDate: string;
  oldTime: string;
  description: boolean = false;
  oldData: { place: Place, time: string };
  price: number;
  hourValues: number[];
  playingFields: object[];
  bookings: object[];
  sumbDisable: boolean = true;

  form;
  @ViewChild(Slides) private _slides: Slides;


  fromData = {};
  public bookSelect = {};

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public sportCenters: SportCenterService,
              private loadingCtrl: LoadingController,
              public toastCtrl: ToastController,
              public auth: AuthService ,
              public modalCtrl : ModalController,
              public viewCtrl : ViewController) {
    let today = new Date();
    if (today.getMonth() == 11) {
      this.maxDate = moment(new Date(today.getFullYear() + 1, 1, 1)).format();
    } else {
      this.maxDate = moment(new Date(today.getFullYear(), today.getMonth() + 2, today.getDay() - 1)).format();
    }
  }

  ngOnInit(): void {

    let loading = this.loadingCtrl.create({
      content: "Пожалуйста, подождите..."
    });
    loading.present();

    this.place = this.navParams.get("place");
    // this.oldTime = this.navParams.get("time");

    /**
     * updating sport center information
     */
    // this.sportCenters.checkSportCenter(new Date(this.time), this.place)
    //   .subscribe((res) => {
    //     loading.dismissAll();

    //     this.place = res;
    //     this.time = this.navParams.get("time");

    //     // setting defaults to form radio button
    //     this.bookSelect['playground'] = this.place.playingFields[0].name;

    //   }, () => {
    //     loading.dismissAll();
    //     let toast = this.toastCtrl.create({
    //       message: 'Ошибка загрузки',
    //       duration: 2000
    //     });
    //     toast.present();
    //     this.navCtrl.pop();
    //   });

    // HARDCODE mock places
    setTimeout(() => {
      loading.dismissAll();
      this.place = this.place;

      this.initDatesTimes();

      this.bookSelect['playground'] = this.place.playingFields[0].name;
    }, 1000);

  }

  initDatesTimes() {
    const start = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').format('x');
    const end = moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD').add(this.place.limit, 'days').format('x');
    this.sportCenters.schedule(this.place.id, start, end).subscribe((resposne) => {
      this.bookings = resposne.bookings;
      this.playingFields = resposne.playingFields;
      this.calculateDates(this.playingFields[0]);
      this.calculateTimes(this.minDate, this.playingFields[0]);
      this.dateChange();
    });
  }

  calculateDates(playingField) {
    this.minDate = moment().format();
    this.maxDate = moment().add(this.place.limit, 'days').format();
    this.date = this.minDate;
  }

  calculateTimes(date, playingField) {
    const type = (moment(date).isoWeekday() !== 6 && moment(date).isoWeekday() !== 7) ? 'work' : 'weekend';
    this.times = [];
    /*
    reduce(playingField.availableTime, (memo, time) => {
      const isAvailable = isUndefined(find(playingField.unavailableTimes, (item) => {
        return moment(date).format('YYYY-MM-DD') == item.date && time.hour == item.hour
      }));
      const isntBooking = isUndefined(find(this.bookings, (item) => {
        const bookingDate = moment.unix(item.bookingDate);
        console.log(moment(date).format('YYYY-MM-DD'))
        console.log(time.hour)
        console.log('__________')
        console.log(bookingDate.format('YYYY-MM-DD'))
        console.log(bookingDate.hour())
        console.log('_________________________________________________________________________')
        return moment(date).format('YYYY-MM-DD') == bookingDate.format('YYYY-MM-DD') && time.hour == bookingDate.format('H')
      }));
      if (time.type === type && isAvailable && isntBooking) {
        console.log('available hour', time.hour);
        memo.push(moment(time.hour, 'H').format('HH:mm'));
      }
      return memo;
    }, this.times);
    this.time = this.times[0];
    */
  }

  /**
   * update footer price on page did enter
   */
  ionViewDidEnter() {
    this.price = this.calcPrice(this.bookSelect);
  }

  /**
   * redirect to dashboard
   */
  goToDashboard() {
    this.navCtrl.push(DashboardPage);
  }

  /**
   * check time avaliability for this sport center
   */
  dateChange() {

    const time = moment(moment(this.date).format('YYYY-MM-DD') + ' ' + this.time, 'YYYY-MM-DD HH:mm').format();
    console.log('time', time);

    this.sportCenters.checkSportCenter(new Date(time), this.place)
      .subscribe((res) => {
        console.log(res);

        this.place = res;
        this.updatePrice();

      }, (err) => {
        console.log(err);
        this.oldData = {place: this.place, time: this.time};
        this.place = null;
      });
  }

  chooseDate($event, datepicker) {
    $event.preventDefault();
    datepicker.open();
  }

  /**
   * after data change return data
   */
  returnResults() {
    this.place = this.oldData.place;
    this.time = this.oldTime;
  }

  rangeTimeChange() {
    let ind: number = 0;
    this.endTimes.splice(0, this.endTimes.length);
    this.times.forEach((item) => {
      this.endTimes.push(item);
    });
    this.startTimes.forEach((item) => {
      if (item['hour'] == this.sTime) {
        this.endTimes.splice(0, ind);
        return;
      }
      ind++;
    });
    this.sumbDisable = true;
  }

  endrangeTime() {
    this.sumbDisable = false;
    this.updatePrice();
  }

  /**
   * form submit, parse
   * @param form
   */
  formSubmit(form ?: any) {
      const time = moment(moment(this.date).format('YYYY-MM-DD') + ' ' + this.sTime, 'YYYY-MM-DD HH:mm').format();
      let obj = {
        place: this.place,
        avaid: this.avaid,
        time: time,
        sTime: this.sTime,
        eTime: this.eTime,
        orderList: this.servicesFromForm(this.bookSelect),
        price: this.calcPrice(this.bookSelect),
        orderListPriced: this.collectOrderList(this.bookSelect),
        user: AuthService.getCurrentUser(),
        playground: this.bookSelect['playground']
      };

      let order = new Order(obj);

      this.navCtrl.push(OrderSubmitPage, {order: order});
  }

  /**
   * grabs all values from the form
   * @return {number}
   */


  private collectOrderList(obj): { text: string, price: number }[] {
    let arr = [];

    for (let prop in obj) {
      if (prop == 'playground') {
        this.place.playingFields.forEach((item) => {
          if (item.name == obj[prop]) {
            arr.push({text: item.name, price: item.price});
          }
        });
      }
      if (prop != 'playground') {
        if (obj[prop] != null && obj[prop] == true) {
          this.place.services.forEach((item) => {
            if (item.name == prop) {
              arr.push({text: item.name, price: item.price});
            }
          });
        }
      }
    }
    return arr;
  }

  /**
   * footer price updater
   */



  /**
   * grabs all values from obj
   * @return {string[]}
   */
  private servicesFromForm(obj): string[] {

    let arr = [];

    for (let prop in obj) {
      if (prop != 'playground') {
        if (obj[prop] != null && obj[prop] == true) {
          arr.push(prop);
        }
      }
    }

    return arr;

  }

  changeRangeTime(e, pg) {

    this.startTimes.splice(0, this.startTimes.length);
    this.endTimes.splice(0, this.endTimes.length);
    this.times.splice(0, this.times.length);
    this.avaid = pg.availableTimeId;
    console.log(this.avaid);
    let test = document.getElementsByClassName('select_r_time');
    for (let i = 0; i < test.length; i++) {
      test[i].classList.remove('active');
      window.console.log(test[i].lastElementChild.removeAttribute('checked'));
    }
    if(e !== null && e.srcElement.classList.contains('select_r_time')) {
      e.srcElement.classList.add('active');
      e.srcElement.lastElementChild.setAttribute('checked' , 'true');
    }

    pg.avalableTime.forEach((item) => {
      this.startTimes.push(item);
      this.endTimes.push(item);
      this.times.push(item);
    });

    this.startTimes.splice(this.startTimes.length - 2, 2);
    this.endTimes.splice(0, 2);
    this.times.splice(0, 2);

    this.sTime = this.startTimes[0];
    this.eTime = this.endTimes[0];
    this.updatePrice();
    this.sumbDisable = true;
  }

  updatePrice() {

    this.price = this.calcPrice(this.bookSelect);

  }

  private calcPrice(obj): number {
    let price: number = 0;
    let p = 0;
    let start = false;

    this.startTimes.forEach((item) => {
      if (item['hour'] == this.sTime) {
        start = true;
        console.log(p, start, this.sTime);
      }
      if (item['hour'] == this.eTime) {
        start = false;
      }
      if (start) {
        p += parseInt(item['price']);
      }

    });
    price = p;

    for (let prop in obj) {
      if (prop != 'playground') {
        if (obj[prop] != null && obj[prop] == true) {
          this.place.services.forEach((item) => {
            if (item.name == prop) {
              price += +item.price;
            }
          });
        }
      }
    }
    return price;
  }


  placeOnMap() {
    this.navCtrl.push(MapPage, {'place': this.place});
  }

  openModal() {
    let obj = {userId: '1', name: 'Bob', email: 'bob@unicorn.com'};
    let myModal = this.modalCtrl.create(ModalPage, obj);
    myModal.present();
  }
}
