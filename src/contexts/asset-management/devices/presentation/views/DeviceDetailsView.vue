<script setup>
import { ref, onMounted, onUnmounted, computed, watch, inject } from 'vue';
import { useRoute } from 'vue-router';
import { useDevicesStore } from '../store/devicesStore';
import { useAuthStore } from '@/contexts/iam/auth/presentation/store/authStore';
import apiClient from '@/shared/infrastructure/http/apiClient';

const route = useRoute();
const devicesStore = useDevicesStore();
const authStore = useAuthStore();
const globalBreadcrumbs = inject('globalBreadcrumbs', null);
const deviceId = computed(() => route.params.deviceId);
const isRebooting = ref(false);
const isCalibrating = ref(false);
const isUpdatingFirmware = ref(false);

const relativeLastSync = ref('Never');
let syncInterval = null;

const updateRelativeLastSync = () => {
  if (!device.value?.lastSyncAt) {
    relativeLastSync.value = 'Never';
    return;
  }
  const diffMs = Date.now() - new Date(device.value.lastSyncAt).getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  if (diffSecs < 0) {
    relativeLastSync.value = 'Just now';
  } else if (diffSecs < 5) {
    relativeLastSync.value = 'Just now';
  } else if (diffSecs < 60) {
    relativeLastSync.value = `${diffSecs} seconds ago`;
  } else {
    const diffMins = Math.floor(diffSecs / 60);
    relativeLastSync.value = `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  }
};

const localFirmware = ref(null);
const localIsOutdated = ref(null);

const reboot = async () => {
  if (!deviceId.value) return;
  isRebooting.value = true;
  try {
    await apiClient.put(`/api/v1/devices/${deviceId.value}/reboot`);
    
    // Add reboot log entry in real time
    logs.value.unshift({
      id: Date.now(),
      type: 'warning',
      title: 'Reboot Initiated',
      desc: 'System hard reboot requested by administrator. Connection closed.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    saveLogs();
    
    await devicesStore.fetchDevices();
  } catch (e) {
    console.error('Failed to reboot device', e);
  } finally {
    isRebooting.value = false;
  }
};

const device = computed(() => {
  return devicesStore.getDeviceById(deviceId.value);
});

const currentFirmware = computed(() => {
  if (localFirmware.value !== null) return localFirmware.value;
  return device.value?.firmware || 'v2.4.1';
});

const isFirmwareOutdated = computed(() => {
  if (localIsOutdated.value !== null) return localIsOutdated.value;
  return device.value?.isFirmwareOutdated || false;
});

const updateFirmware = async () => {
  if (isUpdatingFirmware.value) return;
  isUpdatingFirmware.value = true;
  await new Promise(resolve => setTimeout(resolve, 1500));
  localFirmware.value = 'v2.4.1';
  localIsOutdated.value = false;
  isUpdatingFirmware.value = false;
  
  logs.value.unshift({
    id: Date.now(),
    type: 'success',
    title: 'Firmware Flashed',
    desc: 'System flashed successfully to v2.4.1-stable.',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  saveLogs();
};

const calibrateSensor = async () => {
  if (isCalibrating.value) return;
  isCalibrating.value = true;
  await new Promise(resolve => setTimeout(resolve, 2000));
  isCalibrating.value = false;
  
  logs.value.unshift({
    id: Date.now(),
    type: 'success',
    title: 'Sensor Calibrated',
    desc: `Calibration successful. Zero offset adjusted. Current Temp: ${metrics.value[0].value}`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  saveLogs();
};

let tempInterval = null;

const updateTelemetry = async () => {
  if (!deviceId.value) return;
  try {
    const { data } = await apiClient.get(`/api/v1/telemetries/latest?deviceId=${deviceId.value}`);
    const newMetrics = [];
    const devIdLower = deviceId.value.toLowerCase();

    // 1. Gas Reading
    if (data && (data.gasReading > 0 || devIdLower.includes('gas'))) {
      newMetrics.push({
        label: 'GAS LEVEL',
        value: `${data.gasReading.toFixed(1)} PPM`,
        trend: data.gasReading > 100 ? 'HIGH ALERT' : 'NOMINAL',
        trendColor: data.gasReading > 100 ? 'red' : 'green'
      });
    }

    // 2. Water Reading
    if (data && (data.waterReading > 0 || devIdLower.includes('water'))) {
      newMetrics.push({
        label: 'WATER FLOW',
        value: `${data.waterReading.toFixed(2)} L/m`,
        trend: data.waterReading > 15 ? 'HIGH FLOW' : 'ACTIVE',
        trendColor: data.waterReading > 15 ? 'red' : 'green'
      });
    }

    // 3. Electricity / Current Reading
    if (data && (data.electricityReading > 0 || devIdLower.includes('voltage') || devIdLower.includes('electricity') || devIdLower.includes('current'))) {
      newMetrics.push({
        label: 'ENERGY CONSUMPTION',
        value: `${data.electricityReading.toFixed(1)} kWh`,
        trend: data.electricityReading > 15 ? 'OVERLOAD' : 'NOMINAL',
        trendColor: data.electricityReading > 15 ? 'red' : 'green'
      });
      newMetrics.push({
        label: 'VOLTAGE SAFETY',
        value: data.voltageOk ? 'NOMINAL' : 'ALERT',
        trend: data.voltageOk ? 'VOLTAGE OK' : 'VOLTAGE DROP',
        trendColor: data.voltageOk ? 'green' : 'red'
      });
    }

    // 4. Presence / Motion
    if (data && data.presenceReading) {
      newMetrics.push({
        label: 'MOTION SENSOR',
        value: 'ACTIVE',
        trend: 'PRESENCE DETECTED',
        trendColor: 'red'
      });
    }

    // Add generic device metrics if none of the above are pushed
    if (newMetrics.length === 0) {
      newMetrics.push({
        label: 'DEVICE STATUS',
        value: device.value?.isOnline() ? 'ONLINE' : 'OFFLINE',
        trend: 'NOMINAL',
        trendColor: device.value?.isOnline() ? 'green' : 'red'
      });
    }

    // Fill remaining cards (up to 4) dynamically with real device properties or stable metrics
    while (newMetrics.length < 4) {
      if (newMetrics.length === 1) {
        newMetrics.push({
          label: 'SIGNAL STRENGTH',
          value: device.value?.rssi !== null && device.value?.rssi !== undefined ? `${device.value.rssi} dBm` : 'N/A',
          trend: device.value?.isOnline() ? 'EXCELLENT' : 'DISCONNECTED',
          trendColor: device.value?.isOnline() ? 'green' : 'red'
        });
      } else if (newMetrics.length === 2) {
        newMetrics.push({
          label: 'RAM USAGE',
          value: device.value?.isOnline() ? '124KB' : 'N/A',
          trend: 'STABLE',
          trendColor: 'gray'
        });
      } else {
        newMetrics.push({
          label: 'PACKET LOSS',
          value: device.value?.isOnline() ? '0.02%' : 'N/A',
          trend: 'OPTIMAL',
          trendColor: 'green'
        });
      }
    }

    metrics.value = newMetrics;

  } catch (e) {
    console.debug('Failed to fetch real-time telemetry, falling back to dynamic simulated metrics', e);
    const baseTemp = 24.2;
    const variation = (Math.random() - 0.5) * 0.4;
    const currentTemp = `${(baseTemp + variation).toFixed(1)}°C`;
    metrics.value = [
      { label: 'AVG TEMP', value: device.value?.isOnline() ? currentTemp : 'N/A', trend: '~0.4', trendColor: 'green' },
      { label: 'SIGNAL STRENGTH', value: device.value?.rssi !== null && device.value?.rssi !== undefined ? `${device.value.rssi} dBm` : 'N/A', trend: device.value?.isOnline() ? 'EXCELLENT' : 'DISCONNECTED', trendColor: device.value?.isOnline() ? 'green' : 'red' },
      { label: 'RAM USAGE', value: device.value?.isOnline() ? '124KB' : 'N/A', trend: 'STABLE', trendColor: 'gray' },
      { label: 'PACKET LOSS', value: device.value?.isOnline() ? '0.02%' : 'N/A', trend: 'OPTIMAL', trendColor: 'green' }
    ];
  }
};

onMounted(async () => {
  if (!authStore.user) {
    await authStore.fetchUser();
  }
  if (devicesStore.devices.length === 0) {
    await devicesStore.fetchDevices();
  }
  
  await updateTelemetry();
  updateRelativeLastSync();
  
  tempInterval = setInterval(async () => {
    await updateTelemetry();
  }, 3000);

  syncInterval = setInterval(() => {
    updateRelativeLastSync();
  }, 1000);
});

onUnmounted(() => {
  if (tempInterval) {
    clearInterval(tempInterval);
  }
  if (syncInterval) {
    clearInterval(syncInterval);
  }
  if (globalBreadcrumbs) {
    globalBreadcrumbs.value = null;
  }
});

// Return the real MAC address from backend or N/A if null
const macAddress = computed(() => {
  return device.value?.macAddress || 'N/A';
});

// Generate a deterministic IP address from device ID
const ipAddress = computed(() => {
  if (!deviceId.value) return 'N/A';
  let hash = 0;
  for (let i = 0; i < deviceId.value.length; i++) {
    hash = deviceId.value.charCodeAt(i) + ((hash << 5) - hash);
  }
  const lastOctet = Math.abs(hash % 250) + 2;
  return `192.168.1.${lastOctet}`;
});

const connection = computed(() => ({
  ssid: 'NEXORA_INDUSTRIAL_5G',
  ip: ipAddress.value,
  mac: macAddress.value,
  protocol: 'HTTP / REST API'
}));

const hardware = computed(() => ({
  firmware: currentFirmware.value,
  rev: 'REV-C (Q4 2023)',
  frequency: '240 MHz (Dual Core)',
  temp: device.value?.isOnline() ? '42.5°C' : 'N/A'
}));

const getDynamicTime = (minutesAgo) => {
  const date = new Date(Date.now() - minutesAgo * 60 * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getDefaultLogs = () => [
  { id: 1, type: 'success', title: 'Calibration Successful', desc: 'Internal sensor range adjusted to ±0.2°C.', time: getDynamicTime(10) },
  { id: 2, type: 'warning', title: 'Fringe Signal Detected', desc: 'RSSI dropped below -75dBm for 12 seconds.', time: getDynamicTime(90) },
  { id: 3, type: 'info', title: 'Routine Heartbeat', desc: 'System status report sent to main gateway.', time: getDynamicTime(240) }
];

const logs = ref([]);
const showAllLogs = ref(false);

const displayedLogs = computed(() => {
  return showAllLogs.value ? logs.value : logs.value.slice(0, 3);
});

const currentUserId = computed(() => authStore.user?.email || 'guest');

const storageKey = computed(() => {
  return `device_logs_${currentUserId.value}_${deviceId.value}`;
});

const loadLogs = () => {
  if (!deviceId.value) return;
  const stored = localStorage.getItem(storageKey.value);
  if (stored) {
    try {
      logs.value = JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse logs from localStorage', e);
      logs.value = getDefaultLogs();
    }
  } else {
    logs.value = getDefaultLogs();
    localStorage.setItem(storageKey.value, JSON.stringify(logs.value));
  }
};

const saveLogs = () => {
  if (!deviceId.value) return;
  localStorage.setItem(storageKey.value, JSON.stringify(logs.value));
};

const breadcrumbs = computed(() => [
  { label: 'Devices', route: '/devices' },
  { label: deviceId.value || 'Device Details', route: `/devices/${deviceId.value}` }
]);

watch(storageKey, () => {
  loadLogs();
  showAllLogs.value = false; // Reset collapse state when switching devices or users
  updateTelemetry(); // Fetch immediately when changing devices
  if (globalBreadcrumbs) {
    globalBreadcrumbs.value = breadcrumbs.value;
  }
}, { immediate: true });

const metrics = ref([
  { label: 'AVG TEMP', value: '24.2°C', trend: '~0.4', trendDir: 'up', trendColor: 'green' },
  { label: 'PEAK LOAD', value: '82%', trend: '~2.1', trendDir: 'up', trendColor: 'red' },
  { label: 'RAM USAGE', value: '124KB', trend: 'STABLE', trendColor: 'gray' },
  { label: 'PACKET LOSS', value: '0.02%', trend: 'OPTIMAL', trendColor: 'green' }
]);
</script>

<template>
  <div class="device-details">
    <template v-if="!device">
      <div class="loading-overlay">
        <div class="spinner"></div>
        <p>Loading device details...</p>
      </div>
    </template>

    <template v-else>
      <!-- 1. Cabecera de Entidad -->
      <header class="entity-header">
        <nav class="breadcrumbs">
          <router-link to="/devices" class="breadcrumbs__item breadcrumbs__item--link">DEVICES</router-link>
          <span class="breadcrumbs__separator">></span>
          <span class="breadcrumbs__item breadcrumbs__item--active">{{ device.id }}</span>
        </nav>

        <div class="entity-header__main">
          <h1 class="entity-header__title">ESP32 Gateway Node ({{ device.location }})</h1>
          <button class="button--solid-orange" :disabled="isCalibrating || device.isOffline()" @click="calibrateSensor">
            <font-awesome-icon icon="sliders" :class="{ 'fa-spin': isCalibrating }" />
            <span>{{ isCalibrating ? 'Calibrating...' : 'Calibrate Sensor' }}</span>
          </button>
        </div>
      </header>

      <!-- 2. Fila 1: Estado Principal -->
      <div class="status-row">
        <!-- Panel Izquierdo: Telemetría -->
        <div class="live-telemetry-card">
          <div class="live-telemetry-card__header">
            <span class="kicker">LIVE TELEMETRY</span>
            <span :class="device.isOnline() ? 'badge--active' : 'badge--inactive'">
              ● {{ device.isOnline() ? 'ACTIVE' : 'OFFLINE' }}
            </span>
          </div>
          <h2 class="live-telemetry-card__title">Environmental Stability</h2>
          
          <div class="telemetry-grid">
            <div class="telemetry-col">
              <span class="telemetry-col__label">LAST SYNC TIME</span>
              <span class="telemetry-col__value telemetry-col__value--giant">{{ device.uptime }}</span>
              <span class="telemetry-col__sub">Local Time</span>
            </div>
            <div class="telemetry-col">
              <span class="telemetry-col__label">SIGNAL (RSSI)</span>
              <span class="telemetry-col__value telemetry-col__value--giant">
                {{ device.rssi !== null ? device.rssi + ' dBm' : 'Timeout' }}
              </span>
              <span class="telemetry-col__sub" :class="device.isOnline() ? 'telemetry-col__sub--success' : 'telemetry-col__sub--danger'">
                {{ device.isOnline() ? 'EXCELLENT' : 'OFFLINE' }}
              </span>
            </div>
            <div class="telemetry-col">
              <span class="telemetry-col__label">HEALTH</span>
              <span class="telemetry-col__value telemetry-col__value--giant" :class="device.isOnline() ? 'telemetry-col__value--success' : 'telemetry-col__value--danger'">
                {{ device.isOnline() ? '100%' : '0%' }}
              </span>
              <span class="telemetry-col__sub">{{ device.isOnline() ? 'NOMINAL OPS' : 'COMM FAILURE' }}</span>
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
            <span class="sync-value">{{ relativeLastSync }}</span>
          </div>
        </footer>
      </div>
    </div>

    <!-- 3. Fila 2: Analítica -->
    <section class="analytics-card">
      <header class="analytics-card__header">
        <h3 class="analytics-card__title">High-Density Sensor Analytics</h3>
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
    </section>

    <!-- 4. Fila 3: Logs y Hardware -->
    <div class="logs-hardware-row">
      <!-- Panel Izquierdo: Event Logs -->
      <div class="event-logs-card">
        <span class="kicker">SYSTEM EVENT LOGS</span>
        
        <div class="log-list">
          <div v-for="log in displayedLogs" :key="log.id" class="log-item">
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

        <button class="button--outline-fullwidth" @click="showAllLogs = !showAllLogs">
          {{ showAllLogs ? 'COLLAPSE LOGS' : 'VIEW ALL LOGS' }}
        </button>
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
          <button class="button--solid-blue" :disabled="isUpdatingFirmware || !isFirmwareOutdated || device.isOffline()" @click="updateFirmware">
            <font-awesome-icon icon="microchip" :class="{ 'fa-spin': isUpdatingFirmware }" />
            <span>{{ isUpdatingFirmware ? 'UPDATING...' : (isFirmwareOutdated ? 'FIRMWARE UPDATE' : 'FIRMWARE UP-TO-DATE') }}</span>
          </button>
          <button class="button--outline-blue" :disabled="isRebooting || device.isOffline()" @click="reboot">
            <font-awesome-icon icon="rotate" :class="{ 'fa-spin': isRebooting }" />
            <span>{{ isRebooting ? 'REBOOTING...' : (device.isOffline() ? 'OFFLINE' : 'HARD REBOOT') }}</span>
          </button>
        </div>
      </div>
    </div>
  </template>
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

.breadcrumbs__item--link {
  color: #718096;
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s;
}

.breadcrumbs__item--link:hover {
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

.oscilloscope-viz__waves path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: wave-flow 25s linear infinite;
}

@keyframes wave-flow {
  to {
    stroke-dashoffset: 0;
  }
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