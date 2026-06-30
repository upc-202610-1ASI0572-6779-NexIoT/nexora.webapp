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
        <button class="export-btn" @click="exportIncidentReport" :disabled="isExporting">
          <font-awesome-icon :icon="isExporting ? 'spinner' : 'file-pdf'" :spin="isExporting" />
          {{ isExporting ? 'Exporting PDF...' : 'Export Incident Report (PDF)' }}
        </button>
      </div>

      <!-- KPI Cards Row -->
      <div class="kpi-grid">
        <KpiCard
          title="ACTIVE CRITICAL"
          :value="activeCriticalCount.toString()"
          subtitle="Requires Immediate Action"
          variant="critical"
          icon="chart-line"
        />
        <KpiCard
          title="PENDING WARNINGS"
          :value="pendingWarningsCount.toString()"
          subtitle="Awaiting Investigation"
          variant="warning"
          icon="clipboard-list"
        />
        <KpiCard
          title="MEAN RESPONSE TIME"
          value="1m 35s"
          subtitle="Realtime updates active"
          variant="positive"
        />
        <KpiCard
          title="SENSORS ONLINE"
          :value="sensorsOnlineValue"
          :subtitle="sensorsOnlineSubtitle"
          variant="default"
        />
      </div>

      <!-- Recent Events Table -->
      <div class="table-section">
        <RecentEventsTable 
          :events="recentEvents" 
          :current-page="currentPage"
          :total-pages="totalPages"
          :total-alerts="totalAlerts"
          :page-size="pageSize"
          @page-change="onPageChange"
          @filter-change="onFilterChange"
        />
      </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import apiClient from '@/shared/infrastructure/http/apiClient';
import KpiCard from '../components/KpiCard.vue';
import RecentEventsTable from '../components/RecentEventsTable.vue';

const recentEvents = ref([]);
const activeCriticalCount = ref(0);
const pendingWarningsCount = ref(0);

const sensorsOnlineValue = ref('0%');
const sensorsOnlineSubtitle = ref('0 active safety units');

// Pagination & Filtering State
const currentPage = ref(1);
const pageSize = ref(5);
const totalAlerts = ref(0);
const totalPages = ref(1);

const filterSeverity = ref('');
const filterType = ref('');

const isExporting = ref(false);

const exportIncidentReport = async () => {
  if (isExporting.value) return;
  isExporting.value = true;
  try {
    const response = await apiClient.get('/api/v1/alerts/reports?format=pdf', {
      responseType: 'blob'
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    
    let fileName = `alerts_report.pdf`;
    const contentDisposition = response.headers['content-disposition'];
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) {
        fileName = match[1];
      }
    }
    
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  } catch (e) {
    console.error('Failed to export PDF report', e);
  } finally {
    isExporting.value = false;
  }
};

const fetchAlerts = async (page = 1) => {
  try {
    currentPage.value = page;
    const res = await apiClient.get('/api/v1/alerts', {
      params: {
        page: page,
        pageSize: pageSize.value,
        severity: filterSeverity.value || null,
        type: filterType.value || null
      }
    });
    
    if (res.data) {
      recentEvents.value = res.data.map(alert => {
        let status = 'WARNING';
        if (alert.severity === 'Critical') {
          status = 'CRITICAL';
        }

        let sensorType = alert.type;
        let ppmLevel = '-';
        if (alert.type.toLowerCase().includes('gas')) {
          ppmLevel = alert.reading > 0 ? `${alert.reading.toFixed(1)} PPM` : 'Gas Anomaly';
        } else if (alert.type.toLowerCase().includes('overcurrent') || alert.type.toLowerCase().includes('current')) {
          ppmLevel = alert.reading > 0 ? `${alert.reading.toFixed(1)} A` : 'Overload';
        } else if (alert.type.toLowerCase().includes('voltage')) {
          ppmLevel = alert.reading === 0 ? 'Fault' : 'OK';
        } else if (alert.type.toLowerCase().includes('intrus') || alert.type.toLowerCase().includes('motion')) {
          ppmLevel = 'Intrusion';
        } else if (alert.reading > 0) {
          ppmLevel = alert.reading.toFixed(1);
        }

        const date = new Date(alert.timestamp);
        const timestampFormatted = date.toISOString().replace('T', ' ').substring(0, 19);

        let propertyId = alert.propertyName || 'Unassigned';

        return {
          id: alert.id,
          timestamp: timestampFormatted,
          propertyId: propertyId,
          sensorType: sensorType,
          ppmLevel: ppmLevel,
          status: status,
          action: status === 'CRITICAL' ? 'INVESTIGATE' : 'VIEW LOG'
        };
      });

      // Parse Total Count header for dynamic pagination calculations
      const totalHeader = res.headers['x-total-count'];
      if (totalHeader) {
        totalAlerts.value = parseInt(totalHeader, 10);
        totalPages.value = Math.ceil(totalAlerts.value / pageSize.value);
      } else {
        totalAlerts.value = recentEvents.value.length;
        totalPages.value = 1;
      }
      
      // Fetch total active critical alerts count across all pages
      try {
        const critRes = await apiClient.get('/api/v1/alerts', {
          params: { page: 1, pageSize: 1, severity: 'Critical', type: filterType.value || null }
        });
        const totalCritical = critRes.headers['x-total-count'];
        activeCriticalCount.value = totalCritical ? parseInt(totalCritical, 10) : 0;
      } catch (err) {
        console.error('Failed to fetch active critical count', err);
        activeCriticalCount.value = 0;
      }

      // Fetch total pending warning alerts count across all pages
      try {
        const warnRes = await apiClient.get('/api/v1/alerts', {
          params: { page: 1, pageSize: 1, severity: 'Warning', type: filterType.value || null }
        });
        const totalWarning = warnRes.headers['x-total-count'];
        pendingWarningsCount.value = totalWarning ? parseInt(totalWarning, 10) : 0;
      } catch (err) {
        console.error('Failed to fetch pending warnings count', err);
        pendingWarningsCount.value = 0;
      }
    }
  } catch (e) {
    console.error('Failed to fetch alerts from backend', e);
  }
};

const fetchDevicesStatus = async () => {
  try {
    const res = await apiClient.get('/api/v1/devices');
    if (res.data) {
      const devices = res.data;
      const total = devices.length;
      const onlineCount = devices.filter(d => d.connectionStatus && d.connectionStatus.toLowerCase() === 'online').length;
      const percentage = total > 0 ? (onlineCount / total) * 100 : 0;
      
      sensorsOnlineValue.value = percentage > 0 ? (percentage % 1 === 0 ? `${percentage}%` : `${percentage.toFixed(1)}%`) : '0%';
      sensorsOnlineSubtitle.value = `${onlineCount} of ${total} units active`;
    }
  } catch (e) {
    console.error('Failed to fetch devices status', e);
    sensorsOnlineValue.value = '0%';
    sensorsOnlineSubtitle.value = '0 active safety units';
  }
};

const onPageChange = (newPage) => {
  fetchAlerts(newPage);
};

const onFilterChange = (filters) => {
  filterSeverity.value = filters.severity;
  filterType.value = filters.type;
  fetchAlerts(1); // Reset to page 1 on filter changes
};

onMounted(() => {
  fetchAlerts(1);
  fetchDevicesStatus();
});
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

.export-btn:disabled {
  background-color: #cbd5e1;
  color: #64748b;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
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
