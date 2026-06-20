export class FirmwareVersion {
  constructor(version) {
    this.version = version || 'Unknown';
  }

  isOutdated() {
    return this.version === 'Unknown' || this.version.startsWith('v2.0') || this.version.startsWith('v1.');
  }

  isLatest() {
    return this.version === 'v2.4.1' || this.version === 'v2.4.1 (Latest)';
  }

  equals(other) {
    return other instanceof FirmwareVersion && this.version === other.version;
  }

  toString() {
    return this.version;
  }
}
