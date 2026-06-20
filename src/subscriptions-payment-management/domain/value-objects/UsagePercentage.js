export class UsagePercentage {
  constructor(value) {
    this.value = Math.min(100, Math.max(0, value || 0));
  }

  isNearLimit(threshold = 80) {
    return this.value >= threshold;
  }

  isExceeded() {
    return this.value >= 100;
  }

  equals(other) {
    return other instanceof UsagePercentage && this.value === other.value;
  }

  toString() {
    return `${this.value}%`;
  }
}
