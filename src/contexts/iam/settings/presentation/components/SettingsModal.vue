<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="settings-overlay" @click.self="close">
        <div class="settings-modal">
          <header class="settings-modal__header">
            <div class="settings-modal__header-left">
              <font-awesome-icon icon="gear" class="settings-modal__header-icon" />
              <h2>{{ t('settings.title') }}</h2>
            </div>
            <button class="settings-modal__close" :aria-label="t('settings.close')" :title="t('settings.close')" @click="close">
              <font-awesome-icon icon="xmark" />
            </button>
          </header>

          <div class="settings-modal__body">
            <nav class="settings-nav">
              <button
                v-for="tab in tabs"
                :key="tab.key"
                :class="['settings-nav__item', { 'settings-nav__item--active': activeTab === tab.key }]"
                @click="activeTab = tab.key"
              >
                <font-awesome-icon :icon="tab.icon" class="settings-nav__icon" />
                <span class="settings-nav__label">{{ t(tab.labelKey) }}</span>
              </button>
            </nav>

            <div class="settings-content">
              <Transition name="fade" mode="out-in">
                <section v-if="activeTab === 'system'" key="system" class="settings-section">
                  <h3 class="settings-section__title">{{ t('settings.tabs.system') }}</h3>

                  <div class="setting-group">
                    <label class="setting-group__label">{{ t('settings.language.label') }}</label>
                    <div class="language-options">
                      <button
                        v-for="lang in languages"
                        :key="lang.code"
                        :class="['language-btn', { 'language-btn--active': selectedLanguage === lang.code }]"
                        @click="selectedLanguage = lang.code"
                      >
                        <span class="language-flag">{{ lang.flag }}</span>
                        <span>{{ t(lang.labelKey) }}</span>
                        <font-awesome-icon v-if="selectedLanguage === lang.code" icon="check" class="language-check" />
                      </button>
                    </div>
                  </div>

                  <div class="setting-group">
                    <label class="setting-group__label">{{ t('settings.notifications.label') }}</label>
                    <div class="notification-toggles">
                      <div class="toggle-row">
                        <div class="toggle-row__info">
                          <span class="toggle-row__title">{{ t('settings.notifications.emailTitle') }}</span>
                          <span class="toggle-row__desc">{{ t('settings.notifications.emailDescription') }}</span>
                        </div>
                        <label class="toggle">
                          <input type="checkbox" v-model="notifications.emailAlerts" />
                          <span class="toggle__slider"></span>
                        </label>
                      </div>
                      <div class="toggle-row">
                        <div class="toggle-row__info">
                          <span class="toggle-row__title">{{ t('settings.notifications.smsTitle') }}</span>
                          <span class="toggle-row__desc">{{ t('settings.notifications.smsDescription') }}</span>
                        </div>
                        <label class="toggle">
                          <input type="checkbox" v-model="notifications.smsAlerts" />
                          <span class="toggle__slider"></span>
                        </label>
                      </div>
                      <div class="toggle-row">
                        <div class="toggle-row__info">
                          <span class="toggle-row__title">{{ t('settings.notifications.pushTitle') }}</span>
                          <span class="toggle-row__desc">{{ t('settings.notifications.pushDescription') }}</span>
                        </div>
                        <label class="toggle">
                          <input type="checkbox" v-model="notifications.pushAlerts" />
                          <span class="toggle__slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </section>

                <section v-else-if="activeTab === 'account'" key="account" class="settings-section">
                  <h3 class="settings-section__title">{{ t('settings.tabs.account') }}</h3>

                  <div class="account-actions">
                    <button class="account-action-btn" @click="goToProfile">
                      <div class="account-action-btn__icon">
                        <font-awesome-icon icon="pen-to-square" />
                      </div>
                      <div class="account-action-btn__text">
                        <span class="account-action-btn__title">{{ t('settings.account.editTitle') }}</span>
                        <span class="account-action-btn__desc">{{ t('settings.account.editDescription') }}</span>
                      </div>
                      <font-awesome-icon icon="chevron-right" class="account-action-btn__arrow" />
                    </button>

                    <button class="account-action-btn account-action-btn--danger" @click="deactivateAccount">
                      <div class="account-action-btn__icon account-action-btn__icon--danger">
                        <font-awesome-icon icon="trash" />
                      </div>
                      <div class="account-action-btn__text">
                        <span class="account-action-btn__title">{{ t('settings.account.deactivateTitle') }}</span>
                        <span class="account-action-btn__desc">{{ t('settings.account.deactivateDescription') }}</span>
                      </div>
                      <font-awesome-icon icon="chevron-right" class="account-action-btn__arrow" />
                    </button>
                  </div>
                </section>

                <section v-else key="security" class="settings-section">
                  <h3 class="settings-section__title">{{ t('settings.tabs.security') }}</h3>

                  <div class="setting-group">
                    <label class="setting-group__label">{{ t('settings.security.passwordLabel') }}</label>
                    <div class="password-section">
                      <div class="password-info">
                        <span class="password-info__status">{{ passwordStatusLabel }}</span>
                      </div>
                      <button class="action-btn action-btn--outline" @click="showPasswordForm = !showPasswordForm">
                        {{ t('settings.security.changePassword') }}
                      </button>
                    </div>
                    <Transition name="slide">
                      <div v-if="showPasswordForm" class="password-form">
                        <div class="password-field">
                          <label class="password-field__label" for="settings-current-password">
                            {{ t('settings.security.currentPassword') }}
                          </label>
                          <div class="password-input-wrapper">
                            <input
                              id="settings-current-password"
                              v-model="passwordForm.currentPassword"
                              :type="showCurrentPassword ? 'text' : 'password'"
                              :class="{ 'password-input--error': passwordErrors.currentPassword }"
                              :placeholder="t('settings.security.currentPasswordInput')"
                            />
                            <button
                              type="button"
                              class="password-toggle"
                              :aria-label="showCurrentPassword ? t('settings.security.hidePassword') : t('settings.security.showPassword')"
                              :title="showCurrentPassword ? t('settings.security.hidePassword') : t('settings.security.showPassword')"
                              @click="showCurrentPassword = !showCurrentPassword"
                            >
                              <font-awesome-icon :icon="showCurrentPassword ? 'eye-slash' : 'eye'" />
                            </button>
                          </div>
                          <span v-if="passwordErrors.currentPassword" class="password-field__error">{{ passwordErrors.currentPassword }}</span>
                        </div>

                        <div class="password-field">
                          <label class="password-field__label" for="settings-new-password">
                            {{ t('settings.security.newPassword') }}
                          </label>
                          <div class="password-input-wrapper">
                            <input
                              id="settings-new-password"
                              v-model="passwordForm.newPassword"
                              :type="showNewPassword ? 'text' : 'password'"
                              :class="{ 'password-input--error': passwordErrors.newPassword }"
                              :placeholder="t('settings.security.newPasswordInput')"
                            />
                            <button
                              type="button"
                              class="password-toggle"
                              :aria-label="showNewPassword ? t('settings.security.hidePassword') : t('settings.security.showPassword')"
                              :title="showNewPassword ? t('settings.security.hidePassword') : t('settings.security.showPassword')"
                              @click="showNewPassword = !showNewPassword"
                            >
                              <font-awesome-icon :icon="showNewPassword ? 'eye-slash' : 'eye'" />
                            </button>
                          </div>
                          <span v-if="passwordErrors.newPassword" class="password-field__error">{{ passwordErrors.newPassword }}</span>
                        </div>

                        <div class="password-field">
                          <label class="password-field__label" for="settings-confirm-password">
                            {{ t('settings.security.confirmPassword') }}
                          </label>
                          <div class="password-input-wrapper">
                            <input
                              id="settings-confirm-password"
                              v-model="passwordForm.confirmPassword"
                              :type="showConfirmPassword ? 'text' : 'password'"
                              :class="{ 'password-input--error': passwordErrors.confirmPassword }"
                              :placeholder="t('settings.security.confirmPasswordInput')"
                            />
                            <button
                              type="button"
                              class="password-toggle"
                              :aria-label="showConfirmPassword ? t('settings.security.hidePassword') : t('settings.security.showPassword')"
                              :title="showConfirmPassword ? t('settings.security.hidePassword') : t('settings.security.showPassword')"
                              @click="showConfirmPassword = !showConfirmPassword"
                            >
                              <font-awesome-icon :icon="showConfirmPassword ? 'eye-slash' : 'eye'" />
                            </button>
                          </div>
                          <span v-if="passwordErrors.confirmPassword" class="password-field__error">{{ passwordErrors.confirmPassword }}</span>
                        </div>

                        <div v-if="passwordSuccess" class="password-success">{{ passwordSuccess }}</div>

                        <div class="password-actions">
                          <button type="button" class="action-btn action-btn--outline" :disabled="isChangingPassword" @click="cancelPasswordChange">
                            {{ t('settings.security.cancel') }}
                          </button>
                          <button type="button" class="save-btn save-btn--small" :disabled="isChangingPassword" @click="changePassword">
                            <span v-if="isChangingPassword" class="btn-spinner" />
                            {{ isChangingPassword ? t('settings.security.changingPassword') : t('settings.security.changePassword') }}
                          </button>
                        </div>
                      </div>
                    </Transition>
                  </div>
                </section>
              </Transition>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, ref, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useSettingsStore } from '../store/settingsStore';
