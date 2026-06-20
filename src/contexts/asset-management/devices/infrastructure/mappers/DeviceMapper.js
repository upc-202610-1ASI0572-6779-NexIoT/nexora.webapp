import { Device } from '../../domain/entities/Device';

export class DeviceMapper {
  static toDomain(raw) {
    return new Device({
      id: raw.id,
      location: raw.location,
      status: raw.status,
      rssi: raw.rssi,
      firmware: raw.firmware,
      uptime: raw.uptime,
      isFirmwareOutdated: raw.isFirmwareOutdated,
    });
  }

  static toPersistence(device) {
    return {
      id: device.id,
      location: device.location,
      status: device.status,
      rssi: device.rssi,
      firmware: device.firmware,
      uptime: device.uptime,
      isFirmwareOutdated: device.isFirmwareOutdated,
    };
  }
}
