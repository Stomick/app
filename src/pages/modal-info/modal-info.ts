import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'modal-info',
  templateUrl: 'modal-info.html'
})
export class ModalPage {
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController) {}

  dismiss(data) {
    this.viewCtrl.dismiss(data);
  }
}
