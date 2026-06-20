import apiClient from '@/shared/infrastructure/http/apiClient';
import { ISettingsRepository } from '../../../domain/repositories/ISettingsRepository';

export class SettingsRepositoryImpl extends ISettingsRepository {
  async getSettings() {
    try {
      const { data } = await apiClient.get('/api/v1/settings');
      return data;
    } catch (err) {
      const body = err.response?.data;
      const message = typeof body === 'string' ? body : body?.message || '';
      throw {
        code: 'SERVER_ERROR',
        message: message || 'Unable to load settings.',
      };
    }
  }
}
