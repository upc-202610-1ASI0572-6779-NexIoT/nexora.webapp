<template>
  <div class="inventory-container">
    <div class="inventory-header">
      <h2 class="inventory-title">{{ t('buildings.inventory.title') }}</h2>

      <div class="quick-actions-bar">
        <div class="search-box">
          <font-awesome-icon icon="search" class="search-icon" />
          <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              :placeholder="t('buildings.inventory.searchPlaceholder', 'Buscar por código, nombre o inquilino...')"
          />
        </div>
        <div class="filter-group">
          <div class="custom-select-container" ref="statusSelectRef">
            <div class="custom-select-trigger" @click="toggleSelectDropdown('status')">
              <span>{{ selectedStatusLabel }}</span>
              <span class="select-arrow">▾</span>
            </div>
            <Transition name="dropdown">
              <div v-if="activeSelectDropdown === 'status'" class="custom-select-options">
                <div class="custom-option" :class="{ selected: filterStatus === '' }" @click="selectOption('status', '')">
                  {{ t('buildings.inventory.filterAllStatus') }}
                </div>
                <div class="custom-option" :class="{ selected: filterStatus === 'ACTIVE' }" @click="selectOption('status', 'ACTIVE')">
                  {{ t('buildings.status.active') }}
                </div>
                <div class="custom-option" :class="{ selected: filterStatus === 'INACTIVE' }" @click="selectOption('status', 'INACTIVE')">
                  {{ t('buildings.status.inactive') }}
                </div>
                <div class="custom-option" :class="{ selected: filterStatus === 'MAINTENANCE' }" @click="selectOption('status', 'MAINTENANCE')">
                  {{ t('buildings.status.maintenance') }}
                </div>
              </div>
            </Transition>
          </div>

          <div class="custom-select-container" ref="healthSelectRef">
            <div class="custom-select-trigger" @click="toggleSelectDropdown('health')">
              <span>{{ selectedHealthLabel }}</span>
              <span class="select-arrow">▾</span>
            </div>
            <Transition name="dropdown">
              <div v-if="activeSelectDropdown === 'health'" class="custom-select-options">
                <div class="custom-option" :class="{ selected: filterHealth === '' }" @click="selectOption('health', '')">
                  {{ t('buildings.inventory.filterAllHealth') }}
                </div>
                <div class="custom-option" :class="{ selected: filterHealth === 'low' }" @click="selectOption('health', 'low')">
                  {{ t('buildings.inventory.healthLow', 'Lento o Crítico (-50%)') }}
                </div>
                <div class="custom-option" :class="{ selected: filterHealth === 'medium' }" @click="selectOption('health', 'medium')">
                  {{ t('buildings.inventory.healthMedium', 'Aceptable (+50%)') }}
                </div>
                <div class="custom-option" :class="{ selected: filterHealth === 'high' }" @click="selectOption('health', 'high')">
                  {{ t('buildings.inventory.healthHigh', 'Óptimo (+70%)') }}
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>

    <div class="table-wrapper">
      <table class="inventory-table">
        <thead>
        <tr>
          <th>#</th>
          <th>{{ t('buildings.inventory.headers.apartmentId') }}</th>
          <th>{{ t('buildings.inventory.headers.buildingName') }}</th>
          <th>{{ t('buildings.inventory.headers.tenantName') }}</th>
          <th>{{ t('buildings.inventory.headers.status') }}</th>
          <th>{{ t('buildings.inventory.headers.healthScore') }}</th>
          <th>{{ t('buildings.inventory.headers.actions') }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in paginatedItems" :key="item.id">
          <td class="col-index">{{ item.index }}</td>
          <td class="col-id">{{ item.propertyCode }}</td>
          <td class="col-name">{{ item.name }}</td>
          <td class="col-tenant">
            <div v-if="item.tenants.length > 0" class="tenant-avatars">
              <div
                  v-for="t in item.displayTenants"
                  :key="t.id"
                  class="tenant-chip tenant-tooltip-wrapper"
                  @click="openTenantProfile(t.id)"
              >
                <span class="tenant-avatar">{{ getInitials(t) }}</span>
                <span class="custom-tooltip">{{ t.firstName }} {{ t.lastName }}</span>
              </div>

              <div v-if="item.tenants.length > 3" class="tenant-more-wrapper">
                <button class="tenant-more-btn" @click.stop="toggleDropdown(item.id)">
                  <span class="tenant-more-count">+{{ item.tenants.length - 3 }}</span>
                </button>

                <Transition name="dropdown">
                  <div
                      v-if="openDropdownId === item.id"
                      :class="['tenant-dropdown', { 'dropdown-upward': isLastRows(item.id) }]"
                      @click.stop
                  >
                    <div
                        v-for="t in item.tenants.slice(3)"
                        :key="t.id"
                        class="tenant-dropdown-item"
                        @click="openTenantProfile(t.id)"
                    >
                      <span class="tenant-avatar tenant-avatar--sm">{{ getInitials(t) }}</span>
                      <span class="tenant-name">{{ t.firstName }} {{ t.lastName }}</span>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
            <span v-else class="text-muted tenant-empty">&mdash;</span>
          </td>
          <td>
            <span :class="['status-badge', item.status.toLowerCase()]">{{ statusLabels[item.status] || item.status }}</span>
          </td>
          <td>
            <div class="health-score">
              <div class="progress-bar">
                <div
                    class="progress-fill"
                    :class="getHealthColorClass(item.healthScore)"
                    :style="{ width: item.healthScore + '%' }"
                ></div>
              </div>
              <span class="score-text">{{ item.healthScore }}%</span>
            </div>
          </td>
          <td>
            <router-link :to="`/buildings/${item.propertyCode}`" class="action-btn-icon" :title="t('buildings.inventory.actions.edit')">
              <font-awesome-icon icon="pen-to-square" />
            </router-link>
          </td>
        </tr>
        <tr v-if="filteredItems.length === 0">
          <td colspan="7" class="empty-row">{{ t('buildings.inventory.empty') }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="inventory-footer">
      <div class="showing-text">
        {{ t('buildings.inventory.showingText', { count: paginatedItems.length, total: filteredItems.length }, `Mostrando ${paginatedItems.length} propiedades de ${filteredItems.length} propiedades_totales`) }}
      </div>
      <div class="pagination">
        <button class="page-btn" :disabled="currentPage === 1" @click="goToPage(1)">&lt;&lt;</button>
        <button class="page-btn" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">&lt;</button>

        <template v-for="p in visiblePages" :key="p">
          <span v-if="p === '...'" class="page-ellipsis">...</span>
          <button
              v-else
              :class="['page-btn', { active: p === currentPage }]"
              @click="goToPage(p)"
          >{{ p }}</button>
        </template>

        <button class="page-btn" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">&gt;</button>
        <button class="page-btn" :disabled="currentPage === totalPages" @click="goToPage(totalPages)">&gt;&gt;</button>
      </div>
    </div>

    <TenantProfileModal :is-open="tenantProfileOpen" :tenant-id="selectedTenantId" @close="tenantProfileOpen = false" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { PropertyRepositoryImpl } from '../../infrastructure/repositories/PropertyRepositoryImpl';
import { TenantRepositoryImpl } from '../../../tenants/infrastructure/repositories/TenantRepositoryImpl';
import TenantProfileModal from './TenantProfileModal.vue';
import { useI18n } from '@/shared/presentation/i18n';

const { t } = useI18n();
const propertyRepo = new PropertyRepositoryImpl();
const tenantRepo = new TenantRepositoryImpl();

const properties = ref([]);
const tenantsByProperty = ref({});
const openDropdownId = ref(null);
const tenantProfileOpen = ref(false);
const selectedTenantId = ref(null);

// Control de Selects Personalizados
const activeSelectDropdown = ref(null);
const statusSelectRef = ref(null);
const healthSelectRef = ref(null);

// Estados de Filtros y Búsqueda
const searchQuery = ref('');
const filterStatus = ref('');
const filterHealth = ref('');
const currentPage = ref(1);
const perPage = 8;

const statusLabels = computed(() => ({
  ACTIVE: t('buildings.status.active'),
  INACTIVE: t('buildings.status.inactive'),
  MAINTENANCE: t('buildings.status.maintenance')
}));

// Labels dinámicos corregidos para Custom Selects
const selectedStatusLabel = computed(() => {
  if (!filterStatus.value) return t('buildings.inventory.filterAllStatus', 'Todos los Estados');
  return statusLabels.value[filterStatus.value] || filterStatus.value;
});

const selectedHealthLabel = computed(() => {
  if (filterHealth.value === 'low') return t('buildings.inventory.healthLow', 'Lento o Crítico (-50%)');
  if (filterHealth.value === 'medium') return t('buildings.inventory.healthMedium', 'Aceptable (+50%)');
  if (filterHealth.value === 'high') return t('buildings.inventory.healthHigh', 'Óptimo (+70%)');
  return t('buildings.inventory.filterAllHealth', 'Cualquier Puntuación');
});

function getInitials(tenant) {
  return (tenant.firstName[0] + tenant.lastName[0]).toUpperCase();
}

const items = computed(() =>
    properties.value.map((p, idx) => {
      const propertyTenants = tenantsByProperty.value[p.id] || [];
      return {
        ...p,
        index: idx + 1,
        tenants: propertyTenants,
        displayTenants: propertyTenants.slice(0, 3),
        healthScore: p.healthScore ?? Math.floor(Math.random() * 40) + 60
      };
    })
);

const filteredItems = computed(() => {
  return items.value.filter(item => {
    const query = searchQuery.value.toLowerCase().trim();
    const matchQuery = !query ||
        String(item.id).toLowerCase().includes(query) ||
        item.propertyCode.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.tenants.some(t => `${t.firstName} ${t.lastName}`.toLowerCase().includes(query));

    const matchStatus = !filterStatus.value || item.status === filterStatus.value;

    let matchHealth = true;
    if (filterHealth.value === 'low') matchHealth = item.healthScore < 50;
    else if (filterHealth.value === 'medium') matchHealth = item.healthScore >= 50;
    else if (filterHealth.value === 'high') matchHealth = item.healthScore >= 70;

    return matchQuery && matchStatus && matchHealth;
  });
});

watch([searchQuery, filterStatus, filterHealth], () => {
  currentPage.value = 1;
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredItems.value.length / perPage)));

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredItems.value.slice(start, start + perPage);
});

