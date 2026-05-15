<template>
  <div class="dashboard-content">
    <div v-if="dashboardStore.stats" class="kpis-row">
      <KpiCard 
        title="ACTIVE LEAKS" 
        :value="dashboardStore.stats.kpis.activeLeaks.toString().padStart(2, '0')" 
        subtitle="Critical incidents active" 
        colorType="danger" 
        icon="house-damage" 
      />
      <KpiCard 
        title="AIR QUALITY AVG" 
        :value="dashboardStore.stats.kpis.airQuality" 
        valueIcon="circle-check"
        subtitle="Optimal range (14 PPM)" 
        colorType="success" 
        icon="wind" 
      />
      <KpiCard 
        title="DEVICES ONLINE" 
        :value="dashboardStore.stats.kpis.devicesOnline.toString()" 
        :valueSub="'/' + dashboardStore.stats.kpis.totalDevices"
        subtitle="97.4% System Uptime" 
        colorType="default" 
        icon="signal" 
      />
      <KpiCard 
        title="DAILY ENERGY" 
        :value="dashboardStore.stats.kpis.dailyEnergy.toString()" 
        valueSuffix="kWh"
        subtitle="-4% from yesterday" 
        colorType="primary" 
        icon="bolt" 
      />
    </div>
    
    <div class="dashboard-main-grid">
      <div class="left-column">
        <div class="chart-section">
          <ConsumptionChart />
        </div>
        <div class="bottom-cards-row">
          <AirQualityCard />
          <SystemHealthCard />
        </div>
      </div>
      <div class="right-column">
        <div class="alerts-section">
          <RecentAlerts />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useDashboardStore } from '../store/dashboardStore';
import KpiCard from '../components/KpiCard.vue';
import ConsumptionChart from '../components/ConsumptionChart.vue';
import RecentAlerts from '../components/RecentAlerts.vue';
import AirQualityCard from '../components/AirQualityCard.vue';
import SystemHealthCard from '../components/SystemHealthCard.vue';

const dashboardStore = useDashboardStore();

onMounted(() => {
  dashboardStore.fetchStats();
});
</script>

<style scoped>
.dashboard-content {
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  min-width: 0;
  background-color: #f1f5f9; /* Same as background */
}

.kpis-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  width: 100%;
}

.dashboard-main-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  width: 100%;
  align-items: start;
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
}

.bottom-cards-row {
  display: flex;
  gap: 24px;
}

.right-column {
  min-width: 0;
  height: 100%;
}

.chart-section {
  min-width: 0;
  width: 100%;
}

.alerts-section {
  min-width: 0;
  width: 100%;
  height: 100%;
}

/* Responsiveness */
@media (max-width: 1200px) {
  .dashboard-main-grid {
    grid-template-columns: 1.5fr 1fr;
  }
}

@media (max-width: 1024px) {
  .kpis-row {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .dashboard-main-grid {
    grid-template-columns: 1fr;
  }
  
  .right-column {
    height: auto;
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    padding: 16px;
    gap: 16px;
  }
  
  .kpis-row {
    gap: 16px;
  }
  
  .left-column {
    gap: 16px;
  }
  
  .bottom-cards-row {
    flex-direction: column;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .kpis-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .dashboard-content {
    padding: 12px;
    gap: 16px;
  }
}
</style>
