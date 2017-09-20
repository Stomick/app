import {Component, ViewChild} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the PaymentIFrame page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-payment-i-frame',
  templateUrl: 'payment-i-frame.html'
})
export class PaymentIFramePage {

  @ViewChild('payFrame') payFrame;
  private url: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.url = this.navParams.get('url');
  }

  ionViewDidLoad() {
    let iframeDoc = this.payFrame.nativeElement.contentWindow.document;
    this.payFrame.nativeElement.src = this.url;
  }

}
