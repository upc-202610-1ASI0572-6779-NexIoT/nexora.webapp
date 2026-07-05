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
            <div class="card-preview-area">
              <div class="credit-card-box">
                <div class="credit-card" :class="{ 'flipped': cardFlipped }">
                  <div class="credit-card__front">
                    <div class="credit-card__chip">
                      <div class="chip-inner"></div>
                    </div>
                    <div class="credit-card__brand">
                      <svg v-if="previewBrand === 'visa'" viewBox="0 0 100 30" class="card-brand-svg">
                        <path fill="#ffffff" d="M45.5 23.4h-7.1l4.4-20.4h7.1l-4.4 20.4zm-16-13.1l-.7 3.6c2.1.6 4.5 1.6 5.7 3.2l-5-6.8zm15.7-7.3c-2.8-1.1-5.7-1.7-8.5-1.7-7.9 0-13.5 4.1-13.5 10 0 4.4 4 6.8 7 8.3 3.1 1.5 4.2 2.5 4.2 3.9 0 2.2-2.5 3.2-4.8 3.2-3.2 0-4.9-.5-7.5-1.6l-1-.5-.8 4.6c2.9 1.3 6 1.9 9.1 1.9 8.5 0 14-4 14.1-10.2 0-3.4-2.1-6-6.7-8.1-2.8-1.4-4.5-2.4-4.5-3.8 0-1.3 1.4-2.6 4.5-2.6 2.6-.1 4.5.5 5.9 1.1l.7.3.8-4.4zm27.4 20.4h5.5l-4.8-20.4h-5.1c-2.4 0-4.4 1.4-5.1 3.5l-9 16.9h6.3l1.3-3.4h7.7l.7 3.4h2.5zm-6.7-8.7l3.2-8.3 1.8 8.3h-5zm-47.5-11.7l-5.5 13.9-.7-3.6c-1.2-4.1-5-8.5-9.2-10.7l6 15.5h6.2l9.3-20.4h-6.1z"/>
                      </svg>
                      <svg v-else-if="previewBrand === 'mastercard'" viewBox="0 0 50 30" class="card-brand-svg">
                        <circle cx="18" cy="15" r="11" fill="#eb001b"/>
                        <circle cx="32" cy="15" r="11" fill="#f79e1b"/>
                      </svg>
                      <svg v-else-if="previewBrand === 'amex'" viewBox="0 0 50 30" class="card-brand-svg">
                        <rect width="50" height="30" rx="4" fill="#007bc1"/>
                        <text x="25" y="19" fill="#ffffff" font-family="Arial, sans-serif" font-size="9px" font-weight="bold" text-anchor="middle" letter-spacing="1">AMEX</text>
                      </svg>
                      <span v-else class="card-brand-text">{{ previewBrandLabel }}</span>
                    </div>
                    <div class="credit-card__number">{{ previewNumber }}</div>
                    <div class="credit-card__footer">
                      <div class="credit-card__holder">
                        <span class="card-label">{{ t('subscription.payment.cardHolder') }}</span>
                        <span class="card-value">{{ previewHolder || t('subscription.payment.placeholderName') }}</span>
                      </div>
                      <div class="credit-card__expiry">
                        <span class="card-label">{{ t('subscription.payment.expires') }}</span>
                        <span class="card-value">{{ previewExpiry }}</span>
                      </div>
                    </div>
                    <div class="credit-card__network">
                      <svg viewBox="0 0 30 20" class="contactless-icon">
                        <path fill="rgba(255,255,255,0.3)" d="M8 10c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm-4 0c0-3.3 2.7-6 6-6s6 2.7 6 6-2.7 6-6 6-6-2.7-6-6zm-4 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10S0 15.5 0 10z"/>
                      </svg>
                    </div>
                  </div>
                  <div class="credit-card__back">
                    <div class="credit-card__magstripe"></div>
                    <div class="credit-card__signature">
                      <div class="credit-card__cvv">{{ checkoutForm.cvv || '***' }}</div>
                    </div>
                    <div class="credit-card__back-text">{{ t('subscription.payment.securityCode') }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="checkout-form-group" :class="{ 'checkout-form-group--error': errors.holder }">
              <label for="ch-holder">{{ t('subscription.payment.edit.holder') }}</label>
              <input id="ch-holder" type="text" v-model="checkoutForm.holderName" maxlength="100" required @input="errors.holder = ''" />
              <span v-if="errors.holder" class="checkout-field-error">{{ errors.holder }}</span>
            </div>

            <div class="checkout-form-group" :class="{ 'checkout-form-group--error': errors.number }">
              <label for="ch-number">{{ t('subscription.payment.edit.number') }}</label>
              <input id="ch-number" type="text" v-model="checkoutForm.fullNumber" maxlength="19" placeholder="4111 1111 1111 1111" required @input="errors.number = ''" />
              <span v-if="errors.number" class="checkout-field-error">{{ errors.number }}</span>
            </div>

            <div class="checkout-form-row">
              <div class="checkout-form-group" :class="{ 'checkout-form-group--error': errors.month }">
                <label for="ch-month">{{ t('subscription.payment.edit.expiryMonth') }}</label>
                <input id="ch-month" type="text" v-model="checkoutForm.expiryMonth" maxlength="2" placeholder="MM" required @input="errors.month = ''" />
                <span v-if="errors.month" class="checkout-field-error">{{ errors.month }}</span>
              </div>
              <div class="checkout-form-group" :class="{ 'checkout-form-group--error': errors.year }">
                <label for="ch-year">{{ t('subscription.payment.edit.expiryYear') }}</label>
                <input id="ch-year" type="text" v-model="checkoutForm.expiryYear" maxlength="2" placeholder="YY" required @input="errors.year = ''" />
                <span v-if="errors.year" class="checkout-field-error">{{ errors.year }}</span>
              </div>
              <div class="checkout-form-group" :class="{ 'checkout-form-group--error': errors.cvv }">
                <label for="ch-cvv">{{ t('subscription.payment.edit.cvv') }}</label>
                <input
                  id="ch-cvv"
                  type="text"
                  v-model="checkoutForm.cvv"
                  maxlength="4"
                  placeholder="***"
                  required
                  @focus="cardFlipped = true"
                  @blur="cardFlipped = false"
                  @input="errors.cvv = ''"
                />
                <span v-if="errors.cvv" class="checkout-field-error">{{ errors.cvv }}</span>
              </div>
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
          <a href="https://upc-202610-1asi0572-6779-nexiot.github.io/nexora.website/privacy_policy.html" class="checkout-footer__link" target="_blank" rel="noopener noreferrer">Pol&iacute;tica de Privacidad</a>
          <a href="https://upc-202610-1asi0572-6779-nexiot.github.io/nexora.website/terms_conditions.html" class="checkout-footer__link" target="_blank" rel="noopener noreferrer">T&eacute;rminos de Servicio</a>
          <a href="https://www.pcisecuritystandards.org/" class="checkout-footer__link" target="_blank" rel="noopener noreferrer">PCI Compliance</a>
        </nav>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from '@/shared/presentation/i18n';
import { ActivateSubscriptionUseCase } from '../../application/use-cases/ActivateSubscriptionUseCase';
import { SubscriptionPaymentRepositoryImpl } from '@/contexts/subscriptions-payment-management/infrastructure/repositories/SubscriptionPaymentRepositoryImpl.js';
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
const cardFlipped = ref(false);

const planId = route.query.planId ? Number(route.query.planId) : null;

const checkoutForm = reactive({
  brand: 'Visa',
  holderName: '',
  fullNumber: '',
  expiryMonth: '',
  expiryYear: '',
  cvv: ''
});

const errors = reactive({
  holder: '',
  number: '',
  month: '',
  year: '',
  cvv: ''
});

function isValidLuhn(num) {
  const digits = (num || '').replace(/\D/g, '');
  if (!digits) return false;
  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    if (alternate) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

const detectCardBrand = (num) => {
  const cleanNumber = (num || '').replace(/\s+/g, '');
  if (!cleanNumber) return 'unknown';
  if (/^4/.test(cleanNumber)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(cleanNumber)) return 'mastercard';
  if (/^3[47]/.test(cleanNumber)) return 'amex';
  if (/^(6011|622|64|65)/.test(cleanNumber)) return 'discover';
  if (/^36/.test(cleanNumber)) return 'diners';
  if (/^35/.test(cleanNumber)) return 'jcb';
  return 'unknown';
};

watch(() => checkoutForm.fullNumber, (newVal) => {
  const formatted = (newVal || '').replace(/\D/g, '').match(/.{1,4}/g);
  if (formatted) {
    checkoutForm.fullNumber = formatted.join(' ');
  }
  const brand = detectCardBrand(newVal);
  if (brand !== 'unknown') {
    checkoutForm.brand = brand.charAt(0).toUpperCase() + brand.slice(1);
  }
});

const previewBrand = computed(() => (checkoutForm.brand || '').toLowerCase());
const previewBrandLabel = computed(() => checkoutForm.brand || 'CARD');

const previewNumber = computed(() => {
  const n = checkoutForm.fullNumber || '';
  if (!n) return '\u00B7\u00B7\u00B7\u00B7  \u00B7\u00B7\u00B7\u00B7  \u00B7\u00B7\u00B7\u00B7  \u00B7\u00B7\u00B7\u00B7';
  return n;
});

const previewHolder = computed(() => checkoutForm.holderName || '');

const previewExpiry = computed(() => {
  if (checkoutForm.expiryMonth && checkoutForm.expiryYear) {
    return `${checkoutForm.expiryMonth}/${checkoutForm.expiryYear}`;
  }
  return 'MM/YY';
});

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

    if (authStore.user) {
      checkoutForm.holderName = `${authStore.user.firstName || ''} ${authStore.user.lastName || ''}`.trim();
    }
  } catch (err) {
    serverError.value = t('subscription.checkout.loadPlanFailed');
  }
});

