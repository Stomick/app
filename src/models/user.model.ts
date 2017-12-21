export class User {
  name: string;
  phone: string;
  code: string;
  token: string;

  constructor(obj) {
    this.name = obj.name || null;
    this.phone = obj.phone || null;
    this.code = obj.code || null;
    this.token = obj.token || null;
  }

  setToken (token: string) {
    this.token= token;
  }
}
