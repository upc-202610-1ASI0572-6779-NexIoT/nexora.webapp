<template>
  <div class="bottom-card">
    <h3 class="card-title">Gas & Water Status</h3>
    <div class="aqi-content" v-if="dashboardStore.stats">
      <div class="aqi-score" :style="{ borderColor: dashboardStore.stats.rawGas > 100 ? '#e74c3c' : '#2ecc71' }">
        <div class="score-value" :style="{ color: dashboardStore.stats.rawGas > 100 ? '#e74c3c' : '#2ecc71', fontSize: '1.2rem' }">
          {{ dashboardStore.stats.rawGas > 100 ? 'LEAK' : 'SAFE' }}
        </div>
      </div>
      <div class="aqi-details">
        <div class="detail-item">Methane Gas Level:<br><strong>{{ dashboardStore.stats.rawGas }} PPM</strong></div>
        <div class="detail-item">Water Flow Rate:<br><strong>{{ dashboardStore.stats.rawWater }} Lpm</strong></div>
        <div class="detail-item">Alert Threshold:<br><strong>100 PPM</strong></div>
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
  background-color: white;
  border-radius: 4px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #eaeaea;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-family: var(--font-general, sans-serif);
  font-size: 1rem;
  font-weight: 700;
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 24px;
}

.aqi-content {
  display: flex;
  align-items: center;
  gap: 24px;
}

.aqi-score {
  width: 80px;
  height: 90px;
  border: 4px solid #2ecc71;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.score-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2ecc71;
}

.aqi-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 0.85rem;
  color: #7f8c8d;
}

/* Responsiveness */
@media (max-width: 480px) {
  .bottom-card {
    padding: 16px;
  }
  .aqi-content {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
