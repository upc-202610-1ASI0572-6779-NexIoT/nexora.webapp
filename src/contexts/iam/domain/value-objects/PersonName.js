export class PersonName {
  constructor(firstName, lastName) {
    if (!firstName || !firstName.trim()) {
      throw { code: 'VALIDATION_ERROR', message: 'First name is required.' };
    }
    if (firstName.trim().length < 2) {
      throw { code: 'VALIDATION_ERROR', message: 'First name must be at least 2 characters.' };
    }
    if (!lastName || !lastName.trim()) {
      throw { code: 'VALIDATION_ERROR', message: 'Last name is required.' };
    }
    if (lastName.trim().length < 2) {
      throw { code: 'VALIDATION_ERROR', message: 'Last name must be at least 2 characters.' };
    }
    this.firstName = firstName.trim();
    this.lastName = lastName.trim();
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  get initials() {
    return `${this.firstName[0]}${this.lastName[0]}`.toUpperCase();
  }

  equals(other) {
    return other instanceof PersonName &&
      this.firstName === other.firstName &&
      this.lastName === other.lastName;
  }

  toString() {
    return this.fullName;
  }
}
