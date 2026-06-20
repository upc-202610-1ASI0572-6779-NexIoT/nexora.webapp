import { DomainEvent } from '@/shared/domain/DomainEvent';

export class AlertCreated extends DomainEvent {
  constructor(alertId, deviceId, severity, type) {
    super();
    this.name = 'AlertCreated';
    this.alertId = alertId;
    this.deviceId = deviceId;
    this.severity = severity;
    this.type = type;
  }
}
