<script setup>
import { onMounted, computed } from 'vue';
import { useReportsStore } from '../store/reportsStore';
import apiClient from '@/shared/infrastructure/http/apiClient';
import { useI18n } from '@/shared/presentation/i18n';

const reportsStore = useReportsStore();
const { t } = useI18n();

onMounted(() => {
  reportsStore.fetchReportsData();
});

const maxChartValue = computed(() => {
  const energyMax = reportsStore.chartData.energy.length > 0 ? Math.max(...reportsStore.chartData.energy) : 0;
  const gasMax = reportsStore.chartData.gas.length > 0 ? Math.max(...reportsStore.chartData.gas) : 0;
  const waterMax = (reportsStore.chartData.water && reportsStore.chartData.water.length > 0) ? Math.max(...reportsStore.chartData.water) : 0;
  const overallMax = Math.max(energyMax, gasMax, waterMax);
  const limit = Math.ceil(overallMax / 1000) * 1000;
  return limit > 0 ? limit : 5000;
});

const gridValues = computed(() => {
  const max = maxChartValue.value;
  const step = max / 5;
  const vals = [];
  for (let i = 5; i >= 1; i--) {
    vals.push(Math.round(step * i));
  }
  return vals;
});

const barWidth = computed(() => {
  const count = reportsStore.chartData.months ? reportsStore.chartData.months.length : 0;
  if (count <= 1) return '55px';
  if (count <= 3) return '35px';
  if (count <= 6) return '20px';
  return '10px';
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
  switch (status) {
    case 'optimal': return t('reportsPage.breakdown.status.optimal');
    case 'monitor': return t('reportsPage.breakdown.status.monitor');
    case 'high-load': return t('reportsPage.breakdown.status.highLoad');
    default: return status.replace('-', ' ').toUpperCase();
  }
};

const handleExportPdf = async () => {
  try {
    const months = reportsStore.selectedMonths;
    const response = await apiClient.get('/api/v1/reports/consumption/export', {
      params: { months },
      responseType: 'blob'
    });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `consumption_report_${new Date().toISOString().split('T')[0]}.pdf`;
    link.click();
    window.URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error('Failed to export consumption PDF report', error);
  }
};
</script>

<template>
  <div class="reports-view">
    <!-- Loading State -->
    <div v-if="reportsStore.isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p>{{ t('reportsPage.loading') }}</p>
    </div>

    <template v-else>
      <!-- 1. Header -->
      <header class="view-header">
        <div>
          <h2 class="view-header__title">{{ t('reportsPage.title') }}</h2>
          <p class="view-header__subtitle">{{ t('reportsPage.subtitle') }}</p>
        </div>
        <div class="view-header__actions">
          <button class="button--outline" @click="handleExportPdf">
            <font-awesome-icon icon="file-pdf" />
            {{ t('reportsPage.exportPdf') }}
          </button>
        </div>
      </header>

      <!-- 2. Fila 1: KPIs y Gráfico Comparativo -->
      <div class="analytics-top-row">
        <!-- Resumen Rápido -->
        <div class="consumption-summary">
          <!-- Tarjeta de Costos -->
          <div class="kpi-card kpi-card--solid-blue">
            <div class="kpi-card__header">
              <span class="kpi-card__label">{{ t('reportsPage.kpis.estimatedCost') }}</span>
              <span class="trend-badge trend-badge--success">
                {{ t('reportsPage.kpis.vsLastPeriod', { trend: '-3.2' }) }}
              </span>
            </div>
            <div class="kpi-card__value-row">
              <span class="kpi-card__value">${{ reportsStore.consumptionSummary.estimatedCost.toFixed(2) }}</span>
              <span class="kpi-card__unit">USD</span>
            </div>
            <div class="kpi-card__footer">
              <div class="budget-info">
                <span>{{ t('reportsPage.kpis.budgetPlan') }}</span>
                <span>{{ t('reportsPage.kpis.budgetUsed', { percent: Math.round(reportsStore.consumptionSummary.budgetPercent) }) }}</span>
              </div>
              <div class="progress-bar">
                <div class="progress-bar__fill" :style="{ width: reportsStore.consumptionSummary.budgetPercent + '%' }"></div>
              </div>
            </div>
          </div>

          <!-- Tarjeta de Luz -->
          <div v-if="reportsStore.hasElectricityLinked" class="kpi-card">
            <div class="kpi-card__header">
              <span class="kpi-card__label">{{ t('reportsPage.kpis.totalEnergy') }}</span>
              <div class="kpi-card__icon-box kpi-card__icon-box--orange">
                <font-awesome-icon icon="bolt" />
              </div>
            </div>
            <div class="kpi-card__value-row">
              <span class="kpi-card__value">{{ reportsStore.consumptionSummary.totalElectricity }}</span>
              <span class="kpi-card__unit">kWh</span>
            </div>
            <span class="kpi-card__subtitle">{{ t('reportsPage.kpis.allProperties') }}</span>
          </div>

          <!-- Tarjeta de Gas -->
          <div v-if="reportsStore.hasGasLinked" class="kpi-card">
            <div class="kpi-card__header">
              <span class="kpi-card__label">{{ t('reportsPage.kpis.totalGas') }}</span>
              <div class="kpi-card__icon-box kpi-card__icon-box--blue">
                <font-awesome-icon icon="fire-flame-curved" />
              </div>
            </div>
            <div class="kpi-card__value-row">
              <span class="kpi-card__value">{{ reportsStore.consumptionSummary.totalGas }}</span>
              <span class="kpi-card__unit">m³</span>
            </div>
            <span class="kpi-card__subtitle">{{ t('reportsPage.kpis.aggregatedGas') }}</span>
          </div>
        </div>

        <!-- Gráfico Comparativo -->
        <section class="comparative-chart-card">
          <header class="chart-header">
            <div>
              <h3 class="chart-header__title">{{ t('reportsPage.chart.title') }}</h3>
              <p class="view-header__subtitle">{{ t('reportsPage.chart.subtitle') }}</p>
            </div>

            <div class="chart-header__legend">
              <div v-if="reportsStore.hasElectricityLinked" class="legend-item">
                <span class="dot dot--blue"></span>
                <span>{{ t('reportsPage.chart.energy') }}</span>
              </div>
              <div v-if="reportsStore.hasGasLinked" class="legend-item">
                <span class="dot dot--orange"></span>
                <span>{{ t('reportsPage.chart.gas') }}</span>
              </div>
              <div v-if="reportsStore.hasWaterLinked" class="legend-item">
                <span class="dot dot--cyan"></span>
                <span>{{ t('reportsPage.chart.water') }}</span>
              </div>
            </div>

            <select
                class="chart-filter"
                v-model="reportsStore.selectedMonths"
                @change="reportsStore.fetchReportsData()"
            >
              <option :value="1">{{ t('reportsPage.chart.filters.lastMonth') }}</option>
              <option :value="3">{{ t('reportsPage.chart.filters.last3Months') }}</option>
              <option :value="6">{{ t('reportsPage.chart.filters.last6Months') }}</option>
              <option :value="12">{{ t('reportsPage.chart.filters.lastYear') }}</option>
              <option :value="24">{{ t('reportsPage.chart.filters.last2Years') }}</option>
            </select>
          </header>

          <div class="chart-canvas-container">
            <!-- Grid Lines Simulation -->
            <div class="chart-grid">
              <div v-for="val in gridValues" :key="val" class="grid-line">
                <span class="grid-label">{{ val }}</span>
              </div>
            </div>

            <!-- Bars Simulation -->
            <div class="chart-bars">
              <div v-for="(month, index) in reportsStore.chartData.months" :key="month" class="bar-group">
                <div class="bar-pair">
                  <div
                      v-if="reportsStore.hasElectricityLinked"
                      class="bar bar--energy"
                      :style="{ height: (reportsStore.chartData.energy[index] / maxChartValue) * 100 + '%', width: barWidth }"
                  ></div>
                  <div
                      v-if="reportsStore.hasGasLinked"
                      class="bar bar--gas"
                      :style="{ height: (reportsStore.chartData.gas[index] / maxChartValue) * 100 + '%', width: barWidth }"
                  ></div>
                  <div
                      v-if="reportsStore.hasWaterLinked"
                      class="bar bar--water"
                      :style="{ height: (reportsStore.chartData.water[index] / maxChartValue) * 100 + '%', width: barWidth }"
                  ></div>
                </div>
                <span class="month-label">{{ month }}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- 3. Fila 2: Desglose y Analítica de IA -->
      <div class="analytics-bottom-row">
        <!-- Panel Izquierdo: Desglose por Propiedad -->
        <section class="property-breakdown-panel">
          <header class="panel-header">
            <h3 class="panel-header__title">{{ t('reportsPage.breakdown.title') }}</h3>
            <router-link :to="{ name: 'buildings' }" class="view-all-link">{{ t('reportsPage.breakdown.viewAll') }}</router-link>
          </header>

          <div class="table-container">
            <table class="data-table--minimal">
              <thead>
              <tr>
                <th>{{ t('reportsPage.breakdown.headers.name') }}</th>
                <th>{{ t('reportsPage.breakdown.headers.location') }}</th>
                <th v-if="reportsStore.hasElectricityLinked">{{ t('reportsPage.breakdown.headers.energy') }}</th>
                <th v-if="reportsStore.hasGasLinked">{{ t('reportsPage.breakdown.headers.gas') }}</th>
                <th v-if="reportsStore.hasWaterLinked">{{ t('reportsPage.breakdown.headers.water') }}</th>
                <th>{{ t('reportsPage.breakdown.headers.status') }}</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="prop in reportsStore.propertyBreakdown" :key="prop.id">
                <td class="cell--name">{{ prop.name }}</td>
                <td class="cell--location">{{ prop.location }}</td>
                <td v-if="reportsStore.hasElectricityLinked">{{ prop.energy }}</td>
                <td v-if="reportsStore.hasGasLinked">{{ prop.gas }}</td>
                <td v-if="reportsStore.hasWaterLinked">{{ prop.water }}</td>
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

.kpi-card__icon-box--blue {
  background-color: rgba(6, 182, 212, 0.1);
  color: #06b6d4;
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
  display: flex;
  flex-direction: column;
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
.dot--cyan { background-color: #06b6d4; }

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
  flex: 1;
  min-height: 350px;
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
  height: 100%;
}

.bar-pair {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 100%;
  width: auto;
}

.bar {
  border-radius: 2px 2px 0 0;
  transition: height 0.5s ease;
  min-height: 3px;
}

.bar--energy { width: 12px; background-color: #1a237e; }
.bar--gas { width: 12px; background-color: #f47b20; }
.bar--water { width: 12px; background-color: #06b6d4; }

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
  grid-template-columns: 1fr;
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
