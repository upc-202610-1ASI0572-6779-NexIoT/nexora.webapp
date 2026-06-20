import { RegistrationData } from '../../domain/entities/RegistrationData';

export class RegisterMapper {
  static toDomain(raw) {
    return new RegistrationData(raw);
  }

  static toApiPayload(registrationData) {
    return {
      email: registrationData.email,
      password: registrationData.password,
      firstName: registrationData.firstName,
      lastName: registrationData.lastName,
      country: registrationData.country,
      city: registrationData.city,
      address: registrationData.address,
      phoneNumber: registrationData.phoneNumber,
    };
  }
}
