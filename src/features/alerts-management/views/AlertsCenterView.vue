<template>
  <div class="page-container">
        <!-- Topbar -->
    <!-- <header class="topbar">
      <div class="search-container">
        <font-awesome-icon icon="search" class="search-icon" />
        <input type="text" placeholder="Search alerts, assets, or logs..." class="search-input" />
      </div>
      <div class="topbar-actions">
        <button class="notification-btn">
          <font-awesome-icon icon="bell" />
          <span class="notification-badge"></span>
        </button>
      </div>
    </header> -->
    <!-- Page Header -->
        <div class="page-header">
        <div>
          <div class="breadcrumbs">DASHBOARD > <strong>ALERTS CENTER</strong></div>
          <h1 class="page-title">Emergency Alerts Center</h1>
          <p class="page-subtitle">Real-time critical event monitoring across all industrial properties.</p>
        </div>
        <button class="export-btn">
          <font-awesome-icon icon="file-pdf" /> Export Incident Report (PDF)
        </button>
      </div>

      <!-- KPI Cards Row -->
      <div class="kpi-grid">
        <KpiCard
          title="ACTIVE CRITICAL"
          value="12"
          subtitle="Requires Immediate Action"
          variant="critical"
          icon="chart-line"
        />
        <KpiCard
          title="PENDING WARNINGS"
          value="28"
          subtitle="Awaiting Investigation"
          variant="warning"
          icon="clipboard-list"
        />
        <KpiCard
          title="MEAN RESPONSE TIME"
          value="4m 12s"
          subtitle="8% faster than avg."
          variant="positive"
        />
        <KpiCard
          title="SENSORS ONLINE"
          value="98.2%"
          subtitle="2,482 active nodes"
          variant="default"
        />
      </div>

      <!-- Recent Events Table -->
      <div class="table-section">
        <RecentEventsTable :events="recentEvents" />
      </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import KpiCard from '../components/KpiCard.vue';
import RecentEventsTable from '../components/RecentEventsTable.vue';

const recentEvents = ref([
  {
    timestamp: '2023-11-24 14:32:11',
    propertyId: 'PRP-7742-TX',
    sensorType: 'Carbon Monoxide',
    ppmLevel: '450.5',
    status: 'CRITICAL',
    action: 'INVESTIGATE'
  },
  {
    timestamp: '2023-11-24 14:28:45',
    propertyId: 'PRP-1092-NY',
    sensorType: 'Ambient Temp',
    ppmLevel: '88.2',
    status: 'WARNING',
    action: 'INVESTIGATE'
  },
  {
    timestamp: '2023-11-24 14:20:02',
    propertyId: 'PRP-3321-CA',
    sensorType: 'Humidity Sensor',
    ppmLevel: '12.4',
    status: 'INVESTIGATING',
    action: 'VIEW LOG'
  },
  {
    timestamp: '2023-11-24 14:15:33',
    propertyId: 'PRP-8821-IL',
    sensorType: 'Voltage spike',
    ppmLevel: '922.0',
    status: 'CRITICAL',
    action: 'INVESTIGATE'
  },
  {
    timestamp: '2023-11-24 13:45:10',
    propertyId: 'PRP-0021-FL',
    sensorType: 'Particle Matter',
    ppmLevel: '0.05',
    status: 'RESOLVED',
    action: 'REPORT'
  }
]);
</script>

<style scoped>
.page-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}



/* Page Header */
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

.export-btn {
  background-color: #f97316;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: 700;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  box-shadow: 0 4px 6px -1px rgba(249, 115, 22, 0.2);
  transition: all 0.2s;
}

.export-btn:hover {
  background-color: #ea580c;
  transform: translateY(-1px);
}

/* KPI Grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* Table Section */
.table-section {
  margin-bottom: 2rem;
}

/* Incident Grid */
.incident-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .incident-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .kpi-grid {
    grid-template-columns: 1fr;
  }
}
</style>
