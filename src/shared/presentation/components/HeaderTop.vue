<template>
  <header class="dashboard-header">
    <div class="header-left">
      <button class="menu-btn" @click="$emit('toggle-sidebar')">
        <font-awesome-icon icon="bars" />
      </button>

      <!-- Render Breadcrumbs in Header if present -->
      <nav v-if="globalBreadcrumbs" class="header-breadcrumbs">
        <span v-for="(item, index) in globalBreadcrumbs" :key="index" class="breadcrumbs__item">
          <router-link v-if="index < globalBreadcrumbs.length - 1" :to="item.route" class="breadcrumbs__link">
            {{ item.label }}
          </router-link>
          <span v-else class="breadcrumbs__current">{{ item.label }}</span>
          <span v-if="index < globalBreadcrumbs.length - 1" class="breadcrumbs__separator">></span>
        </span>
      </nav>
      <h1 v-else class="page-title">{{ pageTitle }}</h1>
    </div>

    <div class="header-actions">
      <button class="icon-btn help-btn" :title="t('helpCenter.helpButton')" @click="$emit('open-help-center')">
        <font-awesome-icon icon="headset" />
      </button>

      <div v-if="route.name !== 'profile'" class="notification-container">
        <button class="icon-btn notification-btn" @click="toggleNotifications">
          <font-awesome-icon icon="bell" />
          <span v-if="notificationCount > 0" class="notification-dot"></span>
        </button>

        <!-- Dropdown Menu -->
        <div v-if="showNotifications" class="notification-dropdown">
          <div class="dropdown-header">
            <h3>Recent Alerts</h3>
            <span class="alerts-count">{{ notificationCount }} active</span>
          </div>
          <div class="dropdown-content">
            <div v-if="latestAlerts.length === 0" class="empty-alerts">
              No recent alerts
            </div>
            <div
                v-else
                v-for="alert in latestAlerts"
                :key="alert.id"
                class="alert-item"
                @click="navigateToAlert(alert.id)"
            >
              <div class="alert-item-header">
                <span :class="['alert-badge', alert.severity.toLowerCase()]">
                  {{ alert.severity }}
                </span>
                <span class="alert-time">{{ alert.timestamp }}</span>
              </div>
              <div class="alert-type">{{ alert.type }}</div>
              <div class="alert-device">Device: {{ alert.deviceId }}</div>
            </div>
          </div>
          <div class="dropdown-footer">
            <router-link to="/alerts" @click="showNotifications = false">View All Alerts</router-link>
          </div>
        </div>
      </div>

      <button v-if="!globalBreadcrumbs && headerConfig.actionRoute && route.name !== 'dashboard' && route.name !== 'property-registration' && route.name !== 'subscription' && route.name !== 'profile' && route.name !== 'alerts' && route.name !== 'reports'" class="register-btn" @click="handleAction">
        <font-awesome-icon :icon="actionIcon" class="register-icon" />
        <span class="register-text">{{ actionLabel }}</span>
      </button>
    </div>
  </header>

  <!-- Toast Notification Container -->
  <div class="toast-container">
    <TransitionGroup name="toast">
      <div
          v-for="toast in activeToasts"
          :key="toast.id"
          class="alert-toast"
          :class="toast.severity.toLowerCase()"
          @click="navigateToAlert(toast.id)"
      >
        <div class="toast-icon">
          <font-awesome-icon :icon="toast.severity === 'Critical' ? 'triangle-exclamation' : 'circle-info'" />
        </div>
        <div class="toast-content">
          <h4 class="toast-title">{{ toast.severity === 'Critical' ? '⚠️ CRITICAL ALERT!' : 'ℹ️ System Warning' }}</h4>
          <p class="toast-message">{{ toast.type }} en {{ toast.propertyName || 'Property' }}</p>
          <span class="toast-subtext">Device: {{ toast.deviceId }} - Click to investigate</span>
        </div>
        <button class="toast-close" @click.stop="removeToast(toast.id)">
          <font-awesome-icon icon="times" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { computed, inject, ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from '@/shared/presentation/i18n';
import apiClient from '@/shared/infrastructure/http/apiClient';

defineEmits(['toggle-sidebar', 'open-help-center']);

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const globalBreadcrumbs = inject('globalBreadcrumbs', null);

const showNotifications = ref(false);
const latestAlerts = ref([]);
const notificationCount = ref(0);
const activeToasts = ref([]);
const lastAlertId = ref(null);

const addToast = (alert) => {
  // Prevent duplicate toasts for the same alert
  if (activeToasts.value.some(t => t.id === alert.id)) return;
  activeToasts.value.push(alert);
  setTimeout(() => {
    removeToast(alert.id);
  }, 10000); // Auto-close toast in 10s
};

const removeToast = (id) => {
  activeToasts.value = activeToasts.value.filter(t => t.id !== id);
};

const fetchLatestAlerts = async () => {
  try {
    const res = await apiClient.get('/api/v1/alerts', {
      params: { page: 1, pageSize: 5 }
    });
    if (res.data) {
      const alerts = res.data;

      // If we already established a baseline last alert ID, check for new arrivals
      if (lastAlertId.value !== null) {
        const newAlerts = alerts.filter(a => a.id > lastAlertId.value);
        newAlerts.forEach(a => {
          addToast({
            id: a.id,
            type: a.type,
            severity: a.severity,
            deviceId: a.deviceId,
            propertyName: a.propertyName
          });
        });
      }

      if (alerts.length > 0) {
        lastAlertId.value = Math.max(...alerts.map(a => a.id));
      }

      latestAlerts.value = alerts.map(alert => {
        let status = 'WARNING';
        if (alert.severity === 'Critical') {
          status = 'CRITICAL';
        }

        return {
          id: alert.id,
          type: alert.type,
          severity: alert.severity,
          status: status,
          timestamp: new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          deviceId: alert.deviceId
        };
      });
      notificationCount.value = latestAlerts.value.length;
    }
  } catch (e) {
    console.error('Failed to fetch latest alerts', e);
  }
};

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  if (showNotifications.value) {
    fetchLatestAlerts();
  }
};

