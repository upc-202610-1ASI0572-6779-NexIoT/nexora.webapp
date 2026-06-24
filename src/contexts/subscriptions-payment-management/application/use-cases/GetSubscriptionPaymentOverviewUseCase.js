export class GetSubscriptionPaymentOverviewUseCase {
  constructor(subscriptionPaymentRepository) {
    this.subscriptionPaymentRepository = subscriptionPaymentRepository;
  }

  async execute() {
    const subscription = await this.subscriptionPaymentRepository.getCurrentSubscription();
    let paymentMethod = null;
    let invoices = [];

    if (subscription) {
      try {
        paymentMethod = await this.subscriptionPaymentRepository.getPaymentMethod();
      } catch {}
      try {
        const invResult = await this.subscriptionPaymentRepository.getInvoices();
        invoices = invResult.invoices || [];
      } catch {}
    }

    return {
      subscription,
      plan: subscription?.plan || null,
      paymentMethod,
      invoices
    };
  }
}
