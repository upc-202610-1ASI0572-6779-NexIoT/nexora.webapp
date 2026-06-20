import apiClient from '@/shared/infrastructure/http/apiClient';
import { AuthMapper } from '../mappers/AuthMapper';
import { RegisterMapper } from '../mappers/RegisterMapper';
import { IAuthRepository } from '../../../domain/repositories/IAuthRepository';

export class AuthRepositoryImpl extends IAuthRepository {
  async login(email, password) {
    try {
      const { data } = await apiClient.post('/api/v1/authentication/signin', {
        email,
        password,
      });

      return {
        token: data.token,
        user: AuthMapper.toDomain(data),
        subscription: data.subscription || null,
      };
    } catch (err) {
      const status = err.response?.status;
      const body = err.response?.data;

      if (status === 423) {
        throw {
          code: 'ACCOUNT_LOCKED',
          message: body?.message || 'Account is locked. Please try again later.',
        };
      }

      if (status === 403) {
        throw {
          code: 'USER_INACTIVE',
          message: body?.message || 'This account has been deactivated.',
        };
      }

      if (status === 401 || status === 404) {
        const msg = body?.message || 'Invalid email or password.';
        const code = msg.toLowerCase().includes('password')
          ? 'INVALID_PASSWORD'
          : 'USER_NOT_FOUND';
        throw { code, message: msg };
      }

      if (status === 429) {
        throw {
          code: 'TOO_MANY_ATTEMPTS',
          message: body?.message || 'Too many login attempts. Please wait before trying again.',
        };
      }

      throw {
        code: 'SERVER_ERROR',
        message: body?.message || 'Unable to connect to the server. Please try again later.',
      };
    }
  }

  async register(registrationData) {
    try {
      const payload = RegisterMapper.toApiPayload(registrationData);
      const { data } = await apiClient.post('/api/v1/authentication/signup', payload);

      return {
        token: data.token,
        user: AuthMapper.toDomain(data),
        subscription: data.subscription || null,
      };
    } catch (err) {
      const status = err.response?.status;
      const body = err.response?.data;
      const message = typeof body === 'string' ? body : body?.message || '';

      if (status === 400) {
        if (message.toLowerCase().includes('already exists')) {
          throw { code: 'EMAIL_TAKEN', message };
        }
        throw { code: 'VALIDATION_ERROR', message: message || 'Invalid registration data.' };
      }

      if (status === 409) {
        throw {
          code: 'EMAIL_TAKEN',
          message: message || 'An account with this email address already exists.',
        };
      }

      throw {
        code: 'SERVER_ERROR',
        message: message || 'Registration failed. Please try again.',
      };
    }
  }

  async changePassword(email, currentPassword, newPassword) {
    // email parameter is accepted for compatibility with use-cases but not used by the API
    try {
      const { data } = await apiClient.post('/api/v1/authentication/change-password', {
        currentPassword,
        newPassword,
      });

      return data;
    } catch (err) {
      const body = err.response?.data;

      if (body && body.code) {
        throw body;
      }

      throw {
        code: 'SERVER_ERROR',
        message: body?.message || 'Unable to change password. Please try again later.',
      };
    }
  }
}
