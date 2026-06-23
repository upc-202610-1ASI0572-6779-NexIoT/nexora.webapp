import { Money } from '../../value-objects/Money';

export class Invoice {
  constructor({ id, date, amount, status }) {
    this.id = id;
    this.date = date;
    this.amount = amount;
    this._money = new Money(amount);
    this.status = status;
  }

  get money() {
    return this._money;
  }

  isPaid() {
    return this.status === 'paid';
  }

  getStatusLabel() {
    return this.isPaid() ? 'Paid' : 'Pending';
  }
}
