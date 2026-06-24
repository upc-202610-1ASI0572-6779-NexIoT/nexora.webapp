<template>
  <article class="payment-card">
    <h2>{{ t('subscription.payment.cardTitle') }}</h2>

    <div class="credit-card-box">
      <div class="credit-card-wrapper" @mouseenter="flipped = true" @mouseleave="flipped = false">
        <div class="credit-card" :class="{ 'credit-card--empty': !card, 'flipped': flipped }">
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
            <div class="credit-card__number">
              <span v-if="card">{{ displayNumber }}</span>
              <span v-else class="card-placeholder">····  ····  ····  ····</span>
            </div>
            <div class="credit-card__footer">
              <div class="credit-card__holder">
                <span class="card-label">{{ t('subscription.payment.cardHolder') }}</span>
                <span v-if="card" class="card-value">{{ cardHolderName }}</span>
                <span v-else class="card-value card-placeholder">{{ t('subscription.payment.placeholderName') }}</span>
              </div>
              <div class="credit-card__expiry">
                <span class="card-label">{{ t('subscription.payment.expires') }}</span>
                <span v-if="card" class="card-value">{{ cardExpiry }}</span>
                <span v-else class="card-value card-placeholder">{{ t('subscription.payment.placeholderExpiry') }}</span>
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
              <div class="credit-card__cvv">{{ cardCvv }}</div>
            </div>
            <div class="credit-card__back-text">{{ t('subscription.payment.securityCode') }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="card" class="card-actions">
      <button class="card-action-btn" type="button" @click="$emit('update-card')">
        <font-awesome-icon icon="pen-to-square" />
        <span>{{ t('subscription.actions.updateCard') }}</span>
      </button>
    </div>
    <button v-else class="add-card-btn" type="button" @click="$emit('update-card')">
      <font-awesome-icon icon="plus" />
      <span>{{ t('subscription.actions.addPaymentMethod') }}</span>
    </button>
  </article>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from '@/shared/presentation/i18n';

const props = defineProps({
  card: {
    type: Object,
    default: null
  }
});

defineEmits(['update-card']);

const flipped = ref(false);
const { t } = useI18n();

const cardBrand = computed(() => {
  if (!props.card) return 'unknown';
  return (props.card.brand || '').toLowerCase();
});

const cardBrandLabel = computed(() => {
  if (!props.card) return '----';
  return props.card.brand || 'CARD';
});

const displayNumber = computed(() => {
  if (!props.card) return '';
  const last = props.card.maskedNumber || props.card.lastFour || '0000';
  return `····  ····  ····  ${last}`;
});

const cardHolderName = computed(() => {
  if (!props.card) return t('subscription.payment.cardHolder');
  return props.card.holderName || t('subscription.payment.cardHolder');
});

const cardExpiry = computed(() => {
  if (!props.card) return '';
  if (props.card.expiryMonth && props.card.expiryYear) {
    return `${props.card.expiryMonth}/${props.card.expiryYear}`;
  }
  return props.card.expiresAt || 'MM/YY';
});

const cardCvv = computed(() => {
  return props.card?.cvv || '***';
});
</script>

<style scoped>
.payment-card {
  background: #ffffff;
  border: 1px solid #d7dde6;
  border-radius: 12px;
  padding: 20px 24px;
}

.payment-card h2 {
  color: #082765;
  font-size: 1.15rem;
  line-height: 1.15;
  margin: 0 0 16px;
}

.credit-card-box {
  width: 100%;
  max-width: 320px;
}

.credit-card-wrapper {
  perspective: 1000px;
  width: 100%;
  aspect-ratio: 1.586 / 1;
}

.credit-card {
  width: 100%;
  height: 100%;
  border-radius: 14px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.5s ease;
  cursor: pointer;
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

.credit-card--empty .credit-card__front {
  background: linear-gradient(135deg, #37474f 0%, #455a64 50%, #546e7a 100%);
  opacity: 0.7;
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

.credit-card--empty .credit-card__back {
  background: linear-gradient(135deg, #37474f 0%, #455a64 50%, #546e7a 100%);
  opacity: 0.7;
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
  margin-top: auto;
  padding-bottom: 6px;
}

.credit-card__number span {
  color: #ffffff;
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: 2.5px;
  font-family: 'Courier New', monospace;
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

.card-placeholder {
  opacity: 0.5;
  letter-spacing: 2px;
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

.card-actions {
  margin-top: 14px;
}

.card-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 16px;
  background: transparent;
  border: 1.5px solid #1a237e;
  border-radius: 8px;
  color: #1a237e;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.card-action-btn:hover {
  background: #1a237e;
  color: #ffffff;
}

.add-card-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: transparent;
  border: 1.5px dashed #9ca3af;
  border-radius: 8px;
  color: #374151;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  font-family: inherit;
  width: 100%;
  justify-content: center;
  transition: all 0.2s;
  margin-top: 6px;
}

.add-card-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: #fff8f0;
}

@media (max-width: 480px) {
  .credit-card__front {
    padding: 14px;
  }
  
  .credit-card__number span {
    font-size: 0.9rem;
    letter-spacing: 1.5px;
  }
  
  .card-value {
    font-size: 0.7rem;
  }
}
</style>
