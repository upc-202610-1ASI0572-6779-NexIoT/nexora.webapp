<script setup>
defineProps({
  items: {
    type: Array,
    required: true
  }
});
</script>

<template>
  <nav class="breadcrumbs">
    <span v-for="(item, index) in items" :key="index" class="breadcrumbs__item">
      <span v-if="index < items.length - 1" class="breadcrumbs__link">
        {{ item.label }}
        <span class="breadcrumbs__separator">></span>
      </span>
      <span v-else class="breadcrumbs__current">{{ item.label }}</span>
    </span>
  </nav>
</template>

<style scoped>
.breadcrumbs {
  padding: 15px 30px;
  font-size: 14px;
  color: #718096;
  display: flex;
  align-items: center;
  gap: 8px;
}

.breadcrumbs__separator {
  margin: 0 8px;
  color: #a0aec0;
}

.breadcrumbs__current {
  font-weight: 700;
  color: #1a237e;
}
</style>