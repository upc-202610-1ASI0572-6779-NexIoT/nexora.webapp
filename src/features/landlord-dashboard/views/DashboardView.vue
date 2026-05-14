<template>
  <div class="dashboard-content">
    <div class="kpis-row">
      <KpiCard title="Today's Consumption" value="450 kWh" primary />
      <KpiCard title="Active Units" value="42/45" />
      <KpiCard title="Pending Alerts" value="3" highlight />
      <KpiCard title="Global Efficiency" value="92%" primary />
    </div>
    
    <div class="dashboard-grid">
      <div class="chart-section">
        <ConsumptionChart />
      </div>
      <div class="alerts-section">
        <RecentAlerts />
      </div>
    </div>
  </div>
</template>

<script setup>
import KpiCard from '../components/KpiCard.vue';
import ConsumptionChart from '../components/ConsumptionChart.vue';
import RecentAlerts from '../components/RecentAlerts.vue';
</script>

<style scoped>
.dashboard-content {
  padding: 0 32px 32px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  min-width: 0;
}

.kpis-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  width: 100%;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  width: 100%;
}

.chart-section, .alerts-section {
  min-width: 0;
  width: 100%;
}

/* Responsiveness */
@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: 0 16px 16px 16px;
  }
}

@media (max-width: 480px) {
  .kpis-row {
    gap: 12px;
    flex-direction: column; /* Force stack on very small screens to avoid squashing */
  }
  
  .dashboard-content {
    padding: 0 12px 12px 12px;
    gap: 16px;
  }
}
</style>