const igvAmount = computed(() => plan.value ? plan.value.monthlyPrice * 0.18 : 0);
const totalAmount = computed(() => plan.value ? plan.value.monthlyPrice + igvAmount.value : 0);

const goBack = () => {
  router.push({ name: 'plan-selection' });
};

function validate() {
  let valid = true;
  errors.holder = '';
  errors.number = '';
  errors.month = '';
  errors.year = '';
  errors.cvv = '';

  if (!checkoutForm.holderName.trim()) {
    errors.holder = t('subscription.validation.holderRequired');
    valid = false;
  }

  const cleanNumber = checkoutForm.fullNumber.replace(/\s+/g, '');
  if (!cleanNumber) {
    errors.number = t('subscription.validation.numberRequired');
    valid = false;
  } else if (!isValidLuhn(cleanNumber)) {
    errors.number = t('subscription.validation.numberInvalid');
    valid = false;
  }

  const month = parseInt(checkoutForm.expiryMonth, 10);
  if (!checkoutForm.expiryMonth) {
    errors.month = t('subscription.validation.monthRequired');
    valid = false;
  } else if (isNaN(month) || month < 1 || month > 12) {
    errors.month = t('subscription.validation.monthInvalid');
    valid = false;
  }

  const fullYear = checkoutForm.expiryYear ? (checkoutForm.expiryYear.length === 2 ? 2000 + parseInt(checkoutForm.expiryYear, 10) : parseInt(checkoutForm.expiryYear, 10)) : null;
  if (!checkoutForm.expiryYear) {
    errors.year = t('subscription.validation.yearRequired');
    valid = false;
  } else if (fullYear) {
    const now = new Date();
    const expiryDate = new Date(fullYear, month);
    if (expiryDate < now) {
      errors.year = t('subscription.validation.yearExpired');
      valid = false;
    }
  }

  if (!checkoutForm.cvv) {
    errors.cvv = t('subscription.validation.cvvRequired');
    valid = false;
  } else if (!/^\d{3,4}$/.test(checkoutForm.cvv)) {
    errors.cvv = t('subscription.validation.cvvInvalid');
    valid = false;
  }

  return valid;
}

