<template>
  <div class="chart-container">
    <div class="chart-header">
      <font-awesome-icon icon="table-cells-large" class="chart-icon" />
      <h3 class="chart-title">Weekly Consumption by Building</h3>
    </div>
    <div class="chart-body">
      <div class="chart-scroll-wrapper">
        <Bar :data="chartData" :options="chartOptions" />
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
  labels: ['Building A', 'Building B', 'Building C', 'Building D', 'Building E'],
  datasets: [
    {
      label: 'Consumption (kWh)',
      backgroundColor: 'rgba(23, 49, 131, 0.1)',
      hoverBackgroundColor: '#173183',
      borderRadius: 4,
      data: [320, 450, 210, 390, 280]
    }
  ]
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: '#2f2f2f',
      titleFont: { family: 'Inter' },
      bodyFont: { family: 'Inter' },
      padding: 12
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: '#f0f0f0',
        drawBorder: false
      },
      ticks: {
        font: { family: 'Inter', size: 11 },
        color: '#7f8c8d',
        callback: (value) => value + ' kWh'
      }
    },
    x: {
      grid: {
        display: false,
        drawBorder: false
      },
      ticks: {
        font: { family: 'Inter', size: 11 },
        color: '#7f8c8d',
        maxRotation: 45,
        minRotation: 0,
        autoSkip: true
      }
    }
  }
});
</script>

<style scoped>
.chart-container {
  background-color: #f8f9fc;
  border-radius: 8px;
  padding: 24px;
  border: 1px solid #eaeaea;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chart-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
  color: var(--secondary-color);
}

.chart-icon {
  font-size: 2rem;
  margin-bottom: 8px;
}

.chart-title {
  font-size: 1.1rem;
  font-family: var(--font-general);
  font-weight: 600;
  color: var(--secondary-color);
}

.chart-body {
  flex: 1;
  min-height: 250px;
  overflow-x: auto;
  overflow-y: hidden;
  position: relative;
}

.chart-scroll-wrapper {
  height: 100%;
  min-width: 100%;
}

/* Responsiveness */
@media (max-width: 480px) {
  .chart-container {
    padding: 16px;
    width: 100%;
    min-width: 0;
  }
  
  .chart-scroll-wrapper {
    min-width: 450px; /* Ensure chart doesn't squash, instead it scrolls */
  }
  
  .chart-body {
    min-height: 220px;
    width: 100%;
  }
  
  .chart-title {
    font-size: 1rem;
  }
  
  .chart-icon {
    font-size: 1.5rem;
  }
}

@media (max-width: 360px) {
  .chart-container {
    padding: 12px;
  }
  
  .chart-scroll-wrapper {
    min-width: 400px;
  }
  
  .chart-body {
    min-height: 200px;
  }
  
  .chart-header {
    margin-bottom: 16px;
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
  background: var(--secondary-color);
}
</style>
