export class SubscriptionPlan {
  constructor({ name, description, status, billingCycle, nextPayment, renewalAmount }) {
    this.name = name;
    this.description = description;
    this.status = status;
    this.billingCycle = billingCycle;
    this.nextPayment = nextPayment;
    this.renewalAmount = renewalAmount;
  }

  isActive() {
    return this.status === 'active';
  }

  getStatusLabel() {
    return this.isActive() ? 'Active' : 'Inactive';
  }

  requiresPayment() {
    return this.renewalAmount && this.renewalAmount > 0;
  }
}
