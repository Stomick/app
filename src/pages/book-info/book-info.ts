import {Component, ElementRef, ViewChild} from '@angular/core';
import {AlertController, Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import {Booking} from "../../models/Booking";
import {DashboardService} from "../dashboard/dashboard.service";
import {TimeSelectPage} from "../time-select/time-select";
import {MapPage} from "../map/map";
import {SocialShare} from "../../components/SocialShare/SocicalShare";
import * as  configURL from "../../config/prod.config";
import {InAppBrowser} from '@ionic-native/in-app-browser';
import {PaymentIFramePage} from "../payment-i-frame/payment-i-frame";
import {DashboardPage} from "../dashboard/dashboard";

@Component({
  selector: 'page-book-info',
  templateUrl: 'book-info.html'
})
export class BookInfoPage {

  @ViewChild('contentnode') contentNode: ElementRef;
  book: Booking = null;
  id: string;
  loader: Loading;
  socialShare: SocialShare;
  browserURL: string = configURL.default.paymentURL;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dashBoardService: DashboardService,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public iab: InAppBrowser) {
    this.socialShare = new SocialShare();
  }

  ionViewDidLoad() {
    this.id = this.navParams.get('id');

    this.dashBoardService.getBooking(this.id).subscribe(((res: Booking) => {
      this.book = res;
    }), (err) => {
      // if error go back to list
      this.navCtrl.pop();
    });
  }

  /**
   * load system browser with payment credentials
   */
  goToPayment() {
    const paymentSystemURL = `${this.browserURL}?id=${this.id}`;
   // this.iab.create(`${this.browserURL}?id=${this.id}`, '_system', {location: 'yes'});

    this.navCtrl.push(PaymentIFramePage, {url: paymentSystemURL});
  }

  goToMainPage() {
    this.navCtrl.setRoot(TimeSelectPage);
  }

  goBack() {
    this.navCtrl.pop();
  }

  goToBookings() {
    this.navCtrl.push(DashboardPage);
  }

  goToMapRout() {
    this.presentLoading();

    this.dashBoardService.getBookingRoute(this.book.playingFieldID).subscribe((res) => {
      this.dismissLoading();
      this.navCtrl.push(MapPage, {'pointB': {lat: res.latitude, lng: res.longitude}});
    }, (err) => {
      this.dismissLoading();
      this.showAlert();
    });
  }

  showAlert(): void {
    let alert = this.alertCtrl.create({
      title: 'Ошибка',
      subTitle: 'Спортивный центр не найден',
      buttons: ['OK']
    });
    alert.present();
  }

  presentLoading(): void {
    this.loader = this.loadingCtrl.create({
      content: "Пожалуйста, подождите..."
    });
    this.loader.present();
  }

  dismissLoading(): void {
    this.loader.dismissAll();
  }

  sendMail(): void {
    this.loader = this.loadingCtrl.create({
      content: "Пожалуйста, подождите..."
    });
    this.loader.present();

    this.socialShare.sendMailBooking(this.id, this.book, this.contentNode).then(() => {
      this.dismissLoading();
    }).catch(() => {
      this.dismissLoading();

      let alert = this.alertCtrl.create({
        title: 'Ошибка',
        subTitle: 'Спортивный центр не найден',
        buttons: ['OK']
      });
      alert.present();
    });
  }

  shareToFriend(): void {
    this.socialShare.shareToFriend(this.book.date);
  }

  sendSuppotMail(): void {
    this.socialShare.sendSuppotMail();
  }

  checkPayment(): void {
    this.presentLoading();

    this.dashBoardService.getBooking(this.id).subscribe(((res: Booking) => {
      this.book = res;
      this.dismissLoading();
    }), (err) => {
      // if error go back to list
      this.navCtrl.pop();
      this.dismissLoading();
    });
  }
}
