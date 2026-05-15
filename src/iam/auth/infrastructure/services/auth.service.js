import { MOCK_USERS, MOCK_TOKEN } from '../mocks/user.mock';

const failedAttempts = new Map();

export const authService = {
  async login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = MOCK_USERS.find((u) => u.email === email);

        if (!user) {
          return reject({
            code: 'USER_NOT_FOUND',
            message: 'No account found with this email address.',
          });
        }

        const attempts = failedAttempts.get(email) || 0;

        if (attempts >= 3) {
          return reject({
            code: 'ACCOUNT_LOCKED',
            message: 'Account is locked due to too many failed attempts. Please try again later.',
          });
        }

        if (user.password !== password) {
          const newCount = attempts + 1;
          failedAttempts.set(email, newCount);

          if (newCount >= 3) {
            return reject({
              code: 'ACCOUNT_LOCKED',
              message: 'Account locked due to too many failed attempts. Please try again later.',
            });
          }

          const remaining = 3 - newCount;
          const attemptWord = remaining === 1 ? 'attempt' : 'attempts';

          return reject({
            code: 'INVALID_PASSWORD',
            message: `Incorrect password. ${remaining} ${attemptWord} remaining.`,
          });
        }

        failedAttempts.delete(email);

        const { password: _, ...safeUser } = user;

        resolve({
          token: MOCK_TOKEN,
          user: safeUser,
        });
      }, 800);
    });
  },
};
