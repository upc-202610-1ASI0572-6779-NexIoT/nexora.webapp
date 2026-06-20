<script setup>
import {
  reactive,
  ref,
  computed,
  onMounted,
  onUnmounted
} from 'vue';
import { useRouter } from 'vue-router';
import AppBreadcrumbs from '@/shared/presentation/components/AppBreadcrumbs.vue';
import { useAuthStore } from '@/contexts/iam/auth/presentation/store/authStore';
import { PropertyRepositoryImpl } from '../../infrastructure/repositories/PropertyRepositoryImpl';
import { useI18n } from '@/shared/presentation/i18n';

const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n();
const propertyRepo = new PropertyRepositoryImpl();

const formData = reactive({
  name: '',
  type: '',
  country: '',
  city: '',
  address: '',
  description: '',
  isSecurityModeArmed: false
});

const error = ref('');
const saving = ref(false);

const breadcrumbs = [
  { label: t('buildings.breadcrumbs.index'), route: '/buildings' },
  { label: t('buildings.breadcrumbs.newRegistration'), route: '/buildings/new' }
];

const propertyTypes = [
  { value: 'HOUSE', label: t('buildings.types.house') },
  { value: 'APARTMENT', label: t('buildings.types.apartment') },
  { value: 'ROOM', label: t('buildings.types.room') },
  { value: 'OFFICE', label: t('buildings.types.office') },
  { value: 'COMMERCIAL', label: t('buildings.types.commercial') }
];

const activeDropdown = ref(false);
const selectRef = ref(null);

const selectedPropertyTypeLabel = computed(() => {
  const selected = propertyTypes.find(
      p => p.value === formData.type
  );

  return (
      selected?.label ||
      t('buildings.form.placeholders.selectType')
  );
});

function selectPropertyType(value) {
  formData.type = value;
  activeDropdown.value = false;
}

