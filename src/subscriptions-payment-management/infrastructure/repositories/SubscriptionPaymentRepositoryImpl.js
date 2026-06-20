import { SubscriptionPaymentMapper } from '../mappers/SubscriptionPaymentMapper';

export class SubscriptionPaymentRepositoryImpl {
  constructor() {
    this.rawSubscriptionPayment = {
      tabs: ['Subscription', 'Billing Overview', 'Usage Logs', 'Payment Methods'],
      plan: {
        name: 'Enterprise Infrastructure Pro',
        description: 'Managed Industrial IoT solution for up to 5,000 devices across multiple regions.',
        status: 'active',
        billingCycle: 'Annual (Save 15%)',
        nextPayment: 'October 12, 2024',
        renewalAmount: '$4,800.00 / year'
      },
      usage: {
        activeDevices: 3420,
        activeDevicesLimit: 5000,
        dataProcessing: 1.2,
        dataProcessingLimit: 2.0,
        resetDays: 14,
        remainingPercentage: 26
      },
      invoices: [
        { id: 'INV-2023-0912', date: 'Sep 12, 2023', amount: '$4,800.00', status: 'paid' },
        { id: 'INV-2022-0912', date: 'Sep 12, 2022', amount: '$4,800.00', status: 'paid' },
        { id: 'INV-2021-0912', date: 'Sep 12, 2021', amount: '$4,800.00', status: 'paid' },
        { id: 'INV-2020-0912', date: 'Sep 12, 2020', amount: '$2,400.00', status: 'paid' }
      ],
      paymentMethod: {
        brand: 'visa',
        maskedNumber: '•••• •••• •••• 2422',
        expiresAt: '12/26'
      },
      accountManager: {
        name: 'Sarah Jenkins',
        email: 's.jenkins@nexora.io'
      }
    };
  }

  async getOverview() {
    return {
      tabs: this.rawSubscriptionPayment.tabs,
      plan: SubscriptionPaymentMapper.planToDomain(this.rawSubscriptionPayment.plan),
      usage: SubscriptionPaymentMapper.usageToDomain(this.rawSubscriptionPayment.usage),
      invoices: this.rawSubscriptionPayment.invoices.map(SubscriptionPaymentMapper.invoiceToDomain),
      paymentMethod: SubscriptionPaymentMapper.paymentMethodToDomain(this.rawSubscriptionPayment.paymentMethod),
      accountManager: SubscriptionPaymentMapper.accountManagerToDomain(this.rawSubscriptionPayment.accountManager)
    };
  }
}
