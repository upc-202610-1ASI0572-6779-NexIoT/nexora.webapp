export class ISubscriptionPaymentRepository {
  async getPlans() {
    throw new Error('Method not implemented: getPlans');
  }

  async getCurrentSubscription() {
    throw new Error('Method not implemented: getCurrentSubscription');
  }

  async activateSubscription(planId, cardData = null) {
    throw new Error('Method not implemented: activateSubscription');
  }

  async getPaymentMethod() {
    throw new Error('Method not implemented: getPaymentMethod');
  }

  async getInvoices() {
    throw new Error('Method not implemented: getInvoices');
  }

  async createPaymentMethod(data) {
    throw new Error('Method not implemented: createPaymentMethod');
  }

  async updatePaymentMethod(data) {
    throw new Error('Method not implemented: updatePaymentMethod');
  }

  async cancelSubscription() {
    throw new Error('Method not implemented: cancelSubscription');
  }
}
