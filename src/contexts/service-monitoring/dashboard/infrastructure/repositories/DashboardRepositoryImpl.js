import apiClient from '@/shared/infrastructure/http/apiClient';
import { IDashboardRepository } from '../../../domain/repositories/IDashboardRepository';

export class DashboardRepositoryImpl extends IDashboardRepository {
  async #fetchTelemetry(deviceId) {
    try {
      const res = await apiClient.get(`/api/v1/telemetry/latest?deviceId=${deviceId}`);
      return res.data || null;
    } catch {
      return null;
    }
  }

  async #fetchAlerts() {
    try {
      const res = await apiClient.get('/api/v1/alerts?limit=5');
      return res.data || [];
    } catch {
      return [];
    }
  }

  async #fetchPropertiesStats() {
    try {
      const res = await apiClient.get('/api/v1/properties/summary');
      return res.data?.total ?? null;
    } catch {
      return null;
    }
  }

  async #fetchDevices() {
    try {
      const res = await apiClient.get('/api/v1/devices');
      return res.data || [];
    } catch {
      return [];
    }
  }

  #formatNum(value, decimals = 2) {
    if (value === null || value === undefined) return null;
    const num = Number(value);
    return Number.isNaN(num) ? null : parseFloat(num.toFixed(decimals));
  }

  #airQualityStatus(ppm) {
    if (ppm === null || ppm === undefined) return '--';
    if (ppm > 300) return 'Critical';
    if (ppm > 100) return 'Poor';
    if (ppm > 50) return 'Moderate';
    return 'Good';
  }

  #buildAlertViewModel(alert, gasPpm, electricityKwh) {
    let type = 'info';
    let icon = 'info-circle';
    let typeLabel = 'SYSTEM';
    let desc = `Alert logged for device ${alert.deviceId}.`;

    if (alert.severity === 'Critical') {
      type = 'critical';
      icon = 'triangle-exclamation';
    } else if (alert.severity === 'Warning') {
      type = 'warning';
      icon = 'exclamation-circle';
    }

    if (alert.type?.includes('Gas')) {
      typeLabel = 'GAS';
      desc = gasPpm !== null
        ? `High gas readings (${gasPpm} PPM) on ${alert.deviceId}.`
        : `Gas alert on ${alert.deviceId}.`;
    } else if (alert.type?.includes('Overcurrent') || alert.type?.includes('Voltage')) {
      typeLabel = 'VOLTAGE';
      icon = 'bolt';
      desc = alert.type === 'Overcurrent Detected'
        ? `High current draw (${electricityKwh ?? '--'} A) on ${alert.deviceId}.`
        : `Grid instability on ${alert.deviceId}.`;
    }

    const date = new Date(alert.timestamp);
    const timeFormatted = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      + ' ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });

    return {
      id: alert.id,
      type,
      typeLabel,
      title: alert.type,
      desc,
      time: timeFormatted,
      icon
    };
  }

  async getStats() {
    const [voltageData, gasData, waterData, activeAlerts, devices, propertiesCount] = await Promise.all([
      this.#fetchTelemetry('voltage-safety-unit-apt-402'),
      this.#fetchTelemetry('gas-safety-unit-apt-402'),
      this.#fetchTelemetry('water-meter-unit-biz-center'),
      this.#fetchAlerts(),
      this.#fetchDevices(),
      this.#fetchPropertiesStats()
    ]);

    const electricityKwh = this.#formatNum(voltageData?.electricityReading);
    const voltageOk = voltageData ? (voltageData.voltageOk !== false) : null;
    const gasPpm = this.#formatNum(gasData?.gasReading);
    const waterReading = this.#formatNum(waterData?.waterReading);
    const airQualityStatus = this.#airQualityStatus(gasPpm);

    const totalDevices = Array.isArray(devices) ? devices.length : null;
    const devicesOnline = Array.isArray(devices)
      ? devices.filter(d => d.connectionStatus === 'Online').length
      : null;

    const alertViewModels = activeAlerts.map(a =>
      this.#buildAlertViewModel(a, gasPpm, electricityKwh)
    );

    const hasGasIssues = gasPpm !== null && gasPpm > 100;
    const hasVoltageIssues = voltageOk !== null && !voltageOk;
    const hasCurrentIssues = electricityKwh !== null && electricityKwh > 20;

    let healthScore = null;
    if (gasPpm !== null || voltageOk !== null || electricityKwh !== null) {
      healthScore = 100;
      if (hasGasIssues) healthScore -= 12;
      if (hasCurrentIssues) healthScore -= 15;
      if (hasVoltageIssues) healthScore -= 25;
      healthScore = Math.max(50, healthScore);
    }

    return {
      kpis: {
        activeLeaks: alertViewModels.length,
        airQuality: gasPpm !== null ? `${airQualityStatus} (${gasPpm} PPM)` : '--',
        devicesOnline,
        totalDevices,
        dailyEnergy: electricityKwh
      },
      alerts: alertViewModels,
      health: healthScore,
      rawGas: gasPpm,
      rawWater: waterReading,
      rawElectricity: electricityKwh,
      voltageOk,
      propertiesCount
    };
  }
}
