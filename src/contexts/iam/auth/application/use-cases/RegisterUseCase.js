import { RegistrationData } from '../../domain/entities/RegistrationData';
import { RegistrationValidationService } from '../../../domain/services/RegistrationValidationService';

export class RegisterUseCase {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async execute(formData) {
    RegistrationValidationService.validate(formData);

    const registrationData = new RegistrationData(formData);

    return this.authRepository.register(registrationData);
  }
}
