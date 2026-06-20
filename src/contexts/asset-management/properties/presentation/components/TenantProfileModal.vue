<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="tp-overlay" @click.self="close">
        <div class="tp-modal">
          <header class="tp-modal__header">
            <div class="tp-modal__header-left">
              <font-awesome-icon icon="user" class="tp-modal__header-icon" />
              <h2>{{ t('tenantProfile.title') }}</h2>
            </div>
            <button class="tp-modal__close" @click="close">
              <font-awesome-icon icon="xmark" />
            </button>
          </header>

          <div class="tp-modal__body">
            <div v-if="loading" class="tp-loading">
              <span class="tp-loading__spinner" />
              <p>{{ t('tenantProfile.loading') }}</p>
            </div>

            <template v-else-if="tenant">
              <div class="tp-scroll-container">

                <section class="tp-hero-section">
                  <div class="tp-hero-mini">
                    <div class="tp-hero-mini__avatar">
                      {{ initials }}
                    </div>
                    <div class="tp-hero-mini__info">
                      <h3>{{ fullName }}</h3>
                    </div>
                  </div>
                </section>

                <section class="tp-group">
                  <h3 class="tp-group__title">
                    <font-awesome-icon icon="user" class="tp-group__icon" />
                    {{ t('tenantProfile.personalInfo') }}
                  </h3>
                  <div class="tp-group__divider"></div>

                  <div class="tp-info-grid">
                    <div class="tp-info-item">
                      <label>{{ t('profile.firstName') }}</label>
                      <span>{{ tenant.firstName }}</span>
                    </div>
                    <div class="tp-info-item">
                      <label>{{ t('profile.lastName') }}</label>
                      <span>{{ tenant.lastName }}</span>
                    </div>
                    <div class="tp-info-item">
                      <label>{{ t('profile.phone') }}</label>
                      <span>{{ tenant.phoneNumber || '—' }}</span>
                    </div>
                  </div>
                </section>

                <section class="tp-group">
                  <h3 class="tp-group__title">
                    <font-awesome-icon icon="location-dot" class="tp-group__icon" />
                    {{ t('tenantProfile.location') }}
                  </h3>
                  <div class="tp-group__divider"></div>

                  <div class="tp-info-grid">
                    <div class="tp-info-item">
                      <label>{{ t('profile.country') }}</label>
                      <span>{{ tenant.country }}</span>
                    </div>
                    <div class="tp-info-item">
                      <label>{{ t('profile.city') }}</label>
                      <span>{{ tenant.city }}</span>
                    </div>
                    <div class="tp-info-item tp-info-item--full">
                      <label>{{ t('profile.address') }}</label>
                      <span>{{ tenant.address }}</span>
                    </div>
                  </div>
                </section>

                <section v-if="tenant.email" class="tp-group">
                  <h3 class="tp-group__title">
                    <font-awesome-icon icon="shield-halved" class="tp-group__icon" />
                    {{ t('profile.accountInfo') }}
                  </h3>
                  <div class="tp-group__divider"></div>

                  <div class="tp-info-grid">
                    <div class="tp-info-item tp-info-item--full">
                      <label>{{ t('profile.email') }}</label>
                      <span>{{ tenant.email }}</span>
                    </div>
                    <div class="tp-info-item">
                      <label>{{ t('profile.status') }}</label>
                      <span class="tp-status-badge" :class="tenant.isActive ? 'tp-status--active' : 'tp-status--locked'">
                        {{ tenant.isActive ? t('profile.active') : t('profile.inactive') }}
                      </span>
                    </div>
                  </div>
                </section>

              </div>
            </template>

            <div v-else-if="error" class="tp-error">
              <font-awesome-icon icon="triangle-exclamation" />
              <p>{{ error }}</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { TenantRepositoryImpl } from '../../../tenants/infrastructure/repositories/TenantRepositoryImpl';
import { useI18n } from '@/shared/presentation/i18n';

const props = defineProps({
  isOpen: Boolean,
  tenantId: { type: Number, default: null }
});
const emit = defineEmits(['close']);

