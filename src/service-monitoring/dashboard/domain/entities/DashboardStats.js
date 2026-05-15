export class DashboardStats {
  constructor({ kpis, alerts, health }) {
    this.kpis = kpis;
    this.alerts = alerts;
    this.health = health;
  }
}
