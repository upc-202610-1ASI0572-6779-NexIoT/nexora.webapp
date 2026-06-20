export class DomainEvent {
  constructor() {
    this.eventId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.occurredOn = new Date().toISOString();
  }
}
