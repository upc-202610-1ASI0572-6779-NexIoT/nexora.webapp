<script setup>
import { onMounted } from 'vue';
import { useReportsStore } from '@/features/reports/presentation/store/reportsStore';

const reportsStore = useReportsStore();

onMounted(() => {
  reportsStore.fetchReportsData();
});

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'optimal': return 'badge--success';
    case 'monitor': return 'badge--warning';
    case 'high-load': return 'badge--danger-text';
    default: return '';
  }
};

const getStatusText = (status) => {
  return status.replace('-', ' ').toUpperCase();
};
</script>

<template>
  <div class="reports-view">
    <!-- Loading State -->
    <div v-if="reportsStore.isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Loading Analytics...</p>
    </div>

    <template v-else-if="reportsStore.consumption">
      <!-- 1. Cabecera de la Vista -->
      <header class="view-header">
        <div class="view-header__titles">
          <h1 class="view-header__title">Consumption Reports</h1>
          <p class="view-header__subtitle">Analytical overview of resource utilization across all registered properties.</p>
        </div>
        
        <div class="view-header__actions">
          <button class="button--outline">
            <font-awesome-icon icon="file-pdf" />
            <span>EXPORT PDF</span>
          </button>
          <button class="button--solid-orange">
            <font-awesome-icon icon="file-csv" />
            <span>EXPORT CSV</span>
          </button>
        </div>
      </header>

      <!-- 2. Fila 1: KPIs y Gráfico Combinado -->
      <div class="analytics-top-row">
        <!-- Panel Izquierdo: Resumen de Consumo -->
        <aside class="consumption-summary">
          <!-- Energía -->
          <div class="kpi-card">
            <div class="kpi-card__header">
              <div class="kpi-card__icon-box kpi-card__icon-box--orange">
                <font-awesome-icon icon="bolt" />
              </div>
              <span :class="['trend-badge', `trend-badge--${reportsStore.consumption.energy.trendVariant}`]">
                {{ reportsStore.consumption.energy.trend }}
              </span>
            </div>
            <div class="kpi-card__body">
              <span class="kpi-card__label">ENERGY CONSUMPTION</span>
              <div class="kpi-card__value-row">
                <span class="kpi-card__value">{{ reportsStore.consumption.energy.value }}</span>
                <span class="kpi-card__unit">{{ reportsStore.consumption.energy.unit }}</span>
              </div>
              <span class="kpi-card__subtitle">Current Billing Period</span>
            </div>
          </div>

          <!-- Gas -->
          <div class="kpi-card">
            <div class="kpi-card__header">
              <div class="kpi-card__icon-box kpi-card__icon-box--orange">
                <font-awesome-icon icon="droplet" />
              </div>
              <span :class="['trend-badge', `trend-badge--${reportsStore.consumption.gas.trendVariant}`]">
                {{ reportsStore.consumption.gas.trend }}
              </span>
            </div>
            <div class="kpi-card__body">
              <span class="kpi-card__label">GAS CONSUMPTION</span>
              <div class="kpi-card__value-row">
                <span class="kpi-card__value">{{ reportsStore.consumption.gas.value }}</span>
                <span class="kpi-card__unit">{{ reportsStore.consumption.gas.unit }}</span>
              </div>
              <span class="kpi-card__subtitle">Current Billing Period</span>
            </div>
          </div>

          <!-- Costos -->
          <div class="kpi-card kpi-card--solid-blue">
            <div class="kpi-card__body">
              <div class="kpi-card__title-row">
                <font-awesome-icon icon="dollar-sign" />
                <span class="kpi-card__label">PROJECTED COSTS</span>
              </div>
              <span class="kpi-card__value">${{ reportsStore.consumption.projectedCosts.value }}</span>
              
              <div class="kpi-card__footer">
                <div class="budget-info">
                  <span>Budget Limit</span>
                  <span>${{ reportsStore.consumption.projectedCosts.budgetLimit }}</span>
                </div>
                <div class="progress-bar">
                  <div 
                    class="progress-bar__fill" 
                    :style="{ width: reportsStore.consumption.projectedCosts.budgetPercent + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Panel Derecho: Gráfico Comparativo -->
        <section class="comparative-chart-card">
          <header class="chart-header">
            <h2 class="chart-header__title">Comparative Consumption Analytics</h2>
            
            <div class="chart-header__legend">
              <div class="legend-item">
                <span class="dot dot--orange"></span>
                <span>Gas (m³)</span>
              </div>
              <div class="legend-item">
                <span class="dot dot--blue"></span>
                <span>Energy (kWh)</span>
              </div>
            </div>

            <select class="chart-filter">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </header>

          <div class="chart-canvas-container">
            <!-- Grid Lines Simulation -->
            <div class="chart-grid">
              <div v-for="val in [5000, 4000, 3000, 2000, 1000]" :key="val" class="grid-line">
                <span class="grid-label">{{ val }}</span>
              </div>
            </div>

            <!-- Bars Simulation -->
            <div class="chart-bars">
              <div v-for="(month, index) in reportsStore.chartData.months" :key="month" class="bar-group">
                <div class="bar-pair">
                  <div 
                    class="bar bar--energy" 
                    :style="{ height: (reportsStore.chartData.energy[index] / 5000) * 100 + '%' }"
                  ></div>
                  <div 
                    class="bar bar--gas" 
                    :style="{ height: (reportsStore.chartData.gas[index] / 5000) * 100 + '%' }"
                  ></div>
                </div>
                <span class="month-label">{{ month }}</span>
              </div>
            </div>

            <!-- Trend Line Simulation -->
            <svg class="trend-line" viewBox="0 0 600 100" preserveAspectRatio="none">
              <path d="M0,80 L100,60 L200,40 L300,50 L400,30 L500,20 L600,10" fill="none" stroke="#9ba8c9" stroke-width="2" stroke-dasharray="5,5" />
            </svg>
          </div>
        </section>
      </div>

      <!-- 3. Fila 2: Desglose y Analítica de IA -->
      <div class="analytics-bottom-row">
        <!-- Panel Izquierdo: Desglose por Propiedad -->
        <section class="property-breakdown-panel">
          <header class="panel-header">
            <h3 class="panel-header__title">Property Breakdown</h3>
            <a href="#" class="view-all-link">VIEW ALL PROPERTIES ></a>
          </header>

          <div class="table-container">
            <table class="data-table--minimal">
              <thead>
                <tr>
                  <th>PROPERTY NAME</th>
                  <th>LOCATION</th>
                  <th>ENERGY (kWh)</th>
                  <th>GAS (m³)</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="prop in reportsStore.propertyBreakdown" :key="prop.id">
                  <td class="cell--name">{{ prop.name }}</td>
                  <td class="cell--location">{{ prop.location }}</td>
                  <td>{{ prop.energy }}</td>
                  <td>{{ prop.gas }}</td>
                  <td>
                    <span :class="['badge', getStatusBadgeClass(prop.status)]">
                      {{ getStatusText(prop.status) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Panel Derecho: Insights de IA -->
        <aside class="ai-insights-card">
          <header class="ai-insights-card__header">
            <font-awesome-icon icon="lightbulb" class="lightbulb-icon" />
            <h3 class="ai-insights-card__title">AI Insights</h3>
          </header>

          <div class="insights-list">
            <div v-for="insight in reportsStore.aiInsights" :key="insight.id" :class="['insight-item', `insight-item--${insight.type}`]">
              <h4 class="insight-item__title">{{ insight.title }}</h4>
              <p class="insight-item__desc">{{ insight.description }}</p>
            </div>
          </div>

          <button class="button--outline-fullwidth mt-auto">FULL AUDIT LOG</button>
        </aside>
      </div>
    </template>
  </div>
</template>

<style scoped>
.reports-view {
  padding: 25px 30px;
  display: flex;
  flex-direction: column;
  gap: 25px;
  min-height: 400px;
  position: relative;
}

.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px;
  color: #1a237e;
  font-weight: 700;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #f47b20;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
/* ... rest of styles ... */

<style scoped>
.reports-view {
  padding: 25px 30px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* 1. Header */
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view-header__title {
  margin: 0;
  color: #1a237e;
  font-weight: 800;
  font-size: 1.8rem;
}

.view-header__subtitle {
  margin: 5px 0 0;
  color: #4a5568;
  font-size: 0.95rem;
}

.view-header__actions {
  display: flex;
  gap: 15px;
}

.button--outline {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #2d3748;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.button--solid-orange {
  background-color: #f47b20;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

/* 2. Top Row */
.analytics-top-row {
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 20px;
}

.consumption-summary {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.kpi-card {
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.kpi-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.kpi-card__icon-box {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.kpi-card__icon-box--orange {
  background-color: rgba(244, 123, 32, 0.1);
  color: #f47b20;
}

.trend-badge {
  font-size: 0.7rem;
  font-weight: 800;
  padding: 4px 8px;
  border-radius: 4px;
}

.trend-badge--success { background-color: #f0fff4; color: #38a169; }
.trend-badge--danger { background-color: #fff5f5; color: #d32f2f; }

.kpi-card__label {
  font-size: 0.7rem;
  font-weight: 800;
  color: #718096;
}

.kpi-card__value-row {
  display: flex;
  align-items: baseline;
  gap: 5px;
}

.kpi-card__value {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1a237e;
}

.kpi-card__unit {
  font-size: 0.9rem;
  color: #a0aec0;
  font-weight: 700;
}

.kpi-card__subtitle {
  font-size: 0.75rem;
  color: #a0aec0;
}

/* Cost Card Modifer */
.kpi-card--solid-blue {
  background-color: #1a237e;
  color: white;
  border: none;
}

.kpi-card--solid-blue .kpi-card__label {
  color: rgba(255, 255, 255, 0.7);
}

.kpi-card--solid-blue .kpi-card__value {
  color: white;
  margin-top: 10px;
}

.kpi-card__title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #f47b20;
}

.kpi-card__footer {
  margin-top: 15px;
}

.budget-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.progress-bar {
  height: 6px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar__fill {
  height: 100%;
  background-color: #f47b20;
  border-radius: 3px;
}

/* Comparative Chart */
.comparative-chart-card {
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 25px;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.chart-header__title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: #1a237e;
}

.chart-header__legend {
  display: flex;
  gap: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #4a5568;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dot--orange { background-color: #f47b20; }
.dot--blue { background-color: #1a237e; }

.chart-filter {
  background-color: #f7fafc;
  border: 1px solid #e2e8f0;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #4a5568;
  outline: none;
}

.chart-canvas-container {
  height: 350px;
  margin-top: 30px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.chart-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.grid-line {
  width: 100%;
  border-top: 1px solid #edf2f7;
  position: relative;
}

.grid-label {
  position: absolute;
  left: -40px;
  top: -8px;
  font-size: 0.7rem;
  color: #a0aec0;
  font-weight: 700;
}

.chart-bars {
  flex: 1;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  padding-bottom: 40px;
  z-index: 5;
}

.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.bar-pair {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 100%;
  width: 30px;
}

.bar {
  border-radius: 2px 2px 0 0;
  transition: height 0.5s ease;
}

.bar--energy { width: 18px; background-color: #1a237e; }
.bar--gas { width: 10px; background-color: #f47b20; }

.month-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #a0aec0;
}

.trend-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 310px;
  z-index: 10;
}

/* 3. Bottom Row */
.analytics-bottom-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.property-breakdown-panel {
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.panel-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #edf2f7;
}

.panel-header__title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a237e;
}

.view-all-link {
  color: #f47b20;
  font-weight: 700;
  font-size: 0.75rem;
  text-decoration: none;
}

.data-table--minimal {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.data-table--minimal th {
  padding: 15px 20px;
  background-color: #f8fafc;
  color: #a0aec0;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
}

.data-table--minimal td {
  padding: 15px 20px;
  border-bottom: 1px solid #edf2f7;
  font-size: 0.85rem;
  color: #4a5568;
}

.cell--name {
  color: #1a237e;
  font-weight: 700;
}

.cell--location {
  color: #718096;
}

/* Badges */
.badge {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 800;
  display: inline-block;
}

.badge--success { background-color: #f0fff4; color: #38a169; }
.badge--warning { background-color: #fffaf0; color: #f47b20; }
.badge--danger-text { color: #d32f2f; }

/* AI Insights */
.ai-insights-card {
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 25px;
  display: flex;
  flex-direction: column;
}

.ai-insights-card__header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 25px;
}

.lightbulb-icon {
  color: #f47b20;
  font-size: 1.2rem;
}

.ai-insights-card__title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a237e;
}

.insights-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.insight-item {
  background-color: #f7fafc;
  padding: 15px;
  border-radius: 0 6px 6px 0;
}

.insight-item--opportunity {
  border-left: 4px solid #f47b20;
}

.insight-item--efficiency {
  border-left: 4px solid #1a237e;
}

.insight-item__title {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: #2d3748;
}

.insight-item__desc {
  margin: 5px 0 0;
  font-size: 0.8rem;
  color: #718096;
  line-height: 1.5;
}

.button--outline-fullwidth {
  width: 100%;
  background: white;
  border: 2px solid #1a237e;
  color: #1a237e;
  padding: 12px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.85rem;
  margin-top: 25px;
  cursor: pointer;
  transition: all 0.2s;
}

.mt-auto { margin-top: auto; }

/* Responsive */
@media (max-width: 1400px) {
  .analytics-top-row { grid-template-columns: 1.2fr 2.8fr; }
}

@media (max-width: 1200px) {
  .analytics-top-row, .analytics-bottom-row { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .view-header { flex-direction: column; align-items: flex-start; gap: 15px; }
  .chart-header { flex-direction: column; gap: 15px; }
}
</style>