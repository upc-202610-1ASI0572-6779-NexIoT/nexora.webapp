import { defineStore } from 'pinia';
import { SettingsRepositoryImpl } from '../../infrastructure/repositories/SettingsRepositoryImpl';
import { GetSystemSettingsUseCase } from '../../application/use-cases/GetSystemSettingsUseCase';

const settingsRepository = new SettingsRepositoryImpl();
const getSystemSettingsUseCase = new GetSystemSettingsUseCase(settingsRepository);

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    profile: null,
    team: [],
    payment: null,
    plan: null,
    security: {
      is2faActive: false,
      lastPasswordChange: ''
    },
    isLoading: false
  }),
  actions: {
    async fetchSettings() {
      this.isLoading = true;
      try {
        const data = await getSystemSettingsUseCase.execute();
        this.profile = data.profile;
        this.team = data.team;
        this.payment = data.payment;
        this.plan = data.plan;
        this.security = data.security;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
