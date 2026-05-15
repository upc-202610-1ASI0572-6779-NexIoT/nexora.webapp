export class GetSubscriptionPaymentOverviewUseCase {
  constructor(subscriptionPaymentRepository) {
    this.subscriptionPaymentRepository = subscriptionPaymentRepository;
  }

  async execute() {
    return this.subscriptionPaymentRepository.getOverview();
  }
}
