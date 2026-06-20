<template>
  <form class="register-form" novalidate @submit.prevent="handleSubmit">
    <div class="register-form__section">
      <h3 class="register-form__section-title">Account Information</h3>

      <div class="register-form__group">
        <label for="reg-email" class="register-form__label">Email address</label>
        <div class="register-form__input-wrapper">
          <input
            id="reg-email"
            v-model="form.email"
            type="email"
            class="register-form__input"
            :class="inputClass('email')"
            placeholder="name@company.com"
            autocomplete="email"
            @blur="onBlur('email')"
            @input="onInput('email')"
          />
          <span v-if="showSuccess('email')" class="register-form__status-icon register-form__status-icon--success">
            <font-awesome-icon icon="check" />
          </span>
        </div>
        <span v-if="showError('email')" class="register-form__error">{{ localErrors.email }}</span>
      </div>

      <div class="register-form__row">
        <div class="register-form__group">
          <label for="reg-password" class="register-form__label">Password</label>
          <div class="register-form__input-wrapper">
            <input
              id="reg-password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="register-form__input"
              :class="inputClass('password')"
              placeholder="Create a strong password"
              autocomplete="new-password"
              @blur="onBlur('password')"
              @input="onInput('password')"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="register-form__toggle"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
            >
              <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
            </button>
          </div>
          <span v-if="showError('password')" class="register-form__error">{{ localErrors.password }}</span>
        </div>

        <div class="register-form__group">
          <label for="reg-confirm" class="register-form__label">Confirm password</label>
          <div class="register-form__input-wrapper">
            <input
              id="reg-confirm"
              v-model="form.confirmPassword"
              :type="showConfirm ? 'text' : 'password'"
              class="register-form__input"
              :class="inputClass('confirmPassword')"
              placeholder="Repeat your password"
              autocomplete="new-password"
              @blur="onBlur('confirmPassword')"
              @input="onInput('confirmPassword')"
            />
            <button
              type="button"
              @click="showConfirm = !showConfirm"
              class="register-form__toggle"
              :aria-label="showConfirm ? 'Hide confirm password' : 'Show confirm password'"
            >
              <font-awesome-icon :icon="showConfirm ? 'eye-slash' : 'eye'" />
            </button>
          </div>
          <span v-if="showError('confirmPassword')" class="register-form__error">{{ localErrors.confirmPassword }}</span>
        </div>
      </div>
    </div>

    <div class="register-form__section">
      <h3 class="register-form__section-title">Personal Information</h3>

      <div class="register-form__row">
        <div class="register-form__group">
          <label for="reg-firstname" class="register-form__label">First name</label>
          <div class="register-form__input-wrapper">
            <input
              id="reg-firstname"
              v-model="form.firstName"
              type="text"
              class="register-form__input"
              :class="inputClass('firstName')"
              placeholder="Your first name"
              @blur="onBlur('firstName')"
              @input="onInput('firstName')"
            />
            <span v-if="showSuccess('firstName')" class="register-form__status-icon register-form__status-icon--success">
              <font-awesome-icon icon="check" />
            </span>
          </div>
          <span v-if="showError('firstName')" class="register-form__error">{{ localErrors.firstName }}</span>
        </div>

        <div class="register-form__group">
          <label for="reg-lastname" class="register-form__label">Last name</label>
          <div class="register-form__input-wrapper">
            <input
              id="reg-lastname"
              v-model="form.lastName"
              type="text"
              class="register-form__input"
              :class="inputClass('lastName')"
              placeholder="Your last name"
              @blur="onBlur('lastName')"
              @input="onInput('lastName')"
            />
            <span v-if="showSuccess('lastName')" class="register-form__status-icon register-form__status-icon--success">
              <font-awesome-icon icon="check" />
            </span>
          </div>
          <span v-if="showError('lastName')" class="register-form__error">{{ localErrors.lastName }}</span>
        </div>
      </div>

      <div class="register-form__row">
        <div class="register-form__group">
          <label for="reg-country" class="register-form__label">Country</label>
          <div class="register-form__input-wrapper">
            <input
              id="reg-country"
              v-model="form.country"
              type="text"
              class="register-form__input"
              :class="inputClass('country')"
              placeholder="e.g. Peru"
              @blur="onBlur('country')"
              @input="onInput('country')"
            />
            <span v-if="showSuccess('country')" class="register-form__status-icon register-form__status-icon--success">
              <font-awesome-icon icon="check" />
            </span>
          </div>
          <span v-if="showError('country')" class="register-form__error">{{ localErrors.country }}</span>
        </div>

        <div class="register-form__group">
          <label for="reg-city" class="register-form__label">City</label>
          <div class="register-form__input-wrapper">
            <input
              id="reg-city"
              v-model="form.city"
              type="text"
              class="register-form__input"
              :class="inputClass('city')"
              placeholder="e.g. Lima"
              @blur="onBlur('city')"
              @input="onInput('city')"
            />
            <span v-if="showSuccess('city')" class="register-form__status-icon register-form__status-icon--success">
              <font-awesome-icon icon="check" />
            </span>
          </div>
          <span v-if="showError('city')" class="register-form__error">{{ localErrors.city }}</span>
        </div>
      </div>

      <div class="register-form__group">
        <label for="reg-address" class="register-form__label">Address</label>
        <div class="register-form__input-wrapper">
          <input
            id="reg-address"
            v-model="form.address"
            type="text"
            class="register-form__input"
            :class="inputClass('address')"
            placeholder="e.g. Av. Javier Prado 123"
            @blur="onBlur('address')"
            @input="onInput('address')"
          />
          <span v-if="showSuccess('address')" class="register-form__status-icon register-form__status-icon--success">
            <font-awesome-icon icon="check" />
          </span>
        </div>
        <span v-if="showError('address')" class="register-form__error">{{ localErrors.address }}</span>
      </div>

      <div class="register-form__group">
        <label for="reg-phone" class="register-form__label">Phone number <span class="register-form__optional">(optional)</span></label>
        <div class="register-form__input-wrapper">
          <input
            id="reg-phone"
            v-model="form.phoneNumber"
            type="tel"
            class="register-form__input"
            :class="inputClass('phoneNumber')"
            placeholder="e.g. +51987654321"
            @blur="onBlur('phoneNumber')"
            @input="onInput('phoneNumber')"
          />
          <span v-if="showSuccess('phoneNumber')" class="register-form__status-icon register-form__status-icon--success">
            <font-awesome-icon icon="check" />
          </span>
        </div>
        <span v-if="showError('phoneNumber')" class="register-form__error">{{ localErrors.phoneNumber }}</span>
      </div>
    </div>

    <button
      type="submit"
      class="register-form__submit"
      :disabled="isSubmitting || !isFormValid"
    >
      <span v-if="!isSubmitting" class="register-form__submit-text">
        Create account
        <font-awesome-icon icon="arrow-right-to-bracket" class="register-form__submit-icon" />
      </span>
      <span v-else class="register-form__submit-text">
        <span class="register-form__spinner" />
        Creating account...
      </span>
    </button>
  </form>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,64}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9]{9,15}$/;

