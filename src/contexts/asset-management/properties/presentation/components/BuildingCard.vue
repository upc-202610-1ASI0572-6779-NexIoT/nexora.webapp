<template>
  <div class="building-card">
    <div class="building-header">
      <div class="building-info">
        <h3 class="building-name">{{ building.name }}</h3>
        <p class="building-address">
          <font-awesome-icon icon="location-dot" />
          {{ building.address }}
        </p>
      </div>
      <div :class="['status-badge', building.status.toLowerCase()]">
        {{ building.status }}
      </div>
    </div>

    <div class="building-stats">
      <div class="stat-item">
        <span class="stat-label">Units</span>
        <span class="stat-value">{{ building.activeUnits }}/{{ building.totalUnits }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Consumption</span>
        <span class="stat-value highlight">{{ building.consumption }} kWh</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Efficiency</span>
        <span class="stat-value">{{ building.efficiency }}%</span>
      </div>
    </div>

    <div class="building-footer">
      <button class="btn--details">View Details</button>
      <button class="btn--manage">
        <font-awesome-icon icon="gear" />
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  building: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.building-card {
  background-color: var(--bg-secondary);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #edf2f7;
}

.building-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.building-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.building-name {
  margin: 0;
  font-size: 1.25rem;
  color: var(--secondary-color);
}

.building-address {
  margin: 4px 0 0 0;
  font-size: 0.875rem;
  color: #718096;
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.status-badge.optimal {
  background-color: #c6f6d5;
  color: #22543d;
}

.status-badge.warning {
  background-color: #feebc8;
  color: #744210;
}

.status-badge.critical {
  background-color: #fed7d7;
  color: #822727;
}

.building-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 16px 0;
  border-top: 1px solid #edf2f7;
  border-bottom: 1px solid #edf2f7;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 0.75rem;
  color: #a0aec0;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.stat-value {
  font-weight: 700;
  color: var(--text-color);
}

.stat-value.highlight {
  color: var(--primary-color);
}

.building-footer {
  display: flex;
  gap: 12px;
}

.btn--details {
  flex: 1;
  background-color: var(--secondary-color);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn--details:hover {
  opacity: 0.9;
}

.btn--manage {
  width: 40px;
  height: 40px;
  background-color: #edf2f7;
  color: #4a5568;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.btn--manage:hover {
  background-color: #e2e8f0;
}
</style>
