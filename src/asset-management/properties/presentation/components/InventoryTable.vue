<template>
  <div class="inventory-container">
    <div class="inventory-header">
      <h2 class="inventory-title">Inventory Overview</h2>
      <div class="inventory-actions">
        <button class="action-btn">
          <font-awesome-icon icon="filter" class="btn-icon" /> Filter
        </button>
        <button class="action-btn">
          <font-awesome-icon icon="download" class="btn-icon" /> Export
        </button>
      </div>
    </div>
    
    <div class="table-wrapper">
      <table class="inventory-table">
        <thead>
          <tr>
            <th>BUILDING NAME</th>
            <th>APARTMENT ID</th>
            <th>TENANT NAME</th>
            <th>SUBSCRIPTION STATUS</th>
            <th>HEALTH SCORE</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <td class="font-bold text-dark">{{ item.buildingName }}</td>
            <td class="text-muted">{{ item.apartmentId }}</td>
            <td>{{ item.tenantName }}</td>
            <td>
              <span :class="['status-badge', item.status.toLowerCase()]">{{ item.status }}</span>
            </td>
            <td>
              <div class="health-score">
                <div class="progress-bar">
                  <div :class="['progress-fill', getHealthColorClass(item.healthScore)]" :style="{ width: item.healthScore + '%' }"></div>
                </div>
                <span class="score-text">{{ item.healthScore }}%</span>
              </div>
            </td>
            <td>
              <button class="more-btn">
                <font-awesome-icon icon="ellipsis-vertical" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="inventory-footer">
      <div class="showing-text">Showing 1-5 of 124 properties</div>
      <div class="pagination">
        <button class="page-btn disabled">Previous</button>
        <button class="page-btn active">1</button>
        <button class="page-btn">2</button>
        <button class="page-btn">3</button>
        <button class="page-btn">Next</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const items = ref([
  { buildingName: 'Skyline Plaza A', apartmentId: 'SPT-402', tenantName: 'Jonathan Vance', status: 'Active', healthScore: 98 },
  { buildingName: 'Nexora Heights', apartmentId: 'NU-1004', tenantName: 'Sarah Jenkins', status: 'Active', healthScore: 82 },
  { buildingName: 'The Obsidian Wing', apartmentId: 'OB-211', tenantName: 'Marcus Thorne', status: 'Inactive', healthScore: 45 },
  { buildingName: 'Riverview Residences', apartmentId: 'RV-09', tenantName: 'Elena Rodriguez', status: 'Active', healthScore: 92 },
  { buildingName: 'Summit Lofts', apartmentId: 'SL-77', tenantName: 'David Chen', status: 'Active', healthScore: 96 }
]);

const getHealthColorClass = (score) => {
  if (score >= 90) return 'bg-success';
  if (score >= 70) return 'bg-warning';
  return 'bg-danger';
};
</script>

<style scoped>
.inventory-container {
  background-color: white;
  border-radius: 4px;
  border: 1px solid #eaeaea;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}

.inventory-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #eaeaea;
}

.inventory-title {
  font-size: 1.25rem;
  font-family: var(--font-general, sans-serif);
  color: #1a3673;
  font-weight: 700;
  margin: 0;
  text-decoration: underline;
  text-decoration-color: #3498db;
  text-underline-offset: 6px;
  text-decoration-thickness: 2px;
}

.inventory-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  background-color: white;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.action-btn:hover {
  background-color: #f8f9fc;
  border-color: #94a3b8;
}

.btn-icon {
  font-size: 0.9rem;
}

.table-wrapper {
  overflow-x: auto;
  width: 100%;
}

.inventory-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.inventory-table th {
  text-align: left;
  padding: 16px 24px;
  font-size: 0.8rem;
  color: #7f8c8d;
  font-weight: 700;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #eaeaea;
  background-color: #fcfcfc;
}

.inventory-table td {
  padding: 16px 24px;
  font-size: 0.9rem;
  color: #2c3e50;
  border-bottom: 1px solid #eaeaea;
  vertical-align: middle;
}

.font-bold { font-weight: 700; color: #1a3673; }
.text-muted { color: #7f8c8d; }

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
}

.status-badge.active {
  background-color: #a7f3d0;
  color: #065f46;
}

.status-badge.inactive {
  background-color: #fecdd3;
  color: #9f1239;
}

.health-score {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background-color: #f1f5f9;
  border-radius: 3px;
  overflow: hidden;
  max-width: 100px;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
}

.bg-success { background-color: #2ecc71; }
.bg-warning { background-color: #f59e0b; }
.bg-danger { background-color: #e74c3c; }

.score-text {
  font-weight: 700;
  font-size: 0.85rem;
  width: 32px;
}

.more-btn {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 4px;
}

.more-btn:hover {
  color: #475569;
}

.inventory-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
}

.showing-text {
  font-size: 0.85rem;
  color: #7f8c8d;
}

.pagination {
  display: flex;
  gap: 4px;
}

.page-btn {
  background-color: white;
  border: 1px solid #e2e8f0;
  color: #475569;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(.disabled):not(.active) {
  background-color: #f8f9fc;
}

.page-btn.active {
  background-color: #1a3673;
  color: white;
  border-color: #1a3673;
}

.page-btn.disabled {
  color: #cbd5e1;
  cursor: not-allowed;
}

/* Responsiveness */
@media (max-width: 768px) {
  .inventory-header, .inventory-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
}
</style>
