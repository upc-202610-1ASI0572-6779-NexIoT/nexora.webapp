export class SubscriptionStatus {
  constructor(value) {
    const valid = Object.values(SubscriptionStatus.VALUES).includes(value);
    this.value = valid ? value : SubscriptionStatus.VALUES.PENDING;
  }

  isActive() {
    return this.value === SubscriptionStatus.VALUES.ACTIVE;
  }

  isSuspended() {
    return this.value === SubscriptionStatus.VALUES.SUSPENDED;
  }

  isExpired() {
    return this.value === SubscriptionStatus.VALUES.EXPIRED;
  }

  isPending() {
    return this.value === SubscriptionStatus.VALUES.PENDING;
  }

  isCancelled() {
    return this.value === SubscriptionStatus.VALUES.CANCELLED;
  }

  getLabel() {
    const labels = {
      [SubscriptionStatus.VALUES.ACTIVE]: 'Active',
      [SubscriptionStatus.VALUES.SUSPENDED]: 'Suspended',
      [SubscriptionStatus.VALUES.EXPIRED]: 'Expired',
      [SubscriptionStatus.VALUES.PENDING]: 'Pending',
      [SubscriptionStatus.VALUES.CANCELLED]: 'Cancelled',
    };
    return labels[this.value] || 'Unknown';
  }

  equals(other) {
    return other instanceof SubscriptionStatus && this.value === other.value;
  }

  toString() {
    return this.value;
  }
}

SubscriptionStatus.VALUES = Object.freeze({
  PENDING: 'Pending',
  ACTIVE: 'Active',
  SUSPENDED: 'Suspended',
  CANCELLED: 'Cancelled',
  EXPIRED: 'Expired',
});
