import { defineStore } from 'pinia';
import { authService } from '../api/auth.service';

/**
 * Auth Store for session management.
 */
export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
        isAuthenticated: !!localStorage.getItem('token'),
        status: 'idle', // 'idle' | 'loading' | 'success' | 'error'
    }),

    getters: {
        /** @returns {boolean} */
        isLoading: (state) => state.status === 'loading',
    },

    actions: {
        /**
         * Attempts to login the user and updates the state.
         * @param {Object} credentials - Object with email and password.
         */
        async login(credentials) {
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
                this.isAuthenticated = false;
                throw error;
            }
        },

        /**
         * Clears session data.
         */
        logout() {
            this.user = null;
            this.token = null;
            this.isAuthenticated = false;
            this.status = 'idle';
            localStorage.removeItem('token');
        }
    }
});