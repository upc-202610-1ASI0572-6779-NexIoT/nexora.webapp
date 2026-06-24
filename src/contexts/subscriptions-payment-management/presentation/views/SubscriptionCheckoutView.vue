<template>
  <div class="checkout-page">
    <div class="checkout-page-glow checkout-page-glow--tr" />
    <div class="checkout-page-glow checkout-page-glow--bl" />

    <div class="checkout-floating-icons">
      <font-awesome-icon icon="lock" class="checkout-float-icon checkout-float-icon--lock" />
      <font-awesome-icon icon="shield" class="checkout-float-icon checkout-float-icon--shield" />
      <font-awesome-icon icon="credit-card" class="checkout-float-icon checkout-float-icon--card" />
      <font-awesome-icon icon="check-circle" class="checkout-float-icon checkout-float-icon--check" />
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
                      <svg v-if="cardBrand === 'visa'" viewBox="0 0 1000 324.68" class="card-brand-svg card-brand-svg--visa">
                        <path fill="#ffffff" d="m651.19.5c-70.93,0-134.32,36.77-134.32,104.69,0,77.9,112.42,83.28,112.42,122.42,0,16.48-18.88,31.23-51.14,31.23-45.77,0-79.98-20.61-79.98-20.61l-14.64,68.55s39.41,17.41,91.73,17.41c77.55,0,138.58-38.57,138.58-107.66,0-82.32-112.89-87.54-112.89-123.86,0-12.91,15.5-27.05,47.66-27.05,36.29,0,65.89,14.99,65.89,14.99l14.33-66.2S696.61.5,651.18.5h0ZM2.22,5.5L.5,15.49s29.84,5.46,56.72,16.36c34.61,12.49,37.07,19.77,42.9,42.35l63.51,244.83h85.14L379.93,5.5h-84.94l-84.28,213.17-34.39-180.7c-3.15-20.68-19.13-32.48-38.68-32.48,0,0-135.41,0-135.41,0Zm411.87,0l-66.63,313.53h81L494.85,5.5h-80.76Zm451.76,0c-19.53,0-29.88,10.46-37.47,28.73l-118.67,284.8h84.94l16.43-47.47h103.48l9.99,47.47h74.95L934.12,5.5h-68.27Zm11.05,84.71l25.18,117.65h-67.45l42.28-117.65h0Z"/>
                      </svg>
                      <svg v-else-if="cardBrand === 'mastercard'" viewBox="0 0 50 30" class="card-brand-svg">
                        <circle cx="18" cy="15" r="11" fill="#eb001b"/>
                        <circle cx="32" cy="15" r="11" fill="#f79e1b"/>
                      </svg>
                      <svg v-else-if="cardBrand === 'amex'" viewBox="0 0 50 30" class="card-brand-svg">
                        <rect width="50" height="30" rx="4" fill="#007bc1"/>
                        <text x="25" y="19" fill="#ffffff" font-family="Arial, sans-serif" font-size="9px" font-weight="bold" text-anchor="middle" letter-spacing="1">AMEX</text>
                      </svg>
                      <span v-else class="card-brand-text">{{ cardBrandLabel }}</span>
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
                      <div class="credit-card__cvv">{{ form.cvv || '***' }}</div>
                    </div>
                    <div class="credit-card__back-text">{{ t('subscription.payment.securityCode') }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="payment-form__fields">
              <div class="form-group" :class="{ 'form-group--error': errors.holderName }">
                <label for="chk-holder">{{ t('subscription.checkout.cardHolder') }}</label>
                <input id="chk-holder" type="text" v-model="form.holderName" maxlength="100" :placeholder="t('subscription.checkout.cardPlaceholderName')" @blur="validateField('holderName')" />
                <span v-if="errors.holderName" class="form-error">{{ errors.holderName }}</span>
              </div>

              <div class="form-group" :class="{ 'form-group--error': errors.fullNumber }">
                <label for="chk-number">{{ t('subscription.checkout.cardNumber') }}</label>
                <input id="chk-number" type="text" inputmode="numeric" v-model="form.fullNumber" maxlength="19" :placeholder="t('subscription.checkout.cardPlaceholderNumber')" @input="onNumberInput" @blur="validateField('fullNumber')" />
                <span v-if="errors.fullNumber" class="form-error">{{ errors.fullNumber }}</span>
              </div>

              <div class="form-row">
                <div class="form-group" :class="{ 'form-group--error': errors.expiryMonth }">
                  <label for="chk-month">{{ t('subscription.checkout.expiryMonth') }}</label>
                  <input id="chk-month" type="text" inputmode="numeric" v-model="form.expiryMonth" maxlength="2" placeholder="MM" @input="onNumericInput('expiryMonth')" @blur="validateField('expiryMonth')" />
                  <span v-if="errors.expiryMonth" class="form-error">{{ errors.expiryMonth }}</span>
                </div>
                <div class="form-group" :class="{ 'form-group--error': errors.expiryYear }">
                  <label for="chk-year">{{ t('subscription.checkout.expiryYear') }}</label>
                  <input id="chk-year" type="text" inputmode="numeric" v-model="form.expiryYear" maxlength="2" placeholder="YY" @input="onNumericInput('expiryYear')" @blur="validateField('expiryYear')" />
                  <span v-if="errors.expiryYear" class="form-error">{{ errors.expiryYear }}</span>
                </div>
                <div class="form-group" :class="{ 'form-group--error': errors.cvv }">
                  <label for="chk-cvv">{{ t('subscription.checkout.cvv') }}</label>
                  <input id="chk-cvv" type="text" inputmode="numeric" v-model="form.cvv" maxlength="4" placeholder="***" @input="onNumericInput('cvv')" @focus="cardFlipped = true" @blur="cardFlipped = false; validateField('cvv')" />
                  <span v-if="errors.cvv" class="form-error">{{ errors.cvv }}</span>
                </div>
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
          <a href="https://upc-202610-1asi0572-6779-nexiot.github.io/nexora.website/privacy_policy.html" class="checkout-footer__link" target="_blank" rel="noopener noreferrer">Política de Privacidad</a>
          <a href="https://upc-202610-1asi0572-6779-nexiot.github.io/nexora.website/terms_conditions.html" class="checkout-footer__link" target="_blank" rel="noopener noreferrer">Términos de Servicio</a>
          <a href="https://www.pcisecuritystandards.org/" class="checkout-footer__link" target="_blank" rel="noopener noreferrer">PCI Compliance</a>
        </nav>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from '@/shared/presentation/i18n';
import { ActivateSubscriptionUseCase } from '../../application/use-cases/ActivateSubscriptionUseCase';
import { SubscriptionPaymentRepositoryImpl } from '../../infrastructure/repositories/SubscriptionPaymentRepositoryImpl';
import { useAuthStore } from '../../../iam/auth/presentation/store/authStore';

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

const form = reactive({
  holderName: '',
  fullNumber: '',
  expiryMonth: '',
  expiryYear: '',
  cvv: '',
  brand: 'Visa',
});

const errors = reactive({
  holderName: '',
  fullNumber: '',
  expiryMonth: '',
  expiryYear: '',
  cvv: '',
});

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
    return;
  }

  if (authStore.user?.fullName) {
    form.holderName = authStore.user.fullName;
  } else {
    try {
      await authStore.fetchUser();
      if (authStore.user?.fullName) {
        form.holderName = authStore.user.fullName;
      }
    } catch (e) {
      // Silently skip if profile fetch fails
    }
  }
});

