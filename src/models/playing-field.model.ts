export class PlayingField {
  id : number;
  info: string;
  name: string;
  price: number;
  sportCenterId: number;
  availableTimeId: number;

  constructor(obj) {
    this.id = obj.id || null;
    this.info = obj.info || '';
    this.name = obj.name || '';
    this.price = obj.price || 0;
    this.sportCenterId = obj.sportCenterId || 0;
    this.availableTimeId = obj.availableTimeId || 0;
  }
}
