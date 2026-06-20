<template>
  <div class="page-container">
    <!-- Breadcrumbs & Header -->
    <div class="page-header">
      <div>
        <div class="breadcrumbs">
          <router-link to="/dashboard">DASHBOARD</router-link> >
          <router-link to="/alerts">ALERTS CENTER</router-link> >
          <strong>INVESTIGATION #{{ alertId }}</strong>
        </div>
        <h1 class="page-title">Alert Investigation</h1>
        <p class="page-subtitle">Real-time diagnostics and maintenance resolution interface.</p>
      </div>
      <button class="back-btn" @click="$router.push('/alerts')">
        <font-awesome-icon icon="arrow-left" /> Back to Alerts Center
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading diagnostic details from Cloud Gateway...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <font-awesome-icon icon="triangle-exclamation" class="error-icon" />
      <h3>Failed to Load Alert</h3>
      <p>{{ error }}</p>
      <button class="retry-btn" @click="fetchAlertDetails">Retry Connection</button>
    </div>

    <!-- Main Investigation Console -->
    <div v-else class="investigation-grid">
      <!-- Left Column: Diagnostic & Asset Details -->
      <div class="main-column">
        <!-- Diagnostic Status Panel -->
        <div class="diagnostic-panel" :class="alert.severity.toLowerCase()">
          <div class="panel-header">
            <span class="severity-badge" :class="alert.severity.toLowerCase()">
              <font-awesome-icon :icon="alert.severity === 'Critical' ? 'triangle-exclamation' : 'exclamation-circle'" />
              {{ alert.severity.toUpperCase() }}
            </span>
            <span class="timestamp">Logged: {{ formatDateTime(alert.timestamp) }}</span>
          </div>
          <h2 class="alert-type-title">{{ alert.type }}</h2>
          <p class="device-label">
            <font-awesome-icon icon="microchip" /> Device Signature: <code>{{ alert.deviceId }}</code>
          </p>
          <div class="alert-explanation">
            <p v-if="alert.type.includes('Overcurrent')">
              <strong>Diagnostic Summary:</strong> The current consumption on this line exceeded the maximum safe current limit of <strong>20.0 Amps</strong>. This indicates an overload anomaly, which could trigger safety relays or represent a hazard for the electrical grid.
            </p>
            <p v-else-if="alert.type.includes('Voltage')">
              <strong>Diagnostic Summary:</strong> Grid instability has been reported by the safety unit (`VoltageOk` status is False). This indicates voltage drops, sags, or potential micro-outages in the power supply.
            </p>
            <p v-else-if="alert.type.includes('Gas')">
              <strong>Diagnostic Summary:</strong> Combustible gas levels have exceeded safety levels. Values above 100 PPM require warnings, while readings exceeding 300 PPM demand critical emergency response.
            </p>
            <p v-else-if="alert.type.includes('Intrusión') || alert.type.includes('intrusion')">
              <strong>Diagnostic Summary:</strong> Motion or access sensor triggered while the security system is armed. This represents a potential intrusion warning.
            </p>
            <p v-else>
              <strong>Diagnostic Summary:</strong> Safety threshold breached. Inspect device logs and telemetry historical timeline below to identify potential causes.
            </p>
          </div>
        </div>

        <!-- Associated Property Asset Card -->
        <div class="info-card property-card">
          <div class="card-header">
            <h3>
              <font-awesome-icon icon="building" class="header-icon" />
              Associated Property Asset
            </h3>
            <span class="security-status" :class="{ armed: alert.device?.property?.isSecurityModeArmed }">
              <font-awesome-icon :icon="alert.device?.property?.isSecurityModeArmed ? 'lock' : 'lock-open'" />
              {{ alert.device?.property?.isSecurityModeArmed ? 'SECURITY ARMED' : 'SECURITY DISARMED' }}
            </span>
          </div>
          <div v-if="alert.device?.property" class="property-details-grid">
            <div class="detail-item">
              <span class="label">Property Name</span>
              <span class="value">{{ alert.device.property.name }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Address</span>
              <span class="value">{{ alert.device.property.address }}</span>
            </div>
            <div class="detail-item">
              <span class="label">City & Country</span>
              <span class="value">{{ alert.device.property.city }}, {{ alert.device.property.country }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Device Connection</span>
              <span class="value connection-status" :class="alert.device.connectionStatus.toLowerCase()">
                <span class="status-dot"></span>
                {{ alert.device.connectionStatus }}
              </span>
            </div>
          </div>
          <div v-else class="no-data">
            <font-awesome-icon icon="info-circle" />
            No property assigned to this safety gateway. This alert applies to all accounts viewing this unit.
          </div>
        </div>

        <!-- Historical Telemetry Timeline -->
        <div class="info-card telemetry-card">
          <div class="card-header">
            <h3>
              <font-awesome-icon icon="chart-line" class="header-icon" />
              Historical Telemetry Logs (Recent readings)
            </h3>
            <span class="live-indicator">
              <span class="pulse-dot"></span> Live Link Active
            </span>
          </div>
          
          <div class="table-wrapper">
            <table class="telemetry-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th v-if="alert.type.includes('Gas')">Gas Level (PPM)</th>
                  <th v-else>Electricity (Amps)</th>
                  <th>Grid Voltage Status</th>
                  <th>Presence / Motion</th>
                  <th>Water Flow (Lpm)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(log, idx) in alert.recentTelemetry" :key="idx" :class="{ 'warning-row': isLogAnomaly(log) }">
                  <td class="timestamp-cell">{{ formatDateTime(log.timestamp) }}</td>
                  <td class="font-bold value-cell" :class="{ 'text-danger': log.electricityReading > 20.0 || log.gasReading > 100 }">
                    <span v-if="alert.type.includes('Gas')">{{ log.gasReading }} PPM</span>
                    <span v-else>{{ log.electricityReading.toFixed(2) }} A</span>
                  </td>
                  <td>
                    <span class="grid-badge" :class="log.voltageOk ? 'ok' : 'error'">
                      <font-awesome-icon :icon="log.voltageOk ? 'circle-check' : 'xmark'" />
                      {{ log.voltageOk ? 'Stable' : 'Unstable' }}
                    </span>
                  </td>
                  <td>
                    <span class="presence-badge" :class="{ active: log.presenceReading }">
                      {{ log.presenceReading ? 'Motion' : 'None' }}
                    </span>
                  </td>
                  <td>{{ log.waterReading.toFixed(1) }} Lpm</td>
                </tr>
                <tr v-if="!alert.recentTelemetry || alert.recentTelemetry.length === 0">
                  <td colspan="5" class="empty-table">No telemetry records registered for this safety unit.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right Column: Ticket Actions & Protocols -->
      <div class="actions-column">
        <!-- Maintenance Ticket Panel -->
        <div class="action-card ticket-panel">
          <h3>Incident Management</h3>
          <p class="panel-desc">Manage the maintenance lifecycle and log the engineer resolution.</p>

          <div class="ticket-status-box" :class="ticket ? ticket.status.toLowerCase() : 'none'">
            <span class="box-label">TICKET STATUS</span>
            <span class="box-value">{{ ticket ? ticket.status.toUpperCase() : 'NO TICKET CREATED' }}</span>
          </div>

          <!-- Ticket details if exists -->
          <div v-if="ticket" class="ticket-info">
            <div class="info-row">
              <span>Ticket ID:</span>
              <strong>#{{ ticket.id }}</strong>
            </div>
            <div class="info-row">
              <span>Assigned To:</span>
              <strong>{{ ticket.assignedTo || 'Unassigned' }}</strong>
            </div>
            <div class="info-row">
              <span>Opened At:</span>
              <span>{{ formatDateTime(ticket.createdAt) }}</span>
            </div>
            <div v-if="ticket.resolvedAt" class="info-row">
              <span>Resolved At:</span>
              <span>{{ formatDateTime(ticket.resolvedAt) }}</span>
            </div>
          </div>

          <!-- Actions Form -->
          <div class="ticket-actions-form">
            <!-- Create ticket if not exists -->
            <div v-if="!ticket" class="form-group">
              <label for="technician">Assign Safety Inspector / Engineer</label>
              <select id="technician" v-model="technicianName" class="form-select">
                <option value="">-- Select Engineer --</option>
                <option value="Ing. Carlos Mendoza">Ing. Carlos Mendoza (Electrical Inspector)</option>
                <option value="Ing. Sofía Reyes">Ing. Sofía Reyes (Gas Safety Expert)</option>
                <option value="Tech. Juan Torres">Tech. Juan Torres (Field Technician)</option>
              </select>
              <button class="primary-btn mt-12" @click="createTicket" :disabled="isActionLoading">
                <font-awesome-icon icon="plus" /> Open Maintenance Ticket
              </button>
            </div>

            <!-- Ticket exists and is Pending or Assigned -->
            <div v-else-if="ticket.status !== 'Resolved'">
              <div v-if="!ticket.assignedTo" class="form-group mb-12">
                <label for="technicianAssign">Assign Safety Inspector</label>
                <select id="technicianAssign" v-model="technicianName" class="form-select">
                  <option value="">-- Select Engineer --</option>
                  <option value="Ing. Carlos Mendoza">Ing. Carlos Mendoza (Electrical Inspector)</option>
                  <option value="Ing. Sofía Reyes">Ing. Sofía Reyes (Gas Safety Expert)</option>
                  <option value="Tech. Juan Torres">Tech. Juan Torres (Field Technician)</option>
                </select>
                <button class="secondary-btn mt-12" @click="assignTechnician" :disabled="!technicianName || isActionLoading">
                  Assign Inspector
                </button>
              </div>
              <button class="success-btn w-100" @click="resolveTicket" :disabled="isActionLoading">
                <font-awesome-icon icon="check" /> Mark Incident as Resolved
              </button>
            </div>

            <div v-else class="resolved-note">
              <font-awesome-icon icon="circle-check" class="resolved-icon" />
              <p>This incident has been fully resolved and marked as safe. The safety gateway logs are preserved for audits.</p>
            </div>
          </div>
        </div>

        <!-- Safety Protocols Card -->
        <div class="action-card protocol-card">
          <h3>Emergency Protocols</h3>
          <p class="panel-desc">Mandatory procedures for the assigned engineer.</p>

          <ul class="protocol-list" v-if="alert.type.includes('Overcurrent')">
            <li>
              <span class="step-num">1</span>
              <div>
                <strong>Overload Trip Verification:</strong>
                Verify if the automatic thermal-magnetic circuit breaker on Apt-402 has tripped.
              </div>
            </li>
            <li>
              <span class="step-num">2</span>
              <div>
                <strong>Load Shedding:</strong>
                Locate and disconnect high-power appliances (water heaters, HVAC units, space heaters) to identify the overload source.
              </div>
            </li>
            <li>
              <span class="step-num">3</span>
              <div>
                <strong>Thermal Scan:</strong>
                Inspect the electrical board using a thermal camera to look for loose connections or damaged wiring.
              </div>
            </li>
          </ul>

          <ul class="protocol-list" v-else-if="alert.type.includes('Voltage')">
            <li>
              <span class="step-num">1</span>
              <div>
                <strong>Phase Test:</strong>
                Measure line voltage at the distribution panel to verify if it falls between 210V - 230V.
              </div>
            </li>
            <li>
              <span class="step-num">2</span>
              <div>
                <strong>Neutral Check:</strong>
                Verify that the neutral-to-ground voltage is below 2.0V. High neutral voltage indicates neutral drift.
              </div>
            </li>
            <li>
              <span class="step-num">3</span>
              <div>
                <strong>Grid Sync:</strong>
                Report phase drops to the utility company if the grid failure is external.
              </div>
            </li>
          </ul>

          <ul class="protocol-list" v-else-if="alert.type.includes('Gas')">
            <li>
              <span class="step-num">1</span>
              <div>
                <strong>Main Valve Shut-off:</strong>
                Close the manual gas valve at the property immediately.
              </div>
            </li>
            <li>
              <span class="step-num">2</span>
              <div>
                <strong>Ventilation:</strong>
                Open windows and doors to disperse the gas concentration. Do NOT toggle electrical switches.
              </div>
            </li>
            <li>
              <span class="step-num">3</span>
              <div>
                <strong>Sensor Calibration:</strong>
                Inspect the gas safety unit sensor for contamination or damage.
              </div>
            </li>
          </ul>

          <ul class="protocol-list" v-else>
            <li>
              <span class="step-num">1</span>
              <div>
                <strong>Site Audit:</strong>
                Visit the property to confirm if there are any visible signs of damage.
              </div>
            </li>
            <li>
              <span class="step-num">2</span>
              <div>
                <strong>Inspect Devices:</strong>
                Confirm the safety gateway has normal LED signals and is communicating correctly.
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiClient from '@/shared/infrastructure/http/apiClient';

const props = defineProps({
  alertId: {
    type: [String, Number],
    required: true
  }
});

const isLoading = ref(true);
const error = ref(null);
const alert = ref(null);
const ticket = ref(null);
const technicianName = ref('');
const isActionLoading = ref(false);

const fetchAlertDetails = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const res = await apiClient.get(`/api/v1/alerts/${props.alertId}`);
    if (res.data) {
      alert.value = res.data;
      ticket.value = res.data.ticket;
    } else {
      error.value = "Alert record is empty.";
    }
  } catch (e) {
    console.error('Failed to load alert details', e);
    error.value = e.response?.data?.message || "Failed to establish contact with backend services. Please ensure the backend is running.";
  } finally {
    isLoading.value = false;
  }
};