function isLastRows(propertyId) {
  const index = paginatedItems.value.findIndex(item => item.id === propertyId);
  return index >= paginatedItems.value.length - 2 && paginatedItems.value.length > 2;
}

const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [1];
  if (current > 3) pages.push('...');
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push('...');
  pages.push(total);
  return pages;
});

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
}

function getHealthColorClass(score) {
  if (score >= 90) return 'bg-success';
  if (score >= 70) return 'bg-warning';
  return 'bg-danger';
}

function toggleDropdown(propertyId) {
  openDropdownId.value = openDropdownId.value === propertyId ? null : propertyId;
}

function toggleSelectDropdown(type) {
  activeSelectDropdown.value = activeSelectDropdown.value === type ? null : type;
}

function selectOption(type, value) {
  if (type === 'status') filterStatus.value = value;
  if (type === 'health') filterHealth.value = value;
  activeSelectDropdown.value = null;
}

function openTenantProfile(tenantId) {
  openDropdownId.value = null;
  selectedTenantId.value = tenantId;
  tenantProfileOpen.value = true;
}

function handleClickOutside(e) {
  if (openDropdownId.value !== null) openDropdownId.value = null;

  if (activeSelectDropdown.value) {
    const isClickInsideStatus = statusSelectRef.value?.contains(e.target);
    const isClickInsideHealth = healthSelectRef.value?.contains(e.target);
    if (!isClickInsideStatus && !isClickInsideHealth) {
      activeSelectDropdown.value = null;
    }
  }
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside);
  try {
    properties.value = await propertyRepo.getAll();
  } catch {
    properties.value = [];
  }

  try {
    const allTenants = await tenantRepo.getAll();
    const map = {};
    for (const tenant of allTenants) {
      if (!map[tenant.propertyId]) map[tenant.propertyId] = [];
      map[tenant.propertyId].push(tenant);
    }
    tenantsByProperty.value = map;
  } catch {
    tenantsByProperty.value = {};
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.inventory-container {
  background-color: white;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
}

.inventory-header {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.inventory-title {
  font-size: 1.25rem;
  color: #1a237e;
  font-weight: 700;
  margin: 0;
}

.quick-actions-bar {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 280px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 0.95rem;
}

.search-input {
  width: 100%;
  padding: 10px 16px 10px 42px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #1e293b;
  background-color: #f8fafc;
  outline: none;
  transition: all 0.2s ease-in-out;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.02);
}

.search-input:focus {
  border-color: #1a237e;
  background-color: white;
}

.filter-group {
  display: flex;
  gap: 12px;
}

/* --- Rediseño Completo de Selectores Personalizados --- */
.custom-select-container {
  position: relative;
  min-width: 190px;
  user-select: none;
}

.custom-select-trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background-color: white;
  font-size: 0.88rem;
  color: #334155;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.2s ease;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

/* Modificación: Borde limpio en focus/activo sin efectos pesados */
.custom-select-trigger:hover,
.custom-select-container:focus-within .custom-select-trigger {
  border-color: #1a237e;
}

.select-arrow {
  font-size: 0.85rem;
  color: #64748b;
  margin-left: 8px;
}

.custom-select-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 6px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 6px 0;
  z-index: 90;
}

