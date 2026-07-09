export class Money {
  constructor(amount, currency = 'USD') {
    this.amount = typeof amount === 'string' ? parseFloat(amount.replace(',', '')) : (amount || 0);
    this.currency = currency;
  }

  format() {
    return `$${this.amount.toFixed(2)}`;
  }

  isExceeding(limit) {
    return this.amount > limit;
  }

  equals(other) {
    return other instanceof Money && this.amount === other.amount && this.currency === other.currency;
  }

  toString() {
    return this.format();
  }
}
