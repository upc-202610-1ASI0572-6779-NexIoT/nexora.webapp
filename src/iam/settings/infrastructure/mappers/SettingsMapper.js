import { UserProfile, TeamMember, PaymentMethod } from '../../domain/entities/Settings';

export class SettingsMapper {
  static toProfileDomain(raw) {
    return new UserProfile(raw);
  }

  static toTeamMemberDomain(raw) {
    return new TeamMember(raw);
  }

  static toPaymentMethodDomain(raw) {
    return new PaymentMethod(raw);
  }
}
