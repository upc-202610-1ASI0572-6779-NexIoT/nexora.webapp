import { defineStore } from 'pinia';
import { GetSubscriptionPaymentOverviewUseCase } from '../../application/use-cases/GetSubscriptionPaymentOverviewUseCase';
import { SubscriptionPaymentRepositoryImpl } from '../../infrastructure/repositories/SubscriptionPaymentRepositoryImpl';

const subscriptionPaymentRepository = new SubscriptionPaymentRepositoryImpl();
const getSubscriptionPaymentOverviewUseCase = new GetSubscriptionPaymentOverviewUseCase(subscriptionPaymentRepository);

export const useSubscriptionPaymentStore = defineStore('subscription-payment', {
  state: () => ({
    tabs: [],
    plan: null,
    usage: null,
    invoices: [],
    paymentMethod: null,
    accountManager: null,
    isLoading: false
  }),
  actions: {
    async fetchOverview() {
      this.isLoading = true;
      try {
        const overview = await getSubscriptionPaymentOverviewUseCase.execute();
        this.tabs = overview.tabs;
        this.plan = overview.plan;
        this.usage = overview.usage;
        this.invoices = overview.invoices;
        this.paymentMethod = overview.paymentMethod;
        this.accountManager = overview.accountManager;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