import { useI18n } from '@/shared/presentation/i18n';
import { useAuthStore } from '@/contexts/iam/auth/presentation/store/authStore';
import { ChangePasswordUseCase } from '@/contexts/iam/auth/application/use-cases/ChangePasswordUseCase';
import { AuthRepositoryImpl } from '@/contexts/iam/auth/infrastructure/repositories/AuthRepositoryImpl';

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close']);
const router = useRouter();
const settingsStore = useSettingsStore();
const authStore = useAuthStore();
const { locale, setLocale, t } = useI18n();
const changePasswordUseCase = new ChangePasswordUseCase(new AuthRepositoryImpl());
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,64}$/;

const activeTab = ref('system');
const showPasswordForm = ref(false);
const lastPasswordChange = ref(null);

const tabs = [
  { key: 'system', labelKey: 'settings.tabs.system', icon: 'sliders' },
  { key: 'account', labelKey: 'settings.tabs.account', icon: 'user' },
  { key: 'security', labelKey: 'settings.tabs.security', icon: 'shield' }
];

const languages = [
  { code: 'en', labelKey: 'settings.language.english', flag: '🇺🇸' },
  { code: 'es', labelKey: 'settings.language.spanish', flag: '🇪🇸' }
];

const selectedLanguage = computed({
  get: () => locale.value,
  set: (value) => setLocale(value)
});

