<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { PropertyRepositoryImpl } from '../../infrastructure/repositories/PropertyRepositoryImpl';
import { TenantRepositoryImpl } from '../../../tenants/infrastructure/repositories/TenantRepositoryImpl';
import { useI18n } from '@/shared/presentation/i18n';
import apiClient from '@/shared/infrastructure/http/apiClient';

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const propertyRepo = new PropertyRepositoryImpl();
const tenantRepo = new TenantRepositoryImpl();

const propertyCode = route.params.propertyCode;

const property = ref(null);
const propertyId = ref(null); // Database ID loaded after fetching by code
const loading = ref(true);
const error = ref('');
const saving = ref(false);
const saveSuccess = ref(false);

const isEditing = ref(false);

// Form data for editing mode
const editForm = reactive({
  name: '',
  description: '',
  propertyType: '',
  country: '',
  city: '',
  address: '',
  status: '',
  isSecurityModeArmed: false
});

// Tenants list
const tenants = ref([]);
const tenantsLoading = ref(false);
const showAddTenant = ref(false);
const newTenant = ref({ firstName: '', lastName: '', country: '', city: '', address: '', phoneNumber: '' });
const tenantSaving = ref(false);
const tenantError = ref('');

const globalBreadcrumbs = inject('globalBreadcrumbs', null);
const propertyTypeLabels = computed(() => ({
  HOUSE: t('buildings.types.house') || 'House',
  APARTMENT: t('buildings.types.apartment') || 'Apartment',
  ROOM: t('buildings.types.room') || 'Room',
  OFFICE: t('buildings.types.office') || 'Office',
  COMMERCIAL: t('buildings.types.commercial') || 'Commercial'
}));

const propertyStatusLabels = computed(() => ({
  ACTIVE: t('buildings.status.active') || 'Active',
  INACTIVE: t('buildings.status.inactive') || 'Inactive',
  MAINTENANCE: t('buildings.status.maintenance') || 'Maintenance'
}));

const breadcrumbs = computed(() => [
  { label: t('buildings.breadcrumbs.index') || 'Properties', route: '/buildings' },
  { label: property.value?.name || t('buildings.breadcrumbs.editProperty') || 'Edit Property', route: `/buildings/${propertyCode}` }
]);

const loadTenants = async () => {
  if (!propertyId.value) return;
  tenantsLoading.value = true;
  try {
    tenants.value = await tenantRepo.getByProperty(propertyId.value);
  } catch (err) {
    console.error('Failed to load tenants', err);
    tenants.value = [];
  } finally {
    tenantsLoading.value = false;
  }
};

onMounted(async () => {
  try {
    property.value = await propertyRepo.getByCode(propertyCode);
    propertyId.value = property.value.id;
    
    // Set form fields
    editForm.name = property.value.name;
    editForm.description = property.value.description || '';
    editForm.propertyType = property.value.propertyType;
    editForm.country = property.value.country;
    editForm.city = property.value.city;
    editForm.address = property.value.address;
    editForm.status = property.value.status;
    editForm.isSecurityModeArmed = property.value.isSecurityModeArmed;

    // Provide global breadcrumbs to HeaderTop
    if (globalBreadcrumbs) {
      globalBreadcrumbs.value = breadcrumbs.value;
    }
    await loadTenants();
  } catch (err) {
    error.value = err.response?.status === 404
      ? t('buildings.errors.notFound') || 'Property not found.'
      : t('buildings.errors.loadFailed') || 'Failed to load property.';
  } finally {
    loading.value = false;
  }
});

onUnmounted(() => {
  if (globalBreadcrumbs) {
    globalBreadcrumbs.value = null;
  }
});

const startEditing = () => {
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
  // Restore original values
  editForm.name = property.value.name;
  editForm.description = property.value.description || '';
  editForm.propertyType = property.value.propertyType;
  editForm.country = property.value.country;
  editForm.city = property.value.city;
  editForm.address = property.value.address;
  editForm.status = property.value.status;
  editForm.isSecurityModeArmed = property.value.isSecurityModeArmed;
};

