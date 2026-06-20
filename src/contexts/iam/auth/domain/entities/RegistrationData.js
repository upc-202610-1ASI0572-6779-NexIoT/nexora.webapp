import { Email } from '../../../domain/value-objects/Email';
import { PersonName } from '../../../domain/value-objects/PersonName';
import { PhoneNumber } from '../../../domain/value-objects/PhoneNumber';
import { Address } from '../../../domain/value-objects/Address';

export class RegistrationData {
  constructor({ email, password, firstName, lastName, country, city, address, phoneNumber }) {
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.country = country;
    this.city = city;
    this.address = address;
    this.phoneNumber = phoneNumber || null;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  toValueObjects() {
    return {
      email: new Email(this.email),
      name: new PersonName(this.firstName, this.lastName),
      address: new Address({ country: this.country, city: this.city, address: this.address }),
      phoneNumber: this.phoneNumber ? new PhoneNumber(this.phoneNumber) : null,
    };
  }
}
