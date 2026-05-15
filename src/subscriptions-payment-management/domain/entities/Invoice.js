export class Invoice {
  constructor({ id, date, amount, status }) {
    this.id = id;
    this.date = date;
    this.amount = amount;
    this.status = status;
  }

  isPaid() {
    return this.status === 'paid';
  }

  getStatusLabel() {
    return this.isPaid() ? 'Paid' : 'Pending';
  }
}
