<script setup>
import { ref, onMounted } from 'vue';
import { useSettingsStore } from '../store/settingsStore';

const settingsStore = useSettingsStore();
const activeTab = ref('Profile');

onMounted(() => {
  settingsStore.fetchSettings();
});
</script>

<template>
  <div class="settings-view">
    <!-- Loading State -->
    <div v-if="settingsStore.isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Retrieving system configuration...</p>
    </div>

    <template v-else>
      <!-- 1. Cabecera de la Vista -->
      <header class="settings-header">
        <div class="settings-header__titles">
          <h1 class="settings-header__title">Configuración del Sistema</h1>
          <p class="settings-header__subtitle">Administra tu perfil, seguridad, facturación y el equipo operativo de Nexora.</p>
        </div>

        <nav class="settings-tabs">
          <button 
            :class="['settings-tabs__btn', { 'settings-tabs__btn--active': activeTab === 'Profile' }]"
            @click="activeTab = 'Profile'"
          >
            Profile
          </button>
          <button 
            :class="['settings-tabs__btn', { 'settings-tabs__btn--active': activeTab === 'Notifications' }]"
            @click="activeTab = 'Notifications'"
          >
            Notifications
          </button>
        </nav>
      </header>

      <!-- 2. Layout Principal -->
      <div class="settings-grid">
        <!-- Columna Izquierda -->
        <div class="settings-grid__left">
          <!-- Tarjeta 1: Información Personal -->
          <section v-if="settingsStore.profile" class="personal-info-card">
            <header class="card-header">
              <div class="card-header__title-group">
                <font-awesome-icon icon="user" class="card-icon" />
                <h3 class="card-title">Información Personal</h3>
              </div>
              <button class="action-link">Editar Datos</button>
            </header>

            <div class="card-body">
              <div class="form-grid">
                <div class="input-group">
                  <label class="input-label">NOMBRE</label>
                  <input type="text" v-model="settingsStore.profile.name" class="input-field" readonly>
                </div>
                <div class="input-group">
                  <label class="input-label">APELLIDOS</label>
                  <input type="text" v-model="settingsStore.profile.lastName" class="input-field" readonly>
                </div>
              </div>

              <div class="input-group mt-20">
                <label class="input-label">CORREO ELECTRÓNICO</label>
                <div class="input-with-icon">
                  <font-awesome-icon icon="envelope" class="field-icon" />
                  <input type="email" v-model="settingsStore.profile.email" class="input-field input-field--full" readonly>
                </div>
              </div>

              <div class="info-group mt-20">
                <label class="input-label">UBICACIÓN DE OPERACIONES</label>
                <p class="info-text">{{ settingsStore.profile.location }}</p>
              </div>
            </div>
          </section>

          <!-- Tarjeta 3: Suscripción y Pagos -->
          <section v-if="settingsStore.plan && settingsStore.payment" class="subscription-card">
            <header class="card-header">
              <div class="card-header__title-group">
                <font-awesome-icon icon="credit-card" class="card-icon" />
                <h3 class="card-title">Suscripción y Pagos</h3>
              </div>
              <button class="action-link">Ver Historial de Facturas</button>
            </header>

            <div class="card-body">
              <div class="subscription-grid">
                <!-- Plan Actual -->
                <div class="plan-box">
                  <div class="plan-box__watermark">
                    <font-awesome-icon icon="star" />
                    <font-awesome-icon icon="star" class="star-2" />
                  </div>
                  <span class="plan-label">PLAN ACTUAL</span>
                  <h2 class="plan-title">{{ settingsStore.plan.name }}</h2>
                  <span class="plan-price">{{ settingsStore.plan.price }}</span>
                  <button class="button--solid-orange mt-auto">Cambiar Plan</button>
                </div>

                <!-- Método de Pago -->
                <div class="payment-box">
                  <div class="payment-box__header">
                    <h4 class="payment-title">Método de Pago</h4>
                    <font-awesome-icon icon="credit-card" />
                  </div>
                  
                  <div class="card-details">
                    <div class="culqi-logo">CULQI</div>
                    <div class="card-info">
                      <span class="card-number">{{ settingsStore.payment.displayLabel }}</span>
                      <span class="card-expiry">EXPIRA {{ settingsStore.payment.expiry }}</span>
                    </div>
                  </div>

                  <button class="button--outline-blue">Actualizar Tarjeta</button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Columna Derecha -->
        <div class="settings-grid__right">
          <!-- Tarjeta 2: Seguridad -->
          <section v-if="settingsStore.security" class="security-card">
            <header class="card-header">
              <div class="card-header__title-group">
                <font-awesome-icon icon="shield-halved" class="card-icon" />
                <h3 class="card-title">Seguridad</h3>
              </div>
            </header>

            <div class="card-body">
              <div class="password-box">
                <div class="password-info">
                  <span class="password-label">Contraseña</span>
                  <span class="password-sub">Último cambio hace {{ settingsStore.security.lastPasswordChange }}</span>
                </div>
                <button class="button--solid-blue">Cambiar Contraseña</button>
              </div>

              <div class="two-factor-row">
                <div class="two-factor-info">
                  <span class="two-factor-title">Autenticación de Dos Factores (2FA)</span>
                  <p class="two-factor-desc">Añade una capa extra de seguridad a tu cuenta.</p>
                </div>
                <div 
                  :class="['toggle-switch', { 'toggle-switch--active': settingsStore.security.is2faActive }]"
                  @click="settingsStore.security.is2faActive = !settingsStore.security.is2faActive"
                >
                  <div class="toggle-switch__circle"></div>
                </div>
              </div>

              <div class="alert-box--danger">
                <font-awesome-icon icon="triangle-exclamation" class="alert-box__icon" />
                <div class="alert-box__content">
                  <span class="alert-box__title">Acceso Crítico Detectado</span>
                  <p class="alert-box__desc">Se detectó un inicio de sesión desde una ubicación inusual.</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Tarjeta 4: Equipo Operativo -->
          <section class="team-card">
            <header class="card-header">
              <div class="card-header__title-group">
                <font-awesome-icon icon="users" class="card-icon" />
                <h3 class="card-title">Equipo Operativo</h3>
              </div>
            </header>

            <div class="card-body">
              <div class="team-list">
                <div class="team-list__header">
                  <span>Nombre</span>
                  <span>Rol</span>
                </div>
                
                <div v-for="member in settingsStore.team" :key="member.name" class="team-item">
                  <div class="member-info">
                    <div class="member-avatar">{{ member.initials }}</div>
                    <span class="member-name">{{ member.name }}</span>
                  </div>
                  <span :class="['role-badge', member.badgeClass]">{{ member.role }}</span>
                </div>
              </div>
            </div>

            <footer class="card-footer">
              <button class="action-link action-link--bold">Administrar Equipo Completo -></button>
            </footer>
          </section>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.settings-view {
  padding: 25px 30px;
  display: flex;
  flex-direction: column;
  min-height: 400px;
  position: relative;
}

