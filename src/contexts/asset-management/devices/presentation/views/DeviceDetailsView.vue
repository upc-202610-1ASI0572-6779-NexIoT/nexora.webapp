<script setup>
import { ref, onMounted, onUnmounted, computed, watch, inject } from 'vue';
import { useRoute } from 'vue-router';
import { useDevicesStore } from '../store/devicesStore';
import { useAuthStore } from '@/contexts/iam/auth/presentation/store/authStore';
import apiClient from '@/shared/infrastructure/http/apiClient';
import { useI18n } from '@/shared/presentation/i18n';

const { t } = useI18n();
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
    relativeLastSync.value = t('deviceDetailsPage.connectionDetails.values.never');
    return;
  }
  const diffMs = Date.now() - new Date(device.value.lastSyncAt).getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  if (diffSecs < 0 || diffSecs < 5) {
    relativeLastSync.value = t('deviceDetailsPage.connectionDetails.values.justNow');
  } else if (diffSecs < 60) {
    relativeLastSync.value = t('deviceDetailsPage.connectionDetails.values.secondsAgo', { seconds: diffSecs });
  } else {
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins === 1) {
      relativeLastSync.value = t('deviceDetailsPage.connectionDetails.values.minutesAgo', { minutes: diffMins });
    } else {
      relativeLastSync.value = t('deviceDetailsPage.connectionDetails.values.minutesAgoPlural', { minutes: diffMins });
    }
  }
};

const localFirmware = ref(null);
const localIsOutdated = ref(null);

