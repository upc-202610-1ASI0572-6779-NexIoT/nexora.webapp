import { AccountManager } from '../../domain/entities/AccountManager';
import { Invoice } from '../../domain/entities/Invoice';
import { PaymentMethod } from '../../domain/entities/PaymentMethod';
import { SubscriptionPlan } from '../../domain/entities/SubscriptionPlan';
import { UsageLimit } from '../../domain/entities/UsageLimit';

export class SubscriptionPaymentMapper {
  static planToDomain(raw) {
    return new SubscriptionPlan(raw);
  }

  static usageToDomain(raw) {
    return new UsageLimit(raw);
  }

  static invoiceToDomain(raw) {
    return new Invoice(raw);
  }

  static paymentMethodToDomain(raw) {
    return new PaymentMethod(raw);
  }

  static accountManagerToDomain(raw) {
    return new AccountManager(raw);
  }
}
