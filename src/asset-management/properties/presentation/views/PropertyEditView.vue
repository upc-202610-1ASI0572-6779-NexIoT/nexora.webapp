<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppBreadcrumbs from '@/shared/presentation/components/AppBreadcrumbs.vue';

const route = useRoute();
const router = useRouter();
const propertyId = route.params.id || 'PRP-SKYL-402';

const isOccupied = ref(true);

const tenant = ref({
  name: 'Johnathan Wick',
  email: 'j.wick@continental.com'
});

const linkedDevice = ref({
  id: 'GTW-ESP32-A92',
  status: 'Online',
  lastSignal: '2 mins ago'
});

const breadcrumbs = [
  { label: 'Properties', route: '/buildings' },
  { label: 'Edit Property', route: `/buildings/edit/${propertyId}` }
];

const handleUpdateTenant = () => {
  console.log('Updating tenant:', tenant.value);
};

const handleSaveChanges = () => {
  console.log('Saving changes for property:', propertyId);
  router.push('/buildings');
};
</script>

<template>
  <div class="edit-view">
    <AppBreadcrumbs :items="breadcrumbs" />

    <!-- 1. Cabecera -->
    <header class="edit-header">
      <div class="edit-header__main">
        <div class="edit-header__info">
          <h1 class="edit-header__title">Edit Property: Skyline Industrial Hub - Unit 402</h1>
          <div class="edit-header__location">
            <font-awesome-icon icon="map-pin" class="edit-header__location-icon" />
            <span>402 Industrial Way, Logistics District, North Wing</span>
          </div>
        </div>

        <div class="property-id-badge">
          <div class="property-id-badge__label">PROPERTY ID</div>
          <div class="property-id-badge__value">{{ propertyId }}</div>
        </div>
      </div>
    </header>

    <!-- 2. Layout Principal -->
    <div class="edit-view__grid">
      <!-- Columna Izquierda: Formularios -->
      <div class="edit-view__form-col">
        <!-- Tarjeta 1: Tenant Information -->
        <div class="form-card">
          <header class="form-card__header">
            <div class="form-card__title-group">
              <font-awesome-icon icon="user" class="form-card__icon" />
              <h3 class="form-card__title">Tenant Information</h3>
            </div>
          </header>
          
          <div class="form-card__body">
            <div class="input-grid">
              <div class="input-group">
                <label class="input-label">TENANT NAME</label>
                <input type="text" v-model="tenant.name" class="input-field" placeholder="Enter name">
              </div>
              <div class="input-group">
                <label class="input-label">CONTACT EMAIL</label>
                <input type="email" v-model="tenant.email" class="input-field" placeholder="Enter email">
              </div>
            </div>
            
            <div class="form-card__actions">
              <button class="button--solid-blue" @click="handleUpdateTenant">Update Tenant</button>
            </div>
          </div>
        </div>

        <!-- Tarjeta 2: Device Linkage Management -->
        <div class="form-card">
          <header class="form-card__header">
            <div class="form-card__title-group">
              <font-awesome-icon icon="network-wired" class="form-card__icon" />
              <h3 class="form-card__title">Device Linkage Management</h3>
            </div>
          </header>

          <div class="form-card__body">
            <div class="linked-device-panel">
              <div class="linked-device-panel__info">
                <div class="linked-device-panel__icon-box">
                  <font-awesome-icon icon="circle-check" />
                </div>
                <div class="linked-device-panel__texts">
                  <span class="linked-device-panel__label">CURRENT LINKED DEVICE</span>
                  <span class="linked-device-panel__id">ESP32 Gateway ID: {{ linkedDevice.id }}</span>
                  <span class="linked-device-panel__status">Last Signal: {{ linkedDevice.lastSignal }} ... Status: {{ linkedDevice.status }}</span>
                </div>
              </div>
              <div class="linked-device-panel__actions">
                <button class="button--outline-blue">Unlink Device</button>
                <button class="button--outline-blue">Replace Hardware</button>
              </div>
            </div>

            <div class="new-gateway">
              <div class="new-gateway__input-wrapper">
                <input type="text" class="input-field" placeholder="Enter new serial or scan code">
                <font-awesome-icon icon="qrcode" class="new-gateway__qr-icon" />
              </div>
              <button class="button--solid-blue">Link</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Columna Derecha: Estados -->
      <div class="edit-view__side-col">
        <!-- Tarjeta 3: Property Status -->
        <div class="status-card">
          <header class="status-card__header">
            <div class="status-card__title-group">
              <font-awesome-icon icon="chart-line" class="status-card__icon" />
              <h3 class="status-card__title">Property Status</h3>
            </div>
          </header>

          <div class="status-card__body">
            <div class="status-control-box">
              <label class="status-control-box__label">OPERATIONAL STATUS</label>
              <div class="segmented-toggle">
                <button 
                  :class="['toggle-option', { 'toggle-option--active': isOccupied }]"
                  @click="isOccupied = true"
                >
                  Occupied
                </button>
                <button 
                  :class="['toggle-option', { 'toggle-option--active': !isOccupied }]"
                  @click="isOccupied = false"
                >
                  Vacant
                </button>
              </div>
            </div>

            <div class="alert-box--success">
              <font-awesome-icon icon="info-circle" class="alert-box__icon" />
              <p class="alert-box__text">Tenant currently active since Dec 2023.</p>
            </div>
          </div>
        </div>

        <!-- Tarjeta 4: Asset Preview -->
        <div class="preview-card">
          <div class="preview-card__image-container">
            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000" alt="Building Preview" class="preview-card__image">
            <div class="preview-card__overlay">
              <span class="preview-card__overlay-text">ASSET PREVIEW / Unit 402 Exterior</span>
            </div>
          </div>
          <div class="preview-card__footer">
            <div class="preview-card__location-link">
              <font-awesome-icon icon="map-pin" />
              <span>View on Map</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. Barra de Acción Fija -->
    <div class="sticky-action-bar">
      <div class="sticky-action-bar__left">
        <font-awesome-icon icon="triangle-exclamation" class="warning-icon" />
        <span class="auto-save-text">Unsaved changes detected. Last auto-save: 3 minutes ago.</span>
      </div>
      
      <div class="sticky-action-bar__right">
        <button class="button--text" @click="$router.back()">Cancel</button>
        <button class="button--solid-orange" @click="handleSaveChanges">
          <font-awesome-icon icon="check" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.edit-view {
  min-height: 100%;
  background-color: #f5f6f8;
}

