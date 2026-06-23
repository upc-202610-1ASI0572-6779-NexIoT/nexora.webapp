<template>
  <div class="checkout-page">
    <div class="checkout-page-glow checkout-page-glow--tr" />
    <div class="checkout-page-glow checkout-page-glow--bl" />

    <div class="checkout-floating-icons">
      <font-awesome-icon icon="lock" class="checkout-float-icon checkout-float-icon--lock" />
      <font-awesome-icon icon="shield" class="checkout-float-icon checkout-float-icon--shield" />
      <font-awesome-icon icon="credit-card" class="checkout-float-icon checkout-float-icon--card" />
      <font-awesome-icon icon="circle-check" class="checkout-float-icon checkout-float-icon--check" />
    </div>

    <div v-if="plan" class="checkout-container">
      <div class="checkout-layout">
        <aside class="checkout-left">
          <button class="checkout-back-btn" type="button" @click="goBack">
            <font-awesome-icon icon="arrow-left" />
            {{ t('subscription.checkout.backToPlans') }}
          </button>

          <section class="order-summary">
             <h2 class="order-summary__title">{{ t('subscription.checkout.orderSummary') }}</h2>

            <div class="order-summary__card">
               <div class="order-summary__header">
                 <h3>{{ plan.name }}</h3>
                 <span class="order-summary__type">{{ plan.unlimitedProperties ? t('subscription.plan.unlimited') : t('subscription.plan.limited', { count: plan.maxPropertiesLimit }) }}</span>
               </div>

              <div class="order-summary__rows">
                <div class="order-summary__row">
                  <span>{{ t('subscription.labels.billing') }}</span>
                  <strong>{{ t('subscription.billingCycle.monthly') }}</strong>
                </div>
                <div class="order-summary__row">
                  <span>{{ t('subscription.checkout.subtotal') }}</span>
                  <strong>${{ plan.monthlyPrice.toFixed(2) }}</strong>
                </div>
                <div class="order-summary__row">
                  <span>{{ t('subscription.checkout.taxLabel', { rate: '18%' }) }}</span>
                  <strong>${{ igvAmount.toFixed(2) }}</strong>
                </div>
              </div>

              <div class="order-summary__perforation" />

              <div class="order-summary__total">
                <span>Total</span>
                <strong>${{ totalAmount.toFixed(2) }}</strong>
              </div>
            </div>
          </section>
        </aside>

        <main class="checkout-right">
           <div class="checkout-right__header">
             <h2 class="checkout-right__title">{{ t('subscription.checkout.secureCheckout') }}</h2>
           </div>

          <div v-if="serverError" class="checkout-alert">
            <font-awesome-icon icon="triangle-exclamation" class="checkout-alert__icon" />
            <p>{{ serverError }}</p>
          </div>

          <form class="payment-form" novalidate @submit.prevent="handleSubmit">
            <div class="payment-form__summary">
              <p v-html="t('subscription.checkout.summaryHtml', { planName: plan.name, amount: totalAmount.toFixed(2) })"></p>
              <p class="payment-form__summary-note">{{ t('subscription.checkout.summaryNote') }}</p>
            </div>

            <button
              type="submit"
              class="payment-form__submit"
              :disabled="isLoading"
            >
                <span v-if="!isLoading" class="payment-form__submit-text">
                  {{ t('subscription.checkout.action.activate') }}
                  <font-awesome-icon icon="arrow-right" class="payment-form__submit-icon" />
                </span>
                <span v-else class="payment-form__submit-text">
                  <span class="payment-form__spinner" />
                  {{ t('subscription.checkout.action.activating') }}
                </span>
            </button>
          </form>
        </main>
      </div>

      <footer class="checkout-footer">
        <p class="checkout-footer__copy">NexIoT &copy; 2025 Todos los derechos reservados.</p>
        <nav class="checkout-footer__links">
          <a href="https://upc-202610-1asi0572-6779-nexiot.github.io/nexora.website/privacy_policy.html" class="checkout-footer__link" target="_blank" rel="noopener noreferrer">Política de Privacidad</a>
          <a href="https://upc-202610-1asi0572-6779-nexiot.github.io/nexora.website/terms_conditions.html" class="checkout-footer__link" target="_blank" rel="noopener noreferrer">Términos de Servicio</a>
          <a href="https://www.pcisecuritystandards.org/" class="checkout-footer__link" target="_blank" rel="noopener noreferrer">PCI Compliance</a>
        </nav>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from '@/shared/presentation/i18n';
