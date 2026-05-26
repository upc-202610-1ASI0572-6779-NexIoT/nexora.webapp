<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import AppBreadcrumbs from '@/shared/presentation/components/AppBreadcrumbs.vue';

const router = useRouter();

const formData = reactive({
  name: '',
  type: '',
  zoning: '',
  address: '',
  gateways: [
    {
      id: 1,
      name: 'Main Control Unit - A1',
      mac: '00:1A:C2:7B:00:44',
      signal: 'Strong',
      status: 'linked'
    }
  ]
});

const breadcrumbs = [
  { label: 'Properties', route: '/buildings' },
  { label: 'New Registration', route: '/buildings/new' }
];

const handleLinkDevice = () => {
  // Logic to link device
};

const handleRemoveGateway = (id) => {
  formData.gateways = formData.gateways.filter(g => g.id !== id);
};

const handleCreateProperty = () => {
  // Logic to save property
  router.push('/buildings');
};
</script>

<template>
  <div class="registration-view">
    <AppBreadcrumbs :items="breadcrumbs" />

    <div class="registration-view__grid">
      <!-- Left Column: Form -->
      <div class="registration-view__form-col">
        <!-- General Information -->
        <div class="form-card">
          <header class="form-card__header">
            <div class="form-card__icon-info">
              <font-awesome-icon icon="info-circle" />
            </div>
            <h2 class="form-card__title">General Information</h2>
          </header>

          <div class="form-card__body">
            <div class="form-group">
              <label class="form-label">PROPERTY NAME</label>
              <input 
                v-model="formData.name" 
                type="text" 
                class="form-input" 
                placeholder="e.g. Skyline Industrial Hub"
              >
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">PROPERTY TYPE</label>
                <select v-model="formData.type" class="form-input">
                  <option value="" disabled>Select type...</option>
                  <option value="industrial">Industrial</option>
                  <option value="commercial">Commercial</option>
                  <option value="residential">Residential</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">ZONING CODE</label>
                <input 
                  v-model="formData.zoning" 
                  type="text" 
                  class="form-input" 
                  placeholder="e.g. IND-4"
                >
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">PHYSICAL ADDRESS</label>
              <div class="input-with-icon">
                <font-awesome-icon icon="map-pin" class="input-with-icon__icon" />
                <input 
                  v-model="formData.address" 
                  type="text" 
                  class="form-input" 
                  placeholder="Enter full address..."
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Hardware Gateways -->
        <div class="form-card">
          <header class="form-card__header">
            <div class="form-card__title-group">
              <font-awesome-icon icon="network-wired" class="form-card__icon" />
              <h2 class="form-card__title">Hardware Gateways</h2>
            </div>
            <button class="button--outline-small">+ ADD GATEWAY</button>
          </header>

          <div class="form-card__body">
            <div v-for="gateway in formData.gateways" :key="gateway.id" class="linked-device-item">
              <div class="linked-device-item__icon-box">
                <font-awesome-icon icon="network-wired" />
              </div>
              <div class="linked-device-item__info">
                <span class="linked-device-item__name">{{ gateway.name }}</span>
                <span class="linked-device-item__details">MAC: {{ gateway.mac }} • Signal: {{ gateway.signal }}</span>
              </div>
              <div class="linked-device-item__actions">
                <span class="badge--linked">✓ LINKED</span>
                <button class="button--icon-danger" @click="handleRemoveGateway(gateway.id)">
                  <font-awesome-icon icon="trash" />
                </button>
              </div>
            </div>

            <div class="device-link-input">
              <div class="device-link-input__qr">
                <font-awesome-icon icon="qrcode" />
              </div>
              <input type="text" placeholder="Enter Serial Number..." class="device-link-input__field">
              <button class="button--solid-brown" @click="handleLinkDevice">LINK DEVICE</button>
            </div>

            <p class="form-helper-text">
              <font-awesome-icon icon="circle-question" />
              <span>Linking a gateway allows real-time telemetry from all sub-sensors.</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Right Column: Sidebar -->
      <div class="registration-view__side-col">
        <!-- Asset Preview -->
        <div class="asset-preview-card">
          <span class="asset-preview-card__kicker">ASSET PREVIEW</span>
          <div class="asset-preview-card__image-container">
            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&auto=format&fit=crop" alt="Property Preview" class="placeholder-image">
          </div>
          <h3 class="asset-preview-card__title">{{ formData.name || 'Property Name' }}</h3>
          <div class="asset-preview-card__location">
            <font-awesome-icon icon="map-pin" />
            <span>{{ formData.address || 'Address not set' }}</span>
          </div>
          <div class="asset-preview-card__stats">
            <div class="asset-preview-card__stat">
              <span class="asset-preview-card__stat-label">STATUS</span>
              <span class="asset-preview-card__stat-value">Draft</span>
            </div>
            <div class="asset-preview-card__stat">
              <span class="asset-preview-card__stat-label">DEVICES</span>
              <span class="asset-preview-card__stat-value">{{ formData.gateways.length }} Linked</span>
            </div>
          </div>
        </div>

        <!-- Action Panel -->
        <div class="action-panel-card">
          <button class="button--solid-brown button--large" @click="handleCreateProperty">Create Property</button>
          <button class="button--outline-blue button--large">Save as Draft</button>
          <button class="button--text-only" @click="$router.back()">DISCARD CHANGES</button>
        </div>

        <!-- Regulatory Compliance -->
        <div class="alert-card--success">
          <div class="alert-card__icon">
            <font-awesome-icon icon="shield" />
          </div>
          <div class="alert-card__content">
            <h4 class="alert-card__title">Regulatory Compliance</h4>
            <p class="alert-card__description">All IoT devices registered must comply with local frequency regulations and data privacy standards.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.registration-view {
  min-height: 100%;
  background-color: #f5f6f8;
}

