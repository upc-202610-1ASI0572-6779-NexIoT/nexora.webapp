<template>
  <div class="kpi-card">
    <div class="kpi-card-title">{{ title }}</div>
    <div class="kpi-card-value-container" :class="valueColorClass">
      <span class="kpi-card-value">{{ value }}</span>
      <span v-if="icon" class="kpi-card-icon" :class="iconClass">
        <font-awesome-icon :icon="icon" />
      </span>
    </div>
    <div class="kpi-card-subtitle" :class="subtitleColorClass">
      {{ subtitle }}
    </div>
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
  subtitle: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'default', // 'critical', 'warning', 'positive', 'default'
  },
  icon: {
    type: String,
    default: ''
  }
});

const valueColorClass = computed(() => {
  switch (props.variant) {
    case 'critical': return 'text-critical';
    case 'warning': return 'text-warning';
    case 'default':
    case 'positive': return 'text-primary-dark';
    default: return 'text-primary-dark';
  }
});

const iconClass = computed(() => {
  switch (props.variant) {
    case 'critical': return 'text-critical';
    case 'warning': return 'text-warning';
    default: return '';
  }
});

const subtitleColorClass = computed(() => {
  switch (props.variant) {
    case 'critical': return 'text-critical font-bold text-xs';
    case 'warning': return 'text-warning font-bold text-xs';
    case 'positive': return 'text-positive font-bold text-xs';
    case 'default': return 'text-gray text-xs';
    default: return 'text-gray text-xs';
  }
});
</script>

<style scoped>
.kpi-card {
  background: white;
  border: 1px solid #e0e0e0;
  padding: 1.25rem 1.5rem;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.kpi-card-title {
  color: #6b7280;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.kpi-card-value-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.kpi-card-value {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
}

.kpi-card-icon {
  font-size: 1.25rem;
}

.kpi-card-subtitle {
  margin-top: 0.25rem;
}

/* Color classes */
.text-critical { color: #d32f2f; }
.text-warning { color: #f57c00; }
.text-primary-dark { color: #0f172a; }
.text-positive { color: #16a34a; }
.text-gray { color: #6b7280; }
.font-bold { font-weight: 700; }
.text-xs { font-size: 0.75rem; }
</style>
