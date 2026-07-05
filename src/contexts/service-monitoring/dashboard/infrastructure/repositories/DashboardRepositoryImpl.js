import apiClient from '@/shared/infrastructure/http/apiClient';
import { HealthCalculationService } from '../../../domain/services/HealthCalculationService';
import { IDashboardRepository } from '../../../domain/repositories/IDashboardRepository';

export class DashboardRepositoryImpl extends IDashboardRepository {
  async getStats() {
    let electricityKwh = null;
    let gasPpm = null;
    let rawWater = null;
    let airQualityStatus = 'N/A';
    let devicesOnline = 0;
    let totalDevices = 0;
    let voltageOk = null;

    let userDevices = [];
    let resDevices = null;
    try {
      resDevices = await apiClient.get('/api/v1/devices');
      if (resDevices.data) {
        userDevices = resDevices.data.filter(d => d.propertyId !== null);
        totalDevices = userDevices.length;
        devicesOnline = userDevices.filter(d => d.connectionStatus === 'Online').length;
      }
    } catch (e) {
      console.debug('Failed to fetch devices, using mock fallback', e);
      devicesOnline = 0;
      totalDevices = 0;
      userDevices = [];
    }

    const gasDevice = userDevices.find(d => 
      (d.id && d.id.toLowerCase().includes('gas')) || 
      (d.name && d.name.toLowerCase().includes('gas'))
    );
    const waterDevice = userDevices.find(d => 
      (d.id && d.id.toLowerCase().includes('water')) || 
      (d.id && d.id.toLowerCase().includes('agua')) || 
      (d.name && d.name.toLowerCase().includes('water')) || 
      (d.name && d.name.toLowerCase().includes('agua'))
    );
    const voltageDevice = userDevices.find(d => 
      (d.id && d.id.toLowerCase().includes('voltage')) || 
      (d.id && d.id.toLowerCase().includes('voltaje')) || 
      (d.id && d.id.toLowerCase().includes('electricity')) || 
      (d.id && d.id.toLowerCase().includes('corriente')) ||
      (d.name && d.name.toLowerCase().includes('voltage')) || 
      (d.name && d.name.toLowerCase().includes('voltaje')) || 
      (d.name && d.name.toLowerCase().includes('electricity')) || 
      (d.name && d.name.toLowerCase().includes('corriente'))
    );

    console.log('DEBUG DASHBOARD:', {
      allDevicesFromApi: resDevices ? resDevices.data : null,
      userDevicesFiltered: userDevices,
      matchedGasDevice: gasDevice,
      matchedWaterDevice: waterDevice,
      matchedVoltageDevice: voltageDevice
    });

    let dailyEnergyVal = 'Sin vincular';
    let dailyEnergyColor = 'default';

    if (voltageDevice) {
      try {
        const resVoltage = await apiClient.get(`/api/v1/telemetries/latest?deviceId=${voltageDevice.id}`);
        console.log('DEBUG VOLTAGE TELEMETRY:', { deviceId: voltageDevice.id, data: resVoltage.data });
        if (resVoltage.data) {
          electricityKwh = resVoltage.data.electricityReading;
          voltageOk = resVoltage.data.voltageOk !== false;
          dailyEnergyVal = parseFloat(electricityKwh.toFixed(2));
          dailyEnergyColor = 'primary';
        } else {
          dailyEnergyVal = 'Sin reportes';
        }
      } catch (e) {
        console.log('Failed to fetch voltage telemetry:', e);
        dailyEnergyVal = 'Sin reportes';
      }
    }

    let airQualityVal = 'Sin vincular';
    let airQualityColor = 'default';
    let airQualityIcon = '';

    if (gasDevice) {
      try {
        const resGas = await apiClient.get(`/api/v1/telemetries/latest?deviceId=${gasDevice.id}`);
        console.log('DEBUG GAS TELEMETRY:', { deviceId: gasDevice.id, data: resGas.data });
        if (resGas.data) {
          gasPpm = parseFloat(resGas.data.gasReading.toFixed(3));
          airQualityStatus = gasPpm > 300 ? 'Critical' : (gasPpm > 100 ? 'Poor' : (gasPpm > 50 ? 'Moderate' : 'Good'));
          airQualityVal = `${airQualityStatus} (${gasPpm} PPM)`;
          airQualityColor = (airQualityStatus === 'Critical' || airQualityStatus === 'Poor') ? 'danger' : 'success';
          airQualityIcon = airQualityColor === 'danger' ? 'triangle-exclamation' : 'circle-check';
        } else {
          airQualityVal = 'Sin reportes';
        }
      } catch (e) {
        console.log('Failed to fetch gas telemetry:', e);
        airQualityVal = 'Sin reportes';
      }
    }

    if (waterDevice) {
      try {
        const resWater = await apiClient.get(`/api/v1/telemetries/latest?deviceId=${waterDevice.id}`);
        console.log('DEBUG WATER TELEMETRY:', { deviceId: waterDevice.id, data: resWater.data });
        if (resWater.data) {
          rawWater = parseFloat(resWater.data.waterReading.toFixed(3));
        }
      } catch (e) {
        console.log('Failed to fetch water telemetry:', e);
      }
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
    if (gasPpm !== null && gasPpm > 100) {
      healthScore -= 12.0;
    }
    if (electricityKwh !== null && electricityKwh > 20.0) {
      healthScore -= 15.0;
    }
    if (voltageOk === false) {
      healthScore -= 25.0;
    }
    healthScore = Math.max(50.0, healthScore);

    return {
      kpis: {
        activeLeaks: activeAlerts.length,
        airQuality: airQualityVal,
        airQualityColor: airQualityColor,
        airQualityIcon: airQualityIcon,
        devicesOnline: devicesOnline,
        totalDevices: totalDevices,
        dailyEnergy: dailyEnergyVal,
        dailyEnergyColor: dailyEnergyColor
      },
      alerts: activeAlerts,
      health: healthScore,
      rawGas: gasPpm,
      rawWater: rawWater,
      rawElectricity: electricityKwh,
      voltageOk: voltageOk,
      gasLinked: gasDevice !== undefined,
      waterLinked: waterDevice !== undefined,
      electricityLinked: voltageDevice !== undefined
    };
  }
}
