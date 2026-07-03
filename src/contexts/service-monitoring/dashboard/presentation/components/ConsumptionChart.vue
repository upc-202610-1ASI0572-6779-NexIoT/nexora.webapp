<template>
  <div class="chart-container">
    <div class="chart-header-row">
      <div class="chart-header-text">
        <h3 class="chart-title">Resource Consumption</h3>
        <p class="chart-subtitle">Live Gas (PPM) and Electricity (Amps) telemetry trends</p>
      </div>
      <div class="chart-toggle">
        <button 
          class="toggle-btn" 
          :class="{ active: currentRange === '24h' }"
          @click="toggleRange('24h')"
        >24 HOURS</button>
        <button 
          class="toggle-btn"
          :class="{ active: currentRange === '7d' }"
          @click="toggleRange('7d')"
        >7 DAYS</button>
      </div>
    </div>
    <div class="chart-body">
      <div class="chart-scroll-wrapper" v-if="chartDataReady">
        <Bar :data="chartData" :options="chartOptions" :style="{ width: '620px', height: '260px' }" />
      </div>
      <div v-else class="chart-loading-placeholder">
        Loading consumption trends...
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';
import apiClient from '@/shared/infrastructure/http/apiClient';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const currentRange = ref('24h');
const chartDataReady = ref(false);

const chartData = ref({
  labels: [],
  datasets: []
});

const loadChartData = async () => {
  try {
    const res = await apiClient.get('/api/v1/analytics/live-consumption', {
      params: { range: currentRange.value }
    });
    if (res.data) {
      chartData.value = {
        labels: res.data.labels,
        datasets: [
          {
            label: 'Gas Level (PPM)',
            backgroundColor: '#fdb173',
            borderRadius: 4,
            data: res.data.gas
          },
          {
            label: 'Electricity Load (Amps)',
            backgroundColor: '#1a3673',
            borderRadius: 4,
            data: res.data.electricity
          }
        ]
      };
      chartDataReady.value = true;
    }
  } catch (e) {
    console.error('Failed to load consumption chart data', e);
  }
};

const toggleRange = (range) => {
  currentRange.value = range;
  chartDataReady.value = false;
  loadChartData();
};

const chartOptions = ref({
  responsive: false,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      labels: {
        font: { family: 'sans-serif', size: 11, weight: 'bold' }
      }
    },
    tooltip: {
      backgroundColor: '#2f2f2f',
      titleFont: { family: 'sans-serif' },
      bodyFont: { family: 'sans-serif' },
      padding: 12
    }
  },
  scales: {
    y: {
      display: true,
      beginAtZero: true,
      grid: {
        color: '#f0f0f0',
        drawBorder: false
      }
    },
    x: {
      display: true,
      grid: {
        display: false,
        drawBorder: false
      }
    }
  }
});

let chartPollInterval = null;

onMounted(() => {
  loadChartData();
  chartPollInterval = setInterval(loadChartData, 5000);
});

onUnmounted(() => {
  if (chartPollInterval) {
    clearInterval(chartPollInterval);
  }
});
</script>

<style scoped>
.chart-container {
  background-color: white;
  border-radius: 4px;
  padding: 24px;
  border: 1px solid #eaeaea;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 0;     /* prevents expanding beyond grid track */
  overflow: hidden; /* clips the chart, forces .chart-body to scroll */
}

.chart-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.chart-header-text {
  display: flex;
  flex-direction: column;
}

.chart-title {
  font-size: 1.25rem;
  font-family: var(--font-general, sans-serif);
  font-weight: 700;
  color: #1a3673;
  margin: 0 0 4px 0;
}

.chart-subtitle {
  font-size: 0.85rem;
  color: #7f8c8d;
  margin: 0;
}

.chart-toggle {
  display: flex;
  background-color: #f8f9fc;
  border-radius: 4px;
  padding: 4px;
}

.toggle-btn {
  background: transparent;
  border: none;
  padding: 6px 12px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #7f8c8d;
  border-radius: 4px;
  cursor: pointer;
}

.toggle-btn.active {
  background-color: #e2e8f0;
  color: #2c3e50;
}

.chart-body {
  overflow-x: auto;
  overflow-y: hidden;
  border-top: 1px solid #eaeaea;
  border-bottom: 1px solid #eaeaea;
  padding-top: 16px;
  padding-bottom: 22px; /* space for scrollbar */
}

.chart-scroll-wrapper {
  width: 620px;  /* must match :style width on <Bar> */
  height: 260px; /* must match :style height on <Bar> */
}

/* Responsiveness */
@media (max-width: 768px) {
  .chart-header-row {
    flex-direction: column;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .chart-container {
    padding: 16px;
    width: 100%;
    min-width: 0;
  }
  
  .chart-body {
    min-height: 200px;
  }
}

/* Custom Scrollbar for the chart */
.chart-body::-webkit-scrollbar {
  height: 6px;
}

.chart-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.chart-body::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}

.chart-body::-webkit-scrollbar-thumb:hover {
  background: #999;
}

.chart-loading-placeholder {
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7f8c8d;
  font-size: 0.9rem;
}
</style>