const { t } = useI18n();
const tenantRepo = new TenantRepositoryImpl();
const tenant = ref(null);
const loading = ref(false);
const error = ref(null);

const fullName = computed(() => {
  if (!tenant.value) return '';
  return `${tenant.value.firstName} ${tenant.value.lastName}`;
});

const initials = computed(() => {
  if (!tenant.value) return '';
  return `${tenant.value.firstName[0]}${tenant.value.lastName[0]}`.toUpperCase();
});

watch(() => props.isOpen, async (open) => {
  if (open && props.tenantId) {
    loading.value = true;
    error.value = null;
    tenant.value = null;
    try {
      tenant.value = await tenantRepo.getById(props.tenantId);
    } catch (e) {
      error.value = e.message || t('tenantProfile.loadFailed');
    } finally {
      loading.value = false;
    }
  }
});

const close = () => emit('close');
</script>

<style scoped>
.tp-overlay {
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

.tp-modal {
  background: #ffffff;
  border-radius: 16px;
  width: 750px;
  max-height: 950px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  overflow: hidden;
}

.tp-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px;
  border-bottom: 1px solid #eef2f6;
  flex-shrink: 0;
}

.tp-modal__header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tp-modal__header-icon {
  font-size: 1.4rem;
  color: var(--primary-color);
}

.tp-modal__header h2 {
  font-size: 1.4rem;
  margin: 0;
  color: #0a1e4b;
  font-weight: 700;
  font-family: var(--font-titles, sans-serif);
}

.tp-modal__close {
  background: none;
  border: none;
  font-size: 1.3rem;
  color: #7f8fa6;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s;
}

.tp-modal__close:hover {
  background: #f1f3f5;
  color: #1a1a2e;
}

.tp-modal__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  background: #ffffff;
}

.tp-scroll-container {
  flex: 1;
  overflow-y: auto;
  padding: 32px 40px;
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.tp-hero-mini {
  display: flex;
  align-items: center;
  gap: 24px;
  background: #f8fafc;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #eef2f6;
}

.tp-hero-mini__avatar {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, var(--primary-color), #e66700);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.6rem;
  font-weight: 700;
  font-family: var(--font-titles);
  box-shadow: 0 4px 12px rgba(255, 115, 0, 0.2);
  flex-shrink: 0;
}

.tp-hero-mini__info {
  flex: 1;
}

.tp-hero-mini__info h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #0a1e4b;
  font-weight: 700;
}

.tp-group {
  display: flex;
  flex-direction: column;
}

.tp-group__title {
  font-size: 1.05rem;
  color: #0a1e4b;
  margin: 0 0 10px 0;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
}

.tp-group__icon {
  color: #94a3b8;
  font-size: 1rem;
}

.tp-group__divider {
  height: 1px;
  background-color: #e2e8f0;
  margin-bottom: 20px;
  width: 100%;
}

.tp-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px 32px;
  padding-left: 4px;
}

.tp-info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.tp-info-item--full {
  grid-column: span 2;
}

.tp-info-item label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tp-info-item span {
  font-size: 0.95rem;
  color: #1e293b;
  font-weight: 500;
}

.tp-status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  width: fit-content;
}

.tp-status--active {
  background: #f0fdf4;
  color: #16a34a;
}

.tp-status--locked {
  background: #fef2f2;
  color: #dc2626;
}

.tp-loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 60px;
  gap: 16px;
  color: #94a3b8;
}

.tp-loading__spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.tp-error {
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

.modal-enter-active .tp-modal, .modal-leave-active .tp-modal {
  transition: transform 0.25s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-from .tp-modal, .modal-leave-to .tp-modal {
  transform: scale(0.95) translateY(10px);
}

@media (max-width: 640px) {
  .tp-modal {
    width: 100%;
    height: 100%;
    max-height: 100%;
    border-radius: 0;
  }

  .tp-scroll-container {
    padding: 20px;
    gap: 28px;
  }

  .tp-hero-mini {
    flex-direction: column;
    text-align: center;
    gap: 16px;
    padding: 16px;
  }

  .tp-info-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .tp-info-item--full {
    grid-column: span 1;
  }
}
</style>