const handleSubmit = async () => {
  if (!validate()) return;

  isLoading.value = true;
  serverError.value = null;

  try {
    const cardData = {
      brand: checkoutForm.brand,
      fullNumber: checkoutForm.fullNumber.replace(/\s+/g, ''),
      expiryMonth: checkoutForm.expiryMonth,
      expiryYear: checkoutForm.expiryYear,
      holderName: checkoutForm.holderName,
      cvv: checkoutForm.cvv
    };

    const result = await activateUseCase.execute(planId, cardData);
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

.card-preview-area {
  display: flex;
  justify-content: center;
}

.credit-card-box {
  width: 100%;
  max-width: 320px;
  perspective: 1000px;
  aspect-ratio: 1.586 / 1;
}

.credit-card {
  width: 100%;
  height: 100%;
  border-radius: 14px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
  transform-origin: center center;
}

.credit-card.flipped {
  transform: rotateY(180deg);
}

.credit-card__front,
.credit-card__back {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 14px;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.credit-card__front {
  background: linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%);
  overflow: hidden;
  padding: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 1;
}

.credit-card__front::before {
  content: '';
  position: absolute;
  top: -40%;
  right: -20%;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
}

.credit-card__front::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -10%;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.03);
}

.credit-card__back {
  background: linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%);
  transform: rotateY(180deg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.credit-card__chip {
  width: 36px;
  height: 26px;
  background: linear-gradient(135deg, #ffd54f, #ffb300);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.chip-inner {
  width: 26px;
  height: 18px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 3px;
}

.credit-card__brand {
  position: absolute;
  top: 18px;
  right: 18px;
}

.card-brand-svg {
  width: 50px;
  height: auto;
}

.card-brand-text {
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 2px;
  opacity: 0.9;
}

.credit-card__number {
  color: #ffffff;
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: 2.5px;
  font-family: 'Courier New', monospace;
  margin-top: auto;
  padding-bottom: 6px;
}

.credit-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.credit-card__holder,
.credit-card__expiry {
  display: flex;
  flex-direction: column;
}

.card-label {
  font-size: 0.55rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
}

.card-value {
  font-size: 0.75rem;
  color: #ffffff;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-top: 2px;
}

.credit-card__network {
  position: absolute;
  bottom: 18px;
  right: 18px;
}

.contactless-icon {
  width: 22px;
  height: auto;
}

.credit-card__magstripe {
  width: 100%;
  height: 38px;
  background: #111111;
  margin-top: 24px;
}

.credit-card__signature {
  margin: 14px 20px 0;
  height: 30px;
  background: #f2f2f2;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 10px;
}

.credit-card__cvv {
  font-family: 'Courier New', monospace;
  font-size: 0.95rem;
  font-weight: 600;
  color: #111111;
  font-style: italic;
}

.credit-card__back-text {
  text-align: right;
  margin: 4px 20px 0;
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.checkout-form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.checkout-form-group label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.checkout-form-group input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  color: #1f2937;
  transition: border-color 0.2s;
  background: #ffffff;
}

.checkout-form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(255, 122, 0, 0.1);
}

.checkout-form-group--error input {
  border-color: #ef4444;
}

.checkout-form-group--error input:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.checkout-field-error {
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 2px;
}

.checkout-form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
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

  .checkout-form-row {
    grid-template-columns: 1fr;
  }
}
</style>