const props = defineProps({
  isSubmitting: Boolean,
  serverFieldErrors: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['register-submit', 'clear-errors']);

const showPassword = ref(false);
const showConfirm = ref(false);

const form = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  country: '',
  city: '',
  address: '',
  phoneNumber: '',
});

const touched = reactive({
  email: false,
  password: false,
  confirmPassword: false,
  firstName: false,
  lastName: false,
  country: false,
  city: false,
  address: false,
  phoneNumber: false,
});

const allFields = [
  'email', 'password', 'confirmPassword', 'firstName',
  'lastName', 'country', 'city', 'address',
];

const localErrors = computed(() => {
  const e = {};
  const v = form;

  if (!v.email.trim()) {
    e.email = 'Email is required.';
  } else if (v.email.length > 255) {
    e.email = 'Email must not exceed 255 characters.';
  } else if (!EMAIL_REGEX.test(v.email)) {
    e.email = 'Enter a valid email address (e.g., name@company.com).';
  }

  if (!v.password) {
    e.password = 'Password is required.';
  } else if (!PASSWORD_REGEX.test(v.password)) {
    e.password = 'Must be 8-64 chars with 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&.#_-).';
  }

  if (!v.confirmPassword) {
    e.confirmPassword = 'Please confirm your password.';
  } else if (v.password !== v.confirmPassword) {
    e.confirmPassword = 'Passwords do not match.';
  }

  if (!v.firstName.trim()) {
    e.firstName = 'First name is required.';
  } else if (v.firstName.trim().length < 2) {
    e.firstName = 'First name must be at least 2 characters.';
  }

  if (!v.lastName.trim()) {
    e.lastName = 'Last name is required.';
  } else if (v.lastName.trim().length < 2) {
    e.lastName = 'Last name must be at least 2 characters.';
  }

  if (!v.country.trim()) {
    e.country = 'Country is required.';
  }

  if (!v.city.trim()) {
    e.city = 'City is required.';
  }

  if (!v.address.trim()) {
    e.address = 'Address is required.';
  } else if (v.address.trim().length < 5) {
    e.address = 'Address must be at least 5 characters.';
  }

  if (v.phoneNumber.trim() && !PHONE_REGEX.test(v.phoneNumber.trim())) {
    e.phoneNumber = 'Enter a valid phone number (e.g., +51987654321).';
  }

  return e;
});

