import { DomainEvent } from '@/shared/domain/DomainEvent';

export class DeviceRegistered extends DomainEvent {
  constructor(deviceId, location) {
    super();
    this.name = 'DeviceRegistered';
    this.deviceId = deviceId;
    this.location = location;
  }
}
