<template>
  <main class="subscription-content">
    <div v-if="subscriptionPaymentStore.isLoading" class="sub-loading">
      <span class="sub-loading__spinner" />
      <p>{{ t('subscription.loading') }}</p>
    </div>

    <div v-else-if="subscriptionPaymentStore.error" class="sub-error">
      <font-awesome-icon icon="triangle-exclamation" />
      <p>{{ t('subscription.loadFailed') }}</p>
    </div>

    <template v-else-if="subscriptionPaymentStore.subscription">
      <section class="summary-grid" :aria-label="t('subscription.overview.ariaLabel')">
        <CurrentPlanCard :plan="currentPlan" />
      </section>

      <section class="sub-info-cards">
        <div class="info-card">
          <span class="info-card__label">{{ t('subscription.labels.status') }}</span>
          <span class="info-card__value" :class="statusClass">{{ subscriptionPaymentStore.subscription.status }}</span>
        </div>
        <div class="info-card">
          <span class="info-card__label">{{ t('subscription.labels.start') }}</span>
          <span class="info-card__value">{{ formattedStartDate }}</span>
        </div>
        <div class="info-card">
          <span class="info-card__label">{{ t('subscription.labels.nextCharge') }}</span>
          <span class="info-card__value">{{ formattedPeriodEnd }}</span>
        </div>
        <div class="info-card">
          <span class="info-card__label">{{ t('subscription.labels.cancelAtPeriodEnd') }}</span>
          <span class="info-card__value">{{ subscriptionPaymentStore.subscription.cancelAtPeriodEnd ? t('common.yes') : t('common.no') }}</span>
        </div>
      </section>

      <section class="sub-details-grid">
        <PaymentMethodCard :card="savedCard" @update-card="openUpdateModal" />
        <BillingHistoryCard :invoices="billingInvoices" />
      </section>
      <UpdateCardModal
        v-if="showUpdateModal"
        :card="editCardData"
        @close="closeUpdateModal"
        @saved="onCardUpdated"
      />
    </template>

    <div v-else class="sub-empty">
      <font-awesome-icon icon="circle-exclamation" />
      <h2>{{ t('subscription.empty.title') }}</h2>
      <p>{{ t('subscription.empty.description') }}</p>
      <button class="sub-empty__btn" type="button" @click="goToPlans">{{ t('subscription.actions.viewPlans') }}</button>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from '@/shared/presentation/i18n';
import { useSubscriptionPaymentStore } from '../store/subscriptionPaymentStore';
import CurrentPlanCard from '../components/CurrentPlanCard.vue';
import PaymentMethodCard from '../components/PaymentMethodCard.vue';
import BillingHistoryCard from '../components/BillingHistoryCard.vue';
import UpdateCardModal from '../components/UpdateCardModal.vue';

const subscriptionPaymentStore = useSubscriptionPaymentStore();
const router = useRouter();
const { t, currentLocale } = useI18n();

const showUpdateModal = ref(false);
const editCardData = ref(null);

function openUpdateModal() {
  editCardData.value = savedCard.value;
  showUpdateModal.value = true;
}

function closeUpdateModal() {
  showUpdateModal.value = false;
  editCardData.value = null;
}

function onCardUpdated() {
  closeUpdateModal();
  subscriptionPaymentStore.fetchOverview();
}

const currentPlan = computed(() => {
  const sub = subscriptionPaymentStore.subscription;
  if (!sub || !sub.plan) return null;
  return {
    name: sub.plan.name,
    description: sub.plan.unlimitedProperties
      ? t('subscription.plan.unlimited')
      : t('subscription.plan.limited', { count: sub.plan.maxPropertiesLimit }),
    status: sub.status,
    billingCycle: t('subscription.billingCycle.monthly'),
    renewalAmount: `$${sub.plan.monthlyPrice.toFixed(2)} ${t('subscription.perMonth')}`
  };
});

const savedCard = computed(() => {
  const methods = subscriptionPaymentStore.paymentMethods;
  if (!methods || methods.length === 0) return null;
  return methods[0];
});

const billingInvoices = computed(() => {
  const invs = subscriptionPaymentStore.invoices;
  if (!invs) return [];
  return invs.map(inv => ({
    id: `INV-${inv.id}`,
    date: new Date(inv.createdAt || inv.dueDate).toLocaleDateString(currentLocale.value || undefined),
    rawDate: inv.createdAt || inv.dueDate,
    amount: `$${inv.amount.toFixed(2)}`,
    status: inv.status,
    getStatusLabel() {
      if (this.status === 'Paid') return t('subscription.invoice.status.paid');
      if (this.status === 'Pending') return t('subscription.invoice.status.pending');
      return this.status;
    }
  }));
});

const formattedStartDate = computed(() => {
  if (!subscriptionPaymentStore.subscription?.startedAt) return '—';
  return new Date(subscriptionPaymentStore.subscription.startedAt).toLocaleDateString(currentLocale.value || undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });
});

const formattedPeriodEnd = computed(() => {
  if (!subscriptionPaymentStore.subscription?.currentPeriodEnd) return '—';
  return new Date(subscriptionPaymentStore.subscription.currentPeriodEnd).toLocaleDateString(currentLocale.value || undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });
});

const statusClass = computed(() => {
  const status = subscriptionPaymentStore.subscription?.status;
  return {
    'info-card__value--active': status === 'Active',
    'info-card__value--warning': status === 'PastDue' || status === 'Pending',
    'info-card__value--danger': status === 'Suspended' || status === 'Expired' || status === 'Cancelled',
  };
});

const goToPlans = () => {
  router.push({ name: 'plan-selection' });
};

onMounted(() => {
  subscriptionPaymentStore.fetchOverview();
});
</script>

<style scoped>
.subscription-content {
  min-height: calc(100vh - 72px);
  padding: 20px 28px 32px;
  background: #f5f7f2;
  color: #1f2937;
}

.sub-loading,
.sub-error,
.sub-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 80px 20px;
  text-align: center;
}

.sub-loading__spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.sub-error svg,
.sub-empty svg {
  font-size: 2.5rem;
  color: #ef4444;
}

.sub-empty h2 {
  font-family: var(--font-titles);
  font-size: 1.3rem;
  color: var(--secondary-color);
}

.sub-empty p {
  font-size: 0.9rem;
  color: #64748b;
}

.sub-empty__btn {
  padding: 12px 28px;
  background: var(--primary-color);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-family: var(--font-titles);
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: background 0.2s;
}

.sub-empty__btn:hover {
  background: #e66700;
}

.summary-grid {
  margin-bottom: 24px;
}

.sub-info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.info-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-card__label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-card__value {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1f2937;
}

.info-card__value--active { color: #16a34a; }
.info-card__value--warning { color: #d97706; }
.info-card__value--danger { color: #dc2626; }

.sub-details-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 20px;
  align-items: start;
}

@media (max-width: 900px) {
  .sub-details-grid {
    grid-template-columns: 1fr;
  }
}
</style>
