<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useDevicesStore } from '../store/devicesStore';
import KpiCard from '@/contexts/service-monitoring/dashboard/presentation/components/KpiCard.vue';
import apiClient from '@/shared/infrastructure/http/apiClient';

const devicesStore = useDevicesStore();
const activeFilter = ref('All Assets');
const currentPage = ref(1);
const pageSize = 5;

let devicesPollInterval = null;

onMounted(() => {
  devicesStore.fetchDevices();
  devicesPollInterval = setInterval(() => {
    devicesStore.fetchDevices();
  }, 5000);
});

onUnmounted(() => {
  if (devicesPollInterval) {
    clearInterval(devicesPollInterval);
  }
});

const rebootDevice = async (id) => {
  try {
    await apiClient.put(`/api/v1/devices/${id}/reboot`);
    devicesStore.fetchDevices(); // refresh immediately
  } catch (e) {
    console.error('Failed to reboot device', e);
  }
};

const showSearch = ref(false);
const searchQuery = ref('');

const toggleSearch = () => {
  showSearch.value = !showSearch.value;
  if (!showSearch.value) {
    searchQuery.value = '';
  }
};

const filteredDevices = computed(() => {
  let list = devicesStore.devices || [];
  if (activeFilter.value === 'Online') {
    list = list.filter(d => d.isOnline());
  } else if (activeFilter.value === 'Offline') {
    list = list.filter(d => d.isOffline());
  } else if (activeFilter.value === 'Needs Maintenance') {
    list = list.filter(d => d.needsUpdate());
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(d => 
      d.id.toLowerCase().includes(q) || 
      d.location.toLowerCase().includes(q)
    );
  }
  return list;
});

const paginatedDevices = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return filteredDevices.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredDevices.value.length / pageSize) || 1;
});

// Reset page when filter changes
const setFilter = (filterName) => {
  activeFilter.value = filterName;
  currentPage.value = 1;
};

