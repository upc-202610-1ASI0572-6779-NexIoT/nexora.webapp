import { defineStore } from 'pinia';
import { GetSubscriptionPaymentOverviewUseCase } from '../../application/use-cases/GetSubscriptionPaymentOverviewUseCase';
import { SubscriptionPaymentRepositoryImpl } from '../../infrastructure/repositories/SubscriptionPaymentRepositoryImpl';

const subscriptionPaymentRepository = new SubscriptionPaymentRepositoryImpl();
const getSubscriptionPaymentOverviewUseCase = new GetSubscriptionPaymentOverviewUseCase(subscriptionPaymentRepository);

export const useSubscriptionPaymentStore = defineStore('subscription-payment', {
  state: () => ({
    subscription: null,
    plan: null,
    paymentMethods: [],
    invoices: [],
    isLoading: false,
    error: null,
  }),
  actions: {
    async fetchOverview() {
      this.isLoading = true;
      this.error = null;
      try {
        const overview = await getSubscriptionPaymentOverviewUseCase.execute();
        this.subscription = overview.subscription;
        this.plan = overview.plan;
        this.paymentMethods = overview.paymentMethods || [];
        this.invoices = overview.invoices || [];
      } catch (err) {
        this.error = err.code || 'SERVER_ERROR';
      } finally {
        this.isLoading = false;
      }
    }
  }
});
