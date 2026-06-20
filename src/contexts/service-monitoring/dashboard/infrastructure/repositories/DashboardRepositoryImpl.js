import apiClient from '@/shared/infrastructure/http/apiClient';
import { HealthCalculationService } from '../../../domain/services/HealthCalculationService';
import { IDashboardRepository } from '../../../domain/repositories/IDashboardRepository';

export class DashboardRepositoryImpl extends IDashboardRepository {
  async getStats() {
    let electricityKwh = 0.0;
    let gasPpm = 0;
    let airQualityStatus = 'Good';
    let devicesOnline = 2;
    let totalDevices = 2;
    let voltageOk = true;

    try {
      // 1. Fetch latest telemetry for voltage safety unit
      const resVoltage = await apiClient.get('/api/v1/telemetries/latest?deviceId=voltage-safety-unit-apt-402');
      if (resVoltage.data) {
        electricityKwh = resVoltage.data.electricityReading;
        voltageOk = resVoltage.data.voltageOk !== false; // handle null/undefined or false
      }
    } catch (e) {
      console.debug('Failed to fetch voltage telemetry, using mock fallback', e);
      electricityKwh = 12.8; // Fallback
      voltageOk = true;
    }

    try {
      // 2. Fetch latest telemetry for gas safety unit
      const resGas = await apiClient.get('/api/v1/telemetries/latest?deviceId=gas-safety-unit-apt-402');
      if (resGas.data) {
        gasPpm = resGas.data.gasReading;
        airQualityStatus = gasPpm > 300 ? 'Critical' : (gasPpm > 100 ? 'Poor' : (gasPpm > 50 ? 'Moderate' : 'Good'));
      }
    } catch (e) {
      console.debug('Failed to fetch gas telemetry, using mock fallback', e);
      gasPpm = 14;
      airQualityStatus = 'Good';
    }

    let propertiesCount = 4;
    try {
      // 3. Fetch properties count
      const resProps = await apiClient.get('/api/v1/properties/stats');
      if (resProps.data) {
        propertiesCount = resProps.data.total;
      }
    } catch (e) {
      console.debug('Failed to fetch properties total', e);
    }

    // 4. Fetch real-time alerts from backend
    let activeAlerts = [];
    try {
      const resAlerts = await apiClient.get('/api/v1/alerts?limit=10');
      if (resAlerts.data) {
        activeAlerts = resAlerts.data.map(alert => {
          let type = 'info';
          let icon = 'info-circle';
          let typeLabel = 'SYSTEM';
          let desc = `An alert was logged for device ${alert.deviceId}.`;

          if (alert.severity === 'Critical') {
            type = 'critical';
            icon = 'triangle-exclamation';
          } else if (alert.severity === 'Warning') {
            type = 'warning';
            icon = 'exclamation-circle';
          }

          if (alert.type.includes('Gas')) {
            typeLabel = 'GAS';
            desc = `High gas readings (${gasPpm} PPM) detected on device ${alert.deviceId}.`;
          } else if (alert.type.includes('Overcurrent') || alert.type.includes('Voltage')) {
            typeLabel = 'VOLTAGE';
            desc = alert.type === 'Overcurrent Detected'
              ? `High current draw (${electricityKwh.toFixed(1)} A) detected on device ${alert.deviceId}.`
              : `Grid instability or voltage drop detected on device ${alert.deviceId}.`;
            icon = 'bolt';
          } else if (alert.type.includes('Intrusión') || alert.type.includes('intrusion')) {
            typeLabel = 'SECURITY';
            desc = `Unscheduled motion detected inside property associated with device ${alert.deviceId}.`;
          }

          const date = new Date(alert.timestamp);
          const timeFormatted = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });

          return {
            id: alert.id,
            type: type,
            typeLabel: typeLabel,
            title: alert.type,
            desc: desc,
            time: timeFormatted,
            icon: icon
          };
        });
      }
    } catch (e) {
      console.debug('Failed to fetch real alerts, using mock fallback', e);
    }

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
    healthScore = Math.max(50.0, healthScore);

    return {
      kpis: {
        activeLeaks: activeAlerts.length,
        airQuality: `${airQualityStatus} (${gasPpm} PPM)`,
        devicesOnline: devicesOnline,
        totalDevices: totalDevices,
        dailyEnergy: parseFloat(electricityKwh.toFixed(2))
      },
      alerts: activeAlerts,
      health: healthScore,
      rawGas: gasPpm,
      rawWater: 0.0,
      rawElectricity: electricityKwh,
      voltageOk: voltageOk
    };
  }
}
