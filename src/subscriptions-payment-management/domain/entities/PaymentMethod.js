export class PaymentMethod {
  constructor({ brand, maskedNumber, expiresAt }) {
    this.brand = brand;
    this.maskedNumber = maskedNumber;
    this.expiresAt = expiresAt;
  }

  getBrandLabel() {
    return this.brand.toUpperCase();
  }
}
