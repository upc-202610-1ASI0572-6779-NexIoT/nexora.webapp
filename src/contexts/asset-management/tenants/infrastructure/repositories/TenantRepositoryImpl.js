import apiClient from '@/shared/infrastructure/http/apiClient';
import { ITenantRepository } from '../../../domain/repositories/ITenantRepository';

export class TenantRepositoryImpl extends ITenantRepository {
  async getAll() {
    const { data } = await apiClient.get('/api/v1/tenants');
    return data;
  }

  async getById(id) {
    const { data } = await apiClient.get(`/api/v1/tenants/${id}`);
    return data;
  }

  async getByProperty(propertyId) {
    const { data } = await apiClient.get(`/api/v1/properties/${propertyId}/tenants`);
    return data;
  }

  async create(tenant) {
    const { data } = await apiClient.post('/api/v1/tenants', tenant);
    return data;
  }

  async update(id, tenant) {
    await apiClient.put(`/api/v1/tenants/${id}`, tenant);
  }

  async delete(id) {
    await apiClient.delete(`/api/v1/tenants/${id}`);
  }
}
