<template>
  <article class="manager-card">
    <h2>Dedicated Account Manager</h2>
    <p>Your subscription includes priority support and a dedicated success representative.</p>

    <div class="manager-row">
      <div class="manager-avatar">
        <font-awesome-icon icon="user" />
      </div>
      <div class="manager-info">
        <strong>{{ accountManager.name }}</strong>
        <span>{{ accountManager.email }}</span>
      </div>
      <button class="call-button" type="button">
        <font-awesome-icon icon="phone-alt" />
        <span>Schedule Call</span>
      </button>
    </div>
  </article>
</template>

<script setup>
defineProps({
  accountManager: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.manager-card {
  background: #ffffff;
  border: 1px solid #d7dde6;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.08);
  padding: 24px 28px;
}

.manager-card h2 {
  color: #082765;
  font-size: 1.45rem;
  line-height: 1.15;
  margin: 0;
}

.manager-card p {
  color: #5f6f85;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 8px 0 0;
  max-width: 560px;
}

.manager-row {
  align-items: center;
  display: flex;
  gap: 14px;
  margin-top: 20px;
}

.manager-avatar {
  align-items: center;
  background: #e5e7eb;
  border-radius: 4px;
  color: #5f6f85;
  display: flex;
  flex: 0 0 46px;
  height: 46px;
  justify-content: center;
}

.manager-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.manager-info strong {
  color: #111827;
  font-size: 0.94rem;
}

.manager-info span {
  color: #6b7280;
  font-size: 0.85rem;
}

.call-button {
  align-items: center;
  background: #082765;
  border: 1px solid #082765;
  border-radius: 4px;
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  font-family: var(--font-general);
  font-weight: 800;
  gap: 8px;
  justify-content: center;
  min-height: 36px;
  padding: 0 18px;
  transition: filter 0.2s ease, border-color 0.2s ease;
}

.call-button:hover {
  filter: brightness(0.96);
}

@media (max-width: 768px) {
  .manager-card {
    padding: 20px;
  }

  .manager-row {
    align-items: stretch;
    flex-direction: column;
  }

  .call-button {
    width: 100%;
  }
}
</style>
