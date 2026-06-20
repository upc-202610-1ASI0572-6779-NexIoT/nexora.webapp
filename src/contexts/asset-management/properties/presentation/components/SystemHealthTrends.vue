<template>
  <div class="trends-card">
    <div class="trends-header">
      <h3 class="trends-title">System Health Trends</h3>
      <span class="badge-optimized">Optimized</span>
    </div>

    <!--
      .chart-outer  → overflow-x:auto (shows the scrollbar)
      .chart-inner  → fixed 560px wide (forces the Bar to be wider than the card)
      responsive:false → Chart.js respects the inline style width instead of filling its parent
    -->
    <div class="chart-outer">
      <div class="chart-inner">
        <Bar
          :data="chartData"
          :options="chartOptions"
          :style="{ width: '560px', height: '220px', display: 'block' }"
        />
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
  labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
  datasets: [
    {
      label: 'Health Trend',
      backgroundColor: [
        '#e2e8f0', '#e2e8f0', '#e2e8f0', '#e2e8f0', '#e2e8f0', '#e2e8f0', '#ff8c00'
      ],
      hoverBackgroundColor: '#cbd5e1',
      borderRadius: 4,
      data: [45, 65, 60, 85, 95, 90, 100],
      barPercentage: 0.55,
      categoryPercentage: 0.7
    }
  ]
});

const chartOptions = ref({
  responsive: false,          // MUST be false — otherwise Chart.js ignores the fixed width
  maintainAspectRatio: false, // height also controlled by inline style
  animation: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#2f2f2f',
      titleFont: { family: 'sans-serif' },
      bodyFont: { family: 'sans-serif' },
      padding: 12
    }
  },
  scales: {
    y: { display: false, beginAtZero: true },
    x: {
      grid: { display: false },
      border: { color: '#eaeaea' },
      ticks: {
        font: { family: 'sans-serif', size: 11, weight: '600' },
        color: '#94a3b8',
        padding: 10
      }
    }
  }
});
</script>

<style scoped>
.trends-card {
  background-color: white;
  border-radius: 4px;
  padding: 24px;
  border: 1px solid #eaeaea;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  /* These two together prevent the card from expanding past its grid track */
  min-width: 0;
  overflow: hidden;
}

.trends-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-shrink: 0;
}

.trends-title {
  font-size: 1.2rem;
  font-family: var(--font-general, sans-serif);
  color: #1a3673;
  font-weight: 700;
  margin: 0;
}

.badge-optimized {
  background-color: #a7f3d0;
  color: #065f46;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
}

/* Scroll container — constrained by the card which is constrained by the grid cell */
.chart-outer {
  overflow-x: auto;
  overflow-y: hidden;
  /* leave room so the scrollbar doesn't overlap the chart */
  padding-bottom: 8px;
}

/* Fixed-size inner box forces the chart to be wider than the card at small widths */
.chart-inner {
  width: 560px;   /* wider than a typical mobile card */
  height: 220px;
}

/* ─── Custom scrollbar ─── */
.chart-outer::-webkit-scrollbar        { height: 6px; }
.chart-outer::-webkit-scrollbar-track  { background: #f1f5f9; border-radius: 10px; }
.chart-outer::-webkit-scrollbar-thumb  { background: #cbd5e1; border-radius: 10px; }
.chart-outer::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

/* Firefox */
.chart-outer { scrollbar-width: thin; scrollbar-color: #cbd5e1 #f1f5f9; }
</style>