const igvAmount = computed(() => plan.value ? plan.value.monthlyPrice * 0.18 : 0);
const totalAmount = computed(() => plan.value ? plan.value.monthlyPrice + igvAmount.value : 0);

const goBack = () => {
  router.push({ name: 'plan-selection' });
};

function detectCardBrand(num) {
  const clean = (num || '').replace(/\s+/g, '');
  if (!clean) return 'unknown';
  if (/^4/.test(clean)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(clean)) return 'mastercard';
  if (/^3[47]/.test(clean)) return 'amex';
  if (/^(6011|622|64|65)/.test(clean)) return 'discover';
  if (/^36/.test(clean)) return 'diners';
  if (/^35/.test(clean)) return 'jcb';
  return 'unknown';
}

const cardBrand = computed(() => (form.brand || '').toLowerCase());
const cardBrandLabel = computed(() => form.brand || 'CARD');

const previewNumber = computed(() => {
  const n = form.fullNumber || '';
  if (!n) return '····  ····  ····  ····';
  return n;
});

const previewHolder = computed(() => form.holderName || '');
const previewExpiry = computed(() => {
  if (form.expiryMonth && form.expiryYear) {
    return `${form.expiryMonth}/${form.expiryYear}`;
  }
  return 'MM/YY';
});

function onNumberInput() {
  let formatted = (form.fullNumber || '').replace(/\D/g, '').match(/.{1,4}/g);
  if (formatted) {
    form.fullNumber = formatted.join(' ');
  }
  const brand = detectCardBrand(form.fullNumber);
  if (brand !== 'unknown') {
    form.brand = brand.charAt(0).toUpperCase() + brand.slice(1);
  }
  errors.fullNumber = '';
}

function onNumericInput(field) {
  form[field] = (form[field] || '').replace(/\D/g, '');
}

