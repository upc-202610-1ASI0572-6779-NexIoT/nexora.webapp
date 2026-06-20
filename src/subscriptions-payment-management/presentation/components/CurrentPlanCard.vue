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
    </div>
  </article>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useI18n } from '@/shared/presentation/i18n';

defineProps({
  plan: {
    type: Object,
    required: true
  }
});

const router = useRouter();
const { t } = useI18n();

const goToPlanSelection = () => {
  router.push({ name: 'plan-selection' });
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