function handleClickOutside(event) {
  if (!selectRef.value?.contains(event.target)) {
    activeDropdown.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

async function handleCreateProperty() {
  error.value = '';

  if (!formData.name.trim()) {
    error.value = t('buildings.form.labels.propertyName') + ' ' + t('buildings.actions.create.error.createFailed');
    return;
  }
  if (!formData.type) {
    error.value = t('buildings.form.labels.propertyType') + ' ' + t('buildings.actions.create.error.createFailed');
    return;
  }
  if (!formData.country.trim()) {
    error.value = t('buildings.form.labels.country') + ' ' + t('buildings.actions.create.error.createFailed');
    return;
  }
  if (!formData.city.trim()) {
    error.value = t('buildings.form.labels.city') + ' ' + t('buildings.actions.create.error.createFailed');
    return;
  }
  if (!formData.address.trim()) {
    error.value = t('buildings.form.labels.address') + ' ' + t('buildings.actions.create.error.createFailed');
    return;
  }

  if (!authStore.subscription) {
    error.value = t('buildings.actions.create.error.noSubscription');
    return;
  }

  saving.value = true;
  try {
    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      type: formData.type,
      country: formData.country.trim(),
      city: formData.city.trim(),
      address: formData.address.trim(),
      isSecurityModeArmed: formData.isSecurityModeArmed
    };
    await propertyRepo.create(payload);
    router.push('/buildings');
  } catch (e) {
    const msg = e.response?.data || e.message;
    if (msg && msg.includes('limit')) {
      error.value = t('buildings.actions.create.error.limitReached');
    } else {
      error.value = msg || t('buildings.actions.create.error.createFailed');
    }
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="reg-view">

    <div class="reg-topbar">
      <AppBreadcrumbs :items="breadcrumbs" class="reg-breadcrumbs" />
    </div>

    <div class="reg-container">

      <header class="reg-header">
        <h1 class="reg-header__title">{{ t('buildings.actions.create.createProperty') }}</h1>
        <p class="reg-header__subtitle">{{ t('buildings.breadcrumbs.newRegistration') }}</p>
      </header>

      <div class="reg-scrollable-body">
        <form @submit.prevent="handleCreateProperty" class="reg-form">

          <section class="reg-section">
            <div class="reg-section__meta">
              <h2 class="reg-section__title">
                <font-awesome-icon icon="info-circle" class="reg-section__icon" />
                {{ t('buildings.form.general.title') }}
              </h2>
              <p class="reg-section__description">Ingresa los datos principales e identificación de la propiedad inmueble.</p>
            </div>

            <div class="reg-section__fields">
              <div class="reg-field">
                <label class="reg-label">{{ t('buildings.form.labels.propertyName') }}</label>
                <input
                    v-model="formData.name"
                    type="text"
                    class="reg-input"
                    :placeholder="t('buildings.form.placeholders.propertyName')"
                />
              </div>

              <div class="reg-row">
                <div class="reg-field">
                  <label class="reg-label">
                    {{ t('buildings.form.labels.propertyType') }}
                  </label>

                  <div
                      class="custom-select-container"
                      ref="selectRef"
                  >
                    <div
                        class="custom-select-trigger"
                        @click="activeDropdown = !activeDropdown"
                    >
                      <span>{{ selectedPropertyTypeLabel }}</span>
                      <span class="select-arrow">▾</span>
                    </div>

                    <Transition name="dropdown">
                      <div
                          v-if="activeDropdown"
                          class="custom-select-options"
                      >
                        <div
                            v-for="pt in propertyTypes"
                            :key="pt.value"
                            class="custom-option"
                            :class="{ selected: formData.type === pt.value }"
                            @click="selectPropertyType(pt.value)"
                        >
                          {{ pt.label }}
                        </div>
                      </div>
                    </Transition>
                  </div>
                </div>
                <div class="reg-field">
                  <label class="reg-label">{{ t('buildings.form.labels.country') }}</label>
                  <input
                      v-model="formData.country"
                      type="text"
                      class="reg-input"
                      :placeholder="t('buildings.form.placeholders.country')"
                  />
                </div>
              </div>

              <div class="reg-row">
                <div class="reg-field">
                  <label class="reg-label">{{ t('buildings.form.labels.city') }}</label>
                  <input
                      v-model="formData.city"
                      type="text"
                      class="reg-input"
                      :placeholder="t('buildings.form.placeholders.city')"
                  />
                </div>
                <div class="reg-field">
                  <label class="reg-label">{{ t('buildings.form.labels.address') }}</label>
                  <input
                      v-model="formData.address"
                      type="text"
                      class="reg-input"
                      :placeholder="t('buildings.form.placeholders.address')"
                  />
                </div>
              </div>

              <div class="reg-field">
                <label class="reg-label">{{ t('buildings.form.labels.description') }}</label>
                <textarea
                    v-model="formData.description"
                    class="reg-input reg-textarea"
                    :placeholder="t('buildings.form.placeholders.description')"
                    rows="3"
                ></textarea>
              </div>
            </div>
          </section>

          <hr class="reg-divider" />

          <section class="reg-section">
            <div class="reg-section__meta">
              <h2 class="reg-section__title">
                <font-awesome-icon icon="lock" class="reg-section__icon" />
                {{ t('buildings.form.security.title') }}
              </h2>
              <p class="reg-section__description">Configura el estado inicial del sistema de monitoreo de seguridad.</p>
            </div>

            <div class="reg-section__fields">
              <div class="reg-toggle-card">
                <div class="reg-toggle-info">
                  <span class="reg-toggle-label">{{ t('buildings.security.modeLabel') }}</span>
                  <span class="reg-toggle-desc">
                    {{ formData.isSecurityModeArmed ? t('buildings.security.armed') : t('buildings.security.disarmed') }}
                  </span>
                </div>
                <button
                    class="reg-toggle"
                    :class="{ 'reg-toggle--active': formData.isSecurityModeArmed }"
                    @click="formData.isSecurityModeArmed = !formData.isSecurityModeArmed"
                    type="button"
                >
                  <span class="reg-toggle__knob"></span>
                </button>
              </div>
            </div>
          </section>

          <div v-if="error" class="reg-error">
            <font-awesome-icon icon="triangle-exclamation" />
            <span>{{ error }}</span>
          </div>
        </form>
      </div>

      <footer class="reg-footer">
        <div class="reg-actions">
          <button
              class="reg-btn reg-btn--secondary"
              type="button"
              @click="router.push('/buildings')"
          >
            {{ t('buildings.actions.cancel') }}
          </button>
          <button
              class="reg-btn reg-btn--primary"
              :disabled="saving"
              @click="handleCreateProperty"
          >
            <span>{{ saving ? t('buildings.actions.saving') + '...' : t('buildings.actions.create.createProperty') }}</span>
          </button>
        </div>
      </footer>

    </div>
  </div>
</template>

<style scoped>
/* Contenedor Raíz: Ocupa exactamente el alto de la pantalla */
.reg-view {
  height: 100vh;
  width: 100%;
  background-color: #ffffff;
  color: #0f172a;
  font-family: var(--font-general, sans-serif);
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* Esquina superior izquierda garantizada sin paddings globales molestos */
.reg-topbar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  box-sizing: border-box;

  padding: 24px 0 0 0; /* sin padding lateral */
}

.reg-breadcrumbs {
  margin: 0;
}

/* Layout Flex Vertical centrado */
.reg-container {
  max-width: 1100px;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  padding: 16px 40px 24px 40px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden; /* Controla que nada desborde de forma desordenada */
}

/* Cabecera Fija */
.reg-header {
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 24px;
  flex-shrink: 0;
}

.reg-header__title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.reg-header__subtitle {
  margin: 4px 0 0;
  font-size: 0.9rem;
  color: #64748b;
}

/* Zona de Contenido Scrolleable Limpia */
.reg-scrollable-body {
  flex: 1;
  overflow-y: auto;
  padding-right: 12px;
  margin-bottom: 16px;
}

/* Estilización de la barra de scroll */
.reg-scrollable-body::-webkit-scrollbar {
  width: 6px;
}
.reg-scrollable-body::-webkit-scrollbar-track {
  background: transparent;
}
.reg-scrollable-body::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.reg-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-bottom: 20px;
}

/* Diseño Grid de Secciones */
.reg-section {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 40px;
}

.reg-section__meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.reg-section__title {
  font-size: 1.05rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.reg-section__icon {
  color: var(--primary-color, #ff7300);
}

.reg-section__description {
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.4;
  margin: 0;
}

.reg-section__fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Campos e Inputs */
.reg-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.reg-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #334155;
}

.reg-input {
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 10px 14px;
  font-size: 0.9rem;
  color: #0f172a;
  outline: none;
  background: #fff;
  transition: all 0.15s ease;
  width: 100%;
  box-sizing: border-box;
}

.reg-input:focus {
  border-color: var(--primary-color, #ff7300);
  box-shadow: 0 0 0 1px var(--primary-color, #ff7300);
}

.reg-textarea {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  resize: vertical;
}

.reg-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.reg-divider {
  border: 0;
  height: 1px;
  background: #f1f5f9;
  margin: 0;
}

.custom-select-container {
  position: relative;
  width: 100%;
  user-select: none;
}

.custom-select-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;
  min-height: 44px;

  padding: 10px 14px;

  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: #fff;

  font-size: 0.9rem;
  color: #0f172a;

  cursor: pointer;
  transition: all 0.15s ease;
  box-sizing: border-box;
}

.custom-select-trigger:hover {
  border-color: var(--primary-color, #ff7300);
}

.select-arrow {
  color: #64748b;
  font-size: 0.8rem;
}

.custom-select-options {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;

  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;

  box-shadow:
      0 10px 25px rgba(15, 23, 42, 0.08),
      0 4px 10px rgba(15, 23, 42, 0.05);

  padding: 6px 0;
  z-index: 100;
}

.custom-option {
  padding: 10px 14px;
  font-size: 0.88rem;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s ease;
}

.custom-option:hover {
  background: #f8fafc;
  color: var(--primary-color, #ff7300);
}

.custom-option.selected {
  background: rgba(255, 115, 0, 0.08);
  color: var(--primary-color, #ff7300);
  font-weight: 600;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.reg-toggle-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.reg-toggle-info {
  display: flex;
  flex-direction: column;
}

.reg-toggle-label {
  font-size: 0.88rem;
  font-weight: 600;
}

.reg-toggle-desc {
  font-size: 0.82rem;
  color: #64748b;
}

.reg-toggle {
  width: 44px;
  height: 24px;
  background: #cbd5e1;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  padding: 0;
}

.reg-toggle--active {
  background: var(--primary-color, #ff7300);
}

.reg-toggle__knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.2s;
}

.reg-toggle--active .reg-toggle__knob {
  transform: translateX(20px);
}

.reg-error {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #fff5f5;
  border: 1px solid #feb2b2;
  border-radius: 6px;
  color: #c53030;
  font-size: 0.88rem;
}

.reg-footer {
  flex-shrink: 0;
  border-top: 1px solid #f1f5f9;
  padding-top: 16px;
}

.reg-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.reg-btn {
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  border: none;
}

.reg-btn--primary {
  background: var(--primary-color, #ff7300);
  color: #fff;
}

.reg-btn--primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.reg-btn--secondary {
  background: transparent;
  color: #475569;
  border: 1px solid #cbd5e1;
}

.reg-btn--secondary:hover {
  background: #f8fafc;
}

/* Ajustes Responsivos */
@media (max-width: 850px) {
  .reg-topbar {
    padding: 16px 20px 0 20px;
  }

  .reg-container {
    padding: 16px 20px;
  }

  .reg-section {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .reg-row {
    grid-template-columns: 1fr;
  }

  .reg-actions {
    flex-direction: column-reverse;
  }

  .reg-btn {
    width: 100%;
    text-align: center;
    justify-content: center;
  }
}
</style>