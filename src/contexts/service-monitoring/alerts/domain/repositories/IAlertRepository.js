export class IAlertRepository {
  async getAll(params = {}) {
    throw new Error('Method not implemented: getAll');
  }

  async getById(id) {
    throw new Error('Method not implemented: getById');
  }

  async create(alert) {
    throw new Error('Method not implemented: create');
  }

  async getCountBySeverity(severity) {
    throw new Error('Method not implemented: getCountBySeverity');
  }
}
