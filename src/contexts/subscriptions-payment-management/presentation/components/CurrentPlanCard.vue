<template>
  <article class="current-plan-card">
    <div class="card-eyebrow">
      <span class="eyebrow">{{ t('subscription.currentPlan.title') }}</span>
    </div>

    <div class="plan-copy">
      <h2>{{ plan.name }}</h2>
      <p>{{ plan.description }}</p>
    </div>

    <div class="plan-details">
      <div>
        <span>{{ t('subscription.labels.billing') }}</span>
        <strong>{{ plan.billingCycle }}</strong>
      </div>
      <div>
        <span>{{ t('subscription.labels.renewalAmount') }}</span>
        <strong>{{ plan.renewalAmount }}</strong>
      </div>
    </div>

    <div class="plan-actions">
      <button class="primary-action" type="button" @click="goToPlanSelection">
        <font-awesome-icon icon="arrow-up" />
        <span>{{ t('subscription.actions.changePlan') }}</span>
      </button>
      <button class="secondary-action danger-action" type="button" @click="cancelConfirm = true">
        <font-awesome-icon icon="xmark" />
        <span>{{ t('subscription.actions.cancel') }}</span>
      </button>
    </div>

    <div v-if="cancelConfirm" class="cancel-modal-overlay" @click.self="cancelConfirm = false">
      <div class="cancel-modal">
        <h3>{{ t('subscription.cancel.title') }}</h3>
        <p>{{ t('subscription.cancel.description') }}</p>
        <p class="cancel-warning">{{ t('subscription.cancel.warning') }}</p>
        <div v-if="cancelError" class="cancel-error">{{ cancelError }}</div>
        <div class="cancel-modal-actions">
          <button class="btn btn--secondary" type="button" @click="cancelConfirm = false" :disabled="isCancelling">
            {{ t('common.back') }}
          </button>
          <button class="btn btn--danger" type="button" @click="handleCancel" :disabled="isCancelling">
            <span v-if="isCancelling" class="spinner"></span>
            <span v-else>{{ t('subscription.cancel.confirm') }}</span>
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from '@/shared/presentation/i18n';
import { SubscriptionPaymentRepositoryImpl } from '../../infrastructure/repositories/SubscriptionPaymentRepositoryImpl';

const props = defineProps({
  plan: {
    type: Object,
    required: true
  },
  subscriptionId: {
    type: [Number, String],
    default: null
  }
});

const emit = defineEmits(['cancel']);

const router = useRouter();
const { t } = useI18n();

const repo = new SubscriptionPaymentRepositoryImpl();
const cancelConfirm = ref(false);
const isCancelling = ref(false);
const cancelError = ref('');

const goToPlanSelection = () => {
  router.push({ name: 'plan-selection' });
};

const handleCancel = async () => {
  if (!props.subscriptionId) return;
  isCancelling.value = true;
  cancelError.value = '';
  try {
    await repo.cancelSubscription(props.subscriptionId);
    cancelConfirm.value = false;
    emit('cancel');
  } catch (err) {
    cancelError.value = err.message || t('subscription.cancel.error');
  } finally {
    isCancelling.value = false;
  }
};
</script>

<style scoped>
.current-plan-card {
  background: #ffffff;
  border: 1px solid #d7dde6;
  border-left: 5px solid var(--primary-color);
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.08);
  padding: 28px 30px;
}

.card-eyebrow,
.plan-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.eyebrow {
  color: #b45309;
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
}

.plan-copy {
  max-width: 620px;
  margin-top: 8px;
}

.plan-copy h2 {
  color: #082765;
  font-size: 2rem;
  line-height: 1.15;
  margin: 0;
}

.plan-copy p {
  color: #5f6f85;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 8px 0 0;
}

.plan-details {
  border-top: 1px solid #e5e7eb;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-top: 28px;
  padding-top: 22px;
}

.plan-details span {
  color: #6b7280;
  display: block;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
}

.plan-details strong {
  color: #082765;
  display: block;
  font-size: 0.92rem;
  margin-top: 4px;
}

.plan-actions {
  margin-top: 28px;
}

.primary-action {
  align-items: center;
  background: #f47b20;
  border: 1px solid #f47b20;
  border-radius: 4px;
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  font-family: var(--font-general);
  font-weight: 800;
  gap: 8px;
  justify-content: center;
  min-height: 36px;
  padding: 0 22px;
  transition: filter 0.2s ease, border-color 0.2s ease;
}

.primary-action:hover {
  filter: brightness(0.96);
}

.secondary-action {
  align-items: center;
  background: transparent;
  border: 1.5px solid #d1d5db;
  border-radius: 4px;
  color: #374151;
  cursor: pointer;
  display: inline-flex;
  font-family: var(--font-general);
  font-weight: 700;
  gap: 8px;
  justify-content: center;
  min-height: 36px;
  padding: 0 22px;
  transition: all 0.2s ease;
}

.secondary-action:hover {
  background: #f3f4f6;
}

.danger-action {
  color: #dc2626;
  border-color: #fca5a5;
}

.danger-action:hover {
  background: #fef2f2;
  border-color: #dc2626;
}

.cancel-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.cancel-modal {
  background: #ffffff;
  border-radius: 16px;
  padding: 32px;
  max-width: 440px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.cancel-modal h3 {
  font-family: var(--font-titles);
  color: #dc2626;
  font-size: 1.25rem;
  margin: 0 0 12px;
}

.cancel-modal p {
  font-size: 0.9rem;
  color: #4b5563;
  line-height: 1.5;
  margin: 0 0 8px;
}

.cancel-warning {
  font-weight: 600;
  color: #d97706 !important;
}

.cancel-error {
  background: #fef2f2;
  color: #dc2626;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  margin: 12px 0;
}

.cancel-modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.btn {
  flex: 1;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
  border: 1.5px solid transparent;
  text-align: center;
}

.btn--secondary {
  background: transparent;
  color: #374151;
  border-color: #d1d5db;
}

.btn--secondary:hover:not(:disabled) {
  background: #f3f4f6;
}

.btn--danger {
  background: #dc2626;
  color: #ffffff;
  border-color: #dc2626;
}

.btn--danger:hover:not(:disabled) {
  background: #b91c1c;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .current-plan-card {
    padding: 20px;
  }

  .plan-copy h2 {
    font-size: 1.55rem;
  }

  .plan-details {
    grid-template-columns: 1fr;
  }

  .plan-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .primary-action,
  .secondary-action {
    width: 100%;
  }
}
</style>
