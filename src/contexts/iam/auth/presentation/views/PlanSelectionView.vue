<template>
  <div class="plan-selection-page">
    <div class="plan-page-glow plan-page-glow--tr" />
    <div class="plan-page-glow plan-page-glow--bl" />

    <div class="plan-floating-icons">
      <font-awesome-icon icon="microchip" class="plan-float-icon plan-float-icon--chip" />
      <font-awesome-icon icon="chart-line" class="plan-float-icon plan-float-icon--chart" />
      <font-awesome-icon icon="shield" class="plan-float-icon plan-float-icon--shield" />
      <font-awesome-icon icon="building" class="plan-float-icon plan-float-icon--building" />
      <font-awesome-icon icon="wifi" class="plan-float-icon plan-float-icon--wifi" />
      <font-awesome-icon icon="gear" class="plan-float-icon plan-float-icon--gear" />
      <font-awesome-icon icon="signal" class="plan-float-icon plan-float-icon--signal" />
      <font-awesome-icon icon="bolt" class="plan-float-icon plan-float-icon--bolt" />
    </div>

    <div class="plan-selection-container">
      <header class="plan-selection-header">
        <h1 class="plan-selection-title">Planes para tu suscripción</h1>
        <p class="plan-selection-subtitle">Optimiza la eficiencia operativa de tus propiedades con el plan adecuado.</p>
      </header>

      <div v-if="isLoading" class="plans-loading">
        <span class="plans-loading__spinner" />
        <p>Cargando planes...</p>
      </div>

      <div v-else-if="error" class="plans-error">
        <font-awesome-icon icon="triangle-exclamation" />
        <p>{{ error }}</p>
      </div>

      <div v-else class="plans-grid">
        <article
          v-for="(plan, index) in plans"
          :key="plan.id"
          class="plan-card"
          :class="{
            'plan-card--professional': index === plans.length - 1,
            'plan-card--basic': index !== plans.length - 1,
          }"
        >
          <span v-if="index === plans.length - 1" class="plan-card__badge">POPULAR</span>
          <span
            class="plan-card__kicker"
            :class="{ 'plan-card__kicker--light': index === plans.length - 1 }"
          >
            {{ plan.unlimitedProperties ? 'Smart Property Management' : 'Property Starter' }}
          </span>
          <h3
            class="plan-card__name"
            :class="{ 'plan-card__name--light': index === plans.length - 1 }"
          >
            {{ plan.name.toUpperCase() }}
          </h3>
          <div class="plan-card__price">
            <span
              class="plan-card__price-sign"
              :class="{ 'plan-card__price-sign--light': index === plans.length - 1 }"
            >$</span>
            <span
              class="plan-card__price-amount"
              :class="{ 'plan-card__price-amount--light': index === plans.length - 1 }"
            >{{ formatPrice(plan.monthlyPrice) }}</span>
            <span
              class="plan-card__price-period"
              :class="{ 'plan-card__price-period--light': index === plans.length - 1 }"
            >/mes</span>
          </div>
          <p
            class="plan-card__desc"
            :class="{ 'plan-card__desc--light': index === plans.length - 1 }"
          >
            {{ plan.unlimitedProperties ? 'Control operativo avanzado para carteras de propiedades exigentes.' : 'Ideal para pequeños propietarios que inician su digitalización.' }}
          </p>

          <ul
            class="plan-card__features"
            :class="{ 'plan-card__features--light': index === plans.length - 1 }"
          >
            <li>
              <span><font-awesome-icon icon="check" /></span>
              {{ plan.unlimitedProperties ? 'Propiedades ilimitadas' : `Hasta ${plan.maxPropertiesLimit} propiedades` }}
            </li>
            <li><span><font-awesome-icon icon="check" /></span> Monitoreo de consumo en tiempo real</li>
            <li><span><font-awesome-icon icon="check" /></span> Dashboard interactivo</li>
            <li><span><font-awesome-icon icon="check" /></span> Alertas inteligentes</li>
            <li><span><font-awesome-icon icon="check" /></span> Exportación de reportes</li>
          </ul>

          <button
            class="plan-card__btn"
            :class="index === plans.length - 1 ? 'plan-card__btn--professional' : 'plan-card__btn--basic'"
            type="button"
            @click="selectPlan(plan.id)"
          >
            COMENZAR AHORA
          </button>
        </article>
      </div>

      <footer class="plan-selection-footer">
        <p class="plan-footer-note">
          Puedes cambiar o actualizar tu plan en cualquier momento desde la configuración de tu cuenta.
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { SubscriptionPaymentRepositoryImpl } from '@/subscriptions-payment-management/infrastructure/repositories/SubscriptionPaymentRepositoryImpl.js';