.registration-view__grid {
  padding: 10px 30px 30px 30px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 25px;
  align-items: start;
}

.registration-view__form-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.registration-view__side-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Form Card */
.form-card {
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 25px;
}

.form-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.form-card__title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-card__icon-info {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #ebf8ff;
  color: #3182ce;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.form-card__icon {
  color: #1a237e;
  font-size: 1.2rem;
}

.form-card__title {
  margin: 0;
  color: #1a237e;
  font-weight: 700;
  font-size: 1.2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 15px;
}

.form-label {
  color: #4a5568;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.form-input {
  border: 1px solid #e2e8f0;
  padding: 12px;
  border-radius: 4px;
  color: #2d3748;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: #1a237e;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-icon__icon {
  position: absolute;
  left: 12px;
  color: #a0aec0;
}

.input-with-icon .form-input {
  padding-left: 35px;
  width: 100%;
}

/* Gateway items */
.linked-device-item {
  background-color: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
}

.linked-device-item__icon-box {
  width: 40px;
  height: 40px;
  background-color: #1a237e;
  color: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.linked-device-item__info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.linked-device-item__name {
  font-weight: 700;
  color: #1a237e;
  font-size: 0.9rem;
}

.linked-device-item__details {
  font-size: 0.8rem;
  color: #718096;
}

.linked-device-item__actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.badge--linked {
  background-color: #c6f6d5;
  color: #22543d;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
}

.button--icon-danger {
  background: none;
  border: none;
  color: #e53e3e;
  cursor: pointer;
  padding: 5px;
  transition: opacity 0.2s;
}

/* Device link input */
.device-link-input {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  border: 1px dashed #cbd5e0;
  padding: 10px;
  border-radius: 6px;
  align-items: center;
}

.device-link-input__qr {
  width: 40px;
  height: 40px;
  background-color: #edf2f7;
  color: #4a5568;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.device-link-input__field {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.9rem;
}

.form-helper-text {
  margin-top: 15px;
  font-size: 0.8rem;
  color: #718096;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Asset Preview Card */
.asset-preview-card {
  background-color: #1a237e;
  color: white;
  border-radius: 8px;
  padding: 25px;
}

.asset-preview-card__kicker {
  font-size: 11px;
  font-weight: 700;
  color: #a0aec0;
  letter-spacing: 1px;
}

.asset-preview-card__image-container {
  width: 100%;
  height: 120px;
  margin: 15px 0;
  border-radius: 4px;
  overflow: hidden;
}

.placeholder-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.asset-preview-card__title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.asset-preview-card__location {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  color: #a0aec0;
  font-size: 0.9rem;
}

.asset-preview-card__stats {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 20px;
  padding-top: 15px;
}

.asset-preview-card__stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.asset-preview-card__stat-label {
  font-size: 10px;
  font-weight: 700;
  color: #a0aec0;
}

.asset-preview-card__stat-value {
  font-weight: 700;
  font-size: 0.9rem;
}

/* Action Panel */
.action-panel-card {
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.button--large {
  padding: 14px;
  font-size: 1rem;
}

.button--solid-brown {
  background-color: #9c4200;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  padding: 10px 20px;
}

.button--outline-blue {
  background-color: white;
  border: 2px solid #1a237e;
  color: #1a237e;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
}

.button--outline-small {
  background-color: white;
  border: 1px solid #e2e8f0;
  color: #1a237e;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}

.button--text-only {
  background: none;
  border: none;
  color: #718096;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
}

/* Alert Card */
.alert-card--success {
  background-color: #f0fff4;
  border-left: 4px solid #38a169;
  padding: 15px;
  display: flex;
  gap: 12px;
  border-radius: 4px;
}

.alert-card__icon {
  color: #38a169;
  font-size: 1.2rem;
}

.alert-card__title {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 700;
  color: #22543d;
}

.alert-card__description {
  margin: 4px 0 0;
  font-size: 0.8rem;
  color: #2d3748;
  line-height: 1.4;
}
</style>