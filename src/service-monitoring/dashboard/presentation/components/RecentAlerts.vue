<template>
  <div class="alerts-container">
    <div class="alerts-header">
      <h3>Recent Alerts</h3>
      <span class="view-all">VIEW ALL</span>
    </div>
    
    <div class="alerts-list">
      <div v-for="(alert, index) in alerts" :key="index" class="alert-item">
        <div class="alert-icon-wrapper">
          <font-awesome-icon :icon="alert.icon" :class="['alert-icon', alert.type]" />
        </div>
        <div class="alert-content">
          <div class="alert-meta">
            <span :class="['alert-type-label', alert.type]">{{ alert.typeLabel }}</span>
            <span class="alert-time">{{ alert.time }}</span>
          </div>
          <div class="alert-title">{{ alert.title }}</div>
          <div class="alert-desc">{{ alert.desc }}</div>
          <button v-if="alert.action" class="alert-action-btn">{{ alert.action }}</button>
        </div>
      </div>
    </div>
    
    <div class="alerts-footer">
      Monitoring 1,240 data points in real time
      <button class="fab-button">
        <font-awesome-icon icon="plus" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const alerts = ref([
  {
    type: 'critical',
    typeLabel: 'CRITICAL',
    title: 'Gas Leak Detected - Zone B4',
    desc: 'Methane levels exceeded 500ppm threshold. Automatic shutoff engaged.',
    time: '2m ago',
    icon: 'triangle-exclamation',
    action: 'DISPATCH TEAM'
  },
  {
    type: 'warning',
    typeLabel: 'WARNING',
    title: 'Sensor Offline: Room 202',
    desc: 'Connectivity lost for more than 5 minutes. Check gateway link.',
    time: '14m ago',
    icon: 'triangle-exclamation'
  },
  {
    type: 'info',
    typeLabel: 'INFO',
    title: 'Daily Report Generated',
    desc: 'System performance report for yesterday is ready for review.',
    time: '1h ago',
    icon: 'circle-info'
  },
  {
    type: 'resolved',
    typeLabel: 'RESOLVED',
    title: 'Maintenance Complete',
    desc: 'Elevator 4 sensor recalibration finished successfully.',
    time: '2h ago',
    icon: 'circle-check'
  }
]);
</script>

<style scoped>
.alerts-container {
  background-color: white;
  border-radius: 4px;
  border: 1px solid #eaeaea;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.alerts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #eaeaea;
}

.alerts-header h3 {
  font-size: 1.1rem;
  font-family: var(--font-general, sans-serif);
  color: #1a3673; /* Primary dark blue */
  font-weight: 700;
  margin: 0;
}

.view-all {
  font-size: 0.75rem;
  font-weight: 700;
  color: #e67e22; /* Primary orange */
  cursor: pointer;
  letter-spacing: 0.5px;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.alert-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid #eaeaea;
}

.alert-icon-wrapper {
  margin-top: 2px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fc;
  border-radius: 4px;
}

.alert-icon.critical { color: #e74c3c; }
.alert-icon.warning { color: #e67e22; }
.alert-icon.info { color: #1a3673; }
.alert-icon.resolved { color: #2ecc71; }

.alert-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.alert-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.alert-type-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.alert-type-label.critical { color: #e74c3c; }
.alert-type-label.warning { color: #e67e22; }
.alert-type-label.info { color: #1a3673; }
.alert-type-label.resolved { color: #2ecc71; }

.alert-time {
  font-size: 0.75rem;
  color: #7f8c8d;
}

.alert-title {
  font-weight: 700;
  font-size: 0.95rem;
  color: #2c3e50;
  margin-bottom: 4px;
}

.alert-desc {
  font-size: 0.85rem;
  color: #7f8c8d;
  line-height: 1.4;
}

.alert-action-btn {
  margin-top: 12px;
  background-color: #c0392b; /* Darker red */
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  align-self: flex-start;
}

.alerts-footer {
  padding: 20px 24px;
  font-size: 0.8rem;
  color: #7f8c8d;
  text-align: center;
  position: relative;
  background-color: #fcfcfc;
  border-radius: 0 0 4px 4px;
}

.fab-button {
  position: absolute;
  right: 24px;
  bottom: -16px; /* Let it overflow a bit or sit on the edge? The design shows it at the bottom right of the card, perhaps slightly overlapping. Let's position it at the bottom edge. */
  bottom: 24px;
  width: 48px;
  height: 48px;
  border-radius: 8px; /* Slightly rounded corners */
  background-color: #e67e22; /* Primary orange */
  color: white;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(230, 126, 34, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsiveness */
@media (max-width: 480px) {
  .alerts-header, .alert-item, .alerts-footer {
    padding: 16px;
  }
  .fab-button {
    right: 16px;
    bottom: 16px;
    width: 40px;
    height: 40px;
  }
}
</style>