const saveChanges = async () => {
  if (!propertyId.value) return;
  saving.value = true;
  error.value = '';
  saveSuccess.value = false;
  try {
    await propertyRepo.update(propertyId.value, {
      name: editForm.name,
      description: editForm.description,
      type: editForm.propertyType,
      country: editForm.country,
      city: editForm.city,
      address: editForm.address,
      status: editForm.status,
      isSecurityModeArmed: editForm.isSecurityModeArmed
    });

    // Update original property
    property.value.name = editForm.name;
    property.value.description = editForm.description;
    property.value.propertyType = editForm.propertyType;
    property.value.country = editForm.country;
    property.value.city = editForm.city;
    property.value.address = editForm.address;
    property.value.status = editForm.status;
    property.value.isSecurityModeArmed = editForm.isSecurityModeArmed;

    // Refresh breadcrumbs name
    if (globalBreadcrumbs) {
      globalBreadcrumbs.value = breadcrumbs.value;
    }

    isEditing.value = false;
    saveSuccess.value = true;
    setTimeout(() => { saveSuccess.value = false; }, 4000);
  } catch (err) {
    error.value = t('buildings.errors.updateStatusFailed') || 'Failed to save property changes.';
  } finally {
    saving.value = false;
  }
};



const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const handleGoBack = () => {
  router.push('/buildings');
};

const handleAddTenant = async () => {
  tenantSaving.value = true;
  tenantError.value = '';
  try {
    await tenantRepo.create({ propertyId: Number(propertyId.value), ...newTenant.value });
    newTenant.value = { firstName: '', lastName: '', country: '', city: '', address: '', phoneNumber: '' };
    showAddTenant.value = false;
    await loadTenants();
  } catch (err) {
    tenantError.value = err.response?.data?.message || t('buildings.errors.saveFailed');
  } finally {
    tenantSaving.value = false;
  }
};

const handleDeleteTenant = async (tenantId) => {
  if (!confirm(t('buildings.tenant.confirmDelete'))) return;
  try {
    await tenantRepo.delete(tenantId);
    await loadTenants();
  } catch {
    tenantError.value = t('buildings.errors.deleteFailed');
  }
};
</script>

