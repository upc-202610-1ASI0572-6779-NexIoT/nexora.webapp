<template>
  <div :class="['kpi-card', { 'dark-card': isDark }]">
    <div class="kpi-header">
      <h3 class="kpi-title">{{ title }}</h3>
      <font-awesome-icon v-if="icon" :icon="icon" :class="['kpi-icon', iconColorClass]" />
    </div>
    <div class="kpi-value-container">
      <span class="kpi-value">{{ value }}</span>
    </div>
    <div :class="['kpi-subtitle', subtitleColorClass]">
      <font-awesome-icon v-if="subtitleIcon" :icon="subtitleIcon" class="subtitle-icon" />
      {{ subtitle }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: String,
  value: [String, Number],
  subtitle: String,
  icon: String,
  subtitleIcon: String,
  isDark: { type: Boolean, default: false },
  iconColorType: { type: String, default: 'default' },
  subtitleColorType: { type: String, default: 'success' }
});

const iconColorClass = computed(() => {
  if (props.iconColorType === 'primary') return 'text-primary'; // Orange
  if (props.iconColorType === 'success') return 'text-success'; // Green
  return 'text-default';
});

const subtitleColorClass = computed(() => {
  if (props.subtitleColorType === 'danger') return 'text-danger';
  if (props.subtitleColorType === 'success') return 'text-success';
  if (props.isDark) return 'text-light';
  return 'text-muted';
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

.kpi-card.dark-card {
  background-color: #1a3673; /* Dark blue */
  color: white;
  border: none;
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

.dark-card .kpi-title {
  color: rgba(255, 255, 255, 0.8);
}

.kpi-icon {
  font-size: 1.2rem;
}

.kpi-value-container {
  margin-bottom: 12px;
}

.kpi-value {
  font-size: 3rem;
  font-weight: 700;
  font-family: var(--font-titles, sans-serif);
  line-height: 1;
  color: #1a3673;
}

.dark-card .kpi-value {
  color: white;
}

.kpi-subtitle {
  font-size: 0.85rem;
  font-family: var(--font-general, sans-serif);
  display: flex;
  align-items: center;
  gap: 6px;
}

.subtitle-icon {
  font-size: 0.85rem;
}

.text-danger { color: #e74c3c; }
.text-success { color: #2ecc71; }
.text-primary { color: #e67e22; }
.text-default { color: #1a3673; }
.text-muted { color: #7f8c8d; }
.text-light { color: rgba(255, 255, 255, 0.8); }
.dark-card .text-default { color: white; }

/* Responsiveness */
@media (max-width: 480px) {
  .kpi-card {
    padding: 16px;
  }
  .kpi-value {
    font-size: 2.5rem;
  }
}
</style>
