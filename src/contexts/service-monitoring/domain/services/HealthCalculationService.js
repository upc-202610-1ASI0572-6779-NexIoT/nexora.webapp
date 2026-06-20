export class HealthCalculationService {
  static calculate(gasPpm, electricityKwh, voltageOk) {
    let healthScore = 100.0;

    if (gasPpm > 100) {
      healthScore -= 12.0;
    }
    if (electricityKwh > 20.0) {
      healthScore -= 15.0;
    }
    if (!voltageOk) {
      healthScore -= 25.0;
    }

    return Math.max(50.0, healthScore);
  }

  static determineAirQuality(gasPpm) {
    if (gasPpm > 300) return 'Critical';
    if (gasPpm > 100) return 'Poor';
    if (gasPpm > 50) return 'Moderate';
    return 'Good';
  }
}
