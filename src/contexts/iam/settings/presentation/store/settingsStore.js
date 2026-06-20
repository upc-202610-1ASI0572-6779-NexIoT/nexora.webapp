import { defineStore } from 'pinia';
import { SettingsRepositoryImpl } from '../../infrastructure/repositories/SettingsRepositoryImpl';
import { GetSystemSettingsUseCase } from '../../application/use-cases/GetSystemSettingsUseCase';

const settingsRepository = new SettingsRepositoryImpl();
const getSystemSettingsUseCase = new GetSystemSettingsUseCase(settingsRepository);

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    settings: null,
    isLoading: false
  }),
  actions: {
    async fetchSettings() {
      this.isLoading = true;
      try {
        this.settings = await getSystemSettingsUseCase.execute();
      } finally {
        this.isLoading = false;
      }
    }
  }
});
