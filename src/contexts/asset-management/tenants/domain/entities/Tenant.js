export class Tenant {
  constructor({ id, name, email, phone, propertyId }) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._phone = phone;
    this._propertyId = propertyId;
    Object.freeze(this);
  }

  get id() { return this._id; }
  get name() { return this._name; }
  get email() { return this._email; }
  get phone() { return this._phone; }
  get propertyId() { return this._propertyId; }
}