const exportInventory = () => {
  const list = filteredDevices.value;
  if (list.length === 0) {
    alert('No devices to export.');
    return;
  }

  const headers = ['DEVICE ID', 'SITE LOCATION', 'STATUS', 'WI-FI RSSI', 'FIRMWARE', 'UPTIME'];
  const rows = list.map(d => [
    d.id,
    d.location,
    d.getStatusLabel(),
    d.rssi !== null ? `${d.rssi} dBm` : 'Timeout',
    d.firmware,
    d.uptime
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(val => `"${val}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `nexora_device_fleet_${new Date().toISOString().slice(0, 10)}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const filters = [
  { name: 'All Assets', icon: 'microchip' },
  { name: 'Online', icon: 'circle-check' },
  { name: 'Needs Maintenance', icon: 'triangle-exclamation' },
  { name: 'Offline', icon: 'circle-info' }
];

const getRssiIcon = (rssi) => {
  if (rssi === null) return 'triangle-exclamation';
  if (rssi >= -50) return 'wifi';
  if (rssi >= -70) return 'wifi';
  return 'wifi'; // Simplified for now, could use signal levels if available
};

const getRssiColor = (rssi) => {
  if (rssi === null) return '#d32f2f'; // Timeout/Error
  if (rssi >= -50) return '#38a169'; // Strong
  if (rssi >= -70) return '#f47b20'; // Medium
  return '#d32f2f'; // Weak
};

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'online': return 'badge--success';
    case 'low-signal': return 'badge--warning';
    case 'comm-failure': return 'badge--danger';
    case 'update-pending': return 'badge--outline-warning';
    default: return '';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'online': return 'ONLINE';
    case 'low-signal': return 'LOW SIGNAL';
    case 'comm-failure': return 'COMM FAILURE';
    case 'update-pending': return 'UPDATE PENDING';
    default: return status.toUpperCase();
  }
};
</script>

<template>
  <div class="devices-view">
    <!-- Loading State -->
    <div v-if="devicesStore.isLoading && devicesStore.devices.length === 0" class="loading-overlay">
      <div class="spinner"></div>
      <p>Scanning IoT fleet...</p>
    </div>

    <template v-else>
      <!-- 1. Fleet Header -->
      <header class="fleet-header">
        <div class="fleet-header__titles">
          <h1 class="fleet-header__title">Device Fleet Overview</h1>
          <p class="fleet-header__subtitle">Monitoring {{ devicesStore.devices.length }} ESP32 Gateway nodes.</p>
        </div>
        
        <div class="segmented-control">
          <button 
            v-for="filter in filters" 
            :key="filter.name"
            :class="['segmented-control__btn', { 'segmented-control__btn--active': activeFilter === filter.name }]"
            @click="setFilter(filter.name)"
          >
            <font-awesome-icon :icon="filter.icon" class="segmented-control__icon" />
            {{ filter.name }}
          </button>
        </div>
      </header>

      <!-- 2. KPI Grid -->
      <div class="kpi-grid">
        <KpiCard 
          title="OPERATIONAL STATUS" 
          :value="devicesStore.kpis.operationalStatus" 
          subtitle="+0.4%"
          icon="check-circle"
          variant="success"
          trend="0.4%"
          trendDirection="up"
        />
        <KpiCard 
          title="GATEWAY LOAD" 
          :value="devicesStore.kpis.gatewayLoad" 
          subtitle="avg msg/s"
          icon="network-wired"
          variant="info"
        />
        <KpiCard 
          title="ACTIVE ALERTS" 
          :value="devicesStore.kpis.activeAlerts" 
          subtitle="Critical"
          icon="triangle-exclamation"
          variant="danger"
        />
        <KpiCard 
          title="FIRMWARE DRIFT" 
          :value="devicesStore.kpis.firmwareDrift" 
          subtitle="nodes out-of-sync"
          icon="download"
          variant="solid-orange"
        />
      </div>

      <!-- 3. Inventory Panel -->
      <section class="inventory-panel">
        <div class="inventory-panel__header">
          <h2 class="inventory-panel__title">ESP32 Gateway Fleet</h2>
          <div class="inventory-panel__actions">
            <button class="icon-button" :class="{ 'icon-button--active': showSearch }" @click="toggleSearch">
              <font-awesome-icon icon="filter" />
            </button>
            <button class="icon-button" @click="exportInventory">
              <font-awesome-icon icon="download" />
            </button>
          </div>
        </div>

        <!-- Real-time Search Bar -->
        <div v-if="showSearch" class="search-bar-container">
          <font-awesome-icon icon="search" class="search-icon" />
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search by Device ID or Site Location..." 
            class="search-input"
          />
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>DEVICE ID</th>
                <th>SITE LOCATION</th>
                <th>STATUS</th>
                <th>WI-FI RSSI</th>
                <th>FIRMWARE</th>
                <th>UPTIME</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="device in paginatedDevices" :key="device.id">
                <td :class="['data-table__id', { 'data-table__id--error': device.isOffline() }]">
                  <router-link :to="{ name: 'device-details', params: { deviceId: device.id } }" class="device-link">
                    {{ device.id }}
                  </router-link>
                </td>
                <td>{{ device.location }}</td>
                <td>
                  <span :class="['badge', getStatusBadgeClass(device.status)]">
                    {{ device.getStatusLabel() }}
                  </span>
                </td>
                <td>
                  <div class="rssi-indicator">
                    <font-awesome-icon 
                      :icon="getRssiIcon(device.rssi)" 
                      :style="{ color: getRssiColor(device.rssi) }"
                    />
                    <span>{{ device.rssi !== null ? device.rssi + ' dBm' : 'Timeout' }}</span>
                  </div>
                </td>
                <td>
                  <span :class="{ 'text-warning': device.needsUpdate() }">
                    {{ device.firmware }} {{ device.needsUpdate() ? '(Outdated)' : '' }}
                  </span>
                </td>
                <td>{{ device.uptime }}</td>
                <td class="data-table__actions">
                  <template v-if="device.isOffline()">
                    <button class="button--danger-small" @click="rebootDevice(device.id)">Reboot</button>
                  </template>
                  <template v-else-if="device.status === 'update-pending'">
                    <a href="#" class="action-link" @click.prevent>Flash</a>
                  </template>
                  <template v-else>
                    <router-link :to="{ name: 'device-details', params: { deviceId: device.id } }" class="action-link">
                      Manage
                    </router-link>
                  </template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="inventory-panel__footer">
          <div class="pagination">
            <span class="pagination__info">
              Showing {{ filteredDevices.length === 0 ? 0 : (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, filteredDevices.length) }} of {{ filteredDevices.length }} entries
            </span>
            <div class="pagination__controls">
              <button class="pagination__btn" :disabled="currentPage === 1 || totalPages === 1" @click="currentPage--">
                <font-awesome-icon icon="chevron-left" />
              </button>
              <button 
                v-for="page in totalPages" 
                :key="page" 
                class="pagination__btn" 
                :class="{ 'pagination__btn--active': currentPage === page }"
                :disabled="totalPages === 1"
                @click="currentPage = page"
              >
                {{ page }}
              </button>
              <button class="pagination__btn" :disabled="currentPage === totalPages || totalPages === 1" @click="currentPage++">
                <font-awesome-icon icon="chevron-right" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.devices-view {
  padding: 25px 30px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  min-height: 400px;
  position: relative;
}

.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px;
  color: #1a237e;
  font-weight: 700;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #f47b20;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.devices-view {
  padding: 25px 30px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* 1. Fleet Header */
.fleet-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 5px;
}

.fleet-header__title {
  margin: 0;
  color: #1a237e;
  font-weight: 800;
  font-size: 1.8rem;
}

.fleet-header__subtitle {
  margin: 5px 0 0;
  color: #718096;
  font-size: 1rem;
}

.segmented-control {
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  padding: 4px;
  gap: 4px;
}

.segmented-control__btn {
  border: none;
  background: transparent;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #718096;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  white-space: nowrap;
}

.segmented-control__btn--active {
  background-color: white;
  color: #1a237e;
  font-weight: 700;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #edf2f7;
}

/* 2. KPI Grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

/* 3. Inventory Panel */
.inventory-panel {
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
}

.inventory-panel__header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #edf2f7;
}

