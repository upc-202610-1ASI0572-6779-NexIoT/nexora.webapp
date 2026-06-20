export class Property {
  constructor({ id, code, name, address, city, country, type, status, healthScore }) {
    this._id = id;
    this._code = code;
    this._name = name;
    this._address = address;
    this._city = city;
    this._country = country;
    this._type = type;
    this._status = status;
    this._healthScore = healthScore ?? 75;
    Object.freeze(this);
  }

  get id() { return this._id; }
  get code() { return this._code; }
  get name() { return this._name; }
  get address() { return this._address; }
  get city() { return this._city; }
  get country() { return this._country; }
  get type() { return this._type; }
  get status() { return this._status; }
  get healthScore() { return this._healthScore; }

  hasGoodHealth() {
    return this._healthScore >= 80;
  }

  needsAttention() {
    return this._healthScore < 60;
  }
}
