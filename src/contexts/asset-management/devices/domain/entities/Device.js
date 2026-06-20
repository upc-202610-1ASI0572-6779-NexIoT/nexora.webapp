import { DeviceStatus } from '../../../domain/value-objects/DeviceStatus';
import { RSSI } from '../../../domain/value-objects/RSSI';
import { FirmwareVersion } from '../../../domain/value-objects/FirmwareVersion';
import { Location } from '../../../domain/value-objects/Location';

export class Device {
  constructor({ id, location, status, rssi, firmware, uptime, isFirmwareOutdated }) {
    this.id = id;
    this._status = new DeviceStatus(status);
    this.status = this._status.toString();
    this._rssi = new RSSI(rssi);
    this.rssi = rssi;
    this._firmware = new FirmwareVersion(firmware);
    this.firmware = firmware;
    this._location = new Location(location);
    this.location = this._location.toString();
    this.uptime = uptime;
    this.isFirmwareOutdated = isFirmwareOutdated;
  }

  get statusVO() {
    return this._status;
  }

  get rssiVO() {
    return this._rssi;
  }

  get firmwareVO() {
    return this._firmware;
  }

  get locationVO() {
    return this._location;
  }

  isOnline() {
    return this._status.isOnline();
  }

  isOffline() {
    return this._status.isOffline();
  }

  hasCriticalSignal() {
    return this._rssi.isCritical();
  }

  needsUpdate() {
    return this.isFirmwareOutdated || this._status.needsUpdate();
  }

  getStatusLabel() {
    return this._status.getLabel();
  }
}
