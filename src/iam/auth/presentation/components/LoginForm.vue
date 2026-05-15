<template>
  <form class="login-form" @submit.prevent="handleSubmit">
    <div class="login-form__group">
      <label for="email" class="login-form__label">Email address</label>
      <input
        id="email"
        v-model="credentials.email"
        type="email"
        class="login-form__input"
        :class="{ 'login-form__input--error': fieldErrors.email }"
        placeholder="name@company.com"
        required
        autocomplete="email"
        @input="onInput"
      />
      <span v-if="fieldErrors.email" class="login-form__error">{{ fieldErrors.email }}</span>
    </div>

    <div class="login-form__group">
      <div class="login-form__label-row">
        <label for="password" class="login-form__label">Password</label>
        <a href="#" class="login-form__forgot">Forgot?</a>
      </div>
      <div class="login-form__input-wrapper">
        <input
          id="password"
          v-model="credentials.password"
          :type="showPassword ? 'text' : 'password'"
          class="login-form__input"
          :class="{ 'login-form__input--error': fieldErrors.password }"
          placeholder="Enter your password"
          required
          autocomplete="current-password"
          @input="onInput"
        />
        <button
          type="button"
          @click="showPassword = !showPassword"
          class="login-form__toggle"
          :aria-label="showPassword ? 'Hide password' : 'Show password'"
        >
          <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
        </button>
      </div>
      <span v-if="fieldErrors.password" class="login-form__error">{{ fieldErrors.password }}</span>
    </div>

    <label class="login-form__checkbox-label">
      <input
        type="checkbox"
        v-model="credentials.remember"
        class="login-form__checkbox"
      />
      <span class="login-form__checkbox-mark" />
      <span class="login-form__checkbox-text">Remember this device for 30 days</span>
    </label>

    <button
      type="submit"
      class="login-form__submit"
      :disabled="isLoading"
    >
      <span v-if="!isLoading" class="login-form__submit-text">
        Sign in
        <font-awesome-icon icon="arrow-right-to-bracket" class="login-form__submit-icon" />
      </span>
      <span v-else class="login-form__submit-text">
        <span class="login-form__spinner" />
        Signing in...
      </span>
    </button>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue';

const props = defineProps({
  isLoading: Boolean,
  fieldErrors: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['login-submit', 'clear-errors']);

const showPassword = ref(false);
const credentials = reactive({
  email: '',
  password: '',
  remember: false,
});

const onInput = () => {
  emit('clear-errors');
};

const handleSubmit = () => {
  emit('login-submit', { ...credentials });
};
</script>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.login-form__group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.login-form__label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #555;
}

.login-form__label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.login-form__forgot {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--primary-color);
  text-decoration: none;
}

.login-form__forgot:hover {
  text-decoration: underline;
}

.login-form__input {
  width: 100%;
  padding: 11px 14px;
  border: 1.5px solid #e2e2e2;
  border-radius: 8px;
  font-family: var(--font-general);
  font-size: 0.95rem;
  color: var(--text-color);
  background: #fafafa;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

.login-form__input::placeholder {
  color: #bbb;
}

.login-form__input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(255, 115, 0, 0.1);
  background: #ffffff;
}

.login-form__input-wrapper {
  position: relative;
}

.login-form__toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  padding: 4px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.login-form__toggle:hover {
  color: #666;
}

.login-form__checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  user-select: none;
}

.login-form__checkbox {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.login-form__checkbox-mark {
  width: 18px;
  height: 18px;
  border: 2px solid #ccc;
  border-radius: 4px;
  flex-shrink: 0;
  position: relative;
  transition: all 0.2s;
}

.login-form__checkbox:checked + .login-form__checkbox-mark {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

.login-form__checkbox:checked + .login-form__checkbox-mark::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 5px;
  width: 4px;
  height: 8px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.login-form__checkbox:focus-visible + .login-form__checkbox-mark {
  box-shadow: 0 0 0 3px rgba(255, 115, 0, 0.15);
}

.login-form__checkbox-text {
  font-size: 0.85rem;
  color: #666;
}

.login-form__submit {
  width: 100%;
  padding: 12px;
  margin-top: 0.25rem;
  background: var(--primary-color);
  color: #ffffff;
  font-family: var(--font-titles);
  font-weight: 700;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
}

.login-form__submit:hover:not(:disabled) {
  background: #e66700;
  box-shadow: 0 4px 15px rgba(255, 115, 0, 0.3);
  transform: translateY(-1px);
}

.login-form__submit:active:not(:disabled) {
  transform: translateY(0);
}

.login-form__submit:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.login-form__submit-icon {
  transition: transform 0.2s;
}

.login-form__submit:hover:not(:disabled) .login-form__submit-icon {
  transform: translateX(3px);
}

.login-form__submit-text {
  display: flex;
  align-items: center;
  gap: 8px;
}

.login-form__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.login-form__input--error {
  border-color: #ef4444;
  background: #fef2f2;
}

.login-form__input--error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  background: #fef2f2;
}

.login-form__error {
  font-size: 0.78rem;
  color: #ef4444;
  line-height: 1.4;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