const isLogAnomaly = (log) => {
  if (alert.value?.type.includes('Gas') && log.gasReading > 100) return true;
  if (alert.value?.type.includes('Overcurrent') && log.electricityReading > 20.0) return true;
  if (!log.voltageOk) return true;
  return false;
};

const createTicket = async () => {
  isActionLoading.value = true;
  try {
    const res = await apiClient.post(`/api/v1/alerts/${props.alertId}/tickets`, {
      assignedTo: technicianName.value || null
    });
    if (res.data) {
      ticket.value = res.data;
    }
  } catch (e) {
    console.error('Failed to create ticket', e);
    alert('Failed to create ticket: ' + (e.response?.data || e.message));
  } finally {
    isActionLoading.value = false;
  }
};

const assignTechnician = async () => {
  if (!technicianName.value) return;
  isActionLoading.value = true;
  try {
    const res = await apiClient.post(`/api/v1/alerts/${props.alertId}/tickets`, {
      assignedTo: technicianName.value
    });
    if (res.data) {
      ticket.value = res.data;
    }
  } catch (e) {
    console.error('Failed to assign technician', e);
    alert('Failed to assign technician: ' + (e.response?.data || e.message));
  } finally {
    isActionLoading.value = false;
  }
};

const resolveTicket = async () => {
  isActionLoading.value = true;
  try {
    const res = await apiClient.put(`/api/v1/alerts/${props.alertId}/status`);
    if (res.data) {
      ticket.value = res.data;
    }
  } catch (e) {
    console.error('Failed to resolve incident', e);
    alert('Failed to resolve incident: ' + (e.response?.data || e.message));
  } finally {
    isActionLoading.value = false;
  }
};

const formatDateTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

onMounted(() => {
  fetchAlertDetails();
});
</script>

<style scoped>
.page-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.breadcrumbs {
  font-size: 0.7rem;
  color: #64748b;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.breadcrumbs a {
  color: #64748b;
  text-decoration: none;
}

.breadcrumbs a:hover {
  color: #1e3a8a;
  text-decoration: underline;
}

.breadcrumbs strong {
  color: #f59e0b;
}

.page-title {
  font-size: 2.25rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 1rem;
  color: #475569;
  margin: 0;
}

.back-btn {
  background-color: white;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 0.75rem 1.25rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.back-btn:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
}

/* Loading and Error States */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #eaeaea;
  text-align: center;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.05);
  border-left-color: #1e3a8a;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon {
  font-size: 3rem;
  color: #dc2626;
  margin-bottom: 1rem;
}

.error-state h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
}

.error-state p {
  color: #64748b;
  margin-bottom: 1.5rem;
}

.retry-btn {
  background-color: #1e3a8a;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: 700;
  border-radius: 6px;
  cursor: pointer;
}

/* Investigation Layout Grid */
.investigation-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

.main-column, .actions-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Diagnostic Status Panel */
.diagnostic-panel {
  background: white;
  border-radius: 8px;
  border-left: 6px solid #1e3a8a;
  border-top: 1px solid #eaeaea;
  border-bottom: 1px solid #eaeaea;
  border-right: 1px solid #eaeaea;
  padding: 1.5rem 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.diagnostic-panel.critical {
  border-left-color: #dc2626;
  background: linear-gradient(to right, #fff5f5, #ffffff 40%);
}

.diagnostic-panel.warning {
  border-left-color: #ea580c;
  background: linear-gradient(to right, #fffaf0, #ffffff 40%);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.severity-badge {
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  padding: 0.35rem 0.75rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.severity-badge.critical {
  background-color: #fee2e2;
  color: #b91c1c;
}

.severity-badge.warning {
  background-color: #ffedd5;
  color: #c2410c;
}

.severity-badge.info {
  background-color: #dbeafe;
  color: #1e40af;
}

.timestamp {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
}

.alert-type-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.01em;
}

.device-label {
  font-size: 0.9rem;
  color: #475569;
  margin: 0 0 1.25rem 0;
}

.device-label code {
  background-color: #f1f5f9;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: monospace;
  color: #b91c1c;
  font-weight: 600;
}

.alert-explanation {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 1.25rem;
  font-size: 0.95rem;
  color: #334155;
  line-height: 1.6;
}

.alert-explanation p {
  margin: 0;
}

/* Info Cards */
.info-card, .action-card {
  background: white;
  border-radius: 8px;
  border: 1px solid #eaeaea;
  box-shadow: 0 1px 3px rgba(0,0,0,0.03);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #eaeaea;
  background-color: #f8fafc;
}

.card-header h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-icon {
  color: #64748b;
}

.security-status {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background-color: #f1f5f9;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.security-status.armed {
  background-color: #ecfdf5;
  color: #047857;
}

/* Property details */
.property-details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  padding: 1.5rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.detail-item .label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-item .value {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.connection-status.online { color: #10b981; }
.connection-status.online .status-dot { background-color: #10b981; }
.connection-status.offline { color: #ef4444; }
.connection-status.offline .status-dot { background-color: #ef4444; }

.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
  color: #64748b;
  font-size: 0.95rem;
  font-style: italic;
}

/* Telemetry Card Table */
.live-indicator {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background-color: #ecfdf5;
  color: #047857;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.pulse-dot {
  width: 6px;
  height: 6px;
  background-color: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70% { box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.table-wrapper {
  overflow-x: auto;
}

.telemetry-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.telemetry-table th {
  padding: 1rem 1.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
  border-bottom: 1px solid #eaeaea;
  text-transform: uppercase;
}

.telemetry-table td {
  padding: 1rem 1.5rem;
  font-size: 0.9rem;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
}

.telemetry-table tr:last-child td {
  border-bottom: none;
}

.telemetry-table tr.warning-row {
  background-color: #fffaf0;
}

.timestamp-cell {
  font-weight: 500;
  color: #475569;
}

.value-cell {
  font-size: 0.95rem;
}

.text-danger {
  color: #ef4444;
  font-weight: 800;
}

.grid-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.grid-badge.ok {
  background-color: #d1fae5;
  color: #065f46;
}

.grid-badge.error {
  background-color: #fee2e2;
  color: #991b1b;
}

.presence-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  background-color: #f1f5f9;
  color: #475569;
}

.presence-badge.active {
  background-color: #fef3c7;
  color: #92400e;
}

.empty-table {
  text-align: center;
  padding: 2rem;
  color: #64748b;
  font-style: italic;
}

/* Incident Management (Right Column) */
.action-card {
  padding: 1.5rem;
}

.action-card h3 {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
}

.panel-desc {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0 0 1.25rem 0;
}

.ticket-status-box {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
}

.ticket-status-box.pending {
  background-color: #fef3c7;
  border-color: #fde68a;
  color: #b45309;
}

.ticket-status-box.assigned {
  background-color: #dbeafe;
  border-color: #bfdbfe;
  color: #1d4ed8;
}

.ticket-status-box.resolved {
  background-color: #d1fae5;
  border-color: #a7f3d0;
  color: #047857;
}

.box-label {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.box-value {
  font-size: 1.25rem;
  font-weight: 900;
  letter-spacing: 0.02em;
}

.ticket-info {
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 1rem;
  margin-bottom: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #475569;
}

.info-row strong {
  color: #0f172a;
}

.ticket-actions-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #475569;
}

.form-select {
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 0.6rem;
  font-size: 0.9rem;
  background-color: white;
  color: #334155;
  font-family: inherit;
}

.form-select:focus {
  outline: none;
  border-color: #1e3a8a;
}

.primary-btn {
  background-color: #1e3a8a;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  font-weight: 700;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.primary-btn:hover {
  background-color: #172554;
}

.primary-btn:disabled, .secondary-btn:disabled, .success-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.secondary-btn {
  background-color: #f1f5f9;
  border: 1px solid #cbd5e1;
  color: #334155;
  padding: 0.75rem 1rem;
  font-weight: 700;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.secondary-btn:hover {
  background-color: #e2e8f0;
}

.success-btn {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  font-weight: 700;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.success-btn:hover {
  background-color: #059669;
}

.w-100 { width: 100%; }
.mt-12 { margin-top: 12px; }
.mb-12 { margin-bottom: 12px; }

.resolved-note {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
  color: #047857;
  padding: 0.5rem 0;
}

.resolved-icon {
  font-size: 2.25rem;
}

.resolved-note p {
  font-size: 0.85rem;
  line-height: 1.4;
  margin: 0;
  font-weight: 500;
}

/* Protocols Card */
.protocol-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.protocol-list li {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  font-size: 0.85rem;
  color: #475569;
  line-height: 1.5;
}

.step-num {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #f1f5f9;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.protocol-list li strong {
  display: block;
  color: #1f2937;
  margin-bottom: 0.15rem;
}

/* Responsiveness */
@media (max-width: 1024px) {
  .investigation-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  .diagnostic-panel {
    padding: 1.25rem;
  }
  .property-details-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
