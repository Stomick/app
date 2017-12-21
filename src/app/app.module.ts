import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TextMaskModule } from 'angular2-text-mask';
import {SmsVerifyPage, AuthenticationPage, DashboardPage,
        BookInfoPage, MainSportChoosePage, TimeSelectPage,
        PlaceChoosePage, PlacePage, OrderSubmitPage} from '../pages/pages';

import {AuthService} from '../providers/auth.service';
import {YandexMap} from "../pages/place-choose/map/map.component";
import {DashboardService} from "../pages/dashboard/dashboard.service";
import {SportCenterService} from "../providers/sport-center.service";
import {PaymentPage} from "../pages/payment/payment";
import {DistanceKmPipe, DistancePlaceSort} from "../pages/place-choose/distance.pipe";
import {PaymentService} from "../providers/payment.service";
import {MapPage} from "../pages/map/map";
import {ModalPage} from "../pages/modal-info/modal-info"
import {OfferPage} from "../pages/offer/offer";
import {DatePipeTemplate} from "../components/pipes/date.pipe";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {PaymentIFramePage} from "../pages/payment-i-frame/payment-i-frame";
import {Keyboard} from "@ionic-native/keyboard";
import {Geolocation} from '@ionic-native/geolocation';

@NgModule({
  declarations: [
    ModalPage,
    MyApp,
    AuthenticationPage,
    SmsVerifyPage,
    DashboardPage,
    BookInfoPage,
    MainSportChoosePage,
    TimeSelectPage,
    PlaceChoosePage,
    YandexMap,
    PlacePage,
    OrderSubmitPage,
    PaymentPage,
    DistanceKmPipe,
    DatePipeTemplate,
    DistancePlaceSort,
    MapPage,
    PaymentIFramePage,
    OfferPage
  ],
  imports: [
    FormsModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: ''
    }),
    TextMaskModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ModalPage,
    MyApp,
    AuthenticationPage,
    SmsVerifyPage,
    DashboardPage,
    BookInfoPage,
    MainSportChoosePage,
    TimeSelectPage,
    PlaceChoosePage,
    PlacePage,
    OrderSubmitPage,
    PaymentPage,
    MapPage,
    PaymentIFramePage,
    OfferPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
    AuthService,
    DashboardService,
    SportCenterService,
    PaymentService,
    InAppBrowser,
    Keyboard
  ]
})
export class AppModule {}
