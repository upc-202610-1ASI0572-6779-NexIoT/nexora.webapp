import { HealthScore } from '../../../domain/value-objects/HealthScore';
import { AirQualityReading } from '../../../domain/value-objects/AirQualityReading';

export class DashboardStats {
  constructor({ kpis, alerts, health }) {
    this.kpis = kpis;
    this.alerts = alerts;
    this.health = health;
    this._healthScore = new HealthScore(health);
    this._airQuality = kpis?.airQuality ? new AirQualityReading(kpis.airQuality) : null;
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
