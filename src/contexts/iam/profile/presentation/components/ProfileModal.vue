<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="profile-overlay" @click.self="close">
        <div class="profile-modal">
          <header class="profile-modal__header">
            <div class="profile-modal__header-left">
              <font-awesome-icon icon="circle-user" class="profile-modal__header-icon" />
              <h2>{{ t('profile.header.title') || 'Mi Perfil' }}</h2>
            </div>
            <button class="profile-modal__close" :aria-label="t('profile.edit.close')" @click="close">
              <font-awesome-icon icon="xmark" />
            </button>
          </header>

          <div class="profile-modal__body">
            <div v-if="profileStore.isLoading" class="profile-loading">
              <span class="profile-loading__spinner" />
            </div>

            <template v-else-if="profile">
              <div class="profile-scroll-container">

                <section class="profile-hero-section">
                  <div class="profile-hero-mini">
                    <div class="profile-hero-mini__avatar">
                      {{ profile.initials }}
                    </div>
                    <div class="profile-hero-mini__info">
                      <h3>{{ profile.fullName }}</h3>
                    </div>
                    <button class="btn-edit-orange" @click="$emit('request-edit')">
                      <font-awesome-icon icon="pen-to-square" />
                      <span>{{ t('profile.header.editAction') }}</span>
                    </button>
                  </div>
                </section>

                <section class="profile-group">
                  <h3 class="profile-group__title">
                    <font-awesome-icon icon="user" class="profile-group__icon" />
                    {{ t('profile.personalInfo') }}
                  </h3>
                  <div class="profile-group__divider"></div>

                  <div class="info-grid">
                    <div class="info-item">
                      <label>{{ t('profile.firstName') }}</label>
                      <span>{{ profile.firstName }}</span>
                    </div>
                    <div class="info-item">
                      <label>{{ t('profile.lastName') }}</label>
                      <span>{{ profile.lastName }}</span>
                    </div>
                    <div class="info-item">
                      <label>{{ t('profile.phone') }}</label>
                      <span>{{ profile.phoneNumber || '—' }}</span>
                    </div>
                  </div>
                </section>

                <section class="profile-group">
                  <h3 class="profile-group__title">
                    <font-awesome-icon icon="location-dot" class="profile-group__icon" />
                    {{ t('profile.country') }} & {{ t('profile.city') }}
                  </h3>
                  <div class="profile-group__divider"></div>

                  <div class="info-grid">
                    <div class="info-item">
                      <label>{{ t('profile.country') }}</label>
                      <span>{{ profile.country }}</span>
                    </div>
                    <div class="info-item">
                      <label>{{ t('profile.city') }}</label>
                      <span>{{ profile.city }}</span>
                    </div>
                    <div class="info-item info-item--full">
                      <label>{{ t('profile.address') }}</label>
                      <span>{{ profile.address }}</span>
                    </div>
                  </div>
                </section>

                <section class="profile-group">
                  <h3 class="profile-group__title">
                    <font-awesome-icon icon="shield-halved" class="profile-group__icon" />
                    {{ t('profile.accountInfo') }}
                  </h3>
                  <div class="profile-group__divider"></div>

                  <div class="info-grid">
                    <div class="info-item">
                      <label>{{ t('profile.email') }}</label>
                      <span>{{ profile.email }}</span>
                    </div>
                    <div class="info-item">
                      <label>{{ t('profile.status') }}</label>
                      <span class="status-badge" :class="statusClass">{{ statusLabel }}</span>
                    </div>
                  </div>
                </section>

              </div>
            </template>

            <div v-else-if="profileStore.error" class="profile-error">
              <font-awesome-icon icon="triangle-exclamation" />
              <p>{{ profileStore.error }}</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useProfileStore } from '../store/profileStore';
import { useI18n } from '@/shared/presentation/i18n';

const props = defineProps({ isOpen: Boolean });
const emit = defineEmits(['close', 'request-edit']);

const profileStore = useProfileStore();
const { t } = useI18n();

