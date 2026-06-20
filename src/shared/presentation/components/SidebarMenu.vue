<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="brand">
        <img src="@/assets/logo/logo-nexora.svg" :alt="t('sidebar.brand.logoAlt')" class="brand-logo" />
        <div class="brand-info">
          <h1 class="brand-name">{{ t('sidebar.brand.name') }}</h1>
          <p class="brand-tagline">{{ t('sidebar.brand.tagline') }}</p>
        </div>
      </div>
      <button class="close-btn" @click="$emit('close')" :aria-label="t('sidebar.actions.close')">
        <font-awesome-icon icon="xmark" />
      </button>
    </div>

    <nav class="sidebar-nav">
      <router-link to="/dashboard" class="nav-link" active-class="active">
        <font-awesome-icon icon="house" class="nav-icon" />
        <span class="nav-text">{{ t('sidebar.nav.home') }}</span>
      </router-link>
      <router-link to="/buildings" class="nav-link" active-class="active">
        <font-awesome-icon icon="building" class="nav-icon" />
        <span class="nav-text">{{ t('sidebar.nav.properties') }}</span>
      </router-link>
      <router-link to="/devices" class="nav-link" active-class="active">
        <font-awesome-icon icon="signal" class="nav-icon" />
        <span class="nav-text">{{ t('sidebar.nav.devices') }}</span>
      </router-link>
      <router-link to="/alerts" class="nav-link" active-class="active">
        <font-awesome-icon icon="bell" class="nav-icon" />
        <span class="nav-text">{{ t('sidebar.nav.alerts') }}</span>
      </router-link>
      <router-link to="/reports" class="nav-link" active-class="active">
        <font-awesome-icon icon="chart-column" class="nav-icon" />
        <span class="nav-text">{{ t('sidebar.nav.reports') }}</span>
      </router-link>
      <router-link to="/subscription" class="nav-link" active-class="active">
        <font-awesome-icon icon="address-card" class="nav-icon" />
        <span class="nav-text">{{ t('sidebar.nav.subscription') }}</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <button type="button" class="user-profile" @click="$emit('open-profile')">
        <div class="user-avatar">
          <span v-if="user" class="user-initials">{{ user.initials }}</span>
          <font-awesome-icon v-else icon="user" />
        </div>
        <div class="user-info">
          <p class="user-name">{{ user ? user.fullName : t('sidebar.user.guest') }}</p>
          <p class="user-status">{{ user ? (user.isActive ? t('sidebar.user.active') : t('sidebar.user.inactive')) : t('sidebar.user.notSignedIn') }}</p>
        </div>
      </button>

      <div class="sidebar-actions">
        <button class="logout-btn" @click="handleLogout">
          <font-awesome-icon icon="right-from-bracket" />
          <span>{{ t('sidebar.actions.logout') }}</span>
        </button>
        <button class="settings-icon-btn" @click="$emit('open-settings')" :title="t('sidebar.actions.settings')">
          <font-awesome-icon icon="gear" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/contexts/iam/auth/presentation/store/authStore';
import { useI18n } from '@/shared/presentation/i18n';

const router = useRouter();
defineEmits(['close', 'open-settings', 'open-profile']);

const authStore = useAuthStore();

const user = computed(() => authStore.user);

function handleLogout() {
  authStore.logout();
  router.push('/login');
}

const { t } = useI18n();
</script>

<style scoped>
.sidebar {
  width: 280px;
  background-color: #173183;
  height: 100vh;
  display: flex;
  flex-direction: column;
  color: #ffffff;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
}

.sidebar-header {
  padding: 32px 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand-logo {
  width: 42px;
  height: 42px;
  filter: drop-shadow(0 0 8px rgba(249, 115, 22, 0.3));
}

.brand-name {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.5px;
  color: #ffffff;
}

.brand-tagline {
  font-size: 0.85rem;
  color: #94a3b8;
  margin: 0;
  font-weight: 400;
}

.close-btn {
  display: none;
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #ffffff;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 12px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 14px 28px;
  text-decoration: none;
  color: #cbd5e1;
  transition: all 0.25s ease;
  position: relative;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.nav-link.active {
  background-color: #f97316;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.2);
}

.nav-icon {
  width: 20px;
  font-size: 1.2rem;
  margin-right: 18px;
  opacity: 0.9;
}

.nav-text {
  font-weight: 500;
  font-size: 1rem;
}

.sidebar-footer {
  display: flex;
  flex-direction: column;
  padding: 16px 24px;
  background-color: rgba(0, 0, 0, 0.15);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  gap: 12px;
}

/* Modificado para soportar el elemento button de forma idéntica */
.user-profile {
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  background: transparent;
  border: none;
  text-align: left;
  padding: 0;
  width: 100%;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.2s;
}

.user-profile:hover {
  opacity: 0.8;
}

.sidebar-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex: 1;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #94a3b8;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.settings-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #94a3b8;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.settings-icon-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.user-avatar {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, var(--primary-color), #e66700);
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: #ffffff;
  overflow: hidden;
  flex-shrink: 0;
}

.user-initials {
  font-family: var(--font-titles);
  font-weight: 700;
  font-size: 1rem;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
  color: #ffffff;
  line-height: 1.2;
}

.user-status {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 4px 0 0 0;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-weight: 500;
  line-height: 1;
}

@media (max-width: 1024px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
    transform: translateX(-100%);
  }

  .sidebar.is-open {
    transform: translateX(0);
  }

  .close-btn {
    display: block;
  }
}
</style>