const router = useRouter();
const repo = new SubscriptionPaymentRepositoryImpl();

const plans = ref([]);
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    plans.value = await repo.getPlans();
    if (plans.value.length === 0) {
      error.value = 'No hay planes disponibles en este momento.';
    }
  } catch (err) {
    error.value = 'No se pudieron cargar los planes. Intente nuevamente.';
  } finally {
    isLoading.value = false;
  }
});

function formatPrice(price) {
  return price.toFixed(2).replace('.', ',');
}

const selectPlan = (planId) => {
  router.push({ name: 'checkout', query: { planId } });
};
</script>

<style scoped>
.plan-selection-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 48px;
  position: relative;
  overflow-y: auto;
  background:
    radial-gradient(ellipse at 15% 30%, rgba(255, 115, 0, 0.04) 0%, transparent 50%),
    radial-gradient(ellipse at 85% 70%, rgba(23, 49, 131, 0.04) 0%, transparent 50%),
    linear-gradient(160deg, #f4f6fa 0%, #eef0f5 40%, #e8ecf1 100%);
}

.plan-page-glow {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(90px);
  z-index: 0;
}

.plan-page-glow--tr {
  width: 400px;
  height: 400px;
  background: rgba(255, 115, 0, 0.06);
  top: -150px;
  right: -120px;
}

.plan-page-glow--bl {
  width: 400px;
  height: 400px;
  background: rgba(23, 49, 131, 0.05);
  bottom: -150px;
  left: -120px;
}

.plan-floating-icons {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.plan-float-icon {
  position: absolute;
  opacity: 0.06;
  color: var(--secondary-color);
}

.plan-float-icon--chip  { top: 8%; left: 4%; font-size: 2.8rem; animation: float-a 7s ease-in-out infinite; }
.plan-float-icon--chart { top: 20%; right: 3%; font-size: 2.2rem; animation: float-b 9s ease-in-out infinite 1s; color: var(--primary-color); }
.plan-float-icon--shield { bottom: 25%; left: 3%; font-size: 2.5rem; animation: float-a 8s ease-in-out infinite 0.5s; }
.plan-float-icon--building { top: 45%; right: 4%; font-size: 2rem; animation: float-b 10s ease-in-out infinite 2s; }
.plan-float-icon--wifi { bottom: 10%; right: 5%; font-size: 2.6rem; animation: float-a 7.5s ease-in-out infinite 1.5s; color: var(--primary-color); }
.plan-float-icon--gear { top: 10%; right: 12%; font-size: 2rem; animation: spin 12s linear infinite; }
.plan-float-icon--signal { bottom: 35%; left: 5%; font-size: 2rem; animation: float-b 8.5s ease-in-out infinite 0.8s; }
.plan-float-icon--bolt { top: 60%; left: 2%; font-size: 1.8rem; animation: float-a 6s ease-in-out infinite 2.5s; color: var(--primary-color); }

@keyframes float-a {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(2deg); }
}

@keyframes float-b {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(8px) rotate(-2deg); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.plan-selection-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1100px;
  animation: plan-fade-in 0.6s ease-out;
}

@keyframes plan-fade-in {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.plan-selection-header {
  text-align: center;
  margin-bottom: 44px;
}

.plan-selection-title {
  font-family: var(--font-titles);
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--primary-color);
  margin-bottom: 10px;
  letter-spacing: -0.02em;
}

.plan-selection-subtitle {
  font-family: var(--font-general);
  font-size: 1rem;
  color: #64748b;
  line-height: 1.6;
}

.plans-loading,
.plans-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 60px 20px;
  color: #64748b;
}

.plans-loading__spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.plans-error {
  color: #ef4444;
}

.plans-error svg {
  font-size: 2rem;
}

.plans-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: stretch;
}

.plan-card {
  background: #ffffff;
  padding: 40px 36px 32px;
  border-radius: 16px;
  border: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.plan-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
}

