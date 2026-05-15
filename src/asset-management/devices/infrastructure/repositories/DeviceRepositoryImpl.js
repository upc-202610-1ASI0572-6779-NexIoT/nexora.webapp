import { DeviceMapper } from '../mappers/DeviceMapper';

export class DeviceRepositoryImpl {
  constructor() {
    // Simulated database/API response
    this.rawDevices = [
      {
        id: 'GTW-ESP32-A12',
        location: 'North Tower - Floor 4',
        status: 'online',
        rssi: -42,
        firmware: 'v2.4.1',
        uptime: '12d 4h 22m',
        isFirmwareOutdated: false
      },
      {
        id: 'GTW-ESP32-B45',
        location: 'South Wing - Basement',
        status: 'low-signal',
        rssi: -78,
        firmware: 'v2.2.0',
        uptime: '3d 18h 05m',
        isFirmwareOutdated: true
      },
      {
        id: 'GTW-ESP32-K81',
        location: 'Parking Area - Zone C',
        status: 'comm-failure',
        rssi: null,
        firmware: 'v2.3.5',
        uptime: '0d 0h 0m',
        isFirmwareOutdated: false
      },
      {
        id: 'GTW-ESP32-M09',
        location: 'Main Lobby',
        status: 'update-pending',
        rssi: -55,
        firmware: 'v2.4.0',
        uptime: '45d 12h 10m',
        isFirmwareOutdated: false
      },
      {
        id: 'GTW-ESP32-X22',
        location: 'Roof Terrace',
        status: 'online',
        rssi: -38,
        firmware: 'v2.4.1',
        uptime: '8d 2h 45m',
        isFirmwareOutdated: false
      }
    ];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.rawDevices.map(DeviceMapper.toDomain);
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const device = this.rawDevices.find(d => d.id === id);
    return device ? DeviceMapper.toDomain(device) : null;
  }

  async getKPIs() {
    return {
      operationalStatus: '98.2%',
      gatewayLoad: '42',
      activeAlerts: '14',
      firmwareDrift: '0.02'
    };
  }
}
