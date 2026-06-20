<template>
  <form class="login-form" novalidate @submit.prevent="handleSubmit">
    <div class="login-form__group">
      <label for="email" class="login-form__label">Email address</label>
      <div class="login-form__input-wrapper">
        <input
          id="email"
          v-model="credentials.email"
          type="email"
          class="login-form__input"
          :class="inputClass('email')"
          placeholder="name@company.com"
          autocomplete="email"
          @blur="onBlur('email')"
          @input="onInput('email')"
        />
        <span v-if="showSuccess('email')" class="login-form__status-icon login-form__status-icon--success">
          <font-awesome-icon icon="check" />
        </span>
      </div>
      <span v-if="showError('email')" class="login-form__error">{{ mergedErrors.email }}</span>
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
          :class="inputClass('password')"
          placeholder="Enter your password"
          autocomplete="current-password"
          @blur="onBlur('password')"
          @input="onInput('password')"
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
      <span v-if="showError('password')" class="login-form__error">{{ mergedErrors.password }}</span>
    </div>

    <button
      type="submit"
      class="login-form__submit"
      :disabled="isLoading || (anyTouched && !isFormValid)"
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
import { reactive, ref, computed } from 'vue';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
});

const touched = reactive({
  email: false,
  password: false,
});

const anyTouched = computed(() => touched.email || touched.password);

const localErrors = computed(() => {
  const e = {};

  if (!credentials.email.trim()) {
    e.email = 'Email is required.';
  } else if (!EMAIL_REGEX.test(credentials.email)) {
    e.email = 'Enter a valid email address (e.g., name@company.com).';
  }

  if (!credentials.password) {
    e.password = 'Password is required.';
  }

  return e;
});

const mergedErrors = computed(() => {
  const m = { ...localErrors.value };
  for (const field of ['email', 'password']) {
    if (!m[field] && props.fieldErrors[field]) {
      m[field] = props.fieldErrors[field];
    }
  }
  return m;
});

const isFormValid = computed(() => {
  return !localErrors.value.email && !localErrors.value.password;
});

const hasError = (field) => !!mergedErrors.value[field];
const isTouched = (field) => touched[field];

const showError = (field) => isTouched(field) && hasError(field);
const showSuccess = (field) => isTouched(field) && !hasError(field) && credentials[field].toString().trim().length > 0;

const inputClass = (field) => ({
  'login-form__input--error': showError(field),
  'login-form__input--success': showSuccess(field),
});

const onBlur = (field) => {
  touched[field] = true;
};

const onInput = (field) => {
  if (touched[field] && props.fieldErrors[field]) {
    emit('clear-errors');
  }
};

const handleSubmit = () => {
  touched.email = true;
  touched.password = true;
  if (!isFormValid.value) return;
  emit('login-submit', { email: credentials.email, password: credentials.password });
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

.login-form__input-wrapper {
  position: relative;
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

/* Error state */

.login-form__input--error {
  border-color: #ef4444;
  background: #fef2f2;
  padding-right: 36px;
}

.login-form__input--error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  background: #fef2f2;
}

/* Success state */

.login-form__input--success {
  border-color: #22c55e;
  background: #f0fdf4;
  padding-right: 36px;
}

.login-form__input--success:focus {
  border-color: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
  background: #f0fdf4;
}

/* Status icon */

.login-form__status-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.85rem;
  pointer-events: none;
}

.login-form__status-icon--success {
  color: #22c55e;
}

/* Toggle password */

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
  z-index: 1;
}

.login-form__toggle:hover {
  color: #666;
}

/* Error message */

.login-form__error {
  font-size: 0.78rem;
  color: #ef4444;
  line-height: 1.4;
}

/* Submit button */

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

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
