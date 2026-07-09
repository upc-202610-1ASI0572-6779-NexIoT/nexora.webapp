<template>
  <div class="buildings-content">
    <div class="kpis-row">
      <PropertyKpiCard
          :title="t('buildings.kpis.totalAssets')"
          :value="totalAssets"
          icon="building"
      />
      <PropertyKpiCard
          :title="t('buildings.kpis.activeTenants')"
          :value="activeTenants"
          icon="users"
      />
      <PropertyKpiCard
          :title="t('buildings.kpis.avgHealthScore')"
          :value="avgHealthScore"
          icon="heart-pulse"
      />
    </div>

    <div class="inventory-section">
      <InventoryTable />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import PropertyKpiCard from '../components/PropertyKpiCard.vue';
import InventoryTable from '../components/InventoryTable.vue';
import { PropertyRepositoryImpl } from '../../infrastructure/repositories/PropertyRepositoryImpl';
import { TenantRepositoryImpl } from '../../../tenants/infrastructure/repositories/TenantRepositoryImpl';
import { useI18n } from '@/shared/presentation/i18n';

const { t } = useI18n();
const propertyRepo = new PropertyRepositoryImpl();
const tenantRepo = new TenantRepositoryImpl();

const properties = ref([]);
const totalAssets = ref('—');
const activeTenants = ref('—');

const avgHealthScore = computed(() => {
  if (properties.value.length === 0) return '—';
  const validScores = properties.value.filter(p => p.healthScore !== null && p.healthScore !== undefined);
  if (validScores.length === 0) return '—';
  const total = validScores.reduce((acc, p) => acc + p.healthScore, 0);
  return Math.round(total / validScores.length) + '%';
});

let pollInterval = null;

const refreshData = async () => {
  try {
    properties.value = await propertyRepo.getAll();
    totalAssets.value = properties.value.length;
  } catch {
    totalAssets.value = '—';
  }

  try {
    const tenants = await tenantRepo.getAll();
    const propertyIds = new Set(properties.value.map(p => p.id));
    const landlordTenants = tenants.filter(t => propertyIds.has(t.propertyId));
    activeTenants.value = landlordTenants.length;
  } catch {
    activeTenants.value = '—';
  }
};

onMounted(async () => {
  await refreshData();
  pollInterval = setInterval(refreshData, 5000);
});

onUnmounted(() => {
  if (pollInterval) {
    clearInterval(pollInterval);
  }
});
</script>

<style scoped>
.buildings-content {
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background-color: #f1f5f9;
  min-height: calc(100vh - 72px);
}

.kpis-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.inventory-section {
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

@media (max-width: 768px) {
  .kpis-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>