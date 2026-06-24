export class PaymentMethod {
  constructor({ brand, maskedNumber, lastFour, fullNumber, holderName, expiryMonth, expiryYear, expiresAt, isDefault, firstName, lastName }) {
    this.brand = brand;
    this.maskedNumber = maskedNumber;
    this.lastFour = lastFour;
    this.fullNumber = fullNumber;
    this.holderName = holderName;
    this.expiryMonth = expiryMonth;
    this.expiryYear = expiryYear;
    this.expiresAt = expiresAt;
    this.isDefault = isDefault;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  isExpired() {
    if (this.expiryYear && this.expiryMonth) {
      const now = new Date();
      const expiry = new Date(parseInt(this.expiryYear), parseInt(this.expiryMonth));
      return expiry < now;
    }
    return false;
  }

  getBrandLabel() {
    return (this.brand || '').toUpperCase();
  }

  getDisplayNumber() {
    const last = this.maskedNumber || this.lastFour || '0000';
    return `····  ····  ····  ${last}`;
  }

  getExpiryDisplay() {
    if (this.expiryMonth && this.expiryYear) {
      return `${this.expiryMonth}/${this.expiryYear}`;
    }
    return this.expiresAt || 'MM/YY';
  }
}
