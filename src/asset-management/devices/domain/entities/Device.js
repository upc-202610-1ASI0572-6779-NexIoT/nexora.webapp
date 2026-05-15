export class Device {
  constructor({ id, location, status, rssi, firmware, uptime, isFirmwareOutdated }) {
    this.id = id;
    this.location = location;
    this.status = status;
    this.rssi = rssi;
    this.firmware = firmware;
    this.uptime = uptime;
    this.isFirmwareOutdated = isFirmwareOutdated;
  }

  isOnline() {
    return this.status === 'online';
  }

  isOffline() {
    return this.status === 'comm-failure';
  }

  hasCriticalSignal() {
    return this.rssi !== null && this.rssi < -75;
  }

  needsUpdate() {
    return this.isFirmwareOutdated || this.status === 'update-pending';
  }

  getStatusLabel() {
    const labels = {
      'online': 'Operational',
      'low-signal': 'Low Signal',
      'comm-failure': 'Offline',
      'update-pending': 'Updating'
    };
    return labels[this.status] || 'Unknown';
  }
}