const navigateToAlert = (id) => {
  showNotifications.value = false;
  router.push({ name: 'alert-investigate', params: { alertId: id } });
};

const closeDropdown = (e) => {
  const container = document.querySelector('.notification-container');
  if (container && !container.contains(e.target)) {
    showNotifications.value = false;
  }
};

let alertPollInterval = null;

onMounted(() => {
  fetchLatestAlerts();
  document.addEventListener('click', closeDropdown);
  alertPollInterval = setInterval(fetchLatestAlerts, 5000);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
  if (alertPollInterval) {
    clearInterval(alertPollInterval);
  }
});

const routeDefaults = {
  dashboard: {
    title: 'Dashboard',
    actionLabel: 'Register New Device',
    actionIcon: 'plus',
    actionRoute: '/devices/new'
  },
  buildings: {
    title: 'Properties Management',
    actionLabel: 'Register New Property',
    actionIcon: 'building',
    actionRoute: '/buildings/new'
  },
  devices: {
    title: 'Devices Management',
    actionLabel: 'Register New Device',
    actionIcon: 'plus',
    actionRoute: '/devices/new'
  },
  alerts: {
    title: 'Alerts Center',
    actionLabel: 'Create Alert Rule',
    actionIcon: 'bell'
  },
  reports: {
    title: 'Consumption Reports',
    actionLabel: 'Export Data',
    actionIcon: 'file-pdf'
  },
  settings: {
    title: 'Settings',
    actionLabel: 'Save Settings',
    actionIcon: 'gear'
  }
};

const headerConfig = computed(() => {
  const name = route.name;
  const defaults = (name && routeDefaults[name]) || {};
  const meta = route.meta || {};
  return { ...defaults, ...meta };
});

const pageTitle = computed(() => {
  if (route.name === 'profile') {
    return t('profile.header.title');
  }
  return headerConfig.value.title || 'Nexora';
});

const actionLabel = computed(() => headerConfig.value.actionLabel || '');
const actionIcon = computed(() => headerConfig.value.actionIcon || 'plus');
const actionRoute = computed(() => headerConfig.value.actionRoute || '');

const handleAction = () => {
  const path = headerConfig.value.actionRoute;
  if (path) {
    router.push(path);
  }
};
</script>

<style scoped>
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  background-color: white;
  border-bottom: 1px solid #eaeaea;
  gap: 24px;
  height: 72px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
}

.menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #1a3673;
  cursor: pointer;
  flex-shrink: 0;
}

