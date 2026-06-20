import apiClient from '@/shared/infrastructure/http/apiClient';
import { ISubscriptionPaymentRepository } from '../../domain/repositories/ISubscriptionPaymentRepository';

export class SubscriptionPaymentRepositoryImpl extends ISubscriptionPaymentRepository {
  async getPlans() {
    try {
      const { data } = await apiClient.get('/api/v1/subscriptions/plans');
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

  async activateSubscription(planId) {
    try {
      const { data } = await apiClient.post('/api/v1/subscriptions', {
        subscriptionPlanId: planId,
      });
      return {
        subscription: data.subscription,
        amountDue: data.amountDue,
        dueDate: data.dueDate,
        invoiceId: data.invoiceId,
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

  async getPaymentMethods() {
    try {
      const { data } = await apiClient.get('/api/v1/subscriptions/payment-methods');
      return data;
    } catch (err) {
      return { paymentMethods: [] };
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

  async updatePaymentMethod(id, data) {
    try {
      const { data: response } = await apiClient.put(`/api/v1/subscriptions/payment-methods/${id}`, data);
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

  async cancelSubscription() {
    try {
      const { data } = await apiClient.put('/api/v1/subscriptions/status');
      return data;
    } catch (err) {
      const status = err.response?.status;
      const body = err.response?.data;
      const message = typeof body === 'string' ? body : body?.message || '';

      if (status === 400) {
        throw { code: 'VALIDATION_ERROR', message: message || message || 'Cannot cancel subscription.' };
      }

      throw {
        code: 'SERVER_ERROR',
        message: message || 'Unable to cancel subscription.',
      };
    }
  }
}
