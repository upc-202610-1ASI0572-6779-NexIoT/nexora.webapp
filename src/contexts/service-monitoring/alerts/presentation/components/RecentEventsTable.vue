<template>
  <div class="table-container">
    <div class="table-header">
      <div class="table-title-group">
        <h2 class="table-title">Recent Critical Events</h2>
        <span class="live-updates-badge">
          <span class="pulse-dot"></span> LIVE UPDATES
        </span>
      </div>
      <div class="table-actions">
        <button 
          class="icon-button" 
          :class="{ active: showFilters || selectedSeverity || selectedType }" 
          @click="showFilters = !showFilters"
        >
          <font-awesome-icon icon="filter" />
        </button>
        <button v-if="selectedSeverity || selectedType" class="icon-button active" @click="resetAllFilters">
          <font-awesome-icon icon="xmark" />
        </button>
      </div>
    </div>

    <!-- Collapsible Filter Panel -->
    <div v-if="showFilters" class="filter-panel">
      <div class="filter-group">
        <label for="filter-severity">Severity</label>
        <select id="filter-severity" v-model="selectedSeverity" @change="applyFilters" class="filter-select">
          <option value="">All Severities</option>
          <option value="Warning">Warning</option>
          <option value="Critical">Critical</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label for="filter-type">Alert Type</label>
        <select id="filter-type" v-model="selectedType" @change="applyFilters" class="filter-select">
          <option value="">All Types</option>
          <option value="Gas">Gas Threshold</option>
          <option value="Overcurrent">Overcurrent Detected</option>
          <option value="Voltage">Voltage Instability</option>
          <option value="Intrusión">Intrusión (Security)</option>
        </select>
      </div>
      
      <button v-if="selectedSeverity || selectedType" class="clear-filters-btn" @click="resetAllFilters">
        Clear Filters
      </button>
    </div>
    
    <table class="events-table">
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>Property ID</th>
          <th>Sensor Type</th>
          <th>PPM Level</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(event, index) in events" :key="index" :class="{'resolved-row': event.status === 'RESOLVED'}">
          <td>
            <div class="cell-with-icon">
              <span class="status-icon" :class="'icon-' + event.status.toLowerCase()">
                <font-awesome-icon :icon="getStatusIcon(event.status)" />
              </span>
              {{ event.timestamp }}
            </div>
          </td>
          <td class="font-bold text-primary">{{ event.propertyId }}</td>
          <td>
            <div class="cell-with-icon">
              <span class="sensor-icon">
                <font-awesome-icon :icon="getSensorIcon(event.sensorType)" />
              </span>
              {{ event.sensorType }}
            </div>
          </td>
          <td :class="getPpmClass(event.ppmLevel, event.status)" class="font-bold">
            {{ event.ppmLevel }}
          </td>
          <td>
            <StatusBadge :status="event.status" />
          </td>
          <td>
            <router-link 
              v-if="event.id"
              :to="{ name: 'alert-investigate', params: { alertId: event.id } }"
              class="action-link" 
              :class="{'action-secondary': event.action === 'VIEW LOG' || event.action === 'REPORT'}"
            >
              {{ event.action }}
            </router-link>
            <span v-else class="action-link action-secondary">{{ event.action }}</span>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div class="table-footer">
      <span class="showing-text">
        Showing <strong>{{ showingStart }} - {{ showingEnd }}</strong> of <strong>{{ totalAlerts }}</strong> total alerts
      </span>
      <div class="pagination" v-if="totalPages > 1">
        <button 
          class="page-btn" 
          :disabled="currentPage === 1" 
          @click="changePage(currentPage - 1)"
        >
          <font-awesome-icon icon="chevron-left" />
        </button>
        
        <template v-for="(page, index) in visiblePages" :key="index">
          <span v-if="page === '...'" class="page-dots">...</span>
          <button 
            v-else 
            class="page-btn" 
            :class="{ active: currentPage === page }" 
            @click="changePage(page)"
          >
            {{ page }}
          </button>
        </template>
        
        <button 
          class="page-btn" 
          :disabled="currentPage === totalPages" 
          @click="changePage(currentPage + 1)"
        >
          <font-awesome-icon icon="chevron-right" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import StatusBadge from './StatusBadge.vue';

const props = defineProps({
  events: {
    type: Array,
    required: true
  },
  currentPage: {
    type: Number,
    default: 1
  },
  totalPages: {
    type: Number,
    default: 1
  },
  totalAlerts: {
    type: Number,
    default: 0
  },
  pageSize: {
    type: Number,
    default: 10
  }
});

const emit = defineEmits(['page-change', 'filter-change']);

const showFilters = ref(false);
const selectedSeverity = ref('');
const selectedType = ref('');

const applyFilters = () => {
  emit('filter-change', {
    severity: selectedSeverity.value,
    type: selectedType.value
  });
};

const resetAllFilters = () => {
  selectedSeverity.value = '';
  selectedType.value = '';
  applyFilters();
};

const showingStart = computed(() => {
  if (props.totalAlerts === 0) return 0;
  return (props.currentPage - 1) * props.pageSize + 1;
});

const showingEnd = computed(() => {
  return Math.min(props.currentPage * props.pageSize, props.totalAlerts);
});

