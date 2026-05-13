<template>
  <div class="login-page">
    <div class="login-page__decor">
      <font-awesome-icon icon="microchip" class="login-page__decor-icon login-page__decor-icon--chip" />
      <font-awesome-icon icon="lightbulb" class="login-page__decor-icon login-page__decor-icon--bulb" />
      <font-awesome-icon icon="lock" class="login-page__decor-icon login-page__decor-icon--lock" />
      <font-awesome-icon icon="wifi" class="login-page__decor-icon login-page__decor-icon--wifi" />
      <font-awesome-icon icon="gear" class="login-page__decor-icon login-page__decor-icon--gear" />
    </div>

    <div class="login-card">
      <aside class="login-brand">
        <div class="login-brand__grid" />
        <div class="login-brand__glow login-brand__glow--tr" />
        <div class="login-brand__glow login-brand__glow--bl" />
        <div class="login-brand__signal" />

        <div class="login-brand__content">
          <AppLogo width="180px" class="login-brand__logo" />

          <p class="login-brand__tagline">
            Intelligence for the<br />Industrial Frontier.
          </p>
        </div>

        <div class="login-brand__status">
          <span class="login-brand__dot" />
          <span class="login-brand__status-text">SYSTEM OPERATIONAL</span>
        </div>
      </aside>

      <main class="login-main">
        <div class="login-main__body">
          <header class="login-main__header">
            <h1 class="login-main__title">Welcome back</h1>
            <p class="login-main__subtitle">
              Access your property management dashboard
            </p>
          </header>

          <div
            v-if="serverAlert"
            class="login-alert"
          >
            <font-awesome-icon icon="triangle-exclamation" class="login-alert__icon" />
            <div class="login-alert__body">
              <p>{{ serverAlert.message }}</p>
            </div>
          </div>

          <div v-if="loginSuccess" class="login-success">
            <font-awesome-icon icon="circle-check" class="login-success__icon" />
            <div class="login-success__body">
              <h2 class="login-success__title">Signed in successfully</h2>
              <p class="login-success__text">Redirecting to dashboard...</p>
            </div>
          </div>

          <LoginForm
            v-else
            :is-loading="authStore.isLoading"
            :field-errors="fieldErrors"
            @login-submit="handleLogin"
            @clear-errors="handleClearErrors"
          />

          <footer class="login-main__footer">
            <p>
              New to Nexora?
              <a href="#" class="login-main__link">Register your property</a>
            </p>
          </footer>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import AppLogo from '@/components/AppLogo.vue';
import LoginForm from '../components/LoginForm.vue';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const loginSuccess = ref(false);

const fieldErrors = computed(() => {
  const error = authStore.serverError;

  if (!error) return {};

  switch (error.code) {
    case 'USER_NOT_FOUND':
      return { email: error.message };
    case 'INVALID_PASSWORD':
      return { password: error.message };
    default:
      return {};
  }
});

const serverAlert = computed(() => {
  const error = authStore.serverError;

  if (!error) return null;

  if (error.code === 'USER_NOT_FOUND' || error.code === 'INVALID_PASSWORD') {
    return null;
  }

  return error;
});

const handleClearErrors = () => {
  authStore.clearErrors();
};

const handleLogin = async (credentials) => {
  try {
    await authStore.login(credentials);
    loginSuccess.value = true;
    setTimeout(() => {
      router.push({ name: 'dashboard' });
    }, 1500);
  } catch (error) {
    console.error('Login error:', error.message);
  }
};
</script>

<style scoped>
.login-page {
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

.login-page::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.7) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
}

.login-card {
  position: relative;
  z-index: 1;
  display: flex;
  width: 100%;
  max-width: 960px;
  min-height: 640px;
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

.login-brand {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3.5rem;
  background: linear-gradient(160deg, #0b1a30 0%, #162d5a 40%, #1e3a6f 100%);
  color: #ffffff;
  overflow: hidden;
}

.login-brand__grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
}

.login-brand__glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(60px);
}

.login-brand__glow--tr {
  width: 350px;
  height: 350px;
  background: rgba(255, 115, 0, 0.1);
  top: -120px;
  right: -100px;
}

