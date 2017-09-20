import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';
import {AuthenticationPage} from "../pages/pages";
import {AuthService} from '../providers/auth.service';

import {TimeSelectPage} from "../pages/time-select/time-select";
import {PlaceChoosePage} from "../pages/place-choose/place-choose";

@Component({
  templateUrl: 'app.html',
  providers: [AuthService]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform,
              public auth: AuthService) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();

      if (AuthService.isAuthentificated()) {
        // this.rootPage = TimeSelectPage;
        this.rootPage = PlaceChoosePage;
      } else {
        this.rootPage = AuthenticationPage;
      }
    }).catch((err) => {
      console.log(err);
      this.rootPage = AuthenticationPage;
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
