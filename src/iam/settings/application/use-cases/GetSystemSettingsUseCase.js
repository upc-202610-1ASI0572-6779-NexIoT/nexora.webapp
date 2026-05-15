export class GetSystemSettingsUseCase {
  constructor(settingsRepository) {
    this.settingsRepository = settingsRepository;
  }

  async execute() {
    return await this.settingsRepository.getSettings();
  }
}
