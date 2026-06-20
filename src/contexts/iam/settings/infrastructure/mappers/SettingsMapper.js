import { TeamMember, PaymentMethod } from '../../domain/entities/Settings';

export class SettingsMapper {
  static toTeamMemberDomain(raw) {
    return new TeamMember(raw);
  }

  static toPaymentMethodDomain(raw) {
    return new PaymentMethod(raw);
  }
}
