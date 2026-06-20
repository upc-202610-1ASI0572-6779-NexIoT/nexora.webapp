export class GetProfileUseCase {
  constructor(profileRepository) {
    this.profileRepository = profileRepository;
  }

  async execute() {
    // The backend identifies the user via the JWT token; no email required here.
    return this.profileRepository.getProfile();
  }
}