.login-brand__glow--bl {
  width: 280px;
  height: 280px;
  background: rgba(0, 255, 136, 0.07);
  bottom: -80px;
  left: -80px;
}

.login-brand__signal {
  position: absolute;
  bottom: 6rem;
  right: 3.5rem;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15));
  pointer-events: none;
}

.login-brand__signal::before {
  content: '';
  position: absolute;
  right: 0;
  top: -2px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
}

.login-brand__content {
  position: relative;
  z-index: 1;
}

.login-brand__logo {
  margin-bottom: 2rem;
  color: #ffffff;
}

.login-brand__tagline {
  font-family: var(--font-titles);
  font-size: 1.25rem;
  line-height: 1.6;
  opacity: 0.85;
  font-weight: 400;
}

.login-brand__status {
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

.login-brand__dot {
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

.login-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.login-main__body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  padding: 3.5rem;
}

.login-main__header {
  margin-bottom: 2rem;
}

.login-main__title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--secondary-color);
  margin-bottom: 0.5rem;
}

.login-main__subtitle {
  color: #888;
  font-size: 0.95rem;
}

/* ─── Page Decorative Elements ─── */

.login-page__decor {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.login-page__decor-icon {
  position: absolute;
  opacity: 0.07;
}

.login-page__decor-icon--chip {
  top: 6%;
  right: 3%;
  font-size: 3.5rem;
  color: var(--primary-color);
  animation: float-icon 6s ease-in-out infinite;
}

.login-page__decor-icon--bulb {
  bottom: 8%;
  left: 3%;
  font-size: 2.5rem;
  color: var(--secondary-color);
  animation: float-icon 8s ease-in-out infinite 1s;
}

.login-page__decor-icon--lock {
  top: 44%;
  right: 2%;
  font-size: 2rem;
  color: var(--primary-color);
  animation: float-icon 7s ease-in-out infinite 2.5s;
}

.login-page__decor-icon--wifi {
  bottom: 10%;
  right: 5%;
  font-size: 2.8rem;
  color: var(--secondary-color);
  animation: float-icon 9s ease-in-out infinite 0.5s;
}

.login-page__decor-icon--gear {
  top: 8%;
  left: 3%;
  font-size: 2.8rem;
  color: var(--primary-color);
  animation: spin-icon 10s linear infinite;
}

@keyframes float-icon {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes spin-icon {
  to {
    transform: rotate(360deg);
  }
}

/* ─── Alert ─── */

.login-alert {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
}

.login-alert__icon {
  color: #ef4444;
  font-size: 1rem;
  margin-top: 2px;
  flex-shrink: 0;
}

.login-alert__body p {
  margin: 0;
  font-size: 0.85rem;
  color: #7f1d1d;
}

.login-alert__link {
  display: inline-block;
  margin-top: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--secondary-color);
  text-decoration: none;
}

.login-alert__link:hover {
  text-decoration: underline;
}

/* ─── Success State ─── */

.login-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2.5rem 1rem;
}

.login-success__icon {
  font-size: 3rem;
  color: #22c55e;
  margin-bottom: 1rem;
}

.login-success__title {
  font-size: 1.5rem;
  color: var(--secondary-color);
  margin-bottom: 0.5rem;
}

.login-success__text {
  color: #888;
  font-size: 0.9rem;
}

/* ─── Footer ─── */

.login-main__footer {
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: #888;
  border-top: 1px solid #f0f0f0;
}

.login-main__link {
  font-weight: 600;
  color: var(--primary-color);
  text-decoration: none;
}

.login-main__link:hover {
  text-decoration: underline;
}

/* ─── Responsive ─── */

@media (max-width: 860px) {
  .login-page__decor {
    display: none;
  }

  .login-brand {
    display: none;
  }

  .login-card {
    max-width: 480px;
    min-height: auto;
  }

  .login-main__body {
    padding: 2.5rem;
  }
}

@media (max-width: 480px) {
  .login-page {
    padding: 0;
  }

  .login-card {
    border-radius: 0;
    min-height: 100vh;
  }

  .login-main__body {
    padding: 2rem;
  }
}
</style>
