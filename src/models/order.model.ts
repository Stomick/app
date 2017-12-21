import {Place} from "./place.model";
import {User} from "./user.model";

export class Order {
  avaid: number;
  place: Place;
  time: string;
  sTime: string;
  eTime: string;
  price: number;
  user: User;
  playground: string;
  orderList: any[];
  orderListPriced: any[];
  comment: string;

  constructor(obj: {
                place: Place,
                avaid: number,
                time: string,
                sTime: string,
                eTime: string,
                price: number,
                user: User,
                playground: string,
                orderList: any[],
                orderListPriced ?: any[],
                comment?: string
              }) {
    this.place = obj.place;
    this.avaid = obj.avaid;
    this.time = obj.time;
    this.sTime = obj.sTime;
    this.eTime = obj.eTime;
    this.price = obj.price;
    this.user = obj.user;
    this.playground = obj.playground;
    this.orderList = obj.orderList;
    this.orderListPriced = obj.orderListPriced;
    this.comment = obj.comment || '';
  }
}