.page-title {
  font-size: 1.5rem;
  font-family: var(--font-titles, sans-serif);
  font-weight: 700;
  color: #1a3673;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

.icon-btn {
  background: none;
  border: none;
  color: #1a3673;
  font-size: 1.25rem;
  cursor: pointer;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover { opacity: 0.8; }

.help-btn {
  font-size: 1.3rem;
}

.notification-btn { position: relative; }

.notification-dot {
  position: absolute;
  top: 0;
  right: -2px;
  width: 8px;
  height: 8px;
  background-color: #e74c3c;
  border-radius: 50%;
  border: 2px solid white;
}

.register-btn {
  background-color: #e67e22;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.register-btn:hover { background-color: #d35400; }

.register-icon { font-size: 1rem; }

@media (max-width: 1024px) {
  .menu-btn { display: block; }
  .dashboard-header { padding: 12px 16px; }
  .page-title { font-size: 1.25rem; }
}

@media (max-width: 768px) {
  .register-text { display: none; }
}

@media (max-width: 480px) {
  .page-title { font-size: 1.1rem; }
  .register-btn { padding: 8px 12px; }
  .dashboard-header { gap: 12px; }
  .header-actions { gap: 12px; }
}

.header-breadcrumbs {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.breadcrumbs__link {
  text-decoration: none;
  color: #7f8c8d;
  font-weight: 500;
  transition: color 0.2s;
}

.breadcrumbs__link:hover { color: #1a3673; }

.breadcrumbs__current {
  font-weight: 700;
  color: #1a3673;
}

.breadcrumbs__separator {
  margin: 0 4px;
  color: #cbd5e1;
}

.notification-container {
  position: relative;
  display: flex;
  align-items: center;
}

.notification-dropdown {
  position: absolute;
  top: 48px;
  right: 0;
  width: 320px;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  overflow: hidden;
  font-family: var(--font-general, sans-serif);
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  background-color: #f8fafc;
}

.dropdown-header h3 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
}

.alerts-count {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 600;
}

.dropdown-content {
  max-height: 300px;
  overflow-y: auto;
}

.empty-alerts {
  padding: 24px;
  text-align: center;
  color: #64748b;
  font-size: 0.85rem;
}

.alert-item {
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: left;
}

.alert-item:hover { background-color: #f8fafc; }

.alert-item:last-child { border-bottom: none; }

.alert-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.alert-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
}

.alert-badge.critical {
  background-color: #fee2e2;
  color: #ef4444;
}

.alert-badge.warning {
  background-color: #fef3c7;
  color: #f59e0b;
}

.alert-time {
  font-size: 0.75rem;
  color: #94a3b8;
}

.alert-type {
  font-size: 0.85rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 2px;
}

.alert-device {
  font-size: 0.75rem;
  color: #64748b;
}

.dropdown-footer {
  padding: 10px 16px;
  text-align: center;
  border-top: 1px solid #f1f5f9;
  background-color: #f8fafc;
}

.dropdown-footer a {
  font-size: 0.8rem;
  font-weight: 700;
  color: #1a3673;
  text-decoration: none;
}

.dropdown-footer a:hover {
  text-decoration: underline;
}

/* Toast Notification Styles */
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 380px;
  width: calc(100% - 40px);
}

.alert-toast {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
  border: 1px solid;
}

.alert-toast::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
}

/* Critical Toast */
.alert-toast.critical {
  background-color: rgba(254, 242, 242, 0.95);
  border-color: rgba(252, 165, 165, 0.5);
  color: #991b1b;
}

.alert-toast.critical::before {
  background-color: #ef4444;
}

.alert-toast.critical .toast-icon {
  color: #ef4444;
}

/* Warning Toast */
.alert-toast.warning {
  background-color: rgba(255, 251, 235, 0.95);
  border-color: rgba(253, 230, 138, 0.5);
  color: #92400e;
}

.alert-toast.warning::before {
  background-color: #f59e0b;
}

.alert-toast.warning .toast-icon {
  color: #f59e0b;
}

.toast-icon {
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  margin-top: 2px;
}

.toast-content {
  flex: 1;
}

.toast-title {
  margin: 0 0 4px 0;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.toast-message {
  margin: 0 0 4px 0;
  font-size: 0.85rem;
  font-weight: 600;
  opacity: 0.9;
}

.toast-subtext {
  font-size: 0.75rem;
  opacity: 0.7;
  font-weight: 500;
  display: block;
}

.toast-close {
  background: none;
  border: none;
  color: inherit;
  opacity: 0.5;
  cursor: pointer;
  padding: 4px;
  font-size: 1rem;
  align-self: flex-start;
  transition: opacity 0.2s;
  margin-top: -2px;
}

.toast-close:hover {
  opacity: 1;
}

/* Toast Transitions */
.toast-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-leave-active {
  transition: all 0.3s ease;
  position: absolute;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(50px) scale(0.9);
}

.toast-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.toast-move {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
