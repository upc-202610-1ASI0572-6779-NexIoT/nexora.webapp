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
        <button class="icon-button"><font-awesome-icon icon="filter" /></button>
        <button class="icon-button"><font-awesome-icon icon="ellipsis-v" /></button>
      </div>
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
            <a href="#" class="action-link" :class="{'action-secondary': event.action === 'VIEW LOG' || event.action === 'REPORT'}">
              {{ event.action }}
            </a>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div class="table-footer">
      <span class="showing-text">Showing <strong>5</strong> of 142 total alerts</span>
      <div class="pagination">
        <button class="page-btn"><font-awesome-icon icon="chevron-left" /></button>
        <button class="page-btn active">1</button>
        <button class="page-btn">2</button>
        <button class="page-btn">3</button>
        <span class="page-dots">...</span>
        <button class="page-btn">29</button>
        <button class="page-btn"><font-awesome-icon icon="chevron-right" /></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import StatusBadge from './StatusBadge.vue';

const props = defineProps({
  events: {
    type: Array,
    required: true
  }
});

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
