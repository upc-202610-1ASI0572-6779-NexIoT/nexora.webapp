import { PersonName } from '../../../domain/value-objects/PersonName';
import { Address } from '../../../domain/value-objects/Address';

export class UpdateProfileUseCase {
  constructor(profileRepository) {
    this.profileRepository = profileRepository;
  }

  async execute(data) {
    // Backend uses JWT to identify user; email is not required from client
    if (!data.firstName || data.firstName.trim().length < 2) {
      throw { code: 'INVALID_FIRST_NAME', message: 'First name must be at least 2 characters.' };
    }
    if (!data.lastName || data.lastName.trim().length < 2) {
      throw { code: 'INVALID_LAST_NAME', message: 'Last name must be at least 2 characters.' };
    }
    if (!data.country || data.country.trim().length < 2) {
      throw { code: 'INVALID_COUNTRY', message: 'Country must be at least 2 characters.' };
    }
    if (!data.city || data.city.trim().length < 2) {
      throw { code: 'INVALID_CITY', message: 'City must be at least 2 characters.' };
    }
    if (!data.address || data.address.trim().length < 5) {
      throw { code: 'INVALID_ADDRESS', message: 'Address must be at least 5 characters.' };
    }
    const validatedData = data;
    if (data.firstName && data.lastName) {
      new PersonName(data.firstName, data.lastName);
    }
    if (data.country && data.city && data.address) {
      new Address({ country: data.country, city: data.city, address: data.address });
    }
    return this.profileRepository.updateProfile(validatedData);
  }
}