const notifications = reactive({
  emailAlerts: true,
  smsAlerts: false,
  pushAlerts: true
});

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const passwordErrors = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const isChangingPassword = ref(false);
const passwordSuccess = ref('');
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const passwordStatusLabel = computed(() => {
  return t('settings.security.passwordStatus', {
    value: lastPasswordChange.value || t('settings.security.never')
  });
});

function close() {
  emit('close');
}

function goToProfile() {
  close();
  router.push('/profile');
}

function deactivateAccount() {
  if (confirm(t('settings.account.deactivateConfirmation'))) {
    console.log('Account deactivation requested');
  }
}

function clearPasswordForm() {
  passwordForm.currentPassword = '';
  passwordForm.newPassword = '';
  passwordForm.confirmPassword = '';
  passwordErrors.currentPassword = '';
  passwordErrors.newPassword = '';
  passwordErrors.confirmPassword = '';
  passwordSuccess.value = '';
  showCurrentPassword.value = false;
  showNewPassword.value = false;
  showConfirmPassword.value = false;
}

function cancelPasswordChange() {
  showPasswordForm.value = false;
  clearPasswordForm();
}

function localizePasswordError(code, fallback) {
  const keys = {
    NO_USER: 'settings.security.errors.noUser',
    CURRENT_PASSWORD_REQUIRED: 'settings.security.errors.currentRequired',
    NEW_PASSWORD_REQUIRED: 'settings.security.errors.newRequired',
    INVALID_PASSWORD: 'settings.security.errors.invalidPassword',
    PASSWORD_MISMATCH: 'settings.security.errors.passwordMismatch',
    SAME_PASSWORD: 'settings.security.errors.samePassword'
  };

  return keys[code] ? t(keys[code]) : (fallback || t('settings.security.passwordChangeFailed'));
}

function validatePasswordForm() {
  let isValid = true;
  passwordErrors.currentPassword = '';
  passwordErrors.newPassword = '';
  passwordErrors.confirmPassword = '';
  passwordSuccess.value = '';

  if (!passwordForm.currentPassword) {
    passwordErrors.currentPassword = t('settings.security.errors.currentRequired');
    isValid = false;
  }

  if (!passwordForm.newPassword) {
    passwordErrors.newPassword = t('settings.security.errors.newRequired');
    isValid = false;
  } else if (!PASSWORD_REGEX.test(passwordForm.newPassword)) {
    passwordErrors.newPassword = t('settings.security.errors.invalidPassword');
    isValid = false;
  }

  if (!passwordForm.confirmPassword) {
    passwordErrors.confirmPassword = t('settings.security.errors.confirmRequired');
    isValid = false;
  } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordErrors.confirmPassword = t('settings.security.errors.passwordMismatch');
    isValid = false;
  }

  if (passwordForm.currentPassword && passwordForm.newPassword && passwordForm.currentPassword === passwordForm.newPassword) {
    passwordErrors.newPassword = t('settings.security.errors.samePassword');
    isValid = false;
  }

  return isValid;
}

