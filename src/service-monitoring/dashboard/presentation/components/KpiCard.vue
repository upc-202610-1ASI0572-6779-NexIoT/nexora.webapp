<template>
  <div class="kpi-card">
    <div class="kpi-header">
      <h3 :class="['kpi-title', colorClass]">{{ title }}</h3>
      <font-awesome-icon v-if="icon" :icon="icon" :class="['kpi-icon', colorClass]" />
    </div>
    <div :class="['kpi-value-container', colorClass]">
      <span class="kpi-value">{{ value }}</span>
      <span v-if="valueSub" class="kpi-value-sub">{{ valueSub }}</span>
      <span v-if="valueSuffix" class="kpi-value-suffix">{{ valueSuffix }}</span>
      <font-awesome-icon v-if="valueIcon" :icon="valueIcon" class="kpi-value-icon" />
    </div>
    <div class="kpi-subtitle">{{ subtitle }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  valueSub: {
    type: String,
    default: ''
  },
  valueSuffix: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  valueIcon: {
    type: String,
    default: ''
  },
  colorType: {
    type: String,
    default: 'default', // 'danger', 'success', 'primary'
  }
});

const colorClass = computed(() => {
  if (props.colorType === 'danger') return 'text-danger';
  if (props.colorType === 'success') return 'text-success';
  if (props.colorType === 'primary') return 'text-primary';
  return 'text-default';
});
</script>

<style scoped>
.kpi-card {
  background-color: white;
  border-radius: 4px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #eaeaea;
  flex: 1;
  min-width: 150px;
  display: flex;
  flex-direction: column;
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.kpi-title {
  font-family: var(--font-general, sans-serif);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  margin: 0;
  letter-spacing: 0.5px;
}

.kpi-icon {
  font-size: 1rem;
}

.kpi-value-container {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 4px;
}

.kpi-value {
  font-size: 2.5rem;
  font-weight: 700;
  font-family: var(--font-titles, sans-serif);
  line-height: 1;
}

.kpi-value-sub {
  font-size: 1.2rem;
  font-weight: 500;
  color: #7f8c8d;
}

.kpi-value-suffix {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.kpi-value-icon {
  font-size: 1rem;
  margin-left: 4px;
}

.kpi-subtitle {
  font-size: 0.8rem;
  color: #7f8c8d;
  font-family: var(--font-general, sans-serif);
}

.text-danger { color: #e74c3c; }
.text-success { color: #2ecc71; }
.text-primary { color: #e67e22; } /* using orange for daily energy */
.text-default { color: #2c3e50; } /* main text */

/* Responsiveness */
@media (max-width: 480px) {
  .kpi-card {
    padding: 12px;
  }
  .kpi-value {
    font-size: 2rem;
  }
}

@media (max-width: 320px) {
  .kpi-card {
    min-width: 100%;
    width: 100%;
  }
}
</style>
