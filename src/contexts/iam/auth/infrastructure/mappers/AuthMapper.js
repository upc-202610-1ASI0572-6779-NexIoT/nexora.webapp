import { User } from '../../domain/entities/User';

export class AuthMapper {
  static toDomain(authResponse) {
    return new User({
      id: authResponse.userId,
      email: authResponse.email,
      isActive: true,
    });
  }

  static toLoginRequest(credentials) {
    return {
      email: credentials.email,
      password: credentials.password,
    };
  }
}
