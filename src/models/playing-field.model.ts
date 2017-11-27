export class PlayingField {
  id : number;
  info: string;
  name: string;
  price: number;
  allPrice: any[] = [];
  sportCenterId: number;
  availableTimeId: number;

  constructor(obj) {
    this.id = obj.id || null;
    this.info = obj.info || '';
    this.name = obj.name || '';
    this.price = obj.price || 0;

    if(obj.allPrice && obj.allPrice.length != 0) {

      obj.allPrice.forEach((item) => {
        this.allPrice.push(item);
      });

    }else {
      this.allPrice = [];
    }
    this.sportCenterId = obj.sportCenterId || 0;
    this.availableTimeId = obj.availableTimeId || 0;
  }
}
