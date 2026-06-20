import { defineStore } from 'pinia';
import { LoginUseCase } from '../../application/use-cases/LoginUseCase';
import { AuthRepositoryImpl } from '../../infrastructure/repositories/AuthRepositoryImpl';
import { SubscriptionBridgeService } from '../../../application/services/SubscriptionBridgeService';

const loginUseCase = new LoginUseCase(new AuthRepositoryImpl());
const subscriptionBridge = new SubscriptionBridgeService();

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    status: 'idle',
    serverError: null,
    subscription: JSON.parse(localStorage.getItem('subscription') || 'null'),
    showPendingModal: false,
  }),

  getters: {
    isLoading: (state) => state.status === 'loading',
    hasActiveSubscription: (state) => {
      return state.subscription?.status === 'Active';
    },
    subscriptionPlanId: (state) => state.subscription?.plan?.id || null,
  },

  actions: {
    async login(credentials) {
      this.serverError = null;
      this.status = 'loading';

      try {
        const data = await loginUseCase.execute(credentials);

        this.token = data.token;
        this.user = data.user;
        this.isAuthenticated = true;
        this.status = 'success';
        this.subscription = data.subscription || null;

        // Persist token and subscription
        localStorage.setItem('token', data.token);
        if (data.subscription) {
          localStorage.setItem('subscription', JSON.stringify(data.subscription));
        } else {
          localStorage.removeItem('subscription');
          // If backend did not return subscription in login response, try to fetch it as a fallback
          try {
            const current = await subscriptionBridge.fetchCurrentSubscription();
            if (current) {
              this.setSubscription(current);
            }
          } catch (e) {
            // Don't block login if fetching subscription fails; keep silent but store serverError for debugging
            // Note: serverError is used by UI to show messages; we avoid showing subscription fetch failures to the user here.
            console.debug('Failed to fetch subscription after login:', e);
          }
        }

        return data;
      } catch (error) {
        this.status = 'error';
        this.serverError = error;
        this.isAuthenticated = false;
        throw error;
      }
    },

    setSubscription(subscription) {
      this.subscription = subscription;
      if (subscription) {
        localStorage.setItem('subscription', JSON.stringify(subscription));
      } else {
        localStorage.removeItem('subscription');
      }
    },

    clearErrors() {
      this.serverError = null;
      this.status = 'idle';
    },

    logout() {
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      this.status = 'idle';
      this.serverError = null;
      this.subscription = null;
      this.showPendingModal = false;
      localStorage.removeItem('token');
      localStorage.removeItem('subscription');
    },
  },
});
