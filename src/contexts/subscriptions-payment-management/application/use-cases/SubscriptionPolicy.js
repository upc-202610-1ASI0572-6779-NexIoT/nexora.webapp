import { SubscriptionPolicyService } from '../../domain/services/SubscriptionPolicyService';

export class SubscriptionPolicy {
  static canCreateProperty(subscription, propertyCount = 0) {
    return SubscriptionPolicyService.canCreateProperty(subscription, propertyCount);
  }

  static isActive(status) {
    return SubscriptionPolicyService.isActive(status);
  }

  static canAccessDashboard(subscription) {
    return SubscriptionPolicyService.canAccessDashboard(subscription);
  }
}
