import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import * as config from '../config/prod.config';
import {Http, Headers, Response} from "@angular/http";
import 'rxjs';
import {AuthService} from "./auth.service";

@Injectable()
export class PaymentService {

  private API_URL: string = config.default.API_PATH;
  private headers: Headers = new Headers();
  private token: string = AuthService.getCurrentUser().token;

  constructor(private http: Http) {
    this.headers.append('Content-Type', 'application/x-www-form-urlencoded');
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('Access-Control-Allow-Headers', "*");
    this.headers.append('Access-Control-Allow-Credentials','true');
    this.headers.append("Authorization", `Bearer ${this.token}`);
  }

  /**
   * POST
   * send payment
   */
  public sendPayment(obj : Object): Observable<boolean> {
    return this.http.post(`${this.API_URL}bookings/payment`, obj, {headers: this.headers})
      .map((res: Response) => {
        return true;
      });
  }


}