const profile = computed(() => profileStore.profile);

const statusLabel = computed(() => {
  if (!profileStore.profile) return '';
  return profileStore.profile.isActive ? t('profile.active') : t('profile.inactive');
});

const statusClass = computed(() => {
  if (!profileStore.profile) return '';
  return profileStore.profile.isActive ? 'status--active' : 'status--locked';
});

watch(() => props.isOpen, (open) => {
  if (open) {
    profileStore.fetchProfile();
  }
});

const close = () => emit('close');
</script>

<style scoped>
.profile-overlay {
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

.profile-modal {
  background: #ffffff;
  border-radius: 16px;
  width: 750px;
  max-width: 100%;
  max-height: calc(100vh - 64px);
  height: auto;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.profile-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #eef2f6;
  flex-shrink: 0;
}

.profile-modal__header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.profile-modal__header-icon {
  font-size: 1.25rem;
  color: var(--primary-color);
}

.profile-modal__header h2 {
  font-size: 1.25rem;
  margin: 0;
  color: #0a1e4b;
  font-weight: 700;
  font-family: var(--font-titles, sans-serif);
}

.profile-modal__close {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #7f8fa6;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  transition: all 0.2s;
}

.profile-modal__close:hover {
  background: #f1f3f5;
  color: #1a1a2e;
}

.profile-modal__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  background: #ffffff;
}

.profile-scroll-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.profile-hero-mini {
  display: flex;
  align-items: center;
  gap: 20px;
  background: #f8fafc;
  padding: 12px 20px;
  border-radius: 12px;
  border: 1px solid #eef2f6;
}

.profile-hero-mini__avatar {
  width: 54px;
  height: 54px;
  background: linear-gradient(135deg, var(--primary-color), #e66700);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 700;
  font-family: var(--font-titles);
  box-shadow: 0 4px 12px rgba(255, 115, 0, 0.2);
  flex-shrink: 0;
}

.profile-hero-mini__info {
  flex: 1;
}

.profile-hero-mini__info h3 {
  margin: 0;
  font-size: 1.15rem;
  color: #0a1e4b;
  font-weight: 700;
}

.btn-edit-orange {
  background: #e67e22;
  color: #ffffff;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s, transform 0.1s;
}

.btn-edit-orange:hover {
  background: #d35400;
}

.btn-edit-orange:active {
  transform: scale(0.98);
}

.profile-group {
  display: flex;
  flex-direction: column;
}

.profile-group__title {
  font-size: 1rem;
  color: #0a1e4b;
  margin: 0 0 8px 0;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
}

.profile-group__icon {
  color: #94a3b8;
  font-size: 0.95rem;
}

.profile-group__divider {
  height: 1px;
  background-color: #e2e8f0;
  margin-bottom: 12px;
  width: 100%;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 24px;
  padding-left: 4px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item--full {
  grid-column: span 2;
}

.info-item label {
  font-size: 0.72rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item span {
  font-size: 0.9rem;
  color: #1e293b;
  font-weight: 500;
}

.status-badge {
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
  width: fit-content;
  margin-top: 4px;
  display: inline-block;
}

.status--active {
  background: #f0fdf4;
  color: #16a34a;
}

.status--locked {
  background: #fef2f2;
  color: #dc2626;
}

.profile-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 60px;
}

.profile-loading__spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.profile-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  color: #dc2626;
  gap: 8px;
  padding: 40px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.modal-enter-active, .modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-active .profile-modal, .modal-leave-active .profile-modal {
  transition: transform 0.25s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-from .profile-modal, .modal-leave-to .profile-modal {
  transform: scale(0.95) translateY(10px);
}

@media (max-width: 640px) {
  .profile-modal {
    width: 100%;
    height: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .profile-scroll-container {
    padding: 20px;
    gap: 20px;
  }

  .profile-hero-mini {
    flex-direction: column;
    text-align: center;
    gap: 12px;
    padding: 12px;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .info-item--full {
    grid-column: span 1;
  }
}
</style>