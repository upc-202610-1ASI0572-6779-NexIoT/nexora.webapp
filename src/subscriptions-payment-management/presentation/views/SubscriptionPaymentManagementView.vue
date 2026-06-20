<template>
  <main class="subscription-content">
    <SubscriptionTabs
      v-if="subscriptionPaymentStore.tabs.length"
      v-model:active-tab="activeTab"
      :tabs="subscriptionPaymentStore.tabs"
    />

    <template v-if="hasOverview">
      <section class="summary-grid" aria-label="Subscription overview">
        <CurrentPlanCard :plan="subscriptionPaymentStore.plan" />
        <UsageLimitCard :usage="subscriptionPaymentStore.usage" />
      </section>

      <BillingHistoryCard :invoices="subscriptionPaymentStore.invoices" />

      <section class="bottom-grid">
        <PaymentMethodCard :payment-method="subscriptionPaymentStore.paymentMethod" />
        <AccountManagerCard :account-manager="subscriptionPaymentStore.accountManager" />
      </section>
    </template>
  </main>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useSubscriptionPaymentStore } from '../store/subscriptionPaymentStore';
import AccountManagerCard from '../components/AccountManagerCard.vue';
import BillingHistoryCard from '../components/BillingHistoryCard.vue';
import CurrentPlanCard from '../components/CurrentPlanCard.vue';
import PaymentMethodCard from '../components/PaymentMethodCard.vue';
import SubscriptionTabs from '../components/SubscriptionTabs.vue';
import UsageLimitCard from '../components/UsageLimitCard.vue';

const subscriptionPaymentStore = useSubscriptionPaymentStore();
const activeTab = ref('Subscription');

const hasOverview = computed(() => {
  return Boolean(
    subscriptionPaymentStore.plan &&
    subscriptionPaymentStore.usage &&
    subscriptionPaymentStore.paymentMethod &&
    subscriptionPaymentStore.accountManager
  );
});

watch(
  () => subscriptionPaymentStore.tabs,
  (tabs) => {
    if (tabs.length && !tabs.includes(activeTab.value)) {
      activeTab.value = tabs[0];
    }
  }
);

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

.summary-grid,
.bottom-grid {
  display: grid;
  gap: 16px;
}

.summary-grid {
  grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
  margin-bottom: 16px;
}

.bottom-grid {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
}

@media (max-width: 1180px) {
  .summary-grid,
  .bottom-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .subscription-content {
    padding: 16px;
  }
}
</style>
