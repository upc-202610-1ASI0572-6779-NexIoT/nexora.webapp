<template>
  <article class="payment-card">
    <h2>Payment Method</h2>

    <div class="card-method">
      <div class="card-brand">{{ paymentMethod.getBrandLabel() }}</div>
      <div class="card-meta">
        <strong>{{ paymentMethod.maskedNumber }}</strong>
        <span>Expires {{ paymentMethod.expiresAt }}</span>
      </div>
      <button type="button">Edit</button>
    </div>

    <button class="add-method-button" type="button">
      <font-awesome-icon icon="plus" />
      <span>Add New Payment Method</span>
    </button>
  </article>
</template>

<script setup>
defineProps({
  paymentMethod: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.payment-card {
  background: #ffffff;
  border: 1px solid #d7dde6;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.08);
  padding: 24px 28px;
}

.payment-card h2 {
  color: #082765;
  font-size: 1.45rem;
  line-height: 1.15;
  margin: 0;
}

.card-method {
  align-items: center;
  background: #f3f4f6;
  border: 1px solid #d7dde6;
  display: flex;
  gap: 14px;
  margin-top: 18px;
  padding: 16px;
}

.card-brand {
  align-items: center;
  background: #082765;
  color: #ffffff;
  display: flex;
  font-size: 0.82rem;
  font-weight: 900;
  height: 38px;
  justify-content: center;
  width: 52px;
}

.card-meta {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.card-meta strong {
  color: #111827;
  font-size: 0.9rem;
}

.card-meta span {
  color: #6b7280;
  font-size: 0.85rem;
}

.card-method button {
  background: transparent;
  border: 0;
  color: #a64f00;
  cursor: pointer;
  font-weight: 800;
}

.add-method-button {
  align-items: center;
  background: transparent;
  border: 1px dashed #9ca3af;
  border-radius: 4px;
  color: #374151;
  cursor: pointer;
  display: inline-flex;
  font-family: var(--font-general);
  font-weight: 800;
  gap: 8px;
  justify-content: center;
  margin-top: 18px;
  min-height: 44px;
  transition: filter 0.2s ease, border-color 0.2s ease;
  width: 100%;
}

.add-method-button:hover {
  filter: brightness(0.96);
}

@media (max-width: 768px) {
  .payment-card {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .card-method {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
