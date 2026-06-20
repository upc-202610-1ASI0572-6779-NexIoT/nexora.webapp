const PHONE_REGEX = /^\+?[0-9]{9,15}$/;

export class PhoneNumber {
  constructor(value) {
    this.value = value || null;
    if (this.value && this.value.trim() && !PHONE_REGEX.test(this.value.trim())) {
      throw { code: 'VALIDATION_ERROR', message: 'Enter a valid phone number (e.g., +51987654321).' };
    }
  }

  equals(other) {
    return other instanceof PhoneNumber && this.value === other.value;
  }

  toString() {
    return this.value || '';
  }
}
