<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-card">
        <div class="modal-header">
          <h2 class="modal-title">{{ t('profile.edit.title') }}</h2>
          <button
            class="modal-close-btn"
            :aria-label="t('profile.edit.close')"
            :title="t('profile.edit.close')"
            @click="$emit('close')"
          >
            <font-awesome-icon icon="times" />
          </button>
        </div>

        <form class="modal-form" novalidate @submit.prevent="handleSave">
          <div class="modal-body">
            <div class="form-row">
              <div class="form-group">
                <label class="form-group__label" for="modal-firstName">{{ t('profile.firstName') }}</label>
                <div class="form-group__input-wrapper">
                  <input
                    id="modal-firstName"
                    v-model.trim="form.firstName"
                    type="text"
                    class="form-group__input"
                    :class="inputClass('firstName')"
                    :placeholder="t('profile.edit.firstNamePlaceholder')"
                    @blur="onBlur('firstName')"
                    @input="onInput('firstName')"
                  />
                  <span v-if="showSuccess('firstName')" class="form-group__status-icon form-group__status-icon--success">
                    <font-awesome-icon icon="check" />
                  </span>
                </div>
                <span v-if="showError('firstName')" class="form-group__error">{{ localErrors.firstName }}</span>
              </div>

              <div class="form-group">
                <label class="form-group__label" for="modal-lastName">{{ t('profile.lastName') }}</label>
                <div class="form-group__input-wrapper">
                  <input
                    id="modal-lastName"
                    v-model.trim="form.lastName"
                    type="text"
                    class="form-group__input"
                    :class="inputClass('lastName')"
                    :placeholder="t('profile.edit.lastNamePlaceholder')"
                    @blur="onBlur('lastName')"
                    @input="onInput('lastName')"
                  />
                  <span v-if="showSuccess('lastName')" class="form-group__status-icon form-group__status-icon--success">
                    <font-awesome-icon icon="check" />
                  </span>
                </div>
                <span v-if="showError('lastName')" class="form-group__error">{{ localErrors.lastName }}</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-group__label" for="modal-country">{{ t('profile.country') }}</label>
                <div class="form-group__input-wrapper">
                  <input
                    id="modal-country"
                    v-model.trim="form.country"
                    type="text"
                    class="form-group__input"
                    :class="inputClass('country')"
                    :placeholder="t('profile.edit.countryPlaceholder')"
                    @blur="onBlur('country')"
                    @input="onInput('country')"
                  />
                  <span v-if="showSuccess('country')" class="form-group__status-icon form-group__status-icon--success">
                    <font-awesome-icon icon="check" />
                  </span>
                </div>
                <span v-if="showError('country')" class="form-group__error">{{ localErrors.country }}</span>
              </div>

              <div class="form-group">
                <label class="form-group__label" for="modal-city">{{ t('profile.city') }}</label>
                <div class="form-group__input-wrapper">
                  <input
                    id="modal-city"
                    v-model.trim="form.city"
                    type="text"
                    class="form-group__input"
                    :class="inputClass('city')"
                    :placeholder="t('profile.edit.cityPlaceholder')"
                    @blur="onBlur('city')"
                    @input="onInput('city')"
                  />
                  <span v-if="showSuccess('city')" class="form-group__status-icon form-group__status-icon--success">
                    <font-awesome-icon icon="check" />
                  </span>
                </div>
                <span v-if="showError('city')" class="form-group__error">{{ localErrors.city }}</span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-group__label" for="modal-address">{{ t('profile.address') }}</label>
              <div class="form-group__input-wrapper">
                <input
                  id="modal-address"
                  v-model.trim="form.address"
                  type="text"
                  class="form-group__input"
                  :class="inputClass('address')"
                  :placeholder="t('profile.edit.addressPlaceholder')"
                  @blur="onBlur('address')"
                  @input="onInput('address')"
                />
                <span v-if="showSuccess('address')" class="form-group__status-icon form-group__status-icon--success">
                  <font-awesome-icon icon="check" />
                </span>
              </div>
              <span v-if="showError('address')" class="form-group__error">{{ localErrors.address }}</span>
            </div>

            <div class="form-group">
              <label class="form-group__label" for="modal-phoneNumber">
                {{ t('profile.edit.phoneNumber') }}
                <span class="form-group__optional">({{ t('profile.edit.optional') }})</span>
              </label>
              <div class="form-group__input-wrapper">
                <input
                  id="modal-phoneNumber"
                  v-model="form.phoneNumber"
                  type="tel"
                  class="form-group__input"
                  :class="inputClass('phoneNumber')"
                  :placeholder="t('profile.edit.phonePlaceholder')"
                  @blur="onBlur('phoneNumber')"
                  @input="onInput('phoneNumber')"
                />
                <span v-if="showSuccess('phoneNumber')" class="form-group__status-icon form-group__status-icon--success">
                  <font-awesome-icon icon="check" />
                </span>
              </div>
              <span v-if="showError('phoneNumber')" class="form-group__error">{{ localErrors.phoneNumber }}</span>
            </div>

            <div v-if="saveError" class="form-error">{{ saveError }}</div>
          </div>

          <div class="modal-footer">
            <button type="submit" class="form-submit" :disabled="isSaving || !isFormValid">
              <span v-if="!isSaving" class="form-submit__text">
                {{ t('profile.edit.save') }}
                <font-awesome-icon icon="check" class="form-submit__icon" />
              </span>
              <span v-else class="form-submit__text">
                <span class="form-submit__spinner" />
                {{ t('profile.edit.saving') }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue';
import { useProfileStore } from '../store/profileStore';
import { useAuthStore } from '@/contexts/iam/auth/presentation/store/authStore';
import { useI18n } from '@/shared/presentation/i18n';

const emit = defineEmits(['close', 'saved']);

const profileStore = useProfileStore();
const authStore = useAuthStore();
const { t } = useI18n();

const PHONE_REGEX = /^\+?[0-9]{9,15}$/;

const isSaving = ref(false);
const saveError = ref('');

const form = reactive({
  firstName: '',
  lastName: '',
  country: '',
  city: '',
  address: '',
  phoneNumber: '',
});

const touched = reactive({
  firstName: false,
  lastName: false,
  country: false,
  city: false,
  address: false,
  phoneNumber: false,
});

onMounted(() => {
  if (profileStore.profile) {
    form.firstName = profileStore.profile.firstName;
    form.lastName = profileStore.profile.lastName;
    form.country = profileStore.profile.country;
    form.city = profileStore.profile.city;
    form.address = profileStore.profile.address;
    form.phoneNumber = profileStore.profile.phoneNumber || '';
  }
});

const localErrors = computed(() => {
  const e = {};
  const v = form;

  if (!v.firstName.trim()) {
    e.firstName = t('profile.edit.errors.firstNameRequired');
  } else if (v.firstName.trim().length < 2) {
    e.firstName = t('profile.edit.errors.firstNameMin');
  }

  if (!v.lastName.trim()) {
    e.lastName = t('profile.edit.errors.lastNameRequired');
  } else if (v.lastName.trim().length < 2) {
    e.lastName = t('profile.edit.errors.lastNameMin');
  }

  if (!v.country.trim()) {
    e.country = t('profile.edit.errors.countryRequired');
  }

  if (!v.city.trim()) {
    e.city = t('profile.edit.errors.cityRequired');
  }

  if (!v.address.trim()) {
    e.address = t('profile.edit.errors.addressRequired');
  } else if (v.address.trim().length < 5) {
    e.address = t('profile.edit.errors.addressMin');
  }

  if (v.phoneNumber.trim() && !PHONE_REGEX.test(v.phoneNumber.trim())) {
    e.phoneNumber = t('profile.edit.errors.phoneInvalid');
  }

  return e;
});

const requiredFields = ['firstName', 'lastName', 'country', 'city', 'address'];

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
  'form-group__input--error': showError(field),
  'form-group__input--success': showSuccess(field),
});

