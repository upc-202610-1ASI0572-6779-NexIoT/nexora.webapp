const VALID_STATUSES = Object.freeze({
  ONLINE: 'online',
  LOW_SIGNAL: 'low-signal',
  COMM_FAILURE: 'comm-failure',
  UPDATE_PENDING: 'update-pending',
});

const STATUS_LABELS = Object.freeze({
  [VALID_STATUSES.ONLINE]: 'Operational',
  [VALID_STATUSES.LOW_SIGNAL]: 'Low Signal',
  [VALID_STATUSES.COMM_FAILURE]: 'Offline',
  [VALID_STATUSES.UPDATE_PENDING]: 'Updating',
});

export class DeviceStatus {
  constructor(value) {
    const normalized = Object.values(VALID_STATUSES).includes(value) ? value : VALID_STATUSES.COMM_FAILURE;
    this.value = normalized;
  }

  isOnline() {
    return this.value === VALID_STATUSES.ONLINE;
  }

  isOffline() {
    return this.value === VALID_STATUSES.COMM_FAILURE;
  }

  needsUpdate() {
    return this.value === VALID_STATUSES.UPDATE_PENDING;
  }

  hasLowSignal() {
    return this.value === VALID_STATUSES.LOW_SIGNAL;
  }

  getLabel() {
    return STATUS_LABELS[this.value] || 'Unknown';
  }

  equals(other) {
    return other instanceof DeviceStatus && this.value === other.value;
  }

  toString() {
    return this.value;
  }
}

DeviceStatus.ONLINE = VALID_STATUSES.ONLINE;
DeviceStatus.LOW_SIGNAL = VALID_STATUSES.LOW_SIGNAL;
DeviceStatus.COMM_FAILURE = VALID_STATUSES.COMM_FAILURE;
DeviceStatus.UPDATE_PENDING = VALID_STATUSES.UPDATE_PENDING;