/* 1. Header */
.edit-header {
  padding: 0 30px 30px 30px;
}

.edit-header__main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 15px;
}

.edit-header__title {
  margin: 0;
  color: #1a237e;
  font-weight: 800;
  font-size: 1.8rem;
}

.edit-header__location {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4a5568;
  margin-top: 5px;
  font-size: 0.95rem;
}

.edit-header__location-icon {
  color: #a0aec0;
}

.property-id-badge {
  background-color: #f0f2f5;
  border: 1px solid #e2e8f0;
  padding: 10px 15px;
  border-radius: 6px;
  display: flex;
  gap: 15px;
  align-items: center;
}

.property-id-badge__label {
  font-size: 0.65rem;
  color: #a0aec0;
  font-weight: 800;
}

.property-id-badge__value {
  color: #1a237e;
  font-weight: 700;
  font-size: 0.95rem;
}

/* 2. Layout Grid */
.edit-view__grid {
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  gap: 25px;
  padding: 0 30px 100px 30px;
}

/* Cards Common */
.form-card, .status-card, .preview-card {
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.form-card__header, .status-card__header {
  padding: 20px;
  border-bottom: 1px solid #f7fafc;
}

.form-card__title-group, .status-card__title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-card__icon, .status-card__icon {
  color: #1a237e;
  font-size: 1.1rem;
}

.form-card__title, .status-card__title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #1a237e;
}

.form-card__body, .status-card__body {
  padding: 20px;
}

/* Inputs */
.input-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-size: 0.7rem;
  font-weight: 800;
  color: #718096;
}

.input-field {
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #1a237e;
  outline: none;
}

.input-field:focus {
  border-color: #1a237e;
}

.form-card__actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

/* Buttons */
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

.button--outline-blue {
  background-color: white;
  border: 1px solid #1a237e;
  color: #1a237e;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
}

.button--solid-orange {
  background-color: #f47b20;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.button--text {
  background: none;
  border: none;
  color: #4a5568;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
}

/* Device Panel */
.linked-device-panel {
  background-color: #f7fafc;
  border: 1px solid #e2e8f0;
  padding: 20px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.linked-device-panel__info {
  display: flex;
  gap: 15px;
  align-items: center;
}

.linked-device-panel__icon-box {
  width: 40px;
  height: 40px;
  background-color: #22543d;
  color: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.linked-device-panel__texts {
  display: flex;
  flex-direction: column;
}

.linked-device-panel__label {
  font-size: 0.65rem;
  color: #718096;
  font-weight: 800;
}

.linked-device-panel__id {
  color: #1a237e;
  font-weight: 700;
  font-size: 0.95rem;
}

.linked-device-panel__status {
  font-size: 0.75rem;
  color: #718096;
}

.linked-device-panel__actions {
  display: flex;
  gap: 10px;
}

.new-gateway {
  display: flex;
  gap: 10px;
}

.new-gateway__input-wrapper {
  flex: 1;
  position: relative;
}

.new-gateway__input-wrapper .input-field {
  width: 100%;
  padding-right: 40px;
}

.new-gateway__qr-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #a0aec0;
  cursor: pointer;
}

/* Status Card */
.status-control-box {
  background-color: #f8fafc;
  border: 1px solid #edf2f7;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
}

.status-control-box__label {
  display: block;
  font-size: 0.7rem;
  font-weight: 800;
  color: #a0aec0;
  margin-bottom: 10px;
}

.segmented-toggle {
  background-color: #e2e8f0;
  border-radius: 30px;
  display: flex;
  padding: 4px;
  gap: 4px;
}

.toggle-option {
  flex: 1;
  border: none;
  background: transparent;
  padding: 8px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #718096;
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-option--active {
  background-color: #f47b20;
  color: white;
  box-shadow: 0 2px 4px rgba(244, 123, 32, 0.3);
}

.alert-box--success {
  background-color: #f0fff4;
  border: 1px solid #c6f6d5;
  padding: 12px;
  border-radius: 6px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.alert-box__icon {
  color: #38a169;
}

.alert-box__text {
  margin: 0;
  font-size: 0.8rem;
  color: #22543d;
  font-weight: 600;
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
  font-weight: 800;
  font-size: 0.85rem;
  cursor: pointer;
}

.preview-card__external-icon {
  color: #a0aec0;
}

/* 5. Sticky Action Bar */
.sticky-action-bar {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #f5f6f8;
  border-top: 2px solid #e2e8f0;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
  margin-left: -30px; /* Offset parent padding */
  margin-right: -30px;
  margin-top: 30px;
}

.sticky-action-bar__left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.warning-icon {
  color: #d32f2f;
}

.auto-save-text {
  font-size: 0.8rem;
  color: #718096;
  font-weight: 600;
}

.sticky-action-bar__right {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* Responsive */
@media (max-width: 1024px) {
  .edit-view__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .input-grid {
    grid-template-columns: 1fr;
  }
}
</style>