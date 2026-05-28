<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import AppBreadcrumbs from '@/shared/presentation/components/AppBreadcrumbs.vue';

const router = useRouter();

const formData = reactive({
  name: '',
  serialNumber: '',
  type: 'gateway',
  propertyId: '',
  macAddress: '',
  firmware: 'v1.0.0',
  protocol: 'mqtt'
});

const breadcrumbs = [
  { label: 'Devices', route: '/devices' },
  { label: 'New Registration', route: '/devices/new' }
];

const handleRegisterDevice = () => {
  // Logic to save device
  console.log('Registering device:', formData);
  router.push('/devices');
};

const properties = [
  { id: 1, name: 'Skyline Industrial Hub' },
  { id: 2, name: 'Eco-Park Complex' },
  { id: 3, name: 'Downtown Tech Center' }
];
</script>

<template>
  <div class="registration-view">
    <AppBreadcrumbs :items="breadcrumbs" />

    <div class="registration-view__grid">
      <!-- Left Column: Form -->
      <div class="registration-view__form-col">
        <!-- Hardware Identification -->
        <div class="form-card">
          <header class="form-card__header">
            <div class="form-card__icon-info">
              <font-awesome-icon icon="microchip" />
            </div>
            <h2 class="form-card__title">Hardware Identification</h2>
          </header>

          <div class="form-card__body">
            <div class="form-group">
              <label class="form-label">DEVICE ALIAS / NAME</label>
              <input 
                v-model="formData.name" 
                type="text" 
                class="form-input" 
                placeholder="e.g. South Wing Gateway - 01"
              >
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">SERIAL NUMBER (S/N)</label>
                <div class="input-with-icon">
                  <font-awesome-icon icon="qrcode" class="input-with-icon__icon" />
                  <input 
                    v-model="formData.serialNumber" 
                    type="text" 
                    class="form-input" 
                    placeholder="ESP32-XXXX-XXXX"
                  >
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">DEVICE TYPE</label>
                <select v-model="formData.type" class="form-input">
                  <option value="gateway">IoT Gateway (ESP32)</option>
                  <option value="sensor">Sensor Node</option>
                  <option value="actuator">Actuator Control</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Network & Deployment -->
        <div class="form-card">
          <header class="form-card__header">
            <div class="form-card__title-group">
              <font-awesome-icon icon="network-wired" class="form-card__icon" />
              <h2 class="form-card__title">Network & Deployment</h2>
            </div>
          </header>

          <div class="form-card__body">
            <div class="form-group">
              <label class="form-label">ASSIGN TO PROPERTY</label>
              <select v-model="formData.propertyId" class="form-input">
                <option value="" disabled>Select a property...</option>
                <option v-for="prop in properties" :key="prop.id" :value="prop.id">
                  {{ prop.name }}
                </option>
              </select>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">MAC ADDRESS</label>
                <input 
                  v-model="formData.macAddress" 
                  type="text" 
                  class="form-input" 
                  placeholder="00:00:00:00:00:00"
                >
              </div>
              <div class="form-group">
                <label class="form-label">COMMS PROTOCOL</label>
                <select v-model="formData.protocol" class="form-input">
                  <option value="mqtt">MQTT over TLS</option>
                  <option value="ws">WebSockets</option>
                  <option value="http">HTTP Rest API</option>
                </select>
              </div>
            </div>

            <p class="form-helper-text">
              <font-awesome-icon icon="circle-info" />
              <span>Ensure the device is powered on and in 'Provisioning Mode' before linking.</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Right Column: Sidebar -->
      <div class="registration-view__side-col">
        <!-- Device Preview -->
        <div class="asset-preview-card">
          <span class="asset-preview-card__kicker">NODE PREVIEW</span>
          <div class="device-avatar">
            <font-awesome-icon :icon="formData.type === 'gateway' ? 'microchip' : 'signal'" />
          </div>
          <h3 class="asset-preview-card__title">{{ formData.name || 'Device Alias' }}</h3>
          <div class="asset-preview-card__location">
            <font-awesome-icon icon="tag" />
            <span>{{ formData.serialNumber || 'No Serial Set' }}</span>
          </div>
          
          <div class="asset-preview-card__stats">
            <div class="asset-preview-card__stat">
              <span class="asset-preview-card__stat-label">PROTOCOL</span>
              <span class="asset-preview-card__stat-value">{{ formData.protocol.toUpperCase() }}</span>
            </div>
            <div class="asset-preview-card__stat">
              <span class="asset-preview-card__stat-label">FIRMWARE</span>
              <span class="asset-preview-card__stat-value">{{ formData.firmware }}</span>
            </div>
          </div>
        </div>

        <!-- Action Panel -->
        <div class="action-panel-card">
          <button class="button--solid-orange button--large" @click="handleRegisterDevice">Register Device</button>
          <button class="button--outline-blue button--large">Provision via QR</button>
          <button class="button--text-only" @click="$router.back()">DISCARD CHANGES</button>
        </div>

        <!-- Provisioning Tip -->
        <div class="alert-card--info">
          <div class="alert-card__icon">
            <font-awesome-icon icon="lightbulb" />
          </div>
          <div class="alert-card__content">
            <h4 class="alert-card__title">Provisioning Tip</h4>
            <p class="alert-card__description">You can use the Nexora Mobile App to scan the device QR code for automatic provisioning.</p>
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
  background-color: #fff7ed;
  color: #f97316;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.form-card__icon {
  color: #1a3673;
  font-size: 1.2rem;
}

.form-card__title {
  margin: 0;
  color: #1a3673;
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
  border-color: #f97316;
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
  background-color: #1a3673;
  color: white;
  border-radius: 8px;
  padding: 25px;
  text-align: center;
}

.asset-preview-card__kicker {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 1px;
}

.device-avatar {
  width: 80px;
  height: 80px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px auto;
  font-size: 2.5rem;
  color: #f97316;
}

.asset-preview-card__title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
}

.asset-preview-card__location {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
}

.asset-preview-card__stats {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 25px;
  padding-top: 20px;
}

.asset-preview-card__stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.asset-preview-card__stat-label {
  font-size: 10px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
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

.button--solid-orange {
  background-color: #f97316;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s;
}

.button--solid-orange:hover {
  background-color: #ea580c;
}

.button--outline-blue {
  background-color: white;
  border: 2px solid #1a3673;
  color: #1a3673;
  border-radius: 6px;
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
.alert-card--info {
  background-color: #eff6ff;
  border-left: 4px solid #3b82f6;
  padding: 15px;
  display: flex;
  gap: 12px;
  border-radius: 4px;
}

.alert-card__icon {
  color: #3b82f6;
  font-size: 1.2rem;
}

.alert-card__title {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 700;
  color: #1e3a8a;
}

.alert-card__description {
  margin: 4px 0 0;
  font-size: 0.8rem;
  color: #1e40af;
  line-height: 1.4;
}
</style>