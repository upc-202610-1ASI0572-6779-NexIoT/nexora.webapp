<template>
  <section class="subscription-tabs" aria-label="Subscription sections">
    <button
      v-for="tab in tabs"
      :key="tab"
      class="tab-button"
      :class="{ active: tab === activeTab }"
      type="button"
      @click="$emit('update:activeTab', tab)"
    >
      {{ tab }}
    </button>
  </section>
</template>

<script setup>
defineProps({
  tabs: {
    type: Array,
    required: true
  },
  activeTab: {
    type: String,
    required: true
  }
});

defineEmits(['update:activeTab']);
</script>

<style scoped>
.subscription-tabs {
  display: flex;
  align-items: center;
  gap: 18px;
  min-height: 36px;
  margin-bottom: 16px;
  overflow-x: auto;
}

.tab-button {
  border: 0;
  border-bottom: 3px solid transparent;
  background: transparent;
  color: #4b5563;
  cursor: pointer;
  flex: 0 0 auto;
  font-family: var(--font-general);
  font-size: 0.95rem;
  font-weight: 600;
  padding: 8px 0;
}

.tab-button.active {
  border-color: var(--primary-color);
  color: var(--secondary-color);
}

@media (max-width: 480px) {
  .subscription-tabs {
    gap: 14px;
  }

  .tab-button {
    font-size: 0.88rem;
  }
}
</style>