function isValidLuhn(num) {
  const digits = num.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

function validateField(field) {
  switch (field) {
    case 'holderName':
      if (!form.holderName.trim()) {
        errors.holderName = t('subscription.checkout.validation.holderRequired');
      } else {
        errors.holderName = '';
      }
      break;
    case 'fullNumber': {
      const raw = form.fullNumber.replace(/\s+/g, '');
      if (!raw) {
        errors.fullNumber = t('subscription.checkout.validation.numberRequired');
      } else if (!isValidLuhn(raw)) {
        errors.fullNumber = t('subscription.checkout.validation.numberInvalid');
      } else {
        errors.fullNumber = '';
      }
      break;
    }
    case 'expiryMonth':
      if (!form.expiryMonth) {
        errors.expiryMonth = t('subscription.checkout.validation.monthRequired');
      } else {
        const m = parseInt(form.expiryMonth, 10);
        if (m < 1 || m > 12 || form.expiryMonth.length !== 2) {
          errors.expiryMonth = t('subscription.checkout.validation.monthInvalid');
        } else {
          errors.expiryMonth = '';
        }
      }
      break;
    case 'expiryYear':
      if (!form.expiryYear) {
        errors.expiryYear = t('subscription.checkout.validation.yearRequired');
      } else {
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const y = parseInt(form.expiryYear, 10);
        if (form.expiryYear.length !== 2 || y < currentYear) {
          errors.expiryYear = t('subscription.checkout.validation.yearExpired');
        } else {
          errors.expiryYear = '';
        }
      }
      break;
    case 'cvv':
      if (!form.cvv) {
        errors.cvv = t('subscription.checkout.validation.cvvRequired');
      } else {
        const cvvRaw = form.cvv.replace(/\D/g, '');
        if (cvvRaw.length < 3 || cvvRaw.length > 4) {
          errors.cvv = t('subscription.checkout.validation.cvvInvalid');
        } else {
          errors.cvv = '';
        }
      }
      break;
  }
}

function validateAll() {
  validateField('holderName');
  validateField('fullNumber');
  validateField('expiryMonth');
  validateField('expiryYear');
  validateField('cvv');
  return !errors.holderName && !errors.fullNumber && !errors.expiryMonth && !errors.expiryYear && !errors.cvv;
}

const handleSubmit = async () => {
  if (!validateAll()) return;
  isLoading.value = true;
  serverError.value = null;

  try {
    const cardData = {
      brand: form.brand,
      fullNumber: form.fullNumber.replace(/\s+/g, ''),
      expiryMonth: form.expiryMonth,
      expiryYear: form.expiryYear,
      holderName: form.holderName.trim(),
      cvv: form.cvv,
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
  gap: 1rem;
}

.card-preview-area {
  display: flex;
  justify-content: center;
}

.credit-card-box {
  width: 100%;
  max-width: 360px;
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
  padding: 20px;
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
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
}

.credit-card__front::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -10%;
  width: 170px;
  height: 170px;
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
  width: 38px;
  height: 28px;
  background: linear-gradient(135deg, #ffd54f, #ffb300);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.chip-inner {
  width: 28px;
  height: 20px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 3px;
}

.credit-card__brand {
  position: absolute;
  top: 20px;
  right: 20px;
}

.card-brand-svg {
  height: 24px;
  width: auto;
}

.card-brand-svg--visa {
  width: 60px;
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
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 3px;
  font-family: 'Courier New', monospace;
  margin-top: auto;
  padding-bottom: 8px;
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
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
}

.card-value {
  font-size: 0.8rem;
  color: #ffffff;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-top: 2px;
}

.credit-card__network {
  position: absolute;
  bottom: 20px;
  right: 20px;
}

.contactless-icon {
  width: 24px;
  height: auto;
}

.credit-card__magstripe {
  width: 100%;
  height: 38px;
  background: #111111;
  margin-top: 26px;
}

.credit-card__signature {
  margin: 14px 22px 0;
  height: 32px;
  background: #f2f2f2;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 10px;
}

.credit-card__cvv {
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  font-weight: 600;
  color: #111111;
  font-style: italic;
}

.credit-card__back-text {
  text-align: right;
  margin: 4px 22px 0;
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.payment-form__fields {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.form-group label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group input {
  width: 100%;
  box-sizing: border-box;
  padding: 7px 10px;
  border: 1.5px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.85rem;
  font-family: inherit;
  color: #1f2937;
  transition: border-color 0.2s;
  background: #ffffff;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(255, 122, 0, 0.1);
}

.form-group--error input {
  border-color: #ef4444;
}

.form-group--error input:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-error {
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 2px;
}

.payment-form__submit {
  width: 100%;
  padding: 12px;
  margin-top: 0.25rem;
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

  .credit-card__front {
    padding: 14px;
  }

  .credit-card__number {
    font-size: 0.9rem;
    letter-spacing: 1.5px;
  }

  .card-value {
    font-size: 0.7rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
