const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,64}$/;

export class PasswordService {
  static validate(newPassword, currentPassword, confirmPassword) {
    if (!currentPassword) {
      throw { code: 'CURRENT_PASSWORD_REQUIRED', message: 'Current password is required.' };
    }
    if (!newPassword) {
      throw { code: 'NEW_PASSWORD_REQUIRED', message: 'New password is required.' };
    }
    if (!PASSWORD_REGEX.test(newPassword)) {
      throw { code: 'INVALID_PASSWORD', message: 'Must be 8-64 chars with 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&.#_-).' };
    }
    if (newPassword !== confirmPassword) {
      throw { code: 'PASSWORD_MISMATCH', message: 'Passwords do not match.' };
    }
    if (currentPassword === newPassword) {
      throw { code: 'SAME_PASSWORD', message: 'New password must be different from current password.' };
    }
  }

  static validateStrength(password) {
    return PASSWORD_REGEX.test(password);
  }
}
