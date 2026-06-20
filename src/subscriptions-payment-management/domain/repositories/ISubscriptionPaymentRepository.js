export class ISubscriptionPaymentRepository {
  async getPlans() {
    throw new Error('Method not implemented: getPlans');
  }

  async getCurrentSubscription() {
    throw new Error('Method not implemented: getCurrentSubscription');
  }

  async activateSubscription(planId) {
    throw new Error('Method not implemented: activateSubscription');
  }

  async getPaymentMethods() {
    throw new Error('Method not implemented: getPaymentMethods');
  }

  async getInvoices() {
    throw new Error('Method not implemented: getInvoices');
  }

  async updatePaymentMethod(id, data) {
    throw new Error('Method not implemented: updatePaymentMethod');
  }

  async cancelSubscription() {
    throw new Error('Method not implemented: cancelSubscription');
  }
}
