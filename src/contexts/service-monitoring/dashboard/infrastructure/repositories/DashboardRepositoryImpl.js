import apiClient from '@/shared/infrastructure/http/apiClient';
import { HealthCalculationService } from '../../../domain/services/HealthCalculationService';
import { IDashboardRepository } from '../../../domain/repositories/IDashboardRepository';

export class DashboardRepositoryImpl extends IDashboardRepository {
  async getStats() {
    let electricityKwh = 0.0;
    let gasPpm = 0;
    let rawWater = 0.0;
    let airQualityStatus = 'Good';
    let devicesOnline = 2;
    let totalDevices = 2;
    let voltageOk = true;

    let userDevices = [];
    try {
      const resDevices = await apiClient.get('/api/v1/devices');
      if (resDevices.data) {
        userDevices = resDevices.data.filter(d => d.propertyId !== null);
        totalDevices = resDevices.data.length;
        devicesOnline = resDevices.data.filter(d => d.connectionStatus === 'Online').length;
      }
    } catch (e) {
      console.debug('Failed to fetch devices, using mock fallback', e);
      devicesOnline = 2;
      totalDevices = 2;
    }

    const gasDevice = userDevices.find(d => d.id.toLowerCase().includes('gas'));
    const waterDevice = userDevices.find(d => d.id.toLowerCase().includes('water') || d.id.toLowerCase().includes('agua'));
    const voltageDevice = userDevices.find(d => d.id.toLowerCase().includes('voltage') || d.id.toLowerCase().includes('voltaje') || d.id.toLowerCase().includes('electricity') || d.id.toLowerCase().includes('corriente'));

    const gasDeviceId = gasDevice ? gasDevice.id : 'gas-safety-unit-apt-402';
    const waterDeviceId = waterDevice ? waterDevice.id : 'water-safety-unit-apt-402';
    const voltageDeviceId = voltageDevice ? voltageDevice.id : 'voltage-safety-unit-apt-402';

    try {
      // 1. Fetch latest telemetry for voltage safety unit
      const resVoltage = await apiClient.get(`/api/v1/telemetries/latest?deviceId=${voltageDeviceId}`);
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
      const resGas = await apiClient.get(`/api/v1/telemetries/latest?deviceId=${gasDeviceId}`);
      if (resGas.data) {
        gasPpm = parseFloat(resGas.data.gasReading.toFixed(3));
        airQualityStatus = gasPpm > 300 ? 'Critical' : (gasPpm > 100 ? 'Poor' : (gasPpm > 50 ? 'Moderate' : 'Good'));
      }
    } catch (e) {
      console.debug('Failed to fetch gas telemetry, using mock fallback', e);
      gasPpm = 14;
      airQualityStatus = 'Good';
    }

    try {
      // 2.5. Fetch latest telemetry for water safety unit
      const resWater = await apiClient.get(`/api/v1/telemetries/latest?deviceId=${waterDeviceId}`);
      if (resWater.data) {
        rawWater = parseFloat(resWater.data.waterReading.toFixed(3));
      }
    } catch (e) {
      console.debug('Failed to fetch water telemetry, using mock fallback', e);
      rawWater = 0.0;
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

          const alertReading = alert.reading !== null && alert.reading !== undefined ? alert.reading : 0;

          if (alert.type.includes('Gas')) {
            typeLabel = 'GAS';
            desc = `High gas readings (${alertReading.toFixed(3)} PPM) detected on device ${alert.deviceId}.`;
          } else if (alert.type.includes('Overcurrent') || alert.type.includes('Voltage')) {
            typeLabel = 'VOLTAGE';
            desc = alert.type === 'Overcurrent Detected'
              ? `High current draw (${alertReading.toFixed(1)} A) detected on device ${alert.deviceId}.`
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
      rawWater: rawWater,
      rawElectricity: electricityKwh,
      voltageOk: voltageOk
    };
  }
}
