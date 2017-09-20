import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import * as config from '../config/prod.config';
import {Http} from "@angular/http";
import {Storage} from '@ionic/storage';
import 'rxjs';
import {User} from "../models/user.model";

@Injectable()
export class AuthService {
  private API_URL: string = config.default.API_PATH;
  storage = new Storage(['localstorage']);
  user: User;

  constructor(private http: Http) {
    this.storage.get("currentUser").then((res : User) => {
      this.user = res;
    });
  }

  /**
   * If token exist, user is logged
   * @return {boolean}
   */
  static isAuthentificated(): boolean {
    return localStorage.getItem('currentUser') != null;
  }

  /**
   * returns auth user
   * @return {User}
   */
  static getCurrentUser() : User {
    if(AuthService.isAuthentificated()) {
      return new User(JSON.parse(localStorage.getItem('currentUser')));
    }
  }

  /**
   * @param name
   * @param phone
   * @return {Observable<boolean>}
   */
  public login(name: string, phone: string): Observable<string> {

    return this.http.post((this.API_URL + "auth/registration"), {name: name, phone: phone})
      .map((res) => {
        let code = res.json();
        return code;
      });
  }

  public checkSMSCode(user: User): Observable<boolean> {

    return this.http.post(`${this.API_URL}auth/signin`, {code: user.code}).map((res) => {
      user.setToken(res.json());
      this.saveUser(user);

      return true;
    });
  }

  saveUser(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

}
