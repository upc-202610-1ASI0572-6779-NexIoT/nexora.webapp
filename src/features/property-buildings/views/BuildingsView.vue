<template>
  <div class="dashboard-layout">
    <div :class="['sidebar-overlay', { 'is-active': isSidebarOpen }]" @click="isSidebarOpen = false"></div>
    <SidebarMenu :class="{ 'is-open': isSidebarOpen }" @close="isSidebarOpen = false" />
    
    <div class="main-content">
      <HeaderTop @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />
      
      <div class="buildings-content">
        <header class="content-header">
          <div class="title-group">
            <h1 class="page-title">My Buildings</h1>
            <p class="page-subtitle">Manage your properties and monitor their efficiency.</p>
          </div>
          <button class="btn--primary">
            <font-awesome-icon icon="plus" />
            Add Building
          </button>
        </header>

        <div class="filters-bar">
          <div class="search-box">
            <font-awesome-icon icon="magnifying-glass" />
            <input type="text" placeholder="Search buildings by name or address..." v-model="searchQuery" />
          </div>
          <div class="filter-actions">
            <select class="filter-select">
              <option value="all">All Status</option>
              <option value="optimal">Optimal</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        <div class="buildings-grid">
          <BuildingCard 
            v-for="building in filteredBuildings" 
            :key="building.id" 
            :building="building" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import SidebarMenu from '@/components/SidebarMenu.vue';
import HeaderTop from '@/components/HeaderTop.vue';
import BuildingCard from '../components/BuildingCard.vue';

const isSidebarOpen = ref(false);
const searchQuery = ref('');

const buildings = ref([
  {
    id: 1,
    name: 'Residencial Los Olivos',
    address: 'Av. Las Palmeras 450, Lima',
    totalUnits: 45,
    activeUnits: 42,
    consumption: 1250,
    efficiency: 94,
    status: 'Optimal'
  },
  {
    id: 2,
    name: 'Edificio San Isidro',
    address: 'Calle Los Pinos 123, San Isidro',
    totalUnits: 30,
    activeUnits: 28,
    consumption: 890,
    efficiency: 88,
    status: 'Warning'
  },
  {
    id: 3,
    name: 'Torre Miraflores',
    address: 'Av. Larco 789, Miraflores',
    totalUnits: 60,
    activeUnits: 58,
    consumption: 2100,
    efficiency: 91,
    status: 'Optimal'
  },
  {
    id: 4,
    name: 'Condominio El Sol',
    address: 'Jr. Huascar 321, Jesus Maria',
    totalUnits: 20,
    activeUnits: 15,
    consumption: 450,
    efficiency: 75,
    status: 'Critical'
  }
]);

const filteredBuildings = computed(() => {
  return buildings.value.filter(b => 
    b.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    b.address.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: var(--bg-primary);
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  min-width: 0;
}

.buildings-content {
  padding: 0 32px 32px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title {
  font-size: 1.75rem;
  margin: 0;
}

.page-subtitle {
  color: #718096;
  margin: 4px 0 0 0;
}

.filters-bar {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 300px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
  color: #a0aec0;
}

.search-box input {
  border: none;
  padding: 12px 0;
  width: 100%;
  outline: none;
  font-family: inherit;
  color: var(--text-color);
}

.filter-select {
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background-color: white;
  color: var(--text-color);
  font-family: inherit;
  outline: none;
  cursor: pointer;
}

.buildings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.sidebar-overlay.is-active {
  opacity: 1;
  pointer-events: auto;
}

@media (max-width: 768px) {
  .buildings-content {
    padding: 0 16px 16px 16px;
  }
}
</style>
