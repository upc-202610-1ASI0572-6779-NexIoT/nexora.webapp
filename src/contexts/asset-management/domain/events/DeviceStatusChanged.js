import { DomainEvent } from '@/shared/domain/DomainEvent';

export class DeviceStatusChanged extends DomainEvent {
  constructor(deviceId, previousStatus, newStatus) {
    super();
    this.name = 'DeviceStatusChanged';
    this.deviceId = deviceId;
    this.previousStatus = previousStatus;
    this.newStatus = newStatus;
  }
}
