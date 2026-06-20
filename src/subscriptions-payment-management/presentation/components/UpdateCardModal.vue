<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">
      <header class="modal-header">
        <h2>{{ t('subscription.payment.edit.title') }}</h2>
      </header>

      <div class="modal-body">
        <div class="card-preview-area">
          <div class="credit-card-box">
            <div class="credit-card" :class="{ 'flipped': flipped }">
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
                  <div class="credit-card__cvv">{{ form.cvv || '***' }}</div>
                </div>
                <div class="credit-card__back-text">{{ t('subscription.payment.securityCode') }}</div>
              </div>
            </div>
          </div>
        </div>

        <form class="edit-form" @submit.prevent="handleSave">
          <div class="form-group">
            <label for="ed-holder">{{ t('subscription.payment.edit.holder') }}</label>
            <input id="ed-holder" type="text" v-model="form.holderName" maxlength="100" required />
          </div>

          <div class="form-group">
            <label for="ed-number">{{ t('subscription.payment.edit.number') }}</label>
            <input id="ed-number" type="text" v-model="form.fullNumber" maxlength="19" placeholder="4111 1111 1111 1111" required />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="ed-month">{{ t('subscription.payment.edit.expiryMonth') }}</label>
              <input id="ed-month" type="text" v-model="form.expiryMonth" maxlength="2" placeholder="MM" required />
            </div>
            <div class="form-group">
              <label for="ed-year">{{ t('subscription.payment.edit.expiryYear') }}</label>
              <input id="ed-year" type="text" v-model="form.expiryYear" maxlength="2" placeholder="YY" required />
            </div>
            <div class="form-group">
              <label for="ed-cvv">{{ t('subscription.payment.edit.cvv') }}</label>
              <input 
                id="ed-cvv" 
                type="text" 
                v-model="form.cvv" 
                maxlength="4" 
                placeholder="***" 
                required
                @focus="flipped = true" 
                @blur="flipped = false" 
              />
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn--secondary" @click="$emit('close')">
              {{ t('subscription.payment.edit.cancel') }}
            </button>
            <button type="submit" class="btn btn--primary" :disabled="saving">
              {{ saving ? t('subscription.payment.edit.saving') : t('subscription.payment.edit.save') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue';
import { useI18n } from '@/shared/presentation/i18n';
import { SubscriptionPaymentRepositoryImpl } from '../../../../../../../Users/mimim/Downloads/MaferXD/MaferXD/subscriptions-payment-management/infrastructure/repositories/SubscriptionPaymentRepositoryImpl.js';

const props = defineProps({
  card: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'saved']);
const { t } = useI18n();

const repository = new SubscriptionPaymentRepositoryImpl();
const saving = ref(false);
const flipped = ref(false);

const form = reactive({
  brand: props.card?.brand || 'Visa',
  holderName: props.card?.holderName || '',
  fullNumber: props.card?.fullNumber || '',
  expiryMonth: props.card?.expiryMonth || '',
  expiryYear: props.card?.expiryYear || '',
  cvv: props.card?.cvv || ''
});

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

watch(() => form.fullNumber, (newVal) => {
  // Auto format card number with spaces every 4 digits
  let formatted = (newVal || '').replace(/\D/g, '').match(/.{1,4}/g);
  if (formatted) {
    form.fullNumber = formatted.join(' ');
  }
  
  const brand = detectCardBrand(newVal);
  if (brand !== 'unknown') {
    form.brand = brand.charAt(0).toUpperCase() + brand.slice(1);
  }
});

const previewBrand = computed(() => (form.brand || '').toLowerCase());
const previewBrandLabel = computed(() => form.brand || 'CARD');

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

async function handleSave() {
  saving.value = true;
  try {
    await repository.updatePaymentMethod(props.card.id, {
      brand: form.brand,
      fullNumber: form.fullNumber.replace(/\s+/g, ''),
      expiryMonth: form.expiryMonth,
      expiryYear: form.expiryYear,
      holderName: form.holderName,
      cvv: form.cvv
    });
    emit('saved');
  } catch (err) {
    alert(t('subscription.payment.edit.errorSaving') + (err.message || 'Error'));
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 560px;
  max-height: 95vh;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 0;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #082765;
  font-family: var(--font-titles);
}

.modal-body {
  padding: 20px 24px 24px;
}

.card-preview-area {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
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

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-group label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group input,
.form-group select {
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

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(255, 122, 0, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.btn {
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
  border: 1.5px solid transparent;
}

.btn--primary {
  background: var(--primary-color);
  color: #ffffff;
  border-color: var(--primary-color);
}

.btn--primary:hover:not(:disabled) {
  background: #e66700;
}

.btn--primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn--secondary {
  background: transparent;
  color: #374151;
  border-color: #d1d5db;
}

.btn--secondary:hover {
  background: #f3f4f6;
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 10px;
  }
  
  .modal-body {
    padding: 16px;
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
