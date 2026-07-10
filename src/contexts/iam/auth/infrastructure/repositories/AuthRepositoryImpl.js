import apiClient from '@/shared/infrastructure/http/apiClient';
import { AuthMapper } from '../mappers/AuthMapper';
import { RegisterMapper } from '../mappers/RegisterMapper';
import { IAuthRepository } from '../../../domain/repositories/IAuthRepository';

export class AuthRepositoryImpl extends IAuthRepository {
  async login(email, password) {
    try {
      const { data } = await apiClient.post('/api/v1/sessions', {
        email,
        password,
        platform: 'web'
      });

      return {
        token: data.token,
        user: AuthMapper.toDomain(data),
        subscription: null,
      };
    } catch (err) {
      const status = err.response?.status;
      const body = err.response?.data;

      if (status === 403) {
        throw {
          code: 'FORBIDDEN_ACCESS',
          message: body?.message || 'This platform is for landlords only.',
        };
      }

      if (status === 401) {
        throw {
          code: 'INVALID_CREDENTIALS',
          message: body?.message || 'Invalid email or password.',
        };
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
      const { data } = await apiClient.post('/api/v1/landlord-accounts', payload);

      return {
        token: data.token,
        user: AuthMapper.toDomain(data),
        subscription: null,
      };
    } catch (err) {
      const status = err.response?.status;
      const body = err.response?.data;
      const message = typeof body === 'string' ? body : body?.message || '';

      if (status === 400) {
        if (message.toLowerCase().includes('already exists') || message.toLowerCase().includes('ya registrado')) {
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
      const { data } = await apiClient.put('/api/v1/password', {
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
