export class Alert {
  constructor({ id, deviceId, severity, type, timestamp }) {
    this._id = id;
    this._deviceId = deviceId;
    this._severity = severity;
    this._type = type;
    this._timestamp = timestamp;
    Object.freeze(this);
  }

  get id() { return this._id; }
  get deviceId() { return this._deviceId; }
  get severity() { return this._severity; }
  get type() { return this._type; }
  get timestamp() { return this._timestamp; }

  isCritical() {
    return this._severity === 'Critical';
  }

  isWarning() {
    return this._severity === 'Warning';
  }

  getSensorType() {
    if (this._type.includes('Gas')) return 'Gas Level';
    if (this._type.includes('Overcurrent')) return 'Current Overload';
    if (this._type.includes('Voltage')) return 'Voltage Monitor';
    if (this._type.includes('Intrusión') || this._type.includes('intrusion')) return 'Security Motion';
    return 'System';
  }

  getStatus() {
    return this.isCritical() ? 'CRITICAL' : 'WARNING';
  }
}
