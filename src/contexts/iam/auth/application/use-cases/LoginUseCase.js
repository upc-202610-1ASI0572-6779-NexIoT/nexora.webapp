import { Email } from '../../../domain/value-objects/Email';

export class LoginUseCase {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  async execute({ email, password }) {
    if (!email || !password) {
      throw {
        code: 'VALIDATION_ERROR',
        message: 'Email and password are required.',
      };
    }
    const emailVO = new Email(email);
    return this.authRepository.login(emailVO.toString(), password);
  }
}
