import { DomainEvent } from '@/shared/domain/DomainEvent';

export class SubscriptionActivated extends DomainEvent {
  constructor(planId, invoiceId) {
    super();
    this.name = 'SubscriptionActivated';
    this.planId = planId;
    this.invoiceId = invoiceId;
  }
}
