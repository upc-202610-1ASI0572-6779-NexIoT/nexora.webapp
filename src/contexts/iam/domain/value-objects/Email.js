const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email {
  constructor(value) {
    if (!value || !value.trim()) {
      throw { code: 'VALIDATION_ERROR', message: 'Email is required.' };
    }
    if (value.length > 255) {
      throw { code: 'VALIDATION_ERROR', message: 'Email must not exceed 255 characters.' };
    }
    if (!EMAIL_REGEX.test(value)) {
      throw { code: 'VALIDATION_ERROR', message: 'Enter a valid email address (e.g., name@company.com).' };
    }
    this.value = value.trim().toLowerCase();
  }

  equals(other) {
    return other instanceof Email && this.value === other.value;
  }

  toString() {
    return this.value;
  }
}
