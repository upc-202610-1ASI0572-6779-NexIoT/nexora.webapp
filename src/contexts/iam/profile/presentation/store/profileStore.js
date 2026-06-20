import { defineStore } from 'pinia';
import { GetProfileUseCase } from '../../application/use-cases/GetProfileUseCase';
import { UpdateProfileUseCase } from '../../application/use-cases/UpdateProfileUseCase';
import { ProfileRepositoryImpl } from '../../infrastructure/repositories/ProfileRepositoryImpl';

const profileRepository = new ProfileRepositoryImpl();
const getProfileUseCase = new GetProfileUseCase(profileRepository);
const updateProfileUseCase = new UpdateProfileUseCase(profileRepository);

export const useProfileStore = defineStore('profile', {
  state: () => ({
    profile: null,
    isLoading: false,
    isSaving: false,
    error: null,
  }),

  actions: {
    async fetchProfile() {
      this.isLoading = true;
      this.error = null;

      try {
        this.profile = await getProfileUseCase.execute();
      } catch (err) {
        // store the full error object (may include { code, message }) so
        // UI components can map codes to translated messages
        this.error = err || { message: 'Failed to load profile.' };
      } finally {
        this.isLoading = false;
      }
    },

    async updateProfile(data) {
      this.isSaving = true;
      this.error = null;

      try {
        this.profile = await updateProfileUseCase.execute(data);
      } catch (err) {
        this.error = err || { message: 'Failed to update profile.' };
        throw err;
      } finally {
        this.isSaving = false;
      }
    },

    clearProfile() {
      this.profile = null;
      this.error = null;
    },
  },
});
