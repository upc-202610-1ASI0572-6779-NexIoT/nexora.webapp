<template>
  <header class="dashboard-header">
    <div class="header-left">
      <button class="menu-btn" @click="$emit('toggle-sidebar')">
        <font-awesome-icon icon="bars" />
      </button>
      <h1 class="page-title">{{ pageTitle }}</h1>
    </div>
    
    <div class="search-bar">
      <font-awesome-icon icon="magnifying-glass" class="search-icon" />
      <input type="text" :placeholder="searchPlaceholder" />
    </div>
    
    <div class="header-actions">
      <button class="icon-btn notification-btn">
        <font-awesome-icon icon="bell" />
        <span class="notification-dot"></span>
      </button>
      
      <button class="register-btn">
        <font-awesome-icon :icon="actionIcon" class="register-icon" />
        <span class="register-text">{{ actionLabel }}</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

defineEmits(['toggle-sidebar']);

const route = useRoute();

const routeDefaults = {
  dashboard: {
    title: 'Dashboard',
    searchPlaceholder: 'Search devices, alerts, or locations...',
    actionLabel: 'Register New Device',
    actionIcon: 'plus'
  },
  buildings: {
    title: 'Properties Management',
    searchPlaceholder: 'Search properties, tenants, or devices...',
    actionLabel: 'Register New Property',
    actionIcon: 'building'
  },
  devices: {
    title: 'Devices Management',
    searchPlaceholder: 'Search devices, locations, or status...',
    actionLabel: 'Register New Device',
    actionIcon: 'plus'
  },
  alerts: {
    title: 'Alerts Center',
    searchPlaceholder: 'Search alerts, severity, or devices...',
    actionLabel: 'Create Alert Rule',
    actionIcon: 'bell'
  },
  settings: {
    title: 'Settings',
    searchPlaceholder: 'Search settings, roles, or integrations...',
    actionLabel: 'Save Settings',
    actionIcon: 'gear'
  }
};

const headerConfig = computed(() => ({
  ...routeDefaults[route.name],
  ...route.meta
}));

const pageTitle = computed(() => headerConfig.value.title || 'Nexora');
const searchPlaceholder = computed(() => headerConfig.value.searchPlaceholder || 'Search Nexora...');
const actionLabel = computed(() => headerConfig.value.actionLabel || 'New Item');
const actionIcon = computed(() => headerConfig.value.actionIcon || 'plus');
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

.search-bar {
  display: flex;
  align-items: center;
  background-color: #f8f9fc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 8px 16px;
  flex: 1;
  max-width: 400px;
  margin-right: auto;
  margin-left: 24px;
  transition: border-color 0.2s;
}

.search-bar:focus-within {
  border-color: #1a3673;
  background-color: white;
}

.search-icon {
  color: #7f8c8d;
  margin-right: 12px;
  font-size: 1rem;
}

.search-bar input {
  border: none;
  background: transparent;
  outline: none;
  font-family: var(--font-general, sans-serif);
  color: #2c3e50;
  width: 100%;
  font-size: 0.95rem;
}

.search-bar input::placeholder {
  color: #95a5a6;
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

.icon-btn:hover {
  opacity: 0.8;
}

.notification-btn {
  position: relative;
}

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
  background-color: #e67e22; /* Primary orange */
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

.register-btn:hover {
  background-color: #d35400; /* Darker orange */
}

.register-icon {
  font-size: 1rem;
}

/* Responsiveness */
@media (max-width: 1024px) {
  .menu-btn {
    display: block;
  }
  
  .dashboard-header {
    padding: 12px 16px;
  }
  
  .page-title {
    font-size: 1.25rem;
  }
}

@media (max-width: 768px) {
  .search-bar {
    display: none;
  }
  
  .header-left {
    flex: 1;
  }
  
  .register-text {
    display: none;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.1rem;
  }
  
  .register-btn {
    padding: 8px 12px;
  }
  
  .dashboard-header {
    gap: 12px;
  }
  
  .header-actions {
    gap: 12px;
  }
}
</style>
