import { DomainEvent } from '@/shared/domain/DomainEvent';

export class SubscriptionCancelled extends DomainEvent {
  constructor(subscriptionId) {
    super();
    this.name = 'SubscriptionCancelled';
    this.subscriptionId = subscriptionId;
  }
}
