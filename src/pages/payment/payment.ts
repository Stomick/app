import {Component} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {PaymentService} from "../../providers/payment.service";
import {TimeSelectPage} from "../time-select/time-select";
import {DashboardPage} from "../dashboard/dashboard";
import {InAppBrowser} from '@ionic-native/in-app-browser';
import {BookInfoPage} from "../book-info/book-info";
import * as  configURL from "../../config/prod.config";

@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html'
})
export class PaymentPage {

  public payForm: FormGroup;
  private id: string;
  maskCardNumber = [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];
  maskDate = [/[0-1]/, /[0-9]/, '/', /[1-5]/, /[0-9]/];
  maskCVV = [/\d/, /\d/, /\d/];
  mask = ['+', '7', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  private formObj = {}; // mask value bigfix
  browserURL: string = configURL.default.paymentURL;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public fb: FormBuilder,
              public payService: PaymentService,
              public alertCtrl: AlertController,
              public iab: InAppBrowser) {

    this.payForm = fb.group({
      'cardNumber': ['', [Validators.required, Validators.minLength(19)]],
      'date': ['', [Validators.required, Validators.pattern(/(1[0-2]|0[1-9]|\d)\/(\d{2}|0(?!0)\d|[1-9]\d)/)]],
      // 'cvv': ['', [Validators.required, Validators.pattern(/\d{3}/)]],
      'name': ['', Validators.required],
      'submit': [true, [Validators.required, Validators.pattern('true')]]
    });

    this.id = this.navParams.get("id");
  }

  ionViewDidLoad() {
    if (this.id == null) {
      this.navCtrl.pop();
    }
    console.log('ionViewDidLoad PaymentPage', this.id);

    this.openbrowser();
  }

  openbrowser() {
    const browser = this.iab.create(`${this.browserURL}?id=${this.id}`, '_system', {location: 'yes'});

    browser.on('exit').subscribe((res) => {
      this.goToBooking();
    });
  }

  goToBooking() {
    this.navCtrl.setPages([{page: TimeSelectPage}, {page: DashboardPage}]);
    this.navCtrl.push(BookInfoPage, {id: this.id});
  }

  formSubmit() {

    let reqObj = {};
    Object.assign(reqObj, this.formObj);
    reqObj['submit'] = this.payForm.value.submit;
    reqObj['id'] = this.id;

    this.payService.sendPayment(reqObj).subscribe((res) => {

      this.showAlert("Спасибо", "Ваш платеж принят");

      this.navCtrl.setPages([{page: TimeSelectPage}, {page: DashboardPage}]);

    }, (err) => {
      this.showAlert();
    });
  }

  public showAlert(title: string = 'Упс', text: string = 'Не удалось оплатить'): void {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

  private inputChange(name: string, value): void {
    this.formObj[name] = value;
  }
}
