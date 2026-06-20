<template>
  <div class="kpi-card">
    <div class="kpi-header">
      <h3 class="kpi-title">{{ title }}</h3>
      <font-awesome-icon v-if="icon" :icon="icon" class="kpi-icon" />
    </div>
    <div class="kpi-value-container">
      <span class="kpi-value">{{ value }}</span>
    </div>
    <div v-if="subtitle" class="kpi-subtitle">
      <font-awesome-icon v-if="subtitleIcon" :icon="subtitleIcon" class="subtitle-icon" />
      {{ subtitle }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: [String, Number],
  subtitle: String,
  icon: String,
  subtitleIcon: String
});
</script>

<style scoped>
.kpi-card {
  background-color: white;
  border-radius: 4px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #eaeaea;
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.kpi-title {
  font-family: var(--font-general, sans-serif);
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
  color: #7f8c8d;
}

.kpi-icon {
  font-size: 1.2rem;
  color: #1a3673;
}

.kpi-value-container {
  margin-bottom: 4px;
}

.kpi-value {
  font-size: 3rem;
  font-weight: 700;
  font-family: var(--font-titles, sans-serif);
  line-height: 1;
  color: #1a3673;
}

.kpi-subtitle {
  font-size: 0.85rem;
  font-family: var(--font-general, sans-serif);
  display: flex;
  align-items: center;
  gap: 6px;
  color: #7f8c8d;
}

.subtitle-icon {
  font-size: 0.85rem;
}

@media (max-width: 480px) {
  .kpi-card {
    padding: 16px;
  }
  .kpi-value {
    font-size: 2.5rem;
  }
}
</style>