const onBlur = (field) => {
  touched[field] = true;
};

const onInput = (field) => {
  if (touched[field] && saveError.value) {
    saveError.value = '';
  }
};

function handleSave() {
  Object.keys(touched).forEach((f) => { touched[f] = true; });
  if (!isFormValid.value) return;

  isSaving.value = true;
  saveError.value = '';
  profileStore.updateProfile({
    firstName: form.firstName,
    lastName: form.lastName,
    country: form.country,
    city: form.city,
    address: form.address,
    phoneNumber: form.phoneNumber,
  })
    .then(() => {
      emit('saved');
      emit('close');
    })
    .catch((err) => {
      if (err && err.code) {
        const key = `profile.errors.${err.code}`;
        const translated = t(key);
        saveError.value = translated !== key ? translated : (err.message || t('profile.edit.saveFailed'));
      } else {
        saveError.value = err.message || t('profile.edit.saveFailed');
      }
    })
    .finally(() => {
      isSaving.value = false;
    });
}
</script>
<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-card {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.modal-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--secondary-color);
  margin: 0;
}

.modal-close-btn {
  background: none;
  border: none;
  color: #999;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
}

.modal-close-btn:hover {
  color: #333;
}

.modal-form {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.modal-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
  background: #fafafa;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-group__label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #555;
}

