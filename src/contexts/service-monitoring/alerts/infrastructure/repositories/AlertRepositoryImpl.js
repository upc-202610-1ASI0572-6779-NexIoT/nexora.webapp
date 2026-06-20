import apiClient from '@/shared/infrastructure/http/apiClient';
import { IAlertRepository } from '../../domain/repositories/IAlertRepository';

export class AlertRepositoryImpl extends IAlertRepository {
  async getAll(params = {}) {
    const { data } = await apiClient.get('/api/v1/alerts', { params });
    return data;
  }

  async getById(id) {
    const { data } = await apiClient.get(`/api/v1/alerts/${id}`);
    return data;
  }

  async create(alert) {
    const { data } = await apiClient.post('/api/v1/alerts', alert);
    return data;
  }

  async getCountBySeverity(severity) {
    const res = await apiClient.get('/api/v1/alerts', {
      params: { page: 1, pageSize: 1, severity }
    });
    return parseInt(res.headers['x-total-count'] || '0', 10);
  }
}
