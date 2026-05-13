import { defineStore } from 'pinia';
import { authService } from '../api/auth.service';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    status: 'idle',
    serverError: null,
  }),

  getters: {
    isLoading: (state) => state.status === 'loading',
  },

  actions: {
    async login(credentials) {
      this.serverError = null;
      this.status = 'loading';

      try {
        const data = await authService.login(credentials.email, credentials.password);

        this.token = data.token;
        this.user = data.user;
        this.isAuthenticated = true;
        this.status = 'success';

        localStorage.setItem('token', data.token);
      } catch (error) {
        this.status = 'error';
        this.serverError = error;
        this.isAuthenticated = false;
        throw error;
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
      localStorage.removeItem('token');
    },
  },
});