.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px;
  color: #1a237e;
  font-weight: 700;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #f47b20;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.settings-view {
  padding: 25px 30px;
  display: flex;
  flex-direction: column;
}

/* 1. Header */
.settings-header__title {
  margin: 0;
  color: #1a237e;
  font-weight: 800;
  font-size: 1.8rem;
}

.settings-header__subtitle {
  margin: 5px 0 0;
  color: #718096;
  font-size: 0.95rem;
}

.settings-tabs {
  display: flex;
  gap: 30px;
  margin-top: 25px;
  border-bottom: 1px solid #e2e8f0;
}

.settings-tabs__btn {
  background: none;
  border: none;
  padding: 0 0 10px 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #718096;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
}

.settings-tabs__btn--active {
  color: #1a237e;
  font-weight: 800;
  border-bottom-color: #1a237e;
}

/* 2. Grid Layout */
.settings-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 25px;
  margin-top: 30px;
}

.settings-grid__left, .settings-grid__right {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* Cards Common */
.personal-info-card, .subscription-card, .security-card, .team-card {
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.card-header {
  padding: 20px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f7fafc;
}

.card-header__title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-icon {
  color: #1a237e;
  font-size: 1.1rem;
}

.card-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #1a237e;
}

.card-body {
  padding: 25px;
}

.action-link {
  background: none;
  border: none;
  color: #1a237e;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  text-decoration: none;
}

.action-link:hover {
  text-decoration: underline;
}

/* Forms */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-size: 0.65rem;
  font-weight: 800;
  color: #718096;
  letter-spacing: 0.5px;
}