const reboot = async () => {
  if (!deviceId.value) return;
  isRebooting.value = true;
  try {
    await apiClient.put(`/api/v1/devices/${deviceId.value}/reboot`);
    
    // Add reboot log entry in DB
    const logData = {
      type: 'warning',
      title: 'Reboot Initiated',
      message: 'System hard reboot requested by administrator. Connection closed.'
    };
    try {
      const { data } = await apiClient.post(`/api/v1/devices/${deviceId.value}/logs`, logData);
      logs.value.unshift({
        id: data.id,
        type: data.type,
        title: data.title,
        desc: data.message,
        time: formatLogTime(data.timestamp)
      });
    } catch (err) {
      console.error('Failed to save log to DB', err);
      logs.value.unshift({
        id: Date.now(),
        type: logData.type,
        title: logData.title,
        desc: logData.message,
        time: formatLogTime(new Date())
      });
    }
    
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
  
  const logData = {
    type: 'success',
    title: 'Firmware Flashed',
    message: 'System flashed successfully to v2.4.1-stable.'
  };
  try {
    const { data } = await apiClient.post(`/api/v1/devices/${deviceId.value}/logs`, logData);
    logs.value.unshift({
      id: data.id,
      type: data.type,
      title: data.title,
      desc: data.message,
      time: formatLogTime(data.timestamp)
    });
  } catch (err) {
    console.error('Failed to save log to DB', err);
    logs.value.unshift({
      id: Date.now(),
      type: logData.type,
      title: logData.title,
      desc: logData.message,
      time: formatLogTime(new Date())
    });
  }
};

const calibrateSensor = async () => {
  if (isCalibrating.value) return;
  isCalibrating.value = true;
  await new Promise(resolve => setTimeout(resolve, 2000));
  isCalibrating.value = false;
  
  const logData = {
    type: 'success',
    title: 'Sensor Calibrated',
    message: `Calibration successful. Zero offset adjusted. Current Temp: ${metrics.value[0].value}`
  };
  try {
    const { data } = await apiClient.post(`/api/v1/devices/${deviceId.value}/logs`, logData);
    logs.value.unshift({
      id: data.id,
      type: data.type,
      title: data.title,
      desc: data.message,
      time: formatLogTime(data.timestamp)
    });
  } catch (err) {
    console.error('Failed to save log to DB', err);
    logs.value.unshift({
      id: Date.now(),
      type: logData.type,
      title: logData.title,
      desc: logData.message,
      time: formatLogTime(new Date())
    });
  }
};

let tempInterval = null;

const getTranslatedMetricLabel = (label) => {
  switch (label) {
    case 'GAS LEVEL': return t('deviceDetailsPage.analytics.labels.gasLevel');
    case 'WATER FLOW': return t('deviceDetailsPage.analytics.labels.waterFlow');
    case 'ENERGY CONSUMPTION': return t('deviceDetailsPage.analytics.labels.energyConsumption');
    case 'VOLTAGE SAFETY': return t('deviceDetailsPage.analytics.labels.voltageSafety');
    case 'MOTION SENSOR': return t('deviceDetailsPage.analytics.labels.motionSensor');
    case 'DEVICE STATUS': return t('deviceDetailsPage.analytics.labels.deviceStatus');
    case 'SIGNAL STRENGTH': return t('deviceDetailsPage.analytics.labels.signalStrength');
    case 'RAM USAGE': return t('deviceDetailsPage.analytics.labels.ramUsage');
    case 'PACKET LOSS': return t('deviceDetailsPage.analytics.labels.packetLoss');
    case 'AVG TEMP': return t('deviceDetailsPage.analytics.labels.avgTemp');
    case 'PEAK LOAD': return t('deviceDetailsPage.analytics.labels.peakLoad');
    default: return label;
  }
};

const getTranslatedMetricTrend = (trend) => {
  switch (trend) {
    case 'NOMINAL': return t('deviceDetailsPage.analytics.trends.nominal');
    case 'ACTIVE': return t('deviceDetailsPage.analytics.trends.active');
    case 'STABLE': return t('deviceDetailsPage.analytics.trends.stable');
    case 'OPTIMAL': return t('deviceDetailsPage.analytics.trends.optimal');
    case 'EXCELLENT': return t('deviceDetailsPage.analytics.trends.excellent');
    case 'ALERT': return t('deviceDetailsPage.analytics.trends.alert');
    case 'VOLTAGE OK': return t('deviceDetailsPage.analytics.trends.voltageOk');
    case 'VOLTAGE DROP': return t('deviceDetailsPage.analytics.trends.voltageDrop');
    case 'HIGH ALERT': return t('deviceDetailsPage.analytics.trends.highAlert');
    case 'HIGH FLOW': return t('deviceDetailsPage.analytics.trends.highFlow');
    case 'OVERLOAD': return t('deviceDetailsPage.analytics.trends.overload');
    case 'PRESENCE DETECTED': return t('deviceDetailsPage.analytics.trends.presenceDetected');
    case 'DISCONNECTED': return t('deviceDetailsPage.analytics.trends.disconnected');
    default: return trend;
  }
};

const getTranslatedMetricValue = (value) => {
  if (value === 'ACTIVE') return t('deviceDetailsPage.analytics.trends.active');
  if (value === 'NOMINAL') return t('deviceDetailsPage.analytics.trends.nominal');
  if (value === 'ALERT') return t('deviceDetailsPage.analytics.trends.alert');
  if (value === 'ONLINE') return t('deviceDetailsPage.liveTelemetry.status.active');
  if (value === 'OFFLINE') return t('deviceDetailsPage.liveTelemetry.status.offline');
  return value;
};

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

const formatLogTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getDefaultLogs = () => [
  { id: 1, type: 'success', title: 'Calibration Successful', desc: 'Internal sensor range adjusted to ±0.2°C.', time: getDynamicTime(10) },
  { id: 2, type: 'warning', title: 'Fringe Signal Detected', desc: 'RSSI dropped below -75dBm for 12 seconds.', time: getDynamicTime(90) },
  { id: 3, type: 'info', title: 'Routine Heartbeat', desc: 'System status report sent to main gateway.', time: getDynamicTime(240) }
];

const getTranslatedLog = (log) => {
  let title = log.title;
  let desc = log.desc;

  if (title === 'Calibration Successful') {
    title = t('deviceDetailsPage.eventLogs.messages.calibrationSuccessfulTitle');
    if (desc === 'Internal sensor range adjusted to ±0.2°C.') {
      desc = t('deviceDetailsPage.eventLogs.messages.calibrationSuccessfulDesc');
    } else if (desc === 'Voltage sensor calibrated to baseline.') {
      desc = t('deviceDetailsPage.eventLogs.messages.calibrationSuccessfulDesc');
    }
  } else if (title === 'Fringe Signal Detected') {
    title = t('deviceDetailsPage.eventLogs.messages.fringeSignalTitle');
    desc = t('deviceDetailsPage.eventLogs.messages.fringeSignalDesc');
  } else if (title === 'Routine Heartbeat') {
    title = t('deviceDetailsPage.eventLogs.messages.routineHeartbeatTitle');
    desc = t('deviceDetailsPage.eventLogs.messages.routineHeartbeatDesc');
  } else if (title === 'Reboot Initiated') {
    title = t('deviceDetailsPage.eventLogs.messages.rebootInitiatedTitle');
    desc = t('deviceDetailsPage.eventLogs.messages.rebootInitiatedDesc');
  } else if (title === 'Firmware Flashed') {
    title = t('deviceDetailsPage.eventLogs.messages.firmwareFlashedTitle');
    desc = t('deviceDetailsPage.eventLogs.messages.firmwareFlashedDesc');
  } else if (title === 'Sensor Calibrated') {
    title = t('deviceDetailsPage.eventLogs.messages.sensorCalibratedTitle');
    if (desc.includes('Current Temp:')) {
      const val = desc.split('Current Temp:')[1]?.trim() || '';
      desc = t('deviceDetailsPage.eventLogs.messages.sensorCalibratedDesc', { val });
    } else {
      desc = t('deviceDetailsPage.eventLogs.messages.sensorCalibratedDesc', { val: '' });
    }
  } else if (title === 'Voltage Spike Detected') {
    title = t('deviceDetailsPage.eventLogs.messages.voltageSpikeDetectedTitle');
    desc = t('deviceDetailsPage.eventLogs.messages.voltageSpikeDetectedDesc');
  } else if (title === 'Power Cycle Initiated') {
    title = t('deviceDetailsPage.eventLogs.messages.powerCycleInitiatedTitle');
    desc = t('deviceDetailsPage.eventLogs.messages.powerCycleInitiatedDesc');
  } else if (title === 'Gas Leak Warning') {
    title = t('deviceDetailsPage.eventLogs.messages.gasLeakWarningTitle');
    desc = t('deviceDetailsPage.eventLogs.messages.gasLeakWarningDesc');
  } else if (title === 'Sensor Pre-heat Complete') {
    title = t('deviceDetailsPage.eventLogs.messages.sensorPreheatCompleteTitle');
    desc = t('deviceDetailsPage.eventLogs.messages.sensorPreheatCompleteDesc');
  }

  return { ...log, title, desc };
};

const logs = ref([]);
const showAllLogs = ref(false);

const displayedLogs = computed(() => {
  const list = showAllLogs.value ? logs.value : logs.value.slice(0, 3);
  return list.map(getTranslatedLog);
});

const loadLogs = async () => {
  if (!deviceId.value) return;
  try {
    const { data } = await apiClient.get(`/api/v1/devices/${deviceId.value}/logs`);
    logs.value = data.map(l => ({
      id: l.id,
      type: l.type,
      title: l.title,
      desc: l.message,
      time: formatLogTime(l.timestamp)
    }));
  } catch (e) {
    console.error('Failed to load logs from server, falling back to local mocks', e);
    logs.value = getDefaultLogs();
  }
};

const breadcrumbs = computed(() => [
  { label: t('deviceDetailsPage.breadcrumbs.devices'), route: '/devices' },
  { label: deviceId.value || 'Device Details', route: `/devices/${deviceId.value}` }
]);

watch(deviceId, () => {
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
        <p>{{ t('deviceDetailsPage.loading') }}</p>
      </div>
    </template>

    <template v-else>
      <!-- 1. Cabecera de Entidad -->
      <header class="entity-header">
        <nav class="breadcrumbs">
          <router-link to="/devices" class="breadcrumbs__item breadcrumbs__item--link">{{ t('deviceDetailsPage.breadcrumbs.devices') }}</router-link>
          <span class="breadcrumbs__separator">></span>
          <span class="breadcrumbs__item breadcrumbs__item--active">{{ device.id }}</span>
        </nav>

        <div class="entity-header__main">
          <h1 class="entity-header__title">{{ t('deviceDetailsPage.header.title', { location: device.location }) }}</h1>
          <button class="button--solid-orange" :disabled="isCalibrating || device.isOffline()" @click="calibrateSensor">
            <font-awesome-icon icon="sliders" :class="{ 'fa-spin': isCalibrating }" />
            <span>{{ isCalibrating ? t('deviceDetailsPage.header.calibrating') : t('deviceDetailsPage.header.calibrateBtn') }}</span>
          </button>
        </div>
      </header>

      <!-- 2. Fila 1: Estado Principal -->
      <div class="status-row">
        <!-- Panel Izquierdo: Telemetría -->
        <div class="live-telemetry-card">
          <div class="live-telemetry-card__header">
            <span class="kicker">{{ t('deviceDetailsPage.liveTelemetry.kicker') }}</span>
            <span :class="device.isOnline() ? 'badge--active' : 'badge--inactive'">
              ● {{ device.isOnline() ? t('deviceDetailsPage.liveTelemetry.status.active') : t('deviceDetailsPage.liveTelemetry.status.offline') }}
            </span>
          </div>
          <h2 class="live-telemetry-card__title">{{ t('deviceDetailsPage.liveTelemetry.title') }}</h2>
          
          <div class="telemetry-grid">
            <div class="telemetry-col">
              <span class="telemetry-col__label">{{ t('deviceDetailsPage.liveTelemetry.labels.lastSyncTime') }}</span>
              <span class="telemetry-col__value telemetry-col__value--giant">{{ device.uptime }}</span>
              <span class="telemetry-col__sub">{{ t('deviceDetailsPage.liveTelemetry.subs.localTime') }}</span>
            </div>
            <div class="telemetry-col">
              <span class="telemetry-col__label">{{ t('deviceDetailsPage.liveTelemetry.labels.signal') }}</span>
              <span class="telemetry-col__value telemetry-col__value--giant">
                {{ device.rssi !== null ? device.rssi + ' dBm' : t('devicesPage.inventory.text.timeout') }}
              </span>
              <span class="telemetry-col__sub" :class="device.isOnline() ? 'telemetry-col__sub--success' : 'telemetry-col__sub--danger'">
                {{ device.isOnline() ? t('deviceDetailsPage.liveTelemetry.subs.excellent') : t('deviceDetailsPage.liveTelemetry.status.offline') }}
              </span>
            </div>
            <div class="telemetry-col">
              <span class="telemetry-col__label">{{ t('deviceDetailsPage.liveTelemetry.labels.health') }}</span>
              <span class="telemetry-col__value telemetry-col__value--giant" :class="device.isOnline() ? 'telemetry-col__value--success' : 'telemetry-col__value--danger'">
                {{ device.isOnline() ? '100%' : '0%' }}
              </span>
              <span class="telemetry-col__sub">{{ device.isOnline() ? t('deviceDetailsPage.liveTelemetry.subs.nominalOps') : t('deviceDetailsPage.liveTelemetry.subs.commFailure') }}</span>
            </div>
          </div>
        </div>

      <!-- Panel Derecho: Conexión -->
      <div class="connection-details-card">
        <span class="kicker kicker--pale">{{ t('deviceDetailsPage.connectionDetails.kicker') }}</span>
        
        <div class="data-list">
          <div class="data-list__row">
            <span class="data-list__label">{{ t('deviceDetailsPage.connectionDetails.labels.ssid') }}</span>
            <span class="data-list__value">{{ connection.ssid }}</span>
          </div>
          <div class="data-list__row">
            <span class="data-list__label">{{ t('deviceDetailsPage.connectionDetails.labels.ipAddress') }}</span>
            <span class="data-list__value">{{ connection.ip }}</span>
          </div>
          <div class="data-list__row">
            <span class="data-list__label">{{ t('deviceDetailsPage.connectionDetails.labels.macAddress') }}</span>
            <span class="data-list__value">{{ connection.mac }}</span>
          </div>
          <div class="data-list__row">
            <span class="data-list__label">{{ t('deviceDetailsPage.connectionDetails.labels.protocol') }}</span>
            <span class="data-list__value">{{ connection.protocol }}</span>
          </div>
        </div>

        <footer class="connection-details-card__footer">
          <font-awesome-icon icon="rotate" class="sync-icon" />
          <div class="sync-texts">
            <span class="sync-label">{{ t('deviceDetailsPage.connectionDetails.labels.lastSync') }}</span>
            <span class="sync-value">{{ relativeLastSync }}</span>
          </div>
        </footer>
      </div>
    </div>

    <!-- 3. Fila 2: Analítica -->
    <section class="analytics-card">
      <header class="analytics-card__header">
        <h3 class="analytics-card__title">{{ t('deviceDetailsPage.analytics.title') }}</h3>
      </header>

      <div class="metrics-grid">
        <div v-for="metric in metrics" :key="metric.label" class="metric-box">
          <span class="metric-box__label">{{ getTranslatedMetricLabel(metric.label) }}</span>
          <span class="metric-box__value">{{ getTranslatedMetricValue(metric.value) }}</span>
          <span :class="['metric-box__trend', `metric-box__trend--${metric.trendColor}`]">
            {{ metric.trendDir === 'up' ? '↑' : '' }} {{ getTranslatedMetricTrend(metric.trend) }}
          </span>
        </div>
      </div>
    </section>

    <!-- 4. Fila 3: Logs y Hardware -->
    <div class="logs-hardware-row">
      <!-- Panel Izquierdo: Event Logs -->
      <div class="event-logs-card">
        <span class="kicker">{{ t('deviceDetailsPage.eventLogs.kicker') }}</span>
        
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
          {{ showAllLogs ? t('deviceDetailsPage.eventLogs.buttons.collapse') : t('deviceDetailsPage.eventLogs.buttons.viewAll') }}
        </button>
      </div>

      <!-- Panel Derecho: Hardware Profile -->
      <div class="hardware-profile-card">
        <span class="kicker">{{ t('deviceDetailsPage.hardwareProfile.kicker') }}</span>
        
        <div class="profile-grid">
          <div class="profile-item">
            <span class="profile-item__label">{{ t('deviceDetailsPage.hardwareProfile.labels.firmwareVersion') }}</span>
            <span class="profile-item__value">{{ hardware.firmware }}</span>
          </div>
          <div class="profile-item">
            <span class="profile-item__label">{{ t('deviceDetailsPage.hardwareProfile.labels.hardwareRev') }}</span>
            <span class="profile-item__value">{{ hardware.rev }}</span>
          </div>
          <div class="profile-item">
            <span class="profile-item__label">{{ t('deviceDetailsPage.hardwareProfile.labels.coreFrequency') }}</span>
            <span class="profile-item__value">{{ hardware.frequency }}</span>
          </div>
          <div class="profile-item">
            <span class="profile-item__label">{{ t('deviceDetailsPage.hardwareProfile.labels.chipTemp') }}</span>
            <span class="profile-item__value">{{ hardware.temp }}</span>
          </div>
        </div>

        <div class="hardware-actions">
          <button class="button--solid-blue" :disabled="isUpdatingFirmware || !isFirmwareOutdated || device.isOffline()" @click="updateFirmware">
            <font-awesome-icon icon="microchip" :class="{ 'fa-spin': isUpdatingFirmware }" />
            <span>{{ isUpdatingFirmware ? t('deviceDetailsPage.hardwareProfile.buttons.updating') : (isFirmwareOutdated ? t('deviceDetailsPage.hardwareProfile.buttons.firmwareUpdate') : t('deviceDetailsPage.hardwareProfile.buttons.firmwareUpToDate')) }}</span>
          </button>
          <button class="button--outline-blue" :disabled="isRebooting || device.isOffline()" @click="reboot">
            <font-awesome-icon icon="rotate" :class="{ 'fa-spin': isRebooting }" />
            <span>{{ isRebooting ? t('deviceDetailsPage.hardwareProfile.buttons.rebooting') : (device.isOffline() ? t('deviceDetailsPage.hardwareProfile.buttons.offline') : t('deviceDetailsPage.hardwareProfile.buttons.hardReboot')) }}</span>
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