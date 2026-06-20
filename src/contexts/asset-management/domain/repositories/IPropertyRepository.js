export class IPropertyRepository {
  async getAll() {
    throw new Error('Method not implemented: getAll');
  }

  async getById(id) {
    throw new Error('Method not implemented: getById');
  }

  async create(property) {
    throw new Error('Method not implemented: create');
  }

  async getByCode(code) {
    throw new Error('Method not implemented: getByCode');
  }

  async updateStatus(id, status) {
    throw new Error('Method not implemented: updateStatus');
  }

  async update(id, propertyData) {
    throw new Error('Method not implemented: update');
  }

  async getTotal() {
    throw new Error('Method not implemented: getTotal');
  }
}