<template>
  <div class="edit-view">
    <!-- Breadcrumbs are handled globally in HeaderTop -->

    <div v-if="loading" class="edit-view__loading">
      <div class="loading-spinner"></div>
      <p>{{ t('buildings.loading') }}</p>
    </div>

    <div v-else-if="error && !property" class="edit-view__error">
      <font-awesome-icon icon="triangle-exclamation" class="error-icon" />
      <p>{{ error }}</p>
      <button class="button--solid-blue" @click="handleGoBack">{{ t('buildings.actions.backToList') }}</button>
    </div>

    <template v-else-if="property">
      <!-- Entity Header -->
      <header class="entity-header">
        <div class="entity-header__left">
          <h1 class="entity-header__title">{{ property.name }}</h1>
          <span class="entity-code-badge">{{ property.propertyCode }}</span>
          <span :class="['status-badge', 'status-badge--' + property.status.toLowerCase()]">
            <span class="status-dot"></span>
            {{ propertyStatusLabels[property.status] || property.status }}
          </span>
        </div>

        <div class="entity-header__right" v-if="!isEditing">
          <button class="button--solid-orange" @click="startEditing">
            <font-awesome-icon icon="pencil" class="button-icon" />
            <span>Editar Propiedad</span>
          </button>
        </div>
      </header>

      <div class="edit-view__grid">
        <!-- Left Column: Form Cards -->
        <div class="edit-view__form-col">
          <!-- General Information -->
          <div class="form-card">
            <header class="form-card__header">
              <div class="form-card__title-group">
                <font-awesome-icon icon="info-circle" class="form-card__icon" />
                <h3 class="form-card__title">{{ t('buildings.form.general.title') }}</h3>
              </div>
            </header>

            <div class="form-card__body">
              <!-- View Mode: Plain Text / Typography -->
              <div v-if="!isEditing" class="info-grid">
                <div class="info-field">
                  <span class="info-field__label">{{ t('buildings.form.labels.propertyName') }}</span>
                  <span class="info-field__value">{{ property.name }}</span>
                </div>
                <div class="info-field">
                  <span class="info-field__label">{{ t('buildings.form.labels.propertyType') }}</span>
                  <span class="info-field__value">{{ propertyTypeLabels[property.propertyType] || property.propertyType }}</span>
                </div>
                <div class="info-field">
                  <span class="info-field__label">{{ t('buildings.form.labels.country') }}</span>
                  <span class="info-field__value">{{ property.country }}</span>
                </div>
                <div class="info-field">
                  <span class="info-field__label">{{ t('buildings.form.labels.city') }}</span>
                  <span class="info-field__value">{{ property.city }}</span>
                </div>
                <div class="info-field info-field--full">
                  <span class="info-field__label">{{ t('buildings.form.labels.address') }}</span>
                  <span class="info-field__value">{{ property.address }}</span>
                </div>
                <div class="info-field info-field--full">
                  <span class="info-field__label">{{ t('buildings.form.labels.description') }}</span>
                  <span class="info-field__value info-field__value--dark">{{ property.description || t('buildings.form.noDescription') }}</span>
                </div>
              </div>

              <!-- Edit Mode: Form Inputs -->
              <div v-else class="edit-grid">
                <div class="form-group">
                  <label class="form-label">{{ t('buildings.form.labels.propertyName') }}</label>
                  <input v-model="editForm.name" type="text" class="form-input" />
                </div>
                <div class="form-group">
                  <label class="form-label">{{ t('buildings.form.labels.propertyType') }}</label>
                  <select v-model="editForm.propertyType" class="form-input">
                    <option value="HOUSE">{{ t('buildings.types.house') }}</option>
                    <option value="APARTMENT">{{ t('buildings.types.apartment') }}</option>
                    <option value="ROOM">{{ t('buildings.types.room') }}</option>
                    <option value="OFFICE">{{ t('buildings.types.office') }}</option>
                    <option value="COMMERCIAL">{{ t('buildings.types.commercial') }}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">{{ t('buildings.form.labels.country') }}</label>
                  <input v-model="editForm.country" type="text" class="form-input" />
                </div>
                <div class="form-group">
                  <label class="form-label">{{ t('buildings.form.labels.city') }}</label>
                  <input v-model="editForm.city" type="text" class="form-input" />
                </div>
                <div class="form-group form-group--full">
                  <label class="form-label">{{ t('buildings.form.labels.address') }}</label>
                  <input v-model="editForm.address" type="text" class="form-input" />
                </div>
                <div class="form-group form-group--full">
                  <label class="form-label">{{ t('buildings.form.labels.description') }}</label>
                  <textarea v-model="editForm.description" class="form-input form-textarea"></textarea>
                </div>
                <!-- Status selection inside General Info in Edit Mode -->
                <div class="form-group form-group--full">
                  <label class="form-label">{{ t('buildings.statusCard.title') }}</label>
                  <select v-model="editForm.status" class="form-input">
                    <option value="ACTIVE">{{ t('buildings.status.active') }}</option>
                    <option value="INACTIVE">{{ t('buildings.status.inactive') }}</option>
                    <option value="MAINTENANCE">{{ t('buildings.status.maintenance') }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Security Configuration -->
          <div class="form-card">
            <header class="form-card__header">
              <div class="form-card__title-group">
                <font-awesome-icon icon="shield" class="form-card__icon" />
                <h3 class="form-card__title">{{ t('buildings.form.security.title') }}</h3>
              </div>
            </header>

            <div class="form-card__body">
              <!-- View Mode -->
              <div v-if="!isEditing" class="info-grid">
                <div class="info-field">
                  <span class="info-field__label">{{ t('buildings.security.modeLabel') }}</span>
                  <span class="info-field__value">{{ property.isSecurityModeArmed ? t('buildings.security.armed') : t('buildings.security.disarmed') }}</span>
                </div>
              </div>

              <!-- Edit Mode -->
              <div v-else class="edit-grid">
                <div class="form-group form-group--checkbox">
                  <label class="form-label-checkbox">
                    <input v-model="editForm.isSecurityModeArmed" type="checkbox" class="form-checkbox" />
                    <span>{{ t('buildings.security.modeLabel') }} ({{ t('buildings.security.armed') }})</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="form-card">
            <header class="form-card__header">
              <div class="form-card__title-group">
                <font-awesome-icon icon="users" class="form-card__icon" />
                <h3 class="form-card__title">{{ t('buildings.form.tenant.title') }}</h3>
              </div>
              <button class="button--small" @click="showAddTenant = !showAddTenant">
                <font-awesome-icon :icon="showAddTenant ? 'times' : 'plus'" />
                {{ showAddTenant ? t('buildings.actions.cancel') : t('buildings.tenant.add') }}
              </button>
            </header>

            <div class="form-card__body">
              <div v-if="tenantsLoading" class="loading-mini">
                <div class="loading-spinner-mini"></div>
                <span>{{ t('buildings.loading') }}</span>
              </div>

              <div v-else-if="tenants.length === 0" class="mockup-placeholder">
                <font-awesome-icon icon="users" class="mockup-placeholder__icon" />
                <p class="mockup-placeholder__text">{{ t('buildings.tenant.noTenants') }}</p>
              </div>

              <div v-else class="tenant-list">
                <div v-for="tenant in tenants" :key="tenant.id" class="tenant-item">
                  <div class="tenant-item__info">
                    <span class="tenant-item__name">{{ tenant.firstName }} {{ tenant.lastName }}</span>
                    <span class="tenant-item__detail">{{ tenant.country }}, {{ tenant.city }}</span>
                    <span v-if="tenant.phoneNumber" class="tenant-item__detail">{{ tenant.phoneNumber }}</span>
                  </div>
                  <button class="tenant-item__delete" @click="handleDeleteTenant(tenant.id)" :title="t('buildings.actions.delete')">
                    <font-awesome-icon icon="trash" />
                  </button>
                </div>
              </div>

              <div v-if="showAddTenant" class="tenant-form">
                <h4 class="tenant-form__title">{{ t('buildings.tenant.add') }}</h4>
                <div class="input-grid">
                  <div class="input-group">
                    <label class="input-label">{{ t('buildings.form.labels.firstName') }}</label>
                    <input v-model="newTenant.firstName" class="input-field" placeholder="Nombre" />
                  </div>
                  <div class="input-group">
                    <label class="input-label">{{ t('buildings.form.labels.lastName') }}</label>
                    <input v-model="newTenant.lastName" class="input-field" placeholder="Apellido" />
                  </div>
                  <div class="input-group">
                    <label class="input-label">{{ t('buildings.form.labels.country') }}</label>
                    <input v-model="newTenant.country" class="input-field" placeholder="País" />
                  </div>
                  <div class="input-group">
                    <label class="input-label">{{ t('buildings.form.labels.city') }}</label>
                    <input v-model="newTenant.city" class="input-field" placeholder="Ciudad" />
                  </div>
                  <div class="input-group input-group--full">
                    <label class="input-label">{{ t('buildings.form.labels.address') }}</label>
                    <input v-model="newTenant.address" class="input-field" placeholder="Dirección" />
                  </div>
                  <div class="input-group">
                    <label class="input-label">{{ t('buildings.form.labels.phone') }}</label>
                    <input v-model="newTenant.phoneNumber" class="input-field" placeholder="Teléfono" />
                  </div>
                </div>
                <p v-if="tenantError" class="form-error">{{ tenantError }}</p>
                <div class="form-card__actions">
                  <button class="button--solid-orange" :disabled="tenantSaving" @click="handleAddTenant">
                    <font-awesome-icon v-if="tenantSaving" icon="spinner" spin />
                    <font-awesome-icon v-else icon="check" />
                    <span>{{ tenantSaving ? t('buildings.actions.saving') : t('buildings.actions.save') }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="form-card form-card--mockup">
            <header class="form-card__header">
              <div class="form-card__title-group">
                <font-awesome-icon icon="network-wired" class="form-card__icon" />
                <h3 class="form-card__title">{{ t('buildings.form.deviceLink.title') }}</h3>
              </div>
              <span class="badge badge--soon">{{ t('common.comingSoon') }}</span>
            </header>

            <div class="form-card__body">
              <div class="mockup-placeholder">
                <font-awesome-icon icon="microchip" class="mockup-placeholder__icon" />
                <p class="mockup-placeholder__text">{{ t('buildings.mockups.deviceLink') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Sidebar -->
        <div class="edit-view__side-col">
          <!-- Metadata & Details Card -->
          <div class="form-card">
            <header class="form-card__header">
              <div class="form-card__title-group">
                <font-awesome-icon icon="list" class="form-card__icon" />
                <h3 class="form-card__title">{{ t('buildings.details.title') }}</h3>
              </div>
            </header>

            <div class="form-card__body details-list">
              <div class="detail-item">
                <span class="detail-item__label">{{ t('buildings.details.propertyCode') }}</span>
                <span class="detail-item__value">{{ property.propertyCode }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-item__label">{{ t('buildings.details.landlord') }}</span>
                <span class="detail-item__value">{{ property.landlord?.firstName }} {{ property.landlord?.lastName }}</span>
              </div>
              <div class="detail-item" v-if="property.landlord?.phoneNumber">
                <span class="detail-item__label">{{ t('buildings.details.contact') }}</span>
                <span class="detail-item__value">{{ property.landlord?.phoneNumber }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-item__label">Created</span>
                <span class="detail-item__value">{{ formatDate(property.createdAt) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-item__label">Last Updated</span>
                <span class="detail-item__value">{{ formatDate(property.updatedAt) }}</span>
              </div>
            </div>
          </div>

          <!-- Preview Card -->
          <div class="preview-card">
            <div class="preview-card__image-container">
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000" :alt="t('buildings.preview.buildingAlt')" class="preview-card__image">
              <div class="preview-card__overlay">
                <span class="preview-card__overlay-text">{{ t('buildings.preview.assetPreview') }}</span>
              </div>
            </div>
            <div class="preview-card__footer">
              <div class="preview-card__location-link">
                <font-awesome-icon icon="map-pin" />
                <span>{{ property.country }}, {{ property.city }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sticky Action Bar (Edit Mode Only) -->
      <transition name="slide-up">
        <div v-if="isEditing" class="sticky-action-bar-edit">
          <div class="sticky-action-bar-edit__left">
            <font-awesome-icon icon="circle-info" class="info-icon" />
            <span>Estás en modo edición</span>
          </div>

          <div class="sticky-action-bar-edit__right">
            <button class="button--text" @click="cancelEditing">Cancelar</button>
            <button class="button--solid-orange" :disabled="saving" @click="saveChanges">
              <font-awesome-icon v-if="saving" icon="spinner" spin class="spinner-icon" />
              <font-awesome-icon v-else icon="check" class="check-icon" />
              <span>{{ saving ? 'Guardando...' : 'Guardar Cambios' }}</span>
            </button>
          </div>
        </div>
      </transition>


    </template>
  </div>
</template>

<style scoped>
.edit-view {
  min-height: 100%;
  background-color: #f5f6f8;
}

.edit-view__loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #718096;
  gap: 16px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #1a237e;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.edit-view__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #e53e3e;
  gap: 16px;
}

.error-icon {
  font-size: 2.5rem;
}

/* Entity Header styling */
.entity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 30px;
}

.entity-header__left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.entity-header__title {
  margin: 0;
  color: #1a237e;
  font-weight: 800;
  font-size: 1.8rem;
}

.entity-code-badge {
  background-color: #e2e8f0;
  color: #475569;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.8rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.8rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-badge--active {
  background-color: #dcfce7;
  color: #15803d;
}
.status-badge--active .status-dot {
  background-color: #16a34a;
}

.status-badge--inactive {
  background-color: #fee2e2;
  color: #b91c1c;
}
.status-badge--inactive .status-dot {
  background-color: #dc2626;
}

.status-badge--maintenance {
  background-color: #fef3c7;
  color: #b45309;
}
.status-badge--maintenance .status-dot {
  background-color: #d97706;
}

.button-icon {
  margin-right: 6px;
}

/* Grid Layout */
.edit-view__grid {
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  gap: 25px;
  padding: 0 30px 100px 30px;
}

.edit-view__form-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.edit-view__side-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Cards Common */
.form-card,
.preview-card {
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.form-card__header {
  padding: 20px;
  border-bottom: 1px solid #f7fafc;
}

.form-card__title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-card__icon {
  color: #1a237e;
  font-size: 1.1rem;
}

.form-card__title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #1a237e;
}

.form-card__body {
  padding: 20px;
}

/* Info Grid / Plain Typography Mode */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.info-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-field--full {
  grid-column: 1 / -1;
}

.info-field__label {
  font-size: 0.75rem;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.info-field__value {
  font-size: 0.95rem;
  color: #1e293b;
  font-weight: 600;
}

.info-field__value--dark {
  color: #1e293b;
  font-weight: 500;
  line-height: 1.5;
}

/* Edit Mode Layout */
.edit-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group--full {
  grid-column: 1 / -1;
}

.form-group--checkbox {
  grid-column: 1 / -1;
  padding: 10px 0;
}

.form-label {
  color: #4a5568;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.form-label-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1a237e;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
}

.form-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.form-input {
  border: 1px solid #e2e8f0;
  padding: 12px;
  border-radius: 6px;
  color: #2d3748;
  font-size: 0.9rem;
  outline: none;
  background-color: #f8fafc;
  transition: border-color 0.2s, background-color 0.2s;
}

.form-input:focus {
  border-color: #1a237e;
  background-color: white;
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

/* Details List */
.details-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-item__label {
  font-size: 0.75rem;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
}

.detail-item__value {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1a237e;
}

/* Buttons */
.button--solid-orange {
  background-color: #e67e22;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.button--solid-orange:hover {
  background-color: #d35400;
}

.button--solid-orange:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button--solid-blue {
  background-color: #1a237e;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
}

.button--text {
  background: none;
  border: none;
  color: #718096;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: color 0.2s;
}

.button--text:hover {
  color: #2d3748;
}

/* Preview Card */
.preview-card__image-container {
  height: 200px;
  position: relative;
}

.preview-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-card__overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
}

.preview-card__overlay-text {
  color: white;
  font-size: 0.85rem;
  font-weight: 700;
}

.preview-card__footer {
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-card__location-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1a237e;
  font-weight: 600;
  font-size: 0.85rem;
}

/* Sticky Action Bar for Edit Mode */
.sticky-action-bar-edit {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  border-top: 1px solid #e2e8f0;
  padding: 16px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.08);
  z-index: 1000;
}

.sticky-action-bar-edit__left {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #475569;
  font-weight: 600;
  font-size: 0.95rem;
}

.sticky-action-bar-edit__left .info-icon {
  color: #e67e22;
}

.sticky-action-bar-edit__right {
  display: flex;
  gap: 16px;
  align-items: center;
}

/* Tenant Elements and Table */
.tenant-table {
  width: 100%;
  border-collapse: collapse;
}

.tenant-table th {
  text-align: left;
  padding: 12px;
  font-size: 0.75rem;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  border-bottom: 2px solid #f1f5f9;
}

.tenant-table td {
  padding: 12px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.tenant-profile-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tenant-avatar-small {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #173183, #2563eb);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
}

.tenant-fullname {
  font-weight: 600;
  color: #1a237e;
  font-size: 0.9rem;
}

.tenant-contact {
  font-size: 0.85rem;
  color: #64748b;
}

.text-right {
  text-align: right !important;
}

.actions-cell {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.action-icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  color: #64748b;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.action-icon-btn:hover {
  color: #1e3a8a;
}

.action-icon-btn--danger:hover {
  color: #ef4444;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  color: #94a3b8;
  gap: 10px;
}

.empty-state__icon {
  font-size: 2.5rem;
}

.empty-state__text {
  font-size: 0.9rem;
  margin: 0;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  color: #64748b;
  gap: 12px;
}

.table-container {
  overflow-x: auto;
  width: 100%;
}

.badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
}

.badge--active {
  background-color: #dcfce7;
  color: #15803d;
}

/* Modal Layouts */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  backdrop-filter: blur(2px);
}

.modal-card {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}

.modal-card--danger {
  border-top: 4px solid #ef4444;
}

.modal-card__header {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f1f5f9;
}

.modal-card__header h3 {
  margin: 0;
  color: #1a237e;
  font-size: 1.15rem;
  font-weight: 700;
}

.modal-card__header--danger h3 {
  color: #ef4444;
}

.modal-card__header .close-btn {
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  color: #94a3b8;
}

.modal-card__body {
  padding: 20px;
}

.modal-card__footer {
  padding: 16px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #f1f5f9;
  background: #f8fafc;
}

.button--solid-danger {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;
}

.button--solid-danger:hover {
  background-color: #dc2626;
}

/* Tenant Details modal styling */
.tenant-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.tenant-details__avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #173183, #1e3a8a);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
}

.tenant-details__name {
  margin: 0;
  font-size: 1.25rem;
  color: #1a237e;
  font-weight: 700;
}

.tenant-details .details-grid {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 15px;
  border-top: 1px solid #f1f5f9;
  padding-top: 15px;
}

.tenant-details .detail-field {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tenant-details .detail-field__label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
}

.tenant-details .detail-field__value {
  font-size: 0.9rem;
  color: #1e293b;
  font-weight: 600;
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

@media (max-width: 1024px) {
  .edit-view__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .info-grid,
  .edit-grid {
    grid-template-columns: 1fr;
  }

  .entity-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 16px 20px;
  }
}

.button--small {
  background: none;
  border: 1px solid #e2e8f0;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #1a237e;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}

.button--small:hover {
  background-color: #f7fafc;
}

.tenant-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tenant-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 12px 16px;
}

.tenant-item__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tenant-item__name {
  font-weight: 700;
  font-size: 0.9rem;
  color: #1a237e;
}

.tenant-item__detail {
  font-size: 0.75rem;
  color: #718096;
}

.tenant-item__delete {
  background: none;
  border: none;
  color: #e53e3e;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  font-size: 0.9rem;
}

.tenant-item__delete:hover {
  background-color: #fed7d7;
}

.tenant-form {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.tenant-form__title {
  margin: 0 0 12px 0;
  font-size: 0.85rem;
  font-weight: 700;
  color: #1a237e;
}

.loading-mini {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 0;
  color: #718096;
  font-size: 0.85rem;
}

.loading-spinner-mini {
  width: 20px;
  height: 20px;
  border: 3px solid #e2e8f0;
  border-top-color: #1a237e;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.form-error {
  color: #e53e3e;
  font-size: 0.8rem;
  margin: 8px 0;
}
</style>
