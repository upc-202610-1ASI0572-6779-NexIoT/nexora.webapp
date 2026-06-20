export class IAuthRepository {
  async login(email, password) {
    throw new Error('Method not implemented: login');
  }

  async register(registrationData) {
    throw new Error('Method not implemented: register');
  }

  async changePassword(email, currentPassword, newPassword) {
    throw new Error('Method not implemented: changePassword');
  }
}
