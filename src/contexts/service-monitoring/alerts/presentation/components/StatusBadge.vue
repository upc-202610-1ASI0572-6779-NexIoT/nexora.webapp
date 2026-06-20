<template>
  <span class="status-badge" :class="badgeClass">
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  status: {
    type: String,
    required: true
  }
});

const label = computed(() => {
  return props.status.toUpperCase();
});

const badgeClass = computed(() => {
  switch (props.status.toLowerCase()) {
    case 'critical':
      return 'badge-critical';
    case 'warning':
      return 'badge-warning';
    case 'investigating':
      return 'badge-investigating';
    case 'resolved':
      return 'badge-resolved';
    default:
      return 'badge-default';
  }
});
</script>

<style scoped>
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-critical {
  background-color: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.badge-warning {
  background-color: #ffedd5;
  color: #ea580c;
  border: 1px solid #fed7aa;
}

.badge-investigating {
  background-color: #e0e7ff;
  color: #4338ca;
  border: 1px solid #c7d2fe;
}

.badge-resolved {
  background-color: #dcfce7;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.badge-default {
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}
</style>
