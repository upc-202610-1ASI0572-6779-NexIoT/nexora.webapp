import apiClient from '@/shared/infrastructure/http/apiClient';
import { ISubscriptionPaymentRepository } from '../../domain/repositories/ISubscriptionPaymentRepository';

export class SubscriptionPaymentRepositoryImpl extends ISubscriptionPaymentRepository {
  async getPlans() {
    try {
      const { data } = await apiClient.get('/api/v1/subscriptions/plans?target=landlord');
      return data;
    } catch (err) {
      const body = err.response?.data;
      const message = typeof body === 'string' ? body : body?.message || '';
      throw {
        code: 'SERVER_ERROR',
        message: message || 'Unable to load subscription plans.',
      };
    }
  }

  async getCurrentSubscription() {
    try {
      const { data } = await apiClient.get('/api/v1/subscriptions/current');
      return data.subscription || null;
    } catch (err) {
      const status = err.response?.status;
      const body = err.response?.data;
      const message = typeof body === 'string' ? body : body?.message || '';

      if (status === 404) {
        return null;
      }

      throw {
        code: 'SERVER_ERROR',
        message: message || 'Unable to load subscription data.',
      };
    }
  }

  async activateSubscription(planId, paymentMethodId = null) {
    try {
      const payload = { subscriptionPlanId: planId };
      if (paymentMethodId) {
        payload.paymentMethodId = paymentMethodId;
      }
      const { data } = await apiClient.post('/api/v1/subscriptions', payload);
      return {
        subscription: data.subscription,
        amountDue: data.amountDue,
        dueDate: data.dueDate,
        invoiceId: data.invoiceId,
        clientSecret: data.clientSecret,
      };
    } catch (err) {
      const status = err.response?.status;
      const body = err.response?.data;
      const message = typeof body === 'string' ? body : body?.message || '';

      if (status === 400) {
        throw { code: 'VALIDATION_ERROR', message: message || 'Invalid request.' };
      }

      throw {
        code: 'SERVER_ERROR',
        message: message || 'Unable to activate subscription.',
      };
    }
  }

  async getPaymentMethod() {
    try {
      const { data } = await apiClient.get('/api/v1/subscriptions/payment-methods');
      return data.paymentMethods && data.paymentMethods.length > 0 ? data.paymentMethods[0] : null;
    } catch (err) {
      return null;
    }
  }

  async getInvoices() {
    try {
      const { data } = await apiClient.get('/api/v1/subscriptions/invoices');
      return data;
    } catch (err) {
      return { invoices: [] };
    }
  }

  async createPaymentMethod(paymentMethodId, holderName) {
    try {
      const { data: response } = await apiClient.post('/api/v1/subscriptions/payment-methods', {
        paymentMethodId,
        holderName
      });
      return response;
    } catch (err) {
      const status = err.response?.status;
      const body = err.response?.data;
      const message = typeof body === 'string' ? body : body?.message || '';

      if (status === 400) {
        throw { code: 'VALIDATION_ERROR', message: message || 'Invalid data.' };
      }

      throw {
        code: 'SERVER_ERROR',
        message: message || 'Unable to create payment method.',
      };
    }
  }

  async updatePaymentMethod(paymentMethodId, holderName) {
    try {
      const { data: response } = await apiClient.put('/api/v1/subscriptions/payment-method', {
        paymentMethodId,
        holderName
      });
      return response;
    } catch (err) {
      const status = err.response?.status;
      const body = err.response?.data;
      const message = typeof body === 'string' ? body : body?.message || '';

      if (status === 404) {
        throw { code: 'NOT_FOUND', message: 'Payment method not found.' };
      }
      if (status === 400) {
        throw { code: 'VALIDATION_ERROR', message: message || 'Invalid data.' };
      }

      throw {
        code: 'SERVER_ERROR',
        message: message || 'Unable to update payment method.',
      };
    }
  }

  async cancelSubscription(subscriptionId) {
    try {
      const { data } = await apiClient.post(`/api/v1/subscriptions/${subscriptionId}/cancel`);
      return data;
    } catch (err) {
      const status = err.response?.status;
      const body = err.response?.data;
      const message = typeof body === 'string' ? body : body?.message || '';

      if (status === 400) {
        throw { code: 'VALIDATION_ERROR', message: message || 'Cannot cancel subscription.' };
      }

      throw {
        code: 'SERVER_ERROR',
        message: message || 'Unable to cancel subscription.',
      };
    }
  }
}
