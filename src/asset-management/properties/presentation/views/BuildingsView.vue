<template>
  <div class="buildings-content">
    <div class="kpis-row">
      <PropertyKpiCard 
        title="TOTAL ASSETS" 
        value="124" 
        subtitle="+12% from last month" 
        icon="building" 
        subtitleIcon="arrow-trend-up"
        iconColorType="default"
        subtitleColorType="success"
      />
      <PropertyKpiCard 
        title="ACTIVE TENANTS" 
        value="1,102" 
        subtitle="98.2% Occupancy rate" 
        icon="users" 
        subtitleIcon="shield-check"
        iconColorType="primary"
        subtitleColorType="success"
      />
      <PropertyKpiCard 
        title="AVG HEALTH SCORE" 
        value="94%" 
        subtitle="3 Units require attention" 
        icon="heart-pulse" 
        subtitleIcon="triangle-exclamation"
        iconColorType="success"
        subtitleColorType="danger"
      />
      <PropertyKpiCard 
        title="ALERTS PENDING" 
        value="08" 
        subtitle="Critical infrastructure updates" 
        icon="bolt" 
        isDark
        iconColorType="primary"
        subtitleColorType="light"
      />
    </div>

    <div class="inventory-section">
      <InventoryTable />
    </div>

    <div class="bottom-section">
      <div class="trends-wrapper">
        <SystemHealthTrends />
      </div>
      <div class="actions-wrapper">
        <ActionCard 
          type="danger"
          icon="droplet"
          title="Leak Detected"
          description="Apartment OB-211 (Obsidian)"
          actionText="Review"
        />
        <ActionCard 
          type="success"
          icon="bolt"
          title="Power Audit"
          description="All Skyline units synchronized"
          statusIcon="circle-check"
        />
      </div>
    </div>
    
    <button class="fab-help-btn">
      <font-awesome-icon icon="headset" />
    </button>
  </div>
</template>

<script setup>
import PropertyKpiCard from '../components/PropertyKpiCard.vue';
import InventoryTable from '../components/InventoryTable.vue';
import SystemHealthTrends from '../components/SystemHealthTrends.vue';
import ActionCard from '../components/ActionCard.vue';
</script>

<style scoped>
.buildings-content {
  padding: 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background-color: #f1f5f9;
  min-height: calc(100vh - 72px); /* Subtract header height */
  position: relative;
}

.kpis-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.inventory-section {
  width: 100%;
}

.bottom-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  align-items: start;
  /* Grid children need min-width:0 or they will expand to fit content */
}

.trends-wrapper {
  min-width: 0;   /* ← prevents the grid cell from expanding beyond its track */
  overflow: hidden; /* extra safety */
  height: 100%;
}

.actions-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.fab-help-btn {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background-color: #e67e22; /* Orange */
  color: white;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(230, 126, 34, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  transition: transform 0.2s;
}

.fab-help-btn:hover {
  transform: scale(1.05);
}

/* Responsiveness */
@media (max-width: 1200px) {
  .bottom-section {
    grid-template-columns: 1.5fr 1fr;
  }
}

@media (max-width: 1024px) {
  .kpis-row {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .bottom-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .buildings-content {
    padding: 16px;
    gap: 16px;
  }
  
  .kpis-row {
    gap: 16px;
  }
  
  .fab-help-btn {
    bottom: 16px;
    right: 16px;
    width: 48px;
    height: 48px;
  }
}

@media (max-width: 480px) {
  .kpis-row {
    grid-template-columns: 1fr;
  }
}
</style>
