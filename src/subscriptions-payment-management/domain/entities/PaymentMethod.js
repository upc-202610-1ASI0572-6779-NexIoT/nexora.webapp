export class PaymentMethod {
  constructor({ brand, maskedNumber, lastFour, holderName, fullNumber, firstName, lastName, expiryMonth, expiryYear, expiresAt, isDefault }) {
    this.brand = brand;
    this.maskedNumber = maskedNumber;
    this.lastFour = lastFour;
    this.holderName = holderName;
    this.fullNumber = fullNumber;
    this.firstName = firstName;
    this.lastName = lastName;
    this.expiryMonth = expiryMonth;
    this.expiryYear = expiryYear;
    this.expiresAt = expiresAt;
    this.isDefault = isDefault;
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
    return `\u00B7\u00B7\u00B7\u00B7  \u00B7\u00B7\u00B7\u00B7  \u00B7\u00B7\u00B7\u00B7  ${last}`;
  }

  getExpiryDisplay() {
    if (this.expiryMonth && this.expiryYear) {
      return `${this.expiryMonth}/${this.expiryYear}`;
    }
    return this.expiresAt || 'MM/YY';
  }
}
