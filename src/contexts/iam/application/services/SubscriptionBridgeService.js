import { SubscriptionPaymentRepositoryImpl } from '@/subscriptions-payment-management/infrastructure/repositories/SubscriptionPaymentRepositoryImpl';

export class SubscriptionBridgeService {
  constructor() {
    this.subscriptionRepository = new SubscriptionPaymentRepositoryImpl();
  }

  async fetchCurrentSubscription() {
    try {
      return await this.subscriptionRepository.getCurrentSubscription();
    } catch {
      return null;
    }
  }
}
