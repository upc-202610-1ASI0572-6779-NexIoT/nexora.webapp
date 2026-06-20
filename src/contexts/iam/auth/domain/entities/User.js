import { Email } from '../../../domain/value-objects/Email';
import { PersonName } from '../../../domain/value-objects/PersonName';

export class User {
  constructor({ id, email, firstName, lastName, isActive, failedLoginAttempts = 0, lockedAt = null }) {
    this.id = id;
    this._email = email ? new Email(email) : null;
    this.email = this._email ? this._email.toString() : email;
    this.firstName = firstName || '';
    this.lastName = lastName || '';
    this._name = (firstName || lastName) ? new PersonName(firstName || '_', lastName || '_') : null;
    this.isActive = isActive;
    this.failedLoginAttempts = failedLoginAttempts;
    this.lockedAt = lockedAt;
  }

  get emailVO() {
    return this._email;
  }

  get nameVO() {
    return this._name;
  }

  get fullName() {
    if (!this.firstName && !this.lastName) return this.email;
    return `${this.firstName} ${this.lastName}`.trim();
  }

  get initials() {
    if (!this.firstName && !this.lastName) return this.email ? this.email[0].toUpperCase() : '';
    return `${this.firstName[0]}${this.lastName[0]}`.toUpperCase();
  }

  get isLocked() {
    if (!this.lockedAt) return false;
    const lockDuration = 15 * 60 * 1000;
    return Date.now() - new Date(this.lockedAt).getTime() < lockDuration;
  }

  recordFailedLogin() {
    this.failedLoginAttempts += 1;
  }

  resetFailedLogins() {
    this.failedLoginAttempts = 0;
    this.lockedAt = null;
  }
}
