import { HealthScore } from '../../../domain/value-objects/HealthScore';
import { AirQualityReading } from '../../../domain/value-objects/AirQualityReading';

export class DashboardStats {
  constructor({ kpis, alerts, health, rawGas, rawWater, rawElectricity, voltageOk, gasLinked, waterLinked, electricityLinked }) {
    this.kpis = kpis;
    this.alerts = alerts;
    this.health = health;
    this._healthScore = new HealthScore(health);
    this._airQuality = kpis?.airQuality ? new AirQualityReading(kpis.airQuality) : null;
    this.rawGas = rawGas;
    this.rawWater = rawWater;
    this.rawElectricity = rawElectricity;
    this.voltageOk = voltageOk;
    this.gasLinked = gasLinked;
    this.waterLinked = waterLinked;
    this.electricityLinked = electricityLinked;
  }

  get healthScore() {
    return this._healthScore;
  }

  get airQuality() {
    return this._airQuality;
  }

  isHealthy() {
    return this._healthScore.isHealthy();
  }

  hasActiveAlerts() {
    return this.alerts && this.alerts.length > 0;
  }
}