import { ActivateSubscriptionUseCase } from '../../application/use-cases/ActivateSubscriptionUseCase';
import { SubscriptionPaymentRepositoryImpl } from '@/subscriptions-payment-management/infrastructure/repositories/SubscriptionPaymentRepositoryImpl.js';
import { useAuthStore } from '@/contexts/iam/auth/presentation/store/authStore';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n();

const repo = new SubscriptionPaymentRepositoryImpl();
const activateUseCase = new ActivateSubscriptionUseCase(repo);

const plan = ref(null);
const isLoading = ref(false);
const serverError = ref(null);

const planId = route.query.planId ? Number(route.query.planId) : null;

onMounted(async () => {
  if (!planId) {
    router.replace({ name: 'plan-selection' });
    return;
  }
  if (authStore.hasActiveSubscription && authStore.subscriptionPlanId === planId && !route.query.change) {
    router.replace({ name: 'dashboard' });
    return;
  }
  try {
    const plans = await repo.getPlans();
    const found = plans.find(p => p.id === planId);
    if (!found) {
      router.replace({ name: 'plan-selection' });
      return;
    }
    plan.value = found;
  } catch (err) {
    serverError.value = t('subscription.checkout.loadPlanFailed');
  }
});

const igvAmount = computed(() => plan.value ? plan.value.monthlyPrice * 0.18 : 0);
const totalAmount = computed(() => plan.value ? plan.value.monthlyPrice + igvAmount.value : 0);

const goBack = () => {
  router.push({ name: 'plan-selection' });
};

const handleSubmit = async () => {
  isLoading.value = true;
  serverError.value = null;

  try {
    const result = await activateUseCase.execute(planId);
    authStore.setSubscription(result.subscription);
    router.push({
      name: 'subscription-confirmation',
      query: {
        planId: plan.value.id,
        planName: plan.value.name,
        amount: result.amountDue,
        invoiceId: result.invoiceId,
        dueDate: result.dueDate,
      },
    });
  } catch (error) {
    if (error && error.code === 'VALIDATION_ERROR') {
      serverError.value = error.message;
    } else {
      serverError.value = t('subscription.checkout.activateFailed');
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.checkout-page {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 48px 48px 0;
  position: relative;
  overflow-y: auto;
  background:
    radial-gradient(ellipse at 15% 30%, rgba(255, 115, 0, 0.04) 0%, transparent 50%),
    radial-gradient(ellipse at 85% 70%, rgba(23, 49, 131, 0.04) 0%, transparent 50%),
    linear-gradient(160deg, #f4f6fa 0%, #eef0f5 40%, #e8ecf1 100%);
}

.checkout-page-glow {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(90px);
  z-index: 0;
}

.checkout-page-glow--tr {
  width: 400px;
  height: 400px;
  background: rgba(255, 115, 0, 0.06);
  top: -150px;
  right: -120px;
}

.checkout-page-glow--bl {
  width: 400px;
  height: 400px;
  background: rgba(23, 49, 131, 0.05);
  bottom: -150px;
  left: -120px;
}

.checkout-floating-icons {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.checkout-float-icon {
  position: absolute;
  opacity: 0.05;
  color: var(--secondary-color);
}

.checkout-float-icon--lock {
  top: 10%;
  left: 3%;
  font-size: 2.5rem;
  animation: float-a 8s ease-in-out infinite;
}

.checkout-float-icon--shield {
  bottom: 30%;
  right: 3%;
  font-size: 2.8rem;
  animation: float-b 9s ease-in-out infinite 1s;
  color: var(--primary-color);
}

.checkout-float-icon--card {
  top: 40%;
  left: 2%;
  font-size: 2.2rem;
  animation: float-a 7s ease-in-out infinite 0.5s;
}

.checkout-float-icon--check {
  bottom: 10%;
  left: 5%;
  font-size: 2rem;
  animation: float-b 8s ease-in-out infinite 2s;
  color: var(--primary-color);
}

@keyframes float-a {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(2deg); }
}

@keyframes float-b {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(8px) rotate(-2deg); }
}

.checkout-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
  animation: checkout-fade-in 0.6s ease-out;
}

@keyframes checkout-fade-in {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.checkout-layout {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 40px;
  align-items: start;
}

.checkout-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  color: var(--secondary-color);
  font-family: var(--font-general);
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  margin-bottom: 28px;
  transition: color 0.2s, gap 0.2s;
}

.checkout-back-btn:hover {
  color: var(--primary-color);
  gap: 14px;
}

.order-summary__title {
  font-family: var(--font-titles);
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--secondary-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 18px;
}

.order-summary__card {
  position: relative;
  background: #ffffff;
  border: 1px solid #d7dde6;
  border-left: 5px solid var(--primary-color);
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
  padding: 28px 32px;
  overflow: hidden;
}

.order-summary__header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.order-summary__header h3 {
  font-family: var(--font-titles);
  font-size: 1.35rem;
  font-weight: 800;
  color: #082765;
  margin: 0;
}

.order-summary__type {
  font-size: 0.8rem;
  color: var(--primary-color);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 4px;
  display: block;
}

.order-summary__rows {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 0;
  padding-bottom: 0;
}

.order-summary__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-summary__row span {
  font-size: 0.9rem;
  color: #6b7280;
}

.order-summary__row strong {
  font-size: 0.95rem;
  color: #1f2937;
}

.order-summary__perforation {
  position: relative;
  height: 0;
  margin: 20px -32px;
  border-top: 2px dashed #d1d5db;
}

.order-summary__perforation::before,
.order-summary__perforation::after {
  content: '';
  position: absolute;
  top: -9px;
  width: 18px;
  height: 18px;
  background: var(--bg-primary, #f5f7f2);
  border-radius: 50%;
  z-index: 1;
}

.order-summary__perforation::before {
  left: -9px;
}

.order-summary__perforation::after {
  right: -9px;
}

.order-summary__total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0;
  border-top: none;
}

.order-summary__total span {
  font-family: var(--font-titles);
  font-size: 1.1rem;
  font-weight: 700;
  color: #082765;
}

.order-summary__total strong {
  font-family: var(--font-titles);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--primary-color);
}

.checkout-right__header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.checkout-right__title {
  font-family: var(--font-titles);
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--secondary-color);
  letter-spacing: 1.5px;
}

