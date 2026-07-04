<template>
  <header class="dashboard-header">
    <div class="header-left">
      <button class="menu-btn" @click="$emit('toggle-sidebar')">
        <font-awesome-icon icon="bars" />
      </button>

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
  </header>
</template>

<script setup>
import { computed, inject } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from '@/shared/presentation/i18n';

defineEmits(['toggle-sidebar']);

const route = useRoute();
const { t } = useI18n();
const globalBreadcrumbs = inject('globalBreadcrumbs', null);

const routeDefaults = {
  dashboard: { title: 'Dashboard' },
  buildings: { title: 'Properties Management' },
  devices: { title: 'Devices Management' },
  alerts: { title: 'Alerts Center' },
  reports: { title: 'Consumption Reports' },
  settings: { title: 'Settings' }
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

@media (max-width: 1024px) {
  .menu-btn { display: block; }
  .dashboard-header { padding: 12px 16px; }
  .page-title { font-size: 1.25rem; }
}

@media (max-width: 480px) {
  .page-title { font-size: 1.1rem; }
  .dashboard-header { gap: 12px; }
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
</style>
