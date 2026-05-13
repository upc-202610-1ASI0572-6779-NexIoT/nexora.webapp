import { MOCK_USER_RESPONSE } from './mocks/user.mock';

/**
 * Service to handle authentication requests.
 * Currently using simulated data (Fake API).
 */
export const authService = {
    /**
     * Simulates a login request to the backend.
     * @param {string} email - User email.
     * @param {string} password - User password.
     * @returns {Promise<Object>} The user DTO and token.
     */
    async login(email, password) {
        // Simulate network latency (800ms)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simple mock validation
                if (email === 'admin@nexora.com' && password === 'admin123') {
                    resolve(MOCK_USER_RESPONSE);
                } else {
                    reject(new Error('Invalid credentials (Fake API)'));
                }
            }, 800);
        });
    }
};