.form-group__optional {
  font-weight: 400;
  color: #aaa;
}

.form-group__input-wrapper {
  position: relative;
}

.form-group__input {
  width: 100%;
  padding: 8px 12px;
  border: 1.5px solid #e2e2e2;
  border-radius: 8px;
  font-family: var(--font-general);
  font-size: 0.88rem;
  color: var(--text-color);
  background: #fafafa;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  box-sizing: border-box;
}

.form-group__input::placeholder {
  color: #bbb;
}

.form-group__input:focus:not(:disabled) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(255, 115, 0, 0.1);
  background: #ffffff;
}

.form-group__input--disabled {
  background: #f1f3f5;
  color: #888;
  cursor: not-allowed;
  border-color: #e2e2e2;
}

.form-group__input--error {
  border-color: #ef4444;
  background: #fef2f2;
  padding-right: 36px;
}

.form-group__input--error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  background: #fef2f2;
}

.form-group__input--success {
  border-color: #22c55e;
  background: #f0fdf4;
  padding-right: 36px;
}

.form-group__input--success:focus {
  border-color: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
  background: #f0fdf4;
}

.form-group__status-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.85rem;
  pointer-events: none;
}

.form-group__status-icon--success {
  color: #22c55e;
}

.form-group__error {
  font-size: 0.72rem;
  color: #ef4444;
  line-height: 1.3;
}

.form-error {
  color: #dc2626;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 8px 12px;
  background: #fef2f2;
  border-radius: 6px;
}

.form-submit {
  width: 100%;
  padding: 10px;
  background: var(--primary-color);
  color: #ffffff;
  font-family: var(--font-titles);
  font-weight: 700;
  font-size: 0.9rem;
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

.form-submit:hover:not(:disabled) {
  background: #e66700;
  box-shadow: 0 4px 15px rgba(255, 115, 0, 0.3);
  transform: translateY(-1px);
}

.form-submit:active:not(:disabled) {
  transform: translateY(0);
}

.form-submit:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.form-submit__icon {
  transition: transform 0.2s;
}

.form-submit:hover:not(:disabled) .form-submit__icon {
  transform: translateX(3px);
}

.form-submit__text {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-submit__spinner {
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
  .form-row {
    grid-template-columns: 1fr;
    gap: 0.85rem;
  }
  
  .modal-card {
    max-height: 100vh;
    border-radius: 0;
  }
}
</style>