.custom-option {
  padding: 10px 14px;
  font-size: 0.88rem;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s ease;
}

.custom-option:hover {
  background-color: #f1f5f9;
  color: #1a237e;
  font-weight: 500;
}

.custom-option.selected {
  background-color: #e8eaf6;
  color: #1a237e;
  font-weight: 600;
}

/* --- Fin Selectores Personalizados --- */

.table-wrapper {
  overflow-x: auto;
  overflow-y: visible;
}

.inventory-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.inventory-table th {
  text-align: left;
  padding: 14px 16px;
  font-size: 0.78rem;
  color: #64748b;
  font-weight: 700;
  background-color: #f8fafc;
  border-bottom: 1px solid #eaeaea;
}

.inventory-table td {
  padding: 14px 16px;
  font-size: 0.88rem;
  color: #334155;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.action-btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  color: #1a237e;
  background-color: #f1f5f9;
  transition: all 0.2s;
  text-decoration: none;
  font-size: 1rem;
}

.action-btn-icon:hover {
  background-color: #1a237e;
  color: white;
  transform: scale(1.05);
}

.tenant-avatars {
  display: flex;
  align-items: center;
  gap: 6px;
}

.tenant-chip {
  display: inline-flex;
  cursor: pointer;
}

.tenant-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #e67e22;
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tenant-avatar--sm {
  width: 24px;
  height: 24px;
  font-size: 0.65rem;
}

