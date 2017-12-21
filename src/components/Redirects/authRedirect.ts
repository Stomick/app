import {NavController} from "ionic-angular";
import {AuthenticationPage} from "../../pages/authentication/authentication.page";

export function redirectToAuthPage(err, navCtrl: NavController) {
  if (err == 401) {
    navCtrl.setRoot(AuthenticationPage);
    localStorage.clear();
  }
}