async function changePassword() {
  if (!validatePasswordForm()) return;

  isChangingPassword.value = true;
  passwordSuccess.value = '';

  try {
    await changePasswordUseCase.execute(
      authStore.user?.email,
      passwordForm.currentPassword,
      passwordForm.newPassword,
      passwordForm.confirmPassword
    );

    clearPasswordForm();
    passwordSuccess.value = t('settings.security.passwordChanged');
  } catch (err) {
    const message = localizePasswordError(err.code, err.message);

    if (err.code === 'INVALID_PASSWORD' || err.code === 'SAME_PASSWORD') {
      passwordErrors.newPassword = message;
    } else if (err.code === 'PASSWORD_MISMATCH') {
      passwordErrors.confirmPassword = message;
    } else {
      passwordErrors.currentPassword = message;
    }
  } finally {
    isChangingPassword.value = false;
  }
}

watch(showPasswordForm, (visible) => {
  if (!visible) {
    clearPasswordForm();
  }
});

function resetModalState() {
  activeTab.value = 'system';
  showPasswordForm.value = false;
  clearPasswordForm();
}

watch(() => props.isOpen, async (open) => {
  if (open) {
    resetModalState();
    await settingsStore.fetchSettings();
    if (settingsStore.settings) {
      notifications.emailAlerts = settingsStore.settings.notifications.emailAlerts;
      notifications.smsAlerts = settingsStore.settings.notifications.smsAlerts;
      notifications.pushAlerts = settingsStore.settings.notifications.pushAlerts;
      lastPasswordChange.value = settingsStore.settings.security.lastPasswordChange;
    }
  }
});
</script>

<style scoped>
.settings-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.settings-modal {
  background: #ffffff;
  border-radius: 16px;
  width: 750px;
  height: 700px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  flex-shrink: 0;
}

.settings-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px;
  border-bottom: 1px solid #eef2f6;
  flex-shrink: 0;
}

.settings-modal__header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.settings-modal__header-icon {
  font-size: 1.4rem;
  color: var(--primary-color);
}

.settings-modal__header h2 {
  font-size: 1.4rem;
  margin: 0;
  color: #0a1e4b;
}

.settings-modal__close {
  background: none;
  border: none;
  font-size: 1.3rem;
  color: #7f8fa6;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
}

.settings-modal__close:hover {
  background: #f1f3f5;
  color: #1a1a2e;
}

.settings-modal__body {
  display: flex;
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

.settings-nav {
  width: 180px;
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-right: 1px solid #eef2f6;
  flex-shrink: 0;
}

.settings-nav__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: none;
  background: none;
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  width: 100%;
}

.settings-nav__item:hover {
  background: #f5f7fa;
}

.settings-nav__item--active {
  background: #f0f4ff;
}

.settings-nav__item--active .settings-nav__icon {
  color: var(--primary-color);
}

.settings-nav__item--active .settings-nav__label {
  color: #0a1e4b;
  font-weight: 600;
}

.settings-nav__icon {
  font-size: 1.1rem;
  color: #7f8fa6;
  width: 20px;
  flex-shrink: 0;
}

.settings-nav__label {
  font-size: 0.88rem;
  font-weight: 500;
  color: #3a4a5c;
}

.settings-content {
  flex: 1;
  padding: 28px 32px;
  overflow-y: auto;
}

.settings-section__title {
  font-size: 1.1rem;
  color: #0a1e4b;
  margin: 0 0 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f4ff;
}

.setting-group {
  margin-bottom: 28px;
}

.setting-group__label {
  display: block;
  font-size: 0.82rem;
  font-weight: 700;
  color: #5a6a7c;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.language-options {
  display: flex;
  gap: 10px;
}

.language-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  background: #ffffff;
  cursor: pointer;
  font-size: 0.9rem;
  color: #3a4a5c;
  transition: all 0.2s;
  font-family: inherit;
}

.language-btn:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.language-btn--active {
  border-color: var(--primary-color);
  background: #fff8f0;
  color: var(--primary-color);
  font-weight: 600;
}

.language-flag {
  font-size: 1.2rem;
}

.language-check {
  font-size: 0.75rem;
  margin-left: 4px;
}

