import { defineStore } from 'pinia';
import { RegisterUseCase } from '../../application/use-cases/RegisterUseCase';
import { AuthRepositoryImpl } from '../../infrastructure/repositories/AuthRepositoryImpl';

const registerUseCase = new RegisterUseCase(new AuthRepositoryImpl());

export const useRegisterStore = defineStore('register', {
  state: () => ({
    isSubmitting: false,
    isSuccess: false,
    fieldErrors: {},
    serverError: null,
  }),

  getters: {
    hasAnyError: (state) => Object.keys(state.fieldErrors).length > 0 || !!state.serverError,
  },

  actions: {
    async register(formData) {
      this.isSubmitting = true;
      this.serverError = null;
      this.fieldErrors = {};

      try {
        const result = await registerUseCase.execute(formData);
        this.isSuccess = true;
        return result;
      } catch (error) {
        if (error.code === 'VALIDATION_ERROR') {
          this.fieldErrors = error.fields || {};
        } else {
          this.serverError = error;
        }
        throw error;
      } finally {
        this.isSubmitting = false;
      }
    },

    clearErrors() {
      this.serverError = null;
      this.fieldErrors = {};
    },

    reset() {
      this.isSubmitting = false;
      this.isSuccess = false;
      this.fieldErrors = {};
      this.serverError = null;
    },
  },
});
