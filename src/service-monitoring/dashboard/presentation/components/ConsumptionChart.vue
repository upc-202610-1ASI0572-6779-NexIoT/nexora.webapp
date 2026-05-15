<template>
  <div class="chart-container">
    <div class="chart-header-row">
      <div class="chart-header-text">
        <h3 class="chart-title">Gas Levels (PPM)</h3>
        <p class="chart-subtitle">Live telemetry from Zone A-D over last 24h</p>
      </div>
      <div class="chart-toggle">
        <button class="toggle-btn active">24 HOURS</button>
        <button class="toggle-btn">7 DAYS</button>
      </div>
    </div>
    <div class="chart-body">
      <div class="chart-scroll-wrapper">
        <Bar :data="chartData" :options="chartOptions" :style="{ width: '620px', height: '260px' }" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
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

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const chartData = ref({
  labels: ['12 AM', '3 AM', '6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM'],
  datasets: [
    {
      label: 'Gas Level (PPM)',
      // We can use an array of colors to match the design (gray for normal, orange/red for high)
      backgroundColor: [
        '#e2e8f0', '#e2e8f0', '#e2e8f0', '#fdb173', '#e2e8f0', 
        '#e2e8f0', '#e2e8f0', '#fca5a5'
      ],
      hoverBackgroundColor: '#94a3b8',
      borderRadius: 2,
      data: [120, 180, 100, 420, 150, 140, 180, 480]
    }
  ]
});

const chartOptions = ref({
  responsive: false,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
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
      display: false, // Hide Y axis as in the design there are only faint grid lines without labels
      beginAtZero: true,
      grid: {
        color: '#f0f0f0',
        drawBorder: false
      }
    },
    x: {
      display: false, // Hide X axis
      grid: {
        display: false,
        drawBorder: false
      }
    }
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
</style>
