export class HealthScore {
  constructor(value) {
    this.value = Math.max(0, Math.min(100, value || 0));
  }

  isHealthy() {
    return this.value >= 80;
  }

  isWarning() {
    return this.value >= 50 && this.value < 80;
  }

  isCritical() {
    return this.value < 50;
  }

  getStatus() {
    if (this.isHealthy()) return 'healthy';
    if (this.isWarning()) return 'warning';
    return 'critical';
  }

  equals(other) {
    return other instanceof HealthScore && this.value === other.value;
  }

  toString() {
    return `${this.value.toFixed(1)}%`;
  }
}