const visiblePages = computed(() => {
  const pages = [];
  const range = 2; // pages around current page
  
  if (props.totalPages <= 5) {
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    
    let start = Math.max(2, props.currentPage - range);
    let end = Math.min(props.totalPages - 1, props.currentPage + range);
    
    if (props.currentPage <= range + 1) {
      end = 2 + range * 2;
    } else if (props.currentPage >= props.totalPages - range) {
      start = props.totalPages - 1 - range * 2;
    }
    
    start = Math.max(2, start);
    end = Math.min(props.totalPages - 1, end);
    
    if (start > 2) {
      pages.push('...');
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (end < props.totalPages - 1) {
      pages.push('...');
    }
    
    pages.push(props.totalPages);
  }
  return pages;
});

const changePage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('page-change', page);
  }
};

const getStatusIcon = (status) => {
  switch (status.toLowerCase()) {
    case 'critical': return 'exclamation-circle';
    case 'warning': return 'exclamation-triangle';
    case 'investigating': return 'eye';
    case 'resolved': return 'check-circle';
    default: return 'info-circle';
  }
};

const getSensorIcon = (type) => {
  if (type.includes('Carbon Monoxide')) return 'wind';
  if (type.includes('Temp')) return 'thermometer-half';
  if (type.includes('Humidity')) return 'tint';
  if (type.includes('Voltage')) return 'bolt';
  if (type.includes('Particle')) return 'dot-circle';
  return 'microchip';
};

const getPpmClass = (ppm, status) => {
  if (status.toLowerCase() === 'critical') return 'text-critical';
  if (status.toLowerCase() === 'warning') return 'text-warning';
  if (status.toLowerCase() === 'resolved') return 'text-muted';
  return 'text-default';
};
</script>

<style scoped>
.table-container {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.filter-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 1.25rem 1.5rem;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  align-items: flex-end;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.filter-group label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.filter-select {
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  font-size: 0.85rem;
  background-color: white;
  color: #334155;
  outline: none;
  min-width: 180px;
  cursor: pointer;
  transition: border-color 0.2s;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
}

.filter-select:focus {
  border-color: #1e3a8a;
  box-shadow: 0 0 0 2px rgba(30, 58, 138, 0.1);
}

.icon-button.active {
  background-color: #e2e8f0;
  color: #1e3a8a;
  border-color: #cbd5e1;
}

.clear-filters-btn {
  background: transparent;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  height: fit-content;
  align-self: flex-end;
}

.clear-filters-btn:hover {
  background-color: #f1f5f9;
  color: #1f2937;
  border-color: #9ca3af;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background-color: #f8fafc;
  border-bottom: 1px solid #e0e0e0;
}

.table-title-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.table-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.live-updates-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #fee2e2;
  color: #b91c1c;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  letter-spacing: 0.05em;
}

.pulse-dot {
  width: 6px;
  height: 6px;
  background-color: #dc2626;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7); }
  70% { box-shadow: 0 0 0 6px rgba(220, 38, 38, 0); }
  100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
}

.table-actions {
  display: flex;
  gap: 0.5rem;
}

.icon-button {
  background: white;
  border: 1px solid #d1d5db;
  color: #4b5563;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.icon-button:hover {
  background-color: #f3f4f6;
}

.events-table {
  width: 100%;
  border-collapse: collapse;
}

.events-table th {
  text-align: left;
  padding: 1rem 1.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 1px solid #e0e0e0;
}

.events-table td {
  padding: 1.25rem 1.5rem;
  font-size: 0.9rem;
  border-bottom: 1px solid #f3f4f6;
  color: #1f2937;
}

.events-table tr:last-child td {
  border-bottom: none;
}

.cell-with-icon {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.status-icon {
  font-size: 1rem;
}

.icon-critical { color: #dc2626; }
.icon-warning { color: #ea580c; }
.icon-investigating { color: #4338ca; }
.icon-resolved { color: #9ca3af; }

.sensor-icon {
  color: #6b7280;
  width: 16px;
  text-align: center;
}

.text-primary { color: #1e3a8a; }
.text-critical { color: #dc2626; }
.text-warning { color: #ea580c; }
.text-default { color: #1f2937; }
.text-muted { color: #9ca3af; }

.font-bold { font-weight: 700; }

.action-link {
  font-size: 0.75rem;
  font-weight: 700;
  color: #1e3a8a;
  text-decoration: none;
  letter-spacing: 0.05em;
}

.action-secondary {
  color: #6b7280;
}

.action-link:hover {
  text-decoration: underline;
}

.resolved-row td {
  color: #9ca3af;
}

.resolved-row .text-primary {
  color: #9ca3af;
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e0e0e0;
  background-color: #fafafa;
}

.showing-text {
  font-size: 0.85rem;
  color: #6b7280;
}

.showing-text strong {
  color: #1f2937;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.page-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 4px;
  color: #4b5563;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
}

.page-btn:hover {
  background-color: #f3f4f6;
}

.page-btn.active {
  background-color: #1e3a8a;
  color: white;
  font-weight: 700;
}

.page-dots {
  color: #9ca3af;
  margin: 0 0.25rem;
}
</style>
