export class SubscriptionPolicyService {
  static canCreateProperty(subscription, propertyCount = 0) {
    if (!subscription || !subscription.plan) return false;
    if (subscription.plan.unlimitedProperties) return true;
    return propertyCount < subscription.plan.maxPropertiesLimit;
  }

  static isActive(status) {
    return status === 'Active';
  }

  static isSuspended(status) {
    return status === 'Suspended';
  }

  static isExpired(status) {
    return status === 'Expired';
  }

  static canAccessDashboard(subscription) {
    return subscription && subscription.status === 'Active';
  }
}
