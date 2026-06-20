import { SubscriptionPolicyService } from '../../domain/services/SubscriptionPolicyService';

export class SubscriptionPolicy {
    static canCreateProperty(subscription) {
        return SubscriptionPolicyService.canCreateProperty(subscription);
    }

    static getPropertyCount() {
        return SubscriptionPolicyService.getPropertyCount();
    }

    static addProperty(propertyData) {
        return SubscriptionPolicyService.addProperty(propertyData);
    }
}