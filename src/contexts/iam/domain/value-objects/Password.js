const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,64}$/;

export class Password {
  constructor(value) {
    if (!value) {
      throw { code: 'PASSWORD_REQUIRED', message: 'Password is required.' };
    }
    if (!PASSWORD_REGEX.test(value)) {
      throw {
        code: 'INVALID_PASSWORD',
        message: 'Password must be 8-64 characters with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&.#_-).'
      };
    }
    this.value = value;
  }

  matches(plainPassword) {
    return this.value === plainPassword;
  }

  isDifferentFrom(otherPassword) {
    return this.value !== otherPassword.value;
  }

  equals(other) {
    return other instanceof Password && this.value === other.value;
  }

  toString() {
    return '[PROTECTED]';
  }
}
