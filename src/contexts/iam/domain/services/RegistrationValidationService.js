import { Email } from '../value-objects/Email';
import { PersonName } from '../value-objects/PersonName';
import { PhoneNumber } from '../value-objects/PhoneNumber';
import { Address } from '../value-objects/Address';

export class RegistrationValidationService {
  static validate(formData) {
    const errors = {};

    try {
      if (formData.email) new Email(formData.email);
    } catch (e) {
      if (e.code === 'VALIDATION_ERROR') errors.email = e.message;
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    try {
      new PersonName(formData.firstName, formData.lastName);
    } catch (e) {
      if (e.code === 'VALIDATION_ERROR') {
        if (e.message.includes('First name')) errors.firstName = e.message;
        if (e.message.includes('Last name')) errors.lastName = e.message;
      }
    }

    try {
      new Address({ country: formData.country, city: formData.city, address: formData.address });
    } catch (e) {
      if (e.code === 'VALIDATION_ERROR') {
        if (e.message.includes('Country')) errors.country = e.message;
        if (e.message.includes('City')) errors.city = e.message;
        if (e.message.includes('Address')) errors.address = e.message;
      }
    }

    try {
      if (formData.phoneNumber) new PhoneNumber(formData.phoneNumber);
    } catch (e) {
      if (e.code === 'VALIDATION_ERROR') errors.phoneNumber = e.message;
    }

    if (Object.keys(errors).length > 0) {
      throw { code: 'VALIDATION_ERROR', fields: errors };
    }
  }
}