.checkout-alert {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
}

.checkout-alert__icon {
  color: #ef4444;
  font-size: 1rem;
  margin-top: 2px;
  flex-shrink: 0;
}

.checkout-alert p {
  margin: 0;
  font-size: 0.85rem;
  color: #7f1d1d;
}

.payment-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.payment-form__summary {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 24px;
}

.payment-form__summary p {
  font-size: 0.95rem;
  color: #1f2937;
  line-height: 1.6;
  margin: 0;
}

.payment-form__summary strong {
  color: var(--secondary-color);
}

.payment-form__summary-note {
  margin-top: 12px !important;
  font-size: 0.82rem !important;
  color: #64748b !important;
}

.payment-form__submit {
  width: 100%;
  padding: 16px;
  margin-top: 0.5rem;
  background: var(--primary-color);
  color: #ffffff;
  font-family: var(--font-titles);
  font-weight: 700;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
}

.payment-form__submit:hover:not(:disabled) {
  background: #e66700;
  box-shadow: 0 4px 15px rgba(255, 115, 0, 0.3);
  transform: translateY(-1px);
}

.payment-form__submit:active:not(:disabled) {
  transform: translateY(0);
}

.payment-form__submit:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.payment-form__submit-icon {
  transition: transform 0.2s;
}

.payment-form__submit:hover:not(:disabled) .payment-form__submit-icon {
  transform: translateX(3px);
}

.payment-form__submit-text {
  display: flex;
  align-items: center;
  gap: 10px;
}

.payment-form__spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.checkout-footer {
  margin-top: 56px;
  padding: 28px 0 36px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.checkout-footer__copy {
  font-size: 0.82rem;
  color: #94a3b8;
}

.checkout-footer__links {
  display: flex;
  gap: 28px;
}

.checkout-footer__link {
  font-size: 0.82rem;
  color: #64748b;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.checkout-footer__link:hover {
  color: var(--primary-color);
  text-decoration: underline;
}

@media (max-width: 860px) {
  .checkout-page {
    padding: 28px 24px 0;
    align-items: flex-start;
  }

  .checkout-floating-icons {
    display: none;
  }

  .checkout-layout {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .checkout-right__header {
    margin-top: 8px;
  }

  .checkout-footer {
    flex-direction: column;
    text-align: center;
  }

  .checkout-footer__links {
    justify-content: center;
    flex-wrap: wrap;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .checkout-page {
    padding: 20px 16px 0;
  }

  .checkout-right__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .order-summary__card {
    padding: 20px 16px;
  }

  .order-summary__perforation {
    margin: 16px -16px;
  }

  .order-summary__perforation::before,
  .order-summary__perforation::after {
    display: none;
  }
}
</style>