.input-field {
  background-color: #f7fafc;
  border: 1px solid #e2e8f0;
  padding: 12px;
  border-radius: 6px;
  color: #1a237e;
  font-weight: 600;
  font-size: 0.9rem;
  outline: none;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.field-icon {
  position: absolute;
  left: 12px;
  color: #a0aec0;
}

.input-with-icon .input-field {
  padding-left: 35px;
}

.input-field--full {
  width: 100%;
}

.info-text {
  margin: 0;
  color: #2d3748;
  font-weight: 600;
  font-size: 0.95rem;
}

.mt-20 { margin-top: 20px; }

/* Subscription Card */
.subscription-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.plan-box {
  background-color: #1a237e;
  border-radius: 8px;
  padding: 20px;
  color: white;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  min-height: 200px;
}

.plan-box__watermark {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 3rem;
  opacity: 0.1;
  color: white;
}

.star-2 {
  font-size: 1.5rem;
  margin-left: 10px;
}

.plan-label {
  font-size: 0.65rem;
  font-weight: 800;
  opacity: 0.8;
  letter-spacing: 1px;
}

.plan-title {
  margin: 10px 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.plan-price {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 20px;
}

.button--solid-orange {
  background-color: #f47b20;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s;
}

.payment-box {
  background-color: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.payment-box__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #1a237e;
}

.payment-title {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
}

.card-details {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  background: white;
  border: 1px solid #edf2f7;
  border-radius: 6px;
}

.culqi-logo {
  background-color: #1a237e;
  color: white;
  font-size: 0.6rem;
  font-weight: 900;
  padding: 6px;
  border-radius: 4px;
}

.card-info {
  display: flex;
  flex-direction: column;
}

.card-number {
  font-weight: 700;
  font-size: 0.9rem;
  color: #1a237e;
}

.card-expiry {
  font-size: 0.7rem;
  color: #a0aec0;
  font-weight: 700;
}

.button--outline-blue {
  background: transparent;
  border: 1px solid #1a237e;
  color: #1a237e;
  padding: 10px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  margin-top: auto;
}

/* Security Card */
.password-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  margin-bottom: 20px;
}

.password-info {
  display: flex;
  flex-direction: column;
}

.password-label {
  font-weight: 700;
  font-size: 0.9rem;
  color: #2d3748;
}

.password-sub {
  font-size: 0.75rem;
  color: #a0aec0;
}

.button--solid-blue {
  background-color: #1a237e;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
}

.two-factor-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  margin-bottom: 10px;
}

.two-factor-title {
  display: block;
  font-weight: 700;
  font-size: 0.9rem;
  color: #1a237e;
}

.two-factor-desc {
  margin: 2px 0 0;
  font-size: 0.8rem;
  color: #718096;
}

.toggle-switch {
  width: 44px;
  height: 22px;
  background-color: #cbd5e0;
  border-radius: 11px;
  padding: 2px;
  cursor: pointer;
  transition: background-color 0.3s;
  position: relative;
}

.toggle-switch--active {
  background-color: #f47b20;
}

.toggle-switch__circle {
  width: 18px;
  height: 18px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.3s;
}

.toggle-switch--active .toggle-switch__circle {
  transform: translateX(22px);
}

.alert-box--danger {
  background-color: #fff5f5;
  border: 1px solid #feb2b2;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  gap: 15px;
  margin-top: 15px;
}

.alert-box__icon {
  color: #c53030;
  font-size: 1.2rem;
}

.alert-box__title {
  display: block;
  font-weight: 700;
  color: #c53030;
  font-size: 0.9rem;
}

.alert-box__desc {
  margin: 2px 0 0;
  font-size: 0.8rem;
  color: #9b2c2c;
}

/* Team Card */
.team-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.team-list__header {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  font-weight: 800;
  color: #a0aec0;
  text-transform: uppercase;
  padding-bottom: 5px;
  border-bottom: 1px solid #f7fafc;
}

.team-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.member-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.member-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 800;
}

.team-item:nth-child(2) .member-avatar { background-color: #ebf8ff; color: #2c5282; }
.team-item:nth-child(3) .member-avatar { background-color: #fffaf0; color: #dd6b20; }
.team-item:nth-child(4) .member-avatar { background-color: #f0fff4; color: #2f855a; }

.member-name {
  font-weight: 700;
  font-size: 0.9rem;
  color: #2d3748;
}

.role-badge {
  font-size: 0.65rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 4px;
}

.badge--admin { background-color: #ebf8ff; color: #1a237e; }
.badge--landlord { background-color: #fffaf0; color: #f47b20; }
.badge--tenant { background-color: #f0fff4; color: #2f855a; }

.card-footer {
  padding: 15px 25px;
  border-top: 1px solid #f7fafc;
  display: flex;
  justify-content: flex-end;
}

.action-link--bold {
  font-weight: 800;
}

.w-full { width: 100%; }
.mt-auto { margin-top: auto; }

/* Responsive */
@media (max-width: 1200px) {
  .settings-grid { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .form-grid, .subscription-grid { grid-template-columns: 1fr; }
}
</style>