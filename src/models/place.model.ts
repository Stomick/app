import {PlayingField} from './playing-field.model';
import {PlaceService} from "./place-service";

export class Place {
  image: string;
  imageLogo: string;
  type: string;
  name: string;
  address: string;
  distance: number;
  latitude: number;
  longitude: number;
  id: number;
  description: string;
  descriptionShort: string;
  playingFields: PlayingField[] = [];
  services: PlaceService[] = [];
  images: string[] = [];
  startWorkTime: string;
  endWorkTime: string;
  workTime: any[] = [];
  advantages: {icon: string, name: string}[];
  roundTheClock : boolean;
  minPrice: number;
  limit: number;


  constructor(obj) {

    this.id = obj.id || null;
    this.image = 'http://2.wlimg.com/product_images/bc-full/dir_21/601811/tennis-court-construction-1705242_service_image.jpg';
    this.imageLogo = obj.logoSrc || 'https://thumb9.shutterstock.com/display_pic_with_logo/1453121/299886746/stock-vector-vector-illustration-for-logo-for-lawn-tennis-consisting-of-ground-orange-tennis-court-net-racket-299886746.jpg';
    this.type = obj.type || 'Спортивный клуб';
    this.name = obj.name || 'Балашиха';
    this.address = obj.address || 'Не указан';
    this.latitude = +obj.latitude || 0;
    this.longitude = +obj.longitude || 0;
    this.distance = obj.distance || 0;
    this.description = obj.description || '';
    this.startWorkTime = obj.begin || '';
    this.endWorkTime = obj.end || '';
    this.roundTheClock = obj.typeTime || false;
    this.minPrice = obj.minPrice || 0;
    this.workTime = obj.workTime || [];
    this.limit = obj.limit || 10;

    if (this.description.length > 75) {
      this.descriptionShort = this.description.substr(0, 75);
    } else {
      this.descriptionShort = this.description;
    }

    if (obj.playingFields && obj.playingFields.length != 0)
      obj.playingFields.forEach((item) => {
        this.playingFields.push(new PlayingField(item))
      });

    if (obj.services && obj.services.length != 0)
      obj.services.forEach((item) => {
        this.services.push(new PlaceService(item))
      });

    if (obj.images != null) {
      if (obj.images.length != 0) {
        for (let i = 0; i < obj.images.length; i++) {
          if (obj.images[i].src != null) {
            this.image = obj.images[i].src;
            break;
          }
        }

        // slider images setting
        obj.images.forEach((item) => {
          if (item.src != null) {
            this.images.push(item.src);
          }
        });
      }
    }

    this.advantages = this.parseAdvanteges(obj);
  }

  private parseAdvanteges(obj: any): {icon: string, name: string}[] {

    let arr = [];
    if (obj.advantages) {
      if (obj.advantages.length != 0) {

        obj.advantages.forEach((item) => {
          let toPush = {};
          toPush['icon'] = item.iconSrc || '';
          toPush['name'] = item.name;
          arr.push(toPush);
        });

        return arr;
      }
      else {
        return [];
      }
    } else {
      return [];
    }
  }
}
