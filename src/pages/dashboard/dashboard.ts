import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, LoadingController, Loading} from 'ionic-angular';
import {BookInfoPage} from '../pages';
import {User} from "../../models/user.model";
import {AuthService} from "../../providers/auth.service";
import {DashboardService} from "./dashboard.service";
import 'rxjs';
import {Booking} from "../../models/Booking";
import {SocialShare} from "../../components/SocialShare/SocicalShare";
import {redirectToAuthPage} from "../../components/Redirects/authRedirect";

@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage implements OnInit {

  price: number = 9900;
  user: User = new User({});
  booked: Booking[] = [];
  loading: Loading;
  currentBooking : Booking;
  socialShare: SocialShare;

  ngOnInit(): void {

    this.loading = this.loadingCtrl.create({
      content: "Идет загрузка..."
    });

    this.dashBoardService.getOwnBookings().subscribe((res) => {
      this.booked = res;
      this.loading.dismissAll();
    }, (err) => {
      this.loading.dismissAll();
      redirectToAuthPage(err, this.navCtrl);
    });
  }

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public auth: AuthService,
              public dashBoardService: DashboardService,
              public loadingCtrl: LoadingController) {
    this.user = AuthService.getCurrentUser();
    this.socialShare = new SocialShare();
  }


  getBooking(id: number) {
    this.navCtrl.push(BookInfoPage, {'id': id});
  }

  goToDashboard() {

  }

  socialButtonShare(socialButton){
    this.socialShare.pressButton(socialButton);
  }

  emailToSupport() {
    this.socialShare.sendSuppotMail(this.user);
  }

  inviteFriend() {
    this.socialShare.inviteFriend();
  }
}
