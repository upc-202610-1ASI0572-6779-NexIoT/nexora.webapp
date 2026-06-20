<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const deviceId = computed(() => route.params.deviceId || 'NODE-ESP32-V4');

// Mock data for the view
const connection = ref({
  ssid: 'NEXORA_INDUSTRIAL_5G',
  ip: '192.168.1.142',
  mac: '4A:55:BC:E2:01:99',
  protocol: 'MQTT over TLS'
});

const hardware = ref({
  firmware: 'v4.2.1-stable',
  rev: 'REV-C (Q4 2023)',
  frequency: '240 MHz (Dual Core)',
  temp: '42.5°C'
});

const logs = ref([
  { id: 1, type: 'success', title: 'Calibration Successful', desc: 'Internal sensor range adjusted to ±0.2°C.', time: '10:42 AM' },
  { id: 2, type: 'warning', title: 'Fringe Signal Detected', desc: 'RSSI dropped below -75dBm for 12 seconds.', time: '09:15 AM' },
  { id: 3, type: 'info', title: 'Routine Heartbeat', desc: 'System status report sent to main gateway.', time: '08:00 AM' }
]);

const metrics = ref([
  { label: 'AVG TEMP', value: '24.2°C', trend: '~0.4', trendDir: 'up', trendColor: 'green' },
  { label: 'PEAK LOAD', value: '82%', trend: '~2.1', trendDir: 'up', trendColor: 'red' },
  { label: 'RAM USAGE', value: '124KB', trend: 'STABLE', trendColor: 'gray' },
  { label: 'PACKET LOSS', value: '0.02%', trend: 'OPTIMAL', trendColor: 'green' }
]);
</script>