const requiredFields = [
  'email', 'password', 'confirmPassword', 'firstName',
  'lastName', 'country', 'city', 'address',
];

const isFormValid = computed(() => {
  for (const field of requiredFields) {
    if (localErrors.value[field]) return false;
  }
  return true;
});

const hasError = (field) => !!localErrors.value[field];
const isTouched = (field) => touched[field];

const showError = (field) => isTouched(field) && hasError(field);
const showSuccess = (field) => isTouched(field) && !hasError(field) && form[field].toString().trim().length > 0;

const inputClass = (field) => ({
  'register-form__input--error': showError(field),
  'register-form__input--success': showSuccess(field),
});

const onBlur = (field) => {
  touched[field] = true;
};

const onInput = (field) => {
  if (touched[field] && props.serverFieldErrors[field]) {
    emit('clear-errors');
  }
};

const handleSubmit = () => {
  Object.keys(touched).forEach((f) => { touched[f] = true; });
  if (!isFormValid.value) return;
  emit('register-submit', { ...form });
};
</script>

<style scoped>
.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.register-form__section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.register-form__section-title {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--secondary-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid #f0f0f0;
}

.register-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.register-form__group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.register-form__label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #555;
}

.register-form__optional {
  font-weight: 400;
  color: #aaa;
}

.register-form__input-wrapper {
  position: relative;
}

.register-form__input {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #e2e2e2;
  border-radius: 8px;
  font-family: var(--font-general);
  font-size: 0.9rem;
  color: var(--text-color);
  background: #fafafa;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

.register-form__input::placeholder {
  color: #bbb;
}

.register-form__input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(255, 115, 0, 0.1);
  background: #ffffff;
}

/* ─── Error state ─── */

.register-form__input--error {
  border-color: #ef4444;
  background: #fef2f2;
  padding-right: 36px;
}

.register-form__input--error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  background: #fef2f2;
}

/* ─── Success state ─── */

.register-form__input--success {
  border-color: #22c55e;
  background: #f0fdf4;
  padding-right: 36px;
}

.register-form__input--success:focus {
  border-color: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
  background: #f0fdf4;
}

/* ─── Status icon (checkmark) ─── */

.register-form__status-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.85rem;
  pointer-events: none;
}

.register-form__status-icon--success {
  color: #22c55e;
}

/* ─── Toggle password visibility ─── */

.register-form__toggle {
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

.register-form__toggle:hover {
  color: #666;
}

/* ─── Error message ─── */

.register-form__error {
  font-size: 0.75rem;
  color: #ef4444;
  line-height: 1.4;
}

/* ─── Submit button ─── */

.register-form__submit {
  width: 100%;
  padding: 12px;
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

.register-form__submit:hover:not(:disabled) {
  background: #e66700;
  box-shadow: 0 4px 15px rgba(255, 115, 0, 0.3);
  transform: translateY(-1px);
}

.register-form__submit:active:not(:disabled) {
  transform: translateY(0);
}

.register-form__submit:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.register-form__submit-icon {
  transition: transform 0.2s;
}

.register-form__submit:hover:not(:disabled) .register-form__submit-icon {
  transform: translateX(3px);
}

.register-form__submit-text {
  display: flex;
  align-items: center;
  gap: 8px;
}

.register-form__spinner {
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

@media (max-width: 600px) {
  .register-form__row {
    grid-template-columns: 1fr;
  }
}
</style>