.notification-toggles {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-radius: 10px;
  transition: background 0.2s;
}

.toggle-row:hover {
  background: #f8fafc;
}

.toggle-row__info {
  display: flex;
  flex-direction: column;
}

.toggle-row__title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a2a3c;
}

.toggle-row__desc {
  font-size: 0.8rem;
  color: #7f8fa6;
  margin-top: 2px;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle__slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: #cbd5e1;
  border-radius: 24px;
  transition: 0.3s;
}

.toggle__slider::before {
  content: '';
  position: absolute;
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background: #ffffff;
  border-radius: 50%;
  transition: 0.3s;
}

.toggle input:checked + .toggle__slider {
  background: var(--primary-color);
}

.toggle input:checked + .toggle__slider::before {
  transform: translateX(20px);
}

.account-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.account-action-btn {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  border: 1.5px solid #eef2f6;
  border-radius: 12px;
  background: #ffffff;
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: all 0.2s;
  font-family: inherit;
}

.account-action-btn:hover {
  border-color: #d0d7e2;
  background: #fafbfc;
}

.account-action-btn--danger:hover {
  border-color: #fecaca;
  background: #fef2f2;
}

.account-action-btn--danger .account-action-btn__title {
  color: #dc2626;
}

.account-action-btn__icon {
  width: 44px;
  height: 44px;
  background: #f0f4ff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--secondary-color);
  font-size: 1.1rem;
  flex-shrink: 0;
}

.account-action-btn__icon--danger {
  background: #fef2f2;
  color: #dc2626;
}

.account-action-btn__text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.account-action-btn__title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a2a3c;
}

.account-action-btn__desc {
  font-size: 0.8rem;
  color: #7f8fa6;
}

.account-action-btn__arrow {
  font-size: 0.85rem;
  color: #c0c8d4;
  flex-shrink: 0;
}

.account-action-btn:hover .account-action-btn__arrow {
  color: #7f8fa6;
}

.save-btn {
  padding: 10px 24px;
  background: var(--primary-color);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  font-family: inherit;
  align-self: flex-start;
  transition: all 0.2s;
}

.save-btn:hover {
  filter: brightness(1.1);
}

.save-btn--small {
  padding: 8px 18px;
  font-size: 0.82rem;
}

.password-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: #f8fafc;
  border-radius: 10px;
}

.password-info__status {
  font-size: 0.85rem;
  color: #5a6a7c;
}

.action-btn {
  padding: 8px 18px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.82rem;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.action-btn--outline {
  background: transparent;
  border: 1.5px solid #e2e8f0;
  color: #3a4a5c;
}

.action-btn--outline:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: #fff8f0;
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 12px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 10px;
}

.password-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.password-field__label {
  font-size: 0.78rem;
  font-weight: 600;
  color: #5a6a7c;
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.password-form input {
  width: 100%;
  padding: 10px 14px;
  padding-right: 40px;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  box-sizing: border-box;
}

.password-form input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.password-form input.password-input--error {
  border-color: #ef4444;
  background: #fef2f2;
}

.password-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:hover {
  color: #3a4a5c;
}

.password-field__error {
  font-size: 0.75rem;
  color: #ef4444;
  line-height: 1.4;
}

.password-success {
  color: #16a34a;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 8px 12px;
  background: #f0fdf4;
  border-radius: 6px;
}

.password-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 4px;
}

.btn-spinner {
  width: 13px;
  height: 13px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-active .settings-modal,
.modal-leave-active .settings-modal {
  transition: transform 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .settings-modal {
  transform: scale(0.95) translateY(10px);
}

.modal-leave-to .settings-modal {
  transform: scale(0.95) translateY(10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
  margin-top: 0;
}

@media (max-width: 640px) {
  .settings-modal__body {
    flex-direction: column;
  }

  .settings-nav {
    width: 100%;
    flex-direction: row;
    padding: 12px;
    gap: 4px;
    border-right: none;
    border-bottom: 1px solid #eef2f6;
    overflow-x: auto;
  }

  .settings-nav__item {
    flex-direction: column;
    gap: 4px;
    padding: 10px;
    min-width: 80px;
    align-items: center;
    text-align: center;
  }

  .settings-content {
    padding: 20px;
  }

  .settings-overlay {
    padding: 0;
    align-items: flex-end;
  }

  .settings-modal {
    width: 100%;
    max-width: 100%;
    height: 92vh;
    border-radius: 16px 16px 0 0;
  }
}
</style>
