import { SettingsMapper } from '../mappers/SettingsMapper';

export class SettingsRepositoryImpl {
  constructor() {
    this.rawData = {
      profile: {
        name: 'Alex',
        lastName: 'Rivera',
        email: 'alex.rivera@nexora.io',
        location: 'Ciudad de México, Hub Industrial Norte'
      },
      team: [
        { name: 'Alex Rivera', role: 'ADMIN' },
        { name: 'Sofia Mena', role: 'LANDLORD' },
        { name: 'Juan Castro', role: 'TENANT' }
      ],
      payment: {
        type: 'Visa',
        lastFour: '1234',
        expiry: '08/26'
      },
      plan: {
        name: 'Professional Plan',
        price: '$249 / mes'
      },
      security: {
        is2faActive: true,
        lastPasswordChange: '3 months ago'
      }
    };
  }

  async getSettings() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      profile: SettingsMapper.toProfileDomain(this.rawData.profile),
      team: this.rawData.team.map(SettingsMapper.toTeamMemberDomain),
      payment: SettingsMapper.toPaymentMethodDomain(this.rawData.payment),
      plan: this.rawData.plan,
      security: this.rawData.security
    };
  }
}
