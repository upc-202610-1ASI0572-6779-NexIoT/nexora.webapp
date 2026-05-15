<template>
  <div class="bottom-card dark-card">
    <h3 class="card-title">System Health</h3>
    <div class="health-content">
      <div class="health-row">
        <span class="row-label">Main Gateway</span>
        <span class="row-value badge-active">ACTIVE</span>
      </div>
      <div class="health-divider"></div>
      <div class="health-row">
        <span class="row-label">Data Latency</span>
        <span class="row-value">12ms</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bottom-card {
  border-radius: 4px;
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.dark-card {
  background-color: #1a3673; /* Primary dark blue from the theme */
  color: white;
}

.card-title {
  font-family: var(--font-general, sans-serif);
  font-size: 1rem;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 24px;
  color: white;
}

.health-content {
  display: flex;
  flex-direction: column;
}

.health-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.row-label {
  font-size: 0.95rem;
}

.row-value {
  font-weight: 700;
}

.badge-active {
  background-color: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.8rem;
  border: 1px solid #2ecc71;
}

.health-divider {
  height: 2px;
  background-color: #2ecc71;
  margin: 8px 0;
  width: 100%;
}

/* Responsiveness */
@media (max-width: 480px) {
  .bottom-card {
    padding: 16px;
  }
}
</style>
