<template>
  <div class="register-page">
    <div class="register-page__decor">
      <font-awesome-icon icon="microchip" class="register-page__decor-icon register-page__decor-icon--chip" />
      <font-awesome-icon icon="lightbulb" class="register-page__decor-icon register-page__decor-icon--bulb" />
      <font-awesome-icon icon="lock" class="register-page__decor-icon register-page__decor-icon--lock" />
      <font-awesome-icon icon="wifi" class="register-page__decor-icon register-page__decor-icon--wifi" />
      <font-awesome-icon icon="gear" class="register-page__decor-icon register-page__decor-icon--gear" />
    </div>

    <div class="register-card">
      <aside class="register-brand">
        <div class="register-brand__grid" />
        <div class="register-brand__glow register-brand__glow--tr" />
        <div class="register-brand__glow register-brand__glow--bl" />
        <div class="register-brand__signal" />

        <div class="register-brand__content">
          <AppLogo width="180px" class="register-brand__logo" />

          <p class="register-brand__tagline">
            Intelligence for the<br />Industrial Frontier.
          </p>
        </div>

        <div class="register-brand__features">
          <div class="register-brand__feature">
            <font-awesome-icon icon="check" class="register-brand__feature-icon" />
            <span>Real-time monitoring</span>
          </div>
          <div class="register-brand__feature">
            <font-awesome-icon icon="check" class="register-brand__feature-icon" />
            <span>Smart alert system</span>
          </div>
          <div class="register-brand__feature">
            <font-awesome-icon icon="check" class="register-brand__feature-icon" />
            <span>Advanced analytics</span>
          </div>
        </div>

        <div class="register-brand__status">
          <span class="register-brand__dot" />
          <span class="register-brand__status-text">SECURE CONNECTION</span>
        </div>
      </aside>

      <main class="register-main">
        <div class="register-main__body">
          <header class="register-main__header">
            <h1 class="register-main__title">Create your account</h1>
            <p class="register-main__subtitle">
              Join Nexora and start managing your properties
            </p>
          </header>

          <div
            v-if="serverError"
            class="register-alert"
          >
            <font-awesome-icon icon="triangle-exclamation" class="register-alert__icon" />
            <div class="register-alert__body">
              <p>{{ serverError.message }}</p>
            </div>
          </div>

          <RegisterForm
            :is-submitting="registerStore.isSubmitting"
            :server-field-errors="registerStore.fieldErrors"
            @register-submit="handleRegister"
            @clear-errors="handleClearErrors"
          />

          <footer class="register-main__footer">
            <p>
              Already have an account?
              <router-link to="/login" class="register-main__link">Sign in</router-link>
            </p>
          </footer>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import AppLogo from '@/shared/presentation/components/AppLogo.vue';
import RegisterForm from '../components/RegisterForm.vue';
import { useRegisterStore } from '../store/registerStore';
import { useAuthStore } from '../store/authStore';

const registerStore = useRegisterStore();
const authStore = useAuthStore();
const router = useRouter();

const serverError = computed(() => {
  const error = registerStore.serverError;
  if (!error) return null;
  return error;
});

const handleClearErrors = () => {
  registerStore.clearErrors();
};

const handleRegister = async (formData) => {
  try {
    const result = await registerStore.register(formData);

    authStore.token = result.token;
    authStore.user = result.user;
    authStore.isAuthenticated = true;
    authStore.status = 'success';
    localStorage.setItem('token', result.token);
    console.log(result.token);

    router.push({ name: 'plan-selection' });
  } catch (error) {
    if (error.code !== 'VALIDATION_ERROR') {
      console.error('Registration error:', error.message);
    }
  }
};
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 20% 50%, rgba(255, 115, 0, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 50%, rgba(23, 49, 131, 0.05) 0%, transparent 50%),
    linear-gradient(135deg, #f0f2f5 0%, #e8ecf1 100%);
}

.register-page::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.7) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
}

.register-card {
  position: relative;
  z-index: 1;
  display: flex;
  width: 100%;
  max-width: 1040px;
  min-height: 700px;
  border-radius: 16px;
  overflow: hidden;
  background: #ffffff;
  box-shadow:
    0 25px 50px -12px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(0, 0, 0, 0.05);
  animation: card-enter 0.5s ease-out;
}

@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ─── Left Brand Panel ─── */

.register-brand {
  flex: 0 0 380px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3.5rem;
  background: linear-gradient(160deg, #0b1a30 0%, #162d5a 40%, #1e3a6f 100%);
  color: #ffffff;
  overflow: hidden;
}

.register-brand__grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
}

.register-brand__glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(60px);
}