.tenant-tooltip-wrapper {
  position: relative;
}

.custom-tooltip {
  visibility: hidden;
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #1e293b;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  z-index: 100;
}

.tenant-tooltip-wrapper:hover .custom-tooltip {
  visibility: visible;
}

.tenant-more-wrapper {
  position: relative;
}

.tenant-more-btn {
  background: none;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 2px 6px;
  cursor: pointer;
  font-size: 0.75rem;
}

.tenant-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 6px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  padding: 4px 0;
  min-width: 160px;
  z-index: 10;
}

.tenant-dropdown.dropdown-upward {
  top: auto;
  bottom: 100%;
  margin-bottom: 6px;
}

.tenant-dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  cursor: pointer;
}

.tenant-dropdown-item:hover {
  background-color: #f1f5f9;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}
.status-badge.active { background-color: #dcfce7; color: #15803d; }
.status-badge.inactive { background-color: #fee2e2; color: #b91c1c; }
.status-badge.maintenance { background-color: #fef3c7; color: #b45309; }

.health-score {
  display: flex;
  align-items: center;
  gap: 8px;
}
.progress-bar {
  width: 60px;
  height: 6px;
  background-color: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}
.progress-fill { height: 100%; }
.bg-success { background-color: #22c55e; }
.bg-warning { background-color: #f59e0b; }
.bg-danger { background-color: #ef4444; }

.empty-row {
  text-align: center;
  color: #64748b;
  padding: 32px !important;
}

.inventory-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid #eaeaea;
  background-color: #f8fafc;
}

.showing-text {
  font-size: 0.82rem;
  color: #64748b;
}

.pagination {
  display: flex;
  gap: 4px;
}

.page-btn {
  background-color: white;
  border: 1px solid #cbd5e1;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
}

.page-btn.active {
  background-color: #1a237e;
  color: white;
  border-color: #1a237e;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-ellipsis {
  padding: 6px 4px;
  font-size: 0.8rem;
  color: #64748b;
}

/* Transición limpia de Dropdowns */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>