<template>
  <div class="device-details">
    <!-- 1. Cabecera de Entidad -->
    <header class="entity-header">
      <nav class="breadcrumbs">
        <span class="breadcrumbs__item">DEVICES</span>
        <span class="breadcrumbs__separator">></span>
        <span class="breadcrumbs__item">{{ deviceId }}</span>
        <span class="breadcrumbs__separator">></span>
        <span class="breadcrumbs__item breadcrumbs__item--active">SENS-0822-T2</span>
      </nav>

      <div class="entity-header__main">
        <h1 class="entity-header__title">ESP32 Temperature Sensor</h1>
        <button class="button--solid-orange">
          <font-awesome-icon icon="sliders" />
          <span>Calibrate Sensor</span>
        </button>
      </div>
    </header>

    <!-- 2. Fila 1: Estado Principal -->
    <div class="status-row">
      <!-- Panel Izquierdo: Telemetría -->
      <div class="live-telemetry-card">
        <div class="live-telemetry-card__header">
          <span class="kicker">LIVE TELEMETRY</span>
          <span class="badge--active">● ACTIVE</span>
        </div>
        <h2 class="live-telemetry-card__title">Environmental Stability</h2>
        
        <div class="telemetry-grid">
          <div class="telemetry-col">
            <span class="telemetry-col__label">UPTIME</span>
            <span class="telemetry-col__value telemetry-col__value--giant">142h</span>
            <span class="telemetry-col__sub">32m 14s</span>
          </div>
          <div class="telemetry-col">
            <span class="telemetry-col__label">SIGNAL (RSSI)</span>
            <span class="telemetry-col__value telemetry-col__value--giant">-64dBm</span>
            <span class="telemetry-col__sub telemetry-col__sub--success">EXCELLENT</span>
          </div>
          <div class="telemetry-col">
            <span class="telemetry-col__label">HEALTH</span>
            <span class="telemetry-col__value telemetry-col__value--giant telemetry-col__value--success">98.2%</span>
            <span class="telemetry-col__sub">NOMINAL OPS</span>
          </div>
        </div>
      </div>

      <!-- Panel Derecho: Conexión -->
      <div class="connection-details-card">
        <span class="kicker kicker--pale">CONNECTION DETAILS</span>
        
        <div class="data-list">
          <div class="data-list__row">
            <span class="data-list__label">SSID</span>
            <span class="data-list__value">{{ connection.ssid }}</span>
          </div>
          <div class="data-list__row">
            <span class="data-list__label">IP Address</span>
            <span class="data-list__value">{{ connection.ip }}</span>
          </div>
          <div class="data-list__row">
            <span class="data-list__label">MAC Address</span>
            <span class="data-list__value">{{ connection.mac }}</span>
          </div>
          <div class="data-list__row">
            <span class="data-list__label">Protocol</span>
            <span class="data-list__value">{{ connection.protocol }}</span>
          </div>
        </div>

        <footer class="connection-details-card__footer">
          <font-awesome-icon icon="rotate" class="sync-icon" />
          <div class="sync-texts">
            <span class="sync-label">LAST SYNC</span>
            <span class="sync-value">2 seconds ago</span>
          </div>
        </footer>
      </div>
    </div>

    <!-- 3. Fila 2: Analítica -->
    <section class="analytics-card">
      <header class="analytics-card__header">
        <h3 class="analytics-card__title">High-Density Sensor Analytics</h3>
        <div class="segmented-control">
          <button class="segmented-control__btn">1H</button>
          <button class="segmented-control__btn segmented-control__btn--active">24H</button>
          <button class="segmented-control__btn">7D</button>
        </div>
      </header>

      <div class="metrics-grid">
        <div v-for="metric in metrics" :key="metric.label" class="metric-box">
          <span class="metric-box__label">{{ metric.label }}</span>
          <span class="metric-box__value">{{ metric.value }}</span>
          <span :class="['metric-box__trend', `metric-box__trend--${metric.trendColor}`]">
            {{ metric.trendDir === 'up' ? '↑' : '' }} {{ metric.trend }}
          </span>
        </div>
      </div>

      <div class="oscilloscope-viz">
        <div class="oscilloscope-viz__content">
          <font-awesome-icon icon="wave-square" class="oscilloscope-viz__icon" />
          <span class="oscilloscope-viz__title">Real-time Oscilloscope Visualization</span>
          <span class="oscilloscope-viz__subtitle">Telemetry streaming at 10Hz via WebSockets</span>
        </div>
        <!-- Mock SVG Waves -->
        <svg class="oscilloscope-viz__waves" viewBox="0 0 800 100" preserveAspectRatio="none">
          <path d="M0,50 Q100,20 200,50 T400,50 T600,50 T800,50" fill="none" stroke="rgba(244, 123, 32, 0.3)" stroke-width="2" />
          <path d="M0,60 Q150,30 300,60 T600,60 T800,60" fill="none" stroke="rgba(26, 35, 126, 0.2)" stroke-width="2" />
        </svg>
      </div>
    </section>

    <!-- 4. Fila 3: Logs y Hardware -->
    <div class="logs-hardware-row">
      <!-- Panel Izquierdo: Event Logs -->
      <div class="event-logs-card">
        <span class="kicker">SYSTEM EVENT LOGS</span>
        
        <div class="log-list">
          <div v-for="log in logs" :key="log.id" class="log-item">
            <div :class="['log-item__icon-box', `log-item__icon-box--${log.type}`]">
              <font-awesome-icon v-if="log.type === 'success'" icon="circle-check" />
              <font-awesome-icon v-if="log.type === 'warning'" icon="triangle-exclamation" />
              <font-awesome-icon v-if="log.type === 'info'" icon="circle-info" />
            </div>
            <div class="log-item__content">
              <span class="log-item__title">{{ log.title }}</span>
              <p class="log-item__desc">{{ log.desc }}</p>
            </div>
            <span class="log-item__time">{{ log.time }}</span>
          </div>
        </div>

        <button class="button--outline-fullwidth">VIEW ALL LOGS</button>
      </div>

      <!-- Panel Derecho: Hardware Profile -->
      <div class="hardware-profile-card">
        <span class="kicker">HARDWARE PROFILE</span>
        
        <div class="profile-grid">
          <div class="profile-item">
            <span class="profile-item__label">FIRMWARE VERSION</span>
            <span class="profile-item__value">{{ hardware.firmware }}</span>
          </div>
          <div class="profile-item">
            <span class="profile-item__label">HARDWARE REV</span>
            <span class="profile-item__value">{{ hardware.rev }}</span>
          </div>
          <div class="profile-item">
            <span class="profile-item__label">CORE FREQUENCY</span>
            <span class="profile-item__value">{{ hardware.frequency }}</span>
          </div>
          <div class="profile-item">
            <span class="profile-item__label">CHIP TEMP</span>
            <span class="profile-item__value">{{ hardware.temp }}</span>
          </div>
        </div>

        <div class="hardware-actions">
          <button class="button--solid-blue">
            <font-awesome-icon icon="microchip" />
            <span>FIRMWARE UPDATE</span>
          </button>
          <button class="button--outline-blue">
            <font-awesome-icon icon="rotate" />
            <span>HARD REBOOT</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.device-details {
  padding: 25px 30px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* Common Components */
.kicker {
  font-size: 0.7rem;
  font-weight: 800;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
}

.kicker--pale {
  color: #a0aec0;
}

/* 1. Entity Header */
.entity-header {
  margin-bottom: 5px;
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.65rem;
  color: #4a5568;
  text-transform: uppercase;
  font-weight: 700;
}

.breadcrumbs__item--active {
  color: #1a237e;
}

.entity-header__main {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 15px;
}

.entity-header__title {
  margin: 0;
  color: #1a237e;
  font-weight: 800;
  font-size: 1.8rem;
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
  font-size: 0.9rem;
}

/* 2. Status Row */
.status-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.live-telemetry-card {
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 25px;
}

.live-telemetry-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.badge--active {
  background-color: #f0fff4;
  color: #38a169;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 800;
}

.live-telemetry-card__title {
  margin: 0;
  color: #1a237e;
  font-size: 1.5rem;
  font-weight: 700;
}

.telemetry-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 30px;
  text-align: center;
}

