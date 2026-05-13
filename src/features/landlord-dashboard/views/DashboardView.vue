<template>
  <div class="dashboard-layout">
    <div :class="['sidebar-overlay', { 'is-active': isSidebarOpen }]" @click="isSidebarOpen = false"></div>
    <SidebarMenu :class="{ 'is-open': isSidebarOpen }" @close="isSidebarOpen = false" />
    <div class="main-content">
      <HeaderTop @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />
      
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
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SidebarMenu from '@/components/SidebarMenu.vue';
import HeaderTop from '@/components/HeaderTop.vue';
import KpiCard from '../components/KpiCard.vue';
import ConsumptionChart from '../components/ConsumptionChart.vue';
import RecentAlerts from '../components/RecentAlerts.vue';

const isSidebarOpen = ref(false);
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: var(--bg-primary);
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  min-width: 0;
}

.dashboard-content {
  padding: 0 32px 32px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  min-width: 0;
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.sidebar-overlay.is-active {
  opacity: 1;
  pointer-events: auto;
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
