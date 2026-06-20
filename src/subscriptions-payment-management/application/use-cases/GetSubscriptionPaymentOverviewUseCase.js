export class GetSubscriptionPaymentOverviewUseCase {
  constructor(subscriptionPaymentRepository) {
    this.subscriptionPaymentRepository = subscriptionPaymentRepository;
  }

  async execute() {
    const subscription = await this.subscriptionPaymentRepository.getCurrentSubscription();
    let paymentMethods = [];
    let invoices = [];

    if (subscription) {
      try {
        const pmResult = await this.subscriptionPaymentRepository.getPaymentMethods();
        paymentMethods = pmResult.paymentMethods || [];
      } catch {}
      try {
        const invResult = await this.subscriptionPaymentRepository.getInvoices();
        invoices = invResult.invoices || [];
      } catch {}
    }

    return {
      subscription,
      plan: subscription?.plan || null,
      paymentMethods,
      invoices
    };
  }
}