.register-brand__glow--tr {
  width: 350px;
  height: 350px;
  background: rgba(255, 115, 0, 0.1);
  top: -120px;
  right: -100px;
}

.register-brand__glow--bl {
  width: 280px;
  height: 280px;
  background: rgba(0, 255, 136, 0.07);
  bottom: -80px;
  left: -80px;
}

.register-brand__signal {
  position: absolute;
  bottom: 6rem;
  right: 3.5rem;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15));
  pointer-events: none;
}

.register-brand__signal::before {
  content: '';
  position: absolute;
  right: 0;
  top: -2px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
}

.register-brand__content {
  position: relative;
  z-index: 1;
}

.register-brand__logo {
  margin-bottom: 2rem;
  color: #ffffff;
}

.register-brand__tagline {
  font-family: var(--font-titles);
  font-size: 1.25rem;
  line-height: 1.6;
  opacity: 0.85;
  font-weight: 400;
}

.register-brand__features {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.register-brand__feature {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  opacity: 0.8;
}

.register-brand__feature-icon {
  color: #00ff88;
  font-size: 0.75rem;
}

.register-brand__status {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  opacity: 0.8;
}

.register-brand__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #00ff88;
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(0, 255, 136, 0.4);
  }
  50% {
    opacity: 0.9;
    box-shadow: 0 0 0 6px rgba(0, 255, 136, 0);
  }
}

/* ─── Right Main Panel ─── */

.register-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.register-main__body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  padding: 2.5rem 3rem;
}

.register-main__header {
  margin-bottom: 1.5rem;
}

.register-main__title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--secondary-color);
  margin-bottom: 0.4rem;
}

.register-main__subtitle {
  color: #888;
  font-size: 0.95rem;
}

/* ─── Page Decorative Elements ─── */

.register-page__decor {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.register-page__decor-icon {
  position: absolute;
  opacity: 0.07;
}

.register-page__decor-icon--chip {
  top: 6%;
  right: 3%;
  font-size: 3.5rem;
  color: var(--primary-color);
  animation: float-icon 6s ease-in-out infinite;
}

.register-page__decor-icon--bulb {
  bottom: 8%;
  left: 3%;
  font-size: 2.5rem;
  color: var(--secondary-color);
  animation: float-icon 8s ease-in-out infinite 1s;
}

.register-page__decor-icon--lock {
  top: 44%;
  right: 2%;
  font-size: 2rem;
  color: var(--primary-color);
  animation: float-icon 7s ease-in-out infinite 2.5s;
}

.register-page__decor-icon--wifi {
  bottom: 10%;
  right: 5%;
  font-size: 2.8rem;
  color: var(--secondary-color);
  animation: float-icon 9s ease-in-out infinite 0.5s;
}

.register-page__decor-icon--gear {
  top: 8%;
  left: 3%;
  font-size: 2.8rem;
  color: var(--primary-color);
  animation: spin-icon 10s linear infinite;
}

@keyframes float-icon {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes spin-icon {
  to { transform: rotate(360deg); }
}

/* ─── Alert ─── */

.register-alert {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
}

.register-alert__icon {
  color: #ef4444;
  font-size: 1rem;
  margin-top: 2px;
  flex-shrink: 0;
}

.register-alert__body p {
  margin: 0;
  font-size: 0.85rem;
  color: #7f1d1d;
}

/* ─── Success State ─── */

.register-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 1rem;
}

.register-success__icon {
  font-size: 3rem;
  color: #22c55e;
  margin-bottom: 1rem;
}

.register-success__title {
  font-size: 1.5rem;
  color: var(--secondary-color);
  margin-bottom: 0.5rem;
}

.register-success__text {
  color: #888;
  font-size: 0.9rem;
}

/* ─── Footer ─── */

.register-main__footer {
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  text-align: center;
  font-size: 0.9rem;
  color: #888;
  border-top: 1px solid #f0f0f0;
}

.register-main__link {
  font-weight: 600;
  color: var(--primary-color);
  text-decoration: none;
}

.register-main__link:hover {
  text-decoration: underline;
}

/* ─── Responsive ─── */

@media (max-width: 960px) {
  .register-page__decor {
    display: none;
  }

  .register-brand {
    display: none;
  }

  .register-card {
    max-width: 560px;
    min-height: auto;
  }

  .register-main__body {
    padding: 2.5rem;
  }
}

@media (max-width: 480px) {
  .register-page {
    padding: 0;
  }

  .register-card {
    border-radius: 0;
    min-height: 100vh;
  }

  .register-main__body {
    padding: 2rem;
  }
}
</style>
