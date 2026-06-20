export class SubscriptionPolicyService {
  static canCreateProperty(subscription) {
    if (!subscription || !subscription.plan) return false;
    if (subscription.plan.unlimitedProperties) return true;
    const count = SubscriptionPolicyService.getPropertyCount();
    return count < subscription.plan.maxPropertiesLimit;
  }

  static getPropertyCount() {
    try {
      const stored = localStorage.getItem('nexora_properties');
      const properties = stored ? JSON.parse(stored) : [];
      return Array.isArray(properties) ? properties.length : 0;
    } catch {
      return 0;
    }
  }

  static addProperty(propertyData) {
    try {
      const stored = localStorage.getItem('nexora_properties');
      let properties = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(properties)) properties = [];
      const newProperty = { ...propertyData, id: Date.now(), createdAt: new Date().toISOString() };
      properties.push(newProperty);
      localStorage.setItem('nexora_properties', JSON.stringify(properties));
      return newProperty;
    } catch {
      return null;
    }
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
