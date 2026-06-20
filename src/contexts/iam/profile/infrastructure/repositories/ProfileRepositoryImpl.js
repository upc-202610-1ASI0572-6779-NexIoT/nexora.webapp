import apiClient from '@/shared/infrastructure/http/apiClient';
import { Profile } from '../../domain/entities/Profile';
import { IProfileRepository } from '../../../domain/repositories/IProfileRepository';

export class ProfileRepositoryImpl extends IProfileRepository {
  // email parameter kept for compatibility with use-cases, but the
  // real backend identifies the user from the JWT token.
  async getProfile() {
    try {
      const { data } = await apiClient.get('/api/v1/profiles/me');

      if (!data || !data.profile) {
        throw { code: 'USER_NOT_FOUND', message: 'User not found.' };
      }

      const p = data.profile;
      return new Profile({
        email: p.email,
        firstName: p.firstName || '—',
        lastName: p.lastName || '—',
        isActive: p.isActive,
        country: p.country || '—',
        city: p.city || '—',
        address: p.address || '—',
        phoneNumber: p.phoneNumber || null,
      });
    } catch (err) {
      const body = err.response?.data;
      if (body && body.code) throw body;
      throw { code: 'SERVER_ERROR', message: err.message || 'Failed to fetch profile.' };
    }
  }

  async updateProfile(data) {
    try {
      const { data: res } = await apiClient.put('/api/v1/profiles/me', data);
      if (!res || !res.profile) {
        throw { code: 'UPDATE_FAILED', message: 'Failed to update profile.' };
      }

      const p = res.profile;
      return new Profile({
        email: p.email,
        firstName: p.firstName || '—',
        lastName: p.lastName || '—',
        isActive: p.isActive,
        country: p.country || '—',
        city: p.city || '—',
        address: p.address || '—',
        phoneNumber: p.phoneNumber || null,
      });
    } catch (err) {
      const body = err.response?.data;
      if (body && body.code) throw body;
      throw { code: 'SERVER_ERROR', message: err.message || 'Failed to update profile.' };
    }
  }
}
