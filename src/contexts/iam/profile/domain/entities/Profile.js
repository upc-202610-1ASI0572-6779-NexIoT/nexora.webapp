import { Email } from '../../../domain/value-objects/Email';
import { PersonName } from '../../../domain/value-objects/PersonName';
import { PhoneNumber } from '../../../domain/value-objects/PhoneNumber';

export class Profile {
  constructor({ email, firstName, lastName, isActive, country, city, address, phoneNumber }) {
    this._email = email ? new Email(email) : null;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this._name = (firstName && lastName) ? new PersonName(firstName, lastName) : null;
    this.isActive = isActive;
    this.country = country;
    this.city = city;
    this.address = address;
    this.phoneNumber = phoneNumber || null;
    this._phoneVO = phoneNumber ? new PhoneNumber(phoneNumber) : null;
  }

  get emailVO() {
    return this._email;
  }

  get nameVO() {
    return this._name;
  }

  get phoneVO() {
    return this._phoneVO;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  get initials() {
    return `${this.firstName[0]}${this.lastName[0]}`.toUpperCase();
  }
}
