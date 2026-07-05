<template>
  <div class="dashboard-content">
    <div v-if="dashboardStore.isLoading" class="loading-state">
      <font-awesome-icon icon="spinner" spin class="loading-spinner" />
      <span>Loading dashboard data...</span>
    </div>

    <div v-else-if="dashboardStore.stats" class="kpis-row">
      <KpiCard
          title="ACTIVE THREATS"
          :value="String(countAlerts).padStart(2, '0')"
          subtitle="Critical incidents active"
          colorType="danger"
          icon="triangle-exclamation"
      />
      <KpiCard
          title="GAS LEVEL"
          :value="displayGas"
          valueIcon="fire-flame-curved"
          subtitle="Optimal range (<50 PPM)"
          :colorType="gasColor"
          icon="fire-flame-curved"
      />
      <KpiCard
          title="DEVICES ONLINE"
          :value="displayDevices"
          subtitle="System uptime"
          colorType="default"
          icon="signal"
      />
      <KpiCard
          title="VOLTAGE GATEWAY"
          :value="displayVoltage"
          valueSuffix=" A"
          subtitle="Active consumption load"
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
import { computed, onMounted, onUnmounted } from 'vue';
import { useDashboardStore } from '../store/dashboardStore';
import KpiCard from '../components/KpiCard.vue';
import ConsumptionChart from '../components/ConsumptionChart.vue';
import RecentAlerts from '../components/RecentAlerts.vue';
import AirQualityCard from '../components/AirQualityCard.vue';
import SystemHealthCard from '../components/SystemHealthCard.vue';

const dashboardStore = useDashboardStore();

const countAlerts = computed(() =>
    dashboardStore.stats?.kpis?.activeLeaks ?? 0
);

const displayGas = computed(() =>
    dashboardStore.stats?.kpis?.airQuality ?? '--'
);

const gasColor = computed(() => {
  const raw = dashboardStore.stats?.rawGas;
  if (raw === null || raw === undefined) return 'default';
  return raw > 100 ? 'danger' : raw > 50 ? 'warning' : 'success';
});

const displayDevices = computed(() => {
  const online = dashboardStore.stats?.kpis?.devicesOnline;
  const total = dashboardStore.stats?.kpis?.totalDevices;
  if (online === null || online === undefined) return '--';
  return total !== null && total !== undefined ? `${online} / ${total}` : String(online);
});

const displayVoltage = computed(() => {
  const val = dashboardStore.stats?.kpis?.dailyEnergy;
  return val !== null && val !== undefined ? val : '--';
});

let dashboardPollInterval = null;

onMounted(() => {
  dashboardStore.fetchStats();
  dashboardPollInterval = setInterval(() => {
    dashboardStore.fetchStats();
  }, 5000);
});

onUnmounted(() => {
  if (dashboardPollInterval) {
    clearInterval(dashboardPollInterval);
  }
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
  background-color: #f1f5f9;
}

.loading-state {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 32px;
  justify-content: center;
  color: #64748b;
  font-size: 0.95rem;
}

.loading-spinner {
  font-size: 1.2rem;
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
