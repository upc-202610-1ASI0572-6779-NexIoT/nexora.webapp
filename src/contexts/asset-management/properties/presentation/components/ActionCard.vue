<template>
  <div class="action-card">
    <div :class="['icon-box', type]">
      <font-awesome-icon :icon="icon" class="action-icon" />
    </div>
    <div class="action-content">
      <div class="action-title">{{ title }}</div>
      <div class="action-desc">{{ description }}</div>
    </div>
    <div v-if="actionText" class="action-btn-text">
      {{ actionText }}
    </div>
    <div v-else-if="statusIcon" class="status-icon-wrapper">
      <font-awesome-icon :icon="statusIcon" class="status-icon" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'danger' // 'danger', 'success'
  },
  icon: String,
  title: String,
  description: String,
  actionText: String,
  statusIcon: String
});
</script>

<style scoped>
.action-card {
  background-color: white;
  border-radius: 4px;
  padding: 16px;
  border: 1px solid #eaeaea;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-box.danger {
  background-color: #fdf2f2;
  color: #e74c3c;
}

.icon-box.success {
  background-color: #f0fdf4;
  color: #2ecc71;
}

.action-icon {
  font-size: 1.2rem;
}

.action-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.action-title {
  font-weight: 700;
  color: #1a3673;
  font-size: 0.95rem;
  margin-bottom: 4px;
}

.action-desc {
  font-size: 0.8rem;
  color: #7f8c8d;
  line-height: 1.3;
}

.action-btn-text {
  font-weight: 700;
  color: #1a3673;
  font-size: 0.9rem;
  cursor: pointer;
}

.status-icon-wrapper {
  color: #7f8c8d;
  font-size: 1.2rem;
}
</style>
