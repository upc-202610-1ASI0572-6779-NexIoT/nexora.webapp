<template>
  <div class="chart-container">
    <div class="chart-header-row">
      <div class="chart-header-text">
        <h3 class="chart-title">Resource Consumption</h3>
        <p class="chart-subtitle">Gas (PPM) and Electricity (Amps) telemetry over time</p>
      </div>
    </div>
    <div class="chart-body">
      <div class="chart-empty">
        <font-awesome-icon icon="chart-line" class="chart-empty-icon" />
        <p class="chart-empty-text">Historical telemetry data will appear here once collected from your devices.</p>
        <p class="chart-empty-hint">Live readings are shown in the KPIs above.</p>
      </div>
    </div>
  </div>
</template>

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
  min-width: 0;
  overflow: hidden;
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

.chart-body {
  border-top: 1px solid #eaeaea;
  padding-top: 32px;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  color: #94a3b8;
}

.chart-empty-icon {
  font-size: 2rem;
  color: #cbd5e1;
  margin-bottom: 8px;
}

.chart-empty-text {
  font-size: 0.9rem;
  margin: 0;
  max-width: 320px;
  line-height: 1.5;
}

.chart-empty-hint {
  font-size: 0.8rem;
  margin: 0;
  color: #b0bcc9;
}

@media (max-width: 480px) {
  .chart-container {
    padding: 16px;
    width: 100%;
    min-width: 0;
  }
  .chart-body {
    min-height: 160px;
  }
}
</style>
