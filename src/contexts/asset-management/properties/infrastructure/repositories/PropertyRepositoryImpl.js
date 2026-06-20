import apiClient from '@/shared/infrastructure/http/apiClient';
import { IPropertyRepository } from '../../../domain/repositories/IPropertyRepository';

export class PropertyRepositoryImpl extends IPropertyRepository {
  async getAll() {
    const { data } = await apiClient.get('/api/v1/properties');
    return data;
  }

  async getById(id) {
    const { data } = await apiClient.get(`/api/v1/properties/${id}`);
    return data;
  }

  async create(property) {
    const { data } = await apiClient.post('/api/v1/properties', property);
    return data;
  }

  async getByCode(code) {
    const { data } = await apiClient.get(`/api/v1/properties?code=${code}`);
    return data;
  }

  async updateStatus(id, status) {
    await apiClient.put(`/api/v1/properties/${id}/status`, JSON.stringify(status), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async update(id, propertyData) {
    await apiClient.put(`/api/v1/properties/${id}`, propertyData);
  }

  async getTotal() {
    const { data } = await apiClient.get('/api/v1/properties/stats');
    return data;
  }
}
