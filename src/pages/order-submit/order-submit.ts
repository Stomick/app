import {Component, trigger, transition, style, animate} from '@angular/core';
import {NavController, NavParams, LoadingController, ToastController, AlertController} from 'ionic-angular';
import {Order} from "../../models/order.model";
import {PaymentPage} from "../payment/payment";
import {SportCenterService} from "../../providers/sport-center.service";
import {InAppBrowser} from '@ionic-native/in-app-browser';
import {BookInfoPage} from "../book-info/book-info";
import * as  configURL from "../../config/prod.config";
import {PaymentIFramePage} from "../payment-i-frame/payment-i-frame";
import {Keyboard} from "@ionic-native/keyboard";
import {PopoverController} from 'ionic-angular';
import {OfferPage} from '../offer/offer';

@Component({
  selector: 'page-order-submit',
  templateUrl: 'order-submit.html',
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({height: 0, opacity: 0}),
          animate('300ms', style({height: 150, opacity: 1}))
        ]),
        transition(':leave', [
          style({height: 150, opacity: 1}),
          animate('300ms', style({height: 0, opacity: 0}))
        ])
      ]
    )
  ]
})

export class OrderSubmitPage {

  order: Order;
  addCommentShow: boolean = false;
  time: Date = new Date();
  browserURL: string = configURL.default.paymentURL;
  mask = ['+', /\d/, '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public sportCenterService: SportCenterService,
              private loadingCtrl: LoadingController,
              private keyboard: Keyboard,
              public toastCtrl: ToastController,
              public iab: InAppBrowser,
              public alertCtrl: AlertController,
              public popoverCtrl: PopoverController) {
    this.order = this.navParams.get('order');
    this.time = new Date(this.order.time);
  }

  ionViewDidLoad() {
    console.log(this.order);
  }

  submitOrder(): void {
    if (this.order.user.phone.replace(/\D+|\s/g, '').length === 11) {
      this.order.user.phone = this.order.user.phone.replace(/\D+|\s/g, '');
      this.sendRequest();
    } else {
      this.showAlert();
    }
  }

  onFocus() {
    let scontent = document.body.querySelector('page-order-submit .scroll-content');
    scontent.classList.remove("keyboardClosed");
    scontent.classList.add("keyboardOpened");
  }

  onBlur() {
    let scontent = document.body.querySelector('page-order-submit .scroll-content');
    scontent.classList.remove("keyboardOpened");
    scontent.classList.add("keyboardClosed");
  }

  presentOffer() {
    let popover = this.popoverCtrl.create(OfferPage, {}, {
      cssClass: 'gui-popover-wrapper'
    });

    popover.present();
  }

  private showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Упс',
      subTitle: 'Проверьте номер телефона',
      buttons: ['OK']
    });
    alert.present();
  }

  private sendRequest() {

    let loading = this.loadingCtrl.create({
      content: "Пожалуйста, подождите..."
    });
    loading.present();

    this.sportCenterService.placeOrder(this.order).subscribe((res) => {
      let toast = this.toastCtrl.create({
        message: 'Бронирование размещено, оплатите за 30 минут',
        position: 'center',
        duration: 4000,
        showCloseButton: true,
        closeButtonText: "закрыть"
      });

      let id = res;
      loading.dismissAll();

      // this.iab.create(`${this.browserURL}?id=${id}`, '_system', {location: 'yes'});

      //this.navCtrl.pop();
      this.navCtrl.push(PaymentIFramePage, {url: `${this.browserURL}?id=${id}`});
      setTimeout(() => {
        this.navCtrl.insert(3, BookInfoPage, {id: id});
        this.navCtrl.remove(2);
      });
    }, (err) => {

      loading.dismissAll();
      let toast = this.toastCtrl.create({
        message: 'Не удалось разместить заказ, обратитесь к администратору',
        position: 'center',
        duration: 4000,
        showCloseButton: true,
        closeButtonText: "закрыть"
      });
      toast.present();
    });
  }

  phoneInputMaskBugfix(value) {
    this.order.user.phone = value;
  }
}
