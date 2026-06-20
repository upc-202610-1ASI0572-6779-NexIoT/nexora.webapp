import { SubscriptionActivated } from '../../domain/events/SubscriptionActivated';

export class ActivateSubscriptionUseCase {
  constructor(subscriptionPaymentRepository) {
    this.subscriptionPaymentRepository = subscriptionPaymentRepository;
  }

  async execute(planId) {
    const result = await this.subscriptionPaymentRepository.activateSubscription(planId);
    const event = new SubscriptionActivated(planId, result.invoiceId);
    console.debug('[Domain Event]', event.name, event);
    return result;
  }
}
