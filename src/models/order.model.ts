import {Place} from "./place.model";
import {User} from "./user.model";

export class Order {
  place: Place;
  time: string;
  price: number;
  user: User;
  playground: string;
  orderList: any[];
  orderListPriced: any[];
  comment: string;

  constructor(obj: {
                place: Place,
                time: string,
                price: number,
                user: User,
                playground: string,
                orderList: any[],
                orderListPriced ?: any[],
                comment?: string
              }) {
    this.place = obj.place;
    this.time = obj.time;
    this.price = obj.price;
    this.user = obj.user;
    this.playground = obj.playground;
    this.orderList = obj.orderList;
    this.orderListPriced = obj.orderListPriced;
    this.comment = obj.comment || '';
  }
}
