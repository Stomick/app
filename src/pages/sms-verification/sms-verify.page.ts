import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, LoadingController} from 'ionic-angular';
import {AuthService} from '../../providers/auth.service';
import {User} from "../../models/user.model";

import {TimeSelectPage} from "../time-select/time-select";
import {PlaceChoosePage} from "../place-choose/place-choose";

@Component({
  templateUrl: 'sms-verify.page.html',
  selector: 'sms-code',
})
export class SmsVerifyPage implements OnInit {

  name: string;
  phone: string;
  testCode: string;
  testCodeLength: number = 4;
  inputCode: string = '';
  validCode: boolean = true;
  smsSendtimeout: boolean = false;

  constructor(private navCtrl: NavController, private navParams: NavParams, private auth: AuthService,
              private loadingCtrl: LoadingController) {
    this.name = navParams.get('name');
    this.phone = navParams.get('phone');
    this.testCode = navParams.get('code');
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.smsSendtimeout = true;
    }, 30000);
  }

  goBackToAuth() {
    this.navCtrl.pop();
  }

  codeInput() {
    this.validCode = true;
  }

  verifyCode() {
    this.validCode = true;

    if (this.inputCode.length === this.testCodeLength) {

      let loading = this.loadingCtrl.create({
        content: "Пожалуйста, подождите..."
      });
      loading.present();

      this.auth.checkSMSCode(new User({code: this.inputCode, name: this.name, phone: this.phone}))
        .subscribe((res) => {
          loading.dismissAll();
          // this.navCtrl.setRoot(TimeSelectPage);
          this.navCtrl.setRoot(PlaceChoosePage);

        }, (err) => {
          loading.dismissAll();
          this.validCode = false;
        });

    } else if ((this.inputCode.length === this.testCodeLength) || this.inputCode.length != this.testCodeLength) {
      this.validCode = false;
    }
  }

  sendNewCode() {

    let loading = this.loadingCtrl.create({content: 'Новое сообщение отправляется'});
    loading.present();

    this.auth.login(this.name, this.phone).subscribe((res) => {
      loading.dismiss();
      this.testCode = res;

    }, (err) => {
      loading.dismiss();
      console.log(err);
    });
  }
}