.plan-card--professional {
  background: var(--secondary-color);
  border: none;
  box-shadow: 0 16px 32px rgba(23, 49, 131, 0.2);
}

.plan-card--professional:hover {
  box-shadow: 0 20px 40px rgba(23, 49, 131, 0.3);
}

.plan-card__badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: var(--primary-color);
  color: #ffffff;
  padding: 4px 12px;
  border-radius: 4px;
  font-family: var(--font-titles);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 1px;
}

.plan-card__kicker {
  font-family: var(--font-general);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--primary-color);
  text-transform: uppercase;
  margin-bottom: 4px;
  display: block;
}

.plan-card__kicker--light {
  color: rgba(255, 255, 255, 0.7);
}

.plan-card__name {
  font-family: var(--font-titles);
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--secondary-color);
  margin-bottom: 18px;
}

.plan-card__name--light {
  color: #ffffff;
}

.plan-card__price {
  display: flex;
  align-items: baseline;
  gap: 3px;
  margin-bottom: 16px;
}

.plan-card__price-sign {
  font-family: var(--font-titles);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--secondary-color);
  align-self: flex-start;
}

.plan-card__price-amount {
  font-family: var(--font-titles);
  font-size: 2.6rem;
  font-weight: 800;
  color: var(--secondary-color);
  line-height: 1;
  letter-spacing: -0.02em;
}

.plan-card__price-period {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

.plan-card__price-sign--light { color: #ffffff; }
.plan-card__price-amount--light { color: #ffffff; }
.plan-card__price-period--light { color: rgba(255, 255, 255, 0.7); }

.plan-card__desc {
  font-size: 0.82rem;
  color: #64748b;
  margin-bottom: 22px;
  line-height: 1.5;
}

.plan-card__desc--light {
  color: rgba(255, 255, 255, 0.8);
}

.plan-card__features {
  list-style: none;
  padding: 0;
  margin: 0 0 32px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.plan-card__features li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: #64748b;
  line-height: 1.35;
}

.plan-card__features li span {
  color: var(--primary-color);
  font-size: 0.7rem;
  flex-shrink: 0;
  display: inline-flex;
}

.plan-card__features--light li {
  color: rgba(255, 255, 255, 0.9);
}

.plan-card__features--light li span {
  color: var(--primary-color);
}

.plan-card__btn {
  display: block;
  width: 100%;
  padding: 15px;
  border-radius: 8px;
  font-family: var(--font-titles);
  font-weight: 700;
  font-size: 0.82rem;
  letter-spacing: 1.5px;
  border: none;
  cursor: pointer;
  text-transform: uppercase;
  transition: background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
}

.plan-card__btn--basic {
  background: transparent;
  color: var(--secondary-color);
  border: 2px solid var(--secondary-color);
}

.plan-card__btn--basic:hover {
  background: var(--secondary-color);
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(23, 49, 131, 0.15);
}

.plan-card__btn--professional {
  background: var(--primary-color);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(255, 115, 0, 0.25);
}

.plan-card__btn--professional:hover {
  background: #e66700;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 115, 0, 0.35);
}

.plan-selection-footer {
  display: flex;
  justify-content: center;
  margin-top: 36px;
}

.plan-footer-note {
  font-size: 0.78rem;
  color: #94a3b8;
  line-height: 1.5;
}

@media (max-width: 860px) {
  .plan-selection-page {
    padding: 24px 20px;
    align-items: flex-start;
  }

  .plan-floating-icons { display: none; }

  .plan-selection-title {
    font-size: 1.7rem;
  }

  .plans-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .plan-card {
    padding: 28px 24px 24px;
  }

  .plan-card--professional {
    order: -1;
  }
}

@media (max-width: 480px) {
  .plan-selection-page {
    padding: 16px 12px;
  }

  .plan-selection-title {
    font-size: 1.35rem;
  }

  .plan-selection-subtitle {
    font-size: 0.85rem;
  }

  .plan-card {
    padding: 22px 16px 20px;
  }

  .plan-card__price-amount {
    font-size: 2rem;
  }

  .plan-card__features li {
    font-size: 0.78rem;
    gap: 6px;
  }

  .plan-card__features {
    gap: 6px;
    margin-bottom: 24px;
  }
}
</style>