.telemetry-col {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.telemetry-col:not(:last-child) {
  border-right: 1px solid #edf2f7;
}

.telemetry-col__label {
  font-size: 0.7rem;
  font-weight: 800;
  color: #718096;
}

.telemetry-col__value--giant {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1a237e;
  line-height: 1;
}

.telemetry-col__value--success {
  color: #38a169;
}

.telemetry-col__sub {
  font-size: 0.75rem;
  color: #a0aec0;
  font-weight: 700;
}

.telemetry-col__sub--success {
  color: #38a169;
}

.connection-details-card {
  background-color: #1a237e;
  color: white;
  border-radius: 8px;
  padding: 25px;
  display: flex;
  flex-direction: column;
}

.data-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}

.data-list__row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.data-list__label {
  color: #a0aec0;
}

.data-list__value {
  font-weight: 700;
}

.connection-details-card__footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
  padding-top: 15px;
  display: flex;
  gap: 15px;
  align-items: center;
}

.sync-icon {
  color: #f47b20;
  font-size: 1.2rem;
}

.sync-texts {
  display: flex;
  flex-direction: column;
}

.sync-label {
  font-size: 0.65rem;
  color: #a0aec0;
  font-weight: 800;
}

.sync-value {
  font-size: 0.85rem;
  font-weight: 400;
}

/* 3. Analytics Section */
.analytics-card {
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 25px;
}

.analytics-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.analytics-card__title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a237e;
}

.segmented-control {
  background-color: #f7fafc;
  border-radius: 6px;
  padding: 4px;
  display: flex;
  gap: 4px;
}

.segmented-control__btn {
  border: none;
  background: transparent;
  padding: 6px 15px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #718096;
  cursor: pointer;
}

.segmented-control__btn--active {
  background-color: #1a237e;
  color: white;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
}

.metric-box {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.metric-box__label {
  font-size: 0.7rem;
  font-weight: 800;
  color: #718096;
}

.metric-box__value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a237e;
}

.metric-box__trend {
  font-size: 0.75rem;
  font-weight: 700;
}

.metric-box__trend--green { color: #38a169; }
.metric-box__trend--red { color: #d32f2f; }
.metric-box__trend--gray { color: #a0aec0; }

.oscilloscope-viz {
  border: 1px dashed #cbd5e0;
  background-color: #f7fafc;
  height: 200px;
  border-radius: 6px;
  margin-top: 20px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.oscilloscope-viz__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  z-index: 5;
}

.oscilloscope-viz__icon {
  font-size: 2rem;
  color: #1a237e;
}

.oscilloscope-viz__title {
  font-weight: 700;
  color: #1a237e;
}

.oscilloscope-viz__subtitle {
  font-size: 0.8rem;
  color: #718096;
}

.oscilloscope-viz__waves {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
}

/* 4. Logs and Hardware Row */
.logs-hardware-row {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 20px;
}

.event-logs-card, .hardware-profile-card {
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 25px;
}

.log-list {
  display: flex;
  flex-direction: column;
  margin-top: 15px;
}

.log-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 15px;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #edf2f7;
}

.log-item__icon-box {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.log-item__icon-box--success { background-color: #f0fff4; color: #38a169; }
.log-item__icon-box--warning { background-color: #fffaf0; color: #f47b20; }
.log-item__icon-box--info { background-color: #ebf8ff; color: #3182ce; }

.log-item__content {
  display: flex;
  flex-direction: column;
}

.log-item__title {
  font-weight: 700;
  font-size: 0.9rem;
  color: #1a237e;
}

.log-item__desc {
  margin: 2px 0 0;
  font-size: 0.8rem;
  color: #718096;
}

.log-item__time {
  font-size: 0.75rem;
  color: #a0aec0;
  font-weight: 700;
}

.button--outline-fullwidth {
  width: 100%;
  background: white;
  border: 1px solid #1a237e;
  color: #1a237e;
  padding: 12px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.85rem;
  margin-top: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin: 20px 0 30px;
}

.profile-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.profile-item__label {
  font-size: 0.65rem;
  font-weight: 800;
  color: #a0aec0;
}

.profile-item__value {
  font-weight: 700;
  color: #1a237e;
  font-size: 0.9rem;
}

.hardware-actions {
  display: flex;
  gap: 15px;
}

.hardware-actions button {
  flex: 1;
}

.button--solid-blue {
  background-color: #1a237e;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.8rem;
}

.button--outline-blue {
  background-color: white;
  border: 1px solid #1a237e;
  color: #1a237e;
  padding: 12px;
  border-radius: 6px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.8rem;
}

/* Responsive */
@media (max-width: 1200px) {
  .status-row, .logs-hardware-row {
    grid-template-columns: 1fr;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 600px) {
  .entity-header__main {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .telemetry-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .telemetry-col:not(:last-child) {
    border-right: none;
    border-bottom: 1px solid #edf2f7;
    padding-bottom: 15px;
  }
}
</style>