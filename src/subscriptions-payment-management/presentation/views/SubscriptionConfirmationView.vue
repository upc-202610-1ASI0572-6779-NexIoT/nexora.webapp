<template>
  <div class="confirmation-page">
    <div class="confirmation-page-glow confirmation-page-glow--tr" />
    <div class="confirmation-page-glow confirmation-page-glow--bl" />

    <div class="confirmation-card">
      <div class="confirmation-icon">
        <font-awesome-icon icon="check-circle" />
      </div>

      <h1 class="confirmation-title">{{ t('subscription.confirmation.title') }}</h1>

      <div class="confirmation-details">
        <div class="confirmation-detail">
          <span class="confirmation-detail__label">{{ t('subscription.confirmation.planLabel') }}</span>
          <strong class="confirmation-detail__value">{{ planName }}</strong>
        </div>
        <div class="confirmation-detail">
          <span class="confirmation-detail__label">{{ t('subscription.confirmation.amountLabel') }}</span>
          <strong class="confirmation-detail__value">${{ amount }}</strong>
        </div>
        <div class="confirmation-detail">
          <span class="confirmation-detail__label">{{ t('subscription.confirmation.dueDateLabel') }}</span>
          <strong class="confirmation-detail__value">{{ dueDate }}</strong>
        </div>
        <div class="confirmation-detail">
          <span class="confirmation-detail__label">{{ t('subscription.confirmation.invoiceLabel') }}</span>
          <strong class="confirmation-detail__value">#{{ invoiceId }}</strong>
        </div>
        <div class="confirmation-detail">
          <span class="confirmation-detail__label">{{ t('subscription.confirmation.statusLabel') }}</span>
          <strong class="confirmation-detail__value confirmation-detail__value--active">{{ t('subscription.confirmation.statusActive') }}</strong>
        </div>
      </div>

      <button class="confirmation-btn" type="button" @click="goToDashboard">
        {{ t('subscription.confirmation.goToDashboard') }}
        <font-awesome-icon icon="arrow-right" />
      </button>
    </div>

    <footer class="confirmation-footer">
      <p class="confirmation-footer__copy">NexIoT &copy; 2025 Todos los derechos reservados.</p>
      <nav class="confirmation-footer__links">
        <a href="https://upc-202610-1asi0572-6779-nexiot.github.io/nexora.website/privacy_policy.html" class="confirmation-footer__link" target="_blank" rel="noopener noreferrer">Política de Privacidad</a>
        <a href="https://upc-202610-1asi0572-6779-nexiot.github.io/nexora.website/terms_conditions.html" class="confirmation-footer__link" target="_blank" rel="noopener noreferrer">Términos de Servicio</a>
        <a href="https://www.pcisecuritystandards.org/" class="confirmation-footer__link" target="_blank" rel="noopener noreferrer">PCI Compliance</a>
      </nav>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/contexts/iam/auth/presentation/store/authStore';
import { useI18n } from '@/shared/presentation/i18n';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n();

const planName = route.query.planName || '—';
const amount = route.query.amount ? Number(route.query.amount).toFixed(2) : '—';
const dueDate = route.query.dueDate ? new Date(route.query.dueDate).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';
const invoiceId = route.query.invoiceId || '—';

onMounted(() => {
  if (!authStore.subscription) {
    router.replace({ name: 'dashboard' });
  }
});

const goToDashboard = () => {
  router.push({ name: 'dashboard' });
};
</script>

<style scoped>
.confirmation-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  position: relative;
  overflow-y: auto;
  background:
    radial-gradient(ellipse at 30% 40%, rgba(255, 115, 0, 0.04) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 60%, rgba(23, 49, 131, 0.04) 0%, transparent 50%),
    linear-gradient(160deg, #f4f6fa 0%, #eef0f5 40%, #e8ecf1 100%);
}

.confirmation-page-glow {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(90px);
  z-index: 0;
}

.confirmation-page-glow--tr {
  width: 400px;
  height: 400px;
  background: rgba(34, 197, 94, 0.06);
  top: -150px;
  right: -120px;
}

.confirmation-page-glow--bl {
  width: 400px;
  height: 400px;
  background: rgba(23, 49, 131, 0.05);
  bottom: -150px;
  left: -120px;
}

.confirmation-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 520px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  padding: 48px 40px;
  text-align: center;
  animation: confirmation-enter 0.6s ease-out;
}

@keyframes confirmation-enter {
  from { opacity: 0; transform: translateY(24px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.confirmation-icon {
  font-size: 3.5rem;
  color: #22c55e;
  margin-bottom: 20px;
}

.confirmation-title {
  font-family: var(--font-titles);
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--secondary-color);
  line-height: 1.4;
  margin-bottom: 32px;
}

.confirmation-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
  padding: 24px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  text-align: left;
}

.confirmation-detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.confirmation-detail__label {
  font-size: 0.82rem;
  color: #64748b;
  font-weight: 500;
}

.confirmation-detail__value {
  font-size: 0.9rem;
  color: #1f2937;
  font-weight: 700;
}

.confirmation-detail__value--active {
  color: #16a34a;
}

.confirmation-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 36px;
  background: var(--primary-color);
  color: #ffffff;
  font-family: var(--font-titles);
  font-weight: 700;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
}

.confirmation-btn:hover {
  background: #e66700;
  box-shadow: 0 4px 15px rgba(255, 115, 0, 0.3);
  transform: translateY(-1px);
}

.confirmation-btn:active {
  transform: translateY(0);
}

.confirmation-btn .fa-arrow-right {
  transition: transform 0.2s;
}

.confirmation-btn:hover .fa-arrow-right {
  transform: translateX(3px);
}

.confirmation-footer {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 520px;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.confirmation-footer__copy {
  font-size: 0.78rem;
  color: #94a3b8;
}

.confirmation-footer__links {
  display: flex;
  gap: 24px;
}

.confirmation-footer__link {
  font-size: 0.78rem;
  color: #64748b;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.confirmation-footer__link:hover {
  color: var(--primary-color);
  text-decoration: underline;
}

@media (max-width: 600px) {
  .confirmation-page {
    padding: 24px 16px;
  }

  .confirmation-card {
    padding: 32px 24px;
  }

  .confirmation-title {
    font-size: 1.1rem;
  }

  .confirmation-details {
    padding: 16px;
  }

  .confirmation-detail {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .confirmation-footer {
    flex-direction: column;
    text-align: center;
  }

  .confirmation-footer__links {
    justify-content: center;
    flex-wrap: wrap;
    gap: 16px;
  }
}
</style>
