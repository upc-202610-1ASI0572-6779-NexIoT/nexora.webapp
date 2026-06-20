<template>
  <div class="bottom-card dark-card">
    <h3 class="card-title">Voltage Gateway</h3>
    <div class="health-content" v-if="dashboardStore.stats">
      <div class="health-row">
        <span class="row-label">Grid Stability</span>
        <span :class="['row-value', dashboardStore.stats.voltageOk ? 'badge-active' : 'badge-danger']">
          {{ dashboardStore.stats.voltageOk ? 'STABLE' : 'ANOMALY' }}
        </span>
      </div>
      <div class="health-divider" :style="{ backgroundColor: dashboardStore.stats.voltageOk ? '#2ecc71' : '#e74c3c' }"></div>
      <div class="health-row">
        <span class="row-label">Current Load</span>
        <span class="row-value">{{ dashboardStore.stats.rawElectricity }} A</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useDashboardStore } from '../store/dashboardStore';
const dashboardStore = useDashboardStore();
</script>

<style scoped>
.bottom-card {
  border-radius: 4px;
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.dark-card {
  background-color: #1a3673; /* Primary dark blue from the theme */
  color: white;
}

.card-title {
  font-family: var(--font-general, sans-serif);
  font-size: 1rem;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 24px;
  color: white;
}

.health-content {
  display: flex;
  flex-direction: column;
}

.health-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.row-label {
  font-size: 0.95rem;
}

.row-value {
  font-weight: 700;
}

.badge-active {
  background-color: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  border: 1px solid #2ecc71;
}

.badge-danger {
  background-color: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  border: 1px solid #e74c3c;
}

.health-divider {
  height: 2px;
  background-color: #2ecc71;
  margin: 8px 0;
  width: 100%;
}

/* Responsiveness */
@media (max-width: 480px) {
  .bottom-card {
    padding: 16px;
  }
}
</style>
