import { DeviceStatus } from '../value-objects/DeviceStatus';

export class DeviceFleetService {
  static calculateKPIs(devices) {
    const total = devices.length;
    const online = devices.filter(d => d.status === DeviceStatus.ONLINE).length;
    const offline = total - online;

    return {
      operationalStatus: total > 0 ? `${Math.round((online / total) * 100)}%` : '100%',
      gatewayLoad: total > 0 ? '42' : '0',
      activeAlerts: offline.toString(),
      firmwareDrift: '0.00',
    };
  }
}
