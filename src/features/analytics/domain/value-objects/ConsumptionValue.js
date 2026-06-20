export class ConsumptionValue {
  constructor({ value, unit, trend, trendVariant }) {
    this.value = value;
    this.unit = unit;
    this.trend = trend;
    this.trendVariant = trendVariant;
  }

  isIncreasing() {
    return this.trend && this.trend.startsWith('+');
  }

  isDecreasing() {
    return this.trend && this.trend.startsWith('-');
  }

  equals(other) {
    return other instanceof ConsumptionValue &&
      this.value === other.value &&
      this.unit === other.unit;
  }

  toString() {
    return `${this.value} ${this.unit}`;
  }
}
