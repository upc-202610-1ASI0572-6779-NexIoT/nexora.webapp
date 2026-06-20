import { PasswordService } from '../../../domain/services/PasswordService';

export class ChangePasswordUseCase {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async execute(email, currentPassword, newPassword, confirmPassword) {
    if (!email) {
      throw { code: 'NO_USER', message: 'No user is currently logged in.' };
    }
    PasswordService.validate(newPassword, currentPassword, confirmPassword);
    return this.authRepository.changePassword(email, currentPassword, newPassword);
  }
}
