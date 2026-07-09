const VALID_CYCLES = Object.freeze(['monthly', 'quarterly', 'yearly']);

export class BillingCycle {
  constructor(value) {
    this.value = VALID_CYCLES.includes(value) ? value : 'monthly';
  }

  isMonthly() {
    return this.value === 'monthly';
  }

  isYearly() {
    return this.value === 'yearly';
  }

  equals(other) {
    return other instanceof BillingCycle && this.value === other.value;
  }

  toString() {
    return this.value;
  }
}

BillingCycle.MONTHLY = 'monthly';
BillingCycle.QUARTERLY = 'quarterly';
BillingCycle.YEARLY = 'yearly';
