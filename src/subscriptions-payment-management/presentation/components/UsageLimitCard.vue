<template>
  <aside class="usage-card" aria-label="Usage limits">
    <font-awesome-icon icon="signal" class="usage-watermark" />
    <h2>Usage Limit</h2>

    <div class="usage-metric">
      <div>
        <span>Active Devices</span>
        <strong>{{ usage.getActiveDevicesLabel() }}</strong>
      </div>
      <div class="usage-bar">
        <span :style="{ width: `${usage.getActiveDevicesPercentage()}%` }"></span>
      </div>
    </div>

    <div class="usage-metric">
      <div>
        <span>Data Processing</span>
        <strong>{{ usage.getDataProcessingLabel() }}</strong>
      </div>
      <div class="usage-bar">
        <span :style="{ width: `${usage.getDataProcessingPercentage()}%` }"></span>
      </div>
    </div>

    <p>{{ usage.getCycleSummary() }}</p>
  </aside>
</template>

<script setup>
defineProps({
  usage: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.usage-card {
  background: #082765;
  border: 1px solid #d7dde6;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.08);
  color: #ffffff;
  overflow: hidden;
  padding: 28px 30px;
  position: relative;
}

.usage-watermark {
  color: rgba(255, 255, 255, 0.08);
  font-size: 6.5rem;
  position: absolute;
  right: 22px;
  top: 22px;
}

.usage-card h2 {
  color: #ffffff;
  font-size: 1.75rem;
  line-height: 1.15;
  margin: 0;
  position: relative;
}

.usage-metric {
  margin-top: 24px;
  position: relative;
}

.usage-metric > div:first-child {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 0.94rem;
}

.usage-metric strong {
  color: #ffffff;
  white-space: nowrap;
}

.usage-bar {
  background: rgba(255, 255, 255, 0.28);
  height: 6px;
  margin-top: 8px;
}

.usage-bar span {
  background: var(--primary-color);
  display: block;
  height: 100%;
}

.usage-card p {
  color: #a8c0e8;
  font-size: 0.95rem;
  font-style: italic;
  line-height: 1.5;
  margin: 28px 0 0;
  max-width: 300px;
  position: relative;
}

@media (max-width: 768px) {
  .usage-card {
    padding: 20px;
  }
}
</style>