.inventory-panel__title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a237e;
}

.inventory-panel__actions {
  display: flex;
  gap: 10px;
}

.icon-button {
  width: 32px;
  height: 32px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  color: #4a5568;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.icon-button:hover {
  background-color: #f7fafc;
}

.icon-button--active {
  background-color: #1a237e !important;
  color: white !important;
  border-color: #1a237e !important;
}

.search-bar-container {
  padding: 16px 20px;
  background-color: #f8fafc;
  border-bottom: 1px solid #edf2f7;
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-icon {
  color: #a0aec0;
  font-size: 1rem;
}

.search-input {
  flex: 1;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 0.9rem;
  color: #2d3748;
  outline: none;
  transition: all 0.2s;
  background: white;
}

.search-input:focus {
  border-color: #1a237e;
  box-shadow: 0 0 0 3px rgba(26, 35, 126, 0.15);
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.data-table th {
  padding: 12px 20px;
  background-color: #f8fafc;
  color: #718096;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #edf2f7;
}

.data-table td {
  padding: 15px 20px;
  border-bottom: 1px solid #edf2f7;
  font-size: 0.9rem;
  color: #4a5568;
}

.data-table__id {
  color: #1a237e;
  font-weight: 700;
}

.device-link {
  color: inherit;
  text-decoration: none;
  display: block;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.device-link:hover {
  text-decoration: underline;
}

.data-table__id--error {
  color: #d32f2f;
}

/* Badges */
.badge {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 800;
  display: inline-block;
}

.badge--success { background-color: #f0fff4; color: #38a169; }
.badge--warning { background-color: #fffaf0; color: #f47b20; }
.badge--danger { background-color: #fff5f5; color: #d32f2f; }
.badge--outline-warning { border: 1px solid #f47b20; color: #f47b20; }

/* Indicators */
.rssi-indicator {
  display: flex;
  gap: 8px;
  align-items: center;
  font-weight: 600;
}

.text-warning {
  color: #f47b20;
}

.data-table__actions {
  white-space: nowrap;
}

.action-link {
  color: #1a237e;
  font-weight: 700;
  text-decoration: none;
}

.action-link:hover {
  text-decoration: underline;
}

.button--danger-small {
  background-color: #d32f2f;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}

.button--secondary-small {
  background-color: #f1f3f9;
  color: #1a237e;
  border: 1px solid #dcdfe6;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.button--secondary-small:hover {
  background-color: #e2e8f0;
}

/* Pagination */
.inventory-panel__footer {
  padding: 15px 20px;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination__info {
  font-size: 0.85rem;
  color: #718096;
}

.pagination__controls {
  display: flex;
  gap: 5px;
}

.pagination__btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  color: #4a5568;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.pagination__btn--active {
  background-color: #1a237e;
  color: white;
  border-color: #1a237e;
}

.pagination__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 4. Bottom Widgets */
.bottom-widgets {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.map-widget {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  height: 300px;
  position: relative;
  overflow: hidden;
}

.map-widget__badge {
  position: absolute;
  top: 15px;
  left: 15px;
  background-color: white;
  padding: 8px 15px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #1a237e;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.map-widget__placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #a0aec0;
  gap: 15px;
}

.map-widget__icon {
  font-size: 3rem;
  color: #e2e8f0;
}

.firmware-widget {
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.firmware-widget__title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a237e;
}

.firmware-widget__list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.progress-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-row__labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  font-weight: 700;
}

.progress-row__version {
  color: #4a5568;
}

.progress-row__percentage {
  color: #1a237e;
}

.progress-bar {
  height: 8px;
  background-color: #edf2f7;
  border-radius: 4px;
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  border-radius: 4px;
}

.progress-bar__fill--latest { background-color: #1a237e; }
.progress-bar__fill--stable { background-color: #a0aec0; }
.progress-bar__fill--legacy { background-color: #f47b20; }

.button--outline-primary {
  background: white;
  border: 2px solid #1a237e;
  color: #1a237e;
  padding: 12px;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.button--outline-primary:hover {
  background-color: #f8fafc;
}

.w-full { width: 100%; }
.mt-auto { margin-top: auto; }

/* Responsive */
@media (max-width: 1200px) {
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
  .bottom-widgets { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .fleet-header { flex-direction: column; align-items: flex-start; gap: 15px; }
  .kpi-grid { grid-template-columns: 1fr; }
}
</style>