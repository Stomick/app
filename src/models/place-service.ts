export class PlaceService {
  id: number;
  name: string;
  price: number;
  sportCenterId: number;
  description: string;

  constructor(obj) {
    this.id = obj.id || null;
    this.name = obj.name || '';
    this.price = obj.price || null;
    this.description = obj.description || '';
  }
}
