export class Address {
  constructor({ country, city, address }) {
    if (!country || !country.trim()) {
      throw { code: 'VALIDATION_ERROR', message: 'Country is required.' };
    }
    if (!city || !city.trim()) {
      throw { code: 'VALIDATION_ERROR', message: 'City is required.' };
    }
    if (!address || !address.trim()) {
      throw { code: 'VALIDATION_ERROR', message: 'Address is required.' };
    }
    if (address.trim().length < 5) {
      throw { code: 'VALIDATION_ERROR', message: 'Address must be at least 5 characters.' };
    }
    this.country = country.trim();
    this.city = city.trim();
    this.address = address.trim();
  }

  equals(other) {
    return other instanceof Address &&
      this.country === other.country &&
      this.city === other.city &&
      this.address === other.address;
  }

  toString() {
    return `${this.address}, ${this.city}, ${this.country}`;
  }
}
