export class RSSI {
  constructor(value) {
    this.value = value !== null && value !== undefined ? value : null;
  }

  isCritical() {
    return this.value !== null && this.value < -75;
  }

  isWeak() {
    return this.value !== null && this.value >= -75 && this.value < -50;
  }

  isStrong() {
    return this.value !== null && this.value >= -50;
  }

  isAvailable() {
    return this.value !== null;
  }

  equals(other) {
    return other instanceof RSSI && this.value === other.value;
  }

  toString() {
    return this.value !== null ? `${this.value} dBm` : 'N/A';
  }
}
