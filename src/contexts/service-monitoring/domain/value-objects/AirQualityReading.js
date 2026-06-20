export class AirQualityReading {
  constructor(ppm) {
    this.ppm = ppm || 0;
  }

  getStatus() {
    if (this.ppm > 300) return 'Critical';
    if (this.ppm > 100) return 'Poor';
    if (this.ppm > 50) return 'Moderate';
    return 'Good';
  }

  isSafe() {
    return this.ppm <= 50;
  }

  getLabel() {
    return `${this.getStatus()} (${this.ppm} PPM)`;
  }

  equals(other) {
    return other instanceof AirQualityReading && this.ppm === other.ppm;
  }

  toString() {
    return this.getLabel();
  }
}
