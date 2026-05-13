<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <img src="@/assets/logo/logo-nexora.svg" alt="Nexora Logo" class="logo-img" />
        <span class="logo-text">Nexora</span>
      </div>
      <button class="close-btn" @click="$emit('close')">
        <font-awesome-icon icon="xmark" />
      </button>
    </div>
    
    <nav class="sidebar-nav">
      <router-link to="/dashboard" class="nav-item" active-class="active">
        <font-awesome-icon icon="table-cells-large" />
        <span>Main Panel</span>
      </router-link>
      <router-link to="/buildings" class="nav-item" active-class="active">
        <font-awesome-icon icon="building" />
        <span>Buildings</span>
      </router-link>
      <router-link to="/devices" class="nav-item" active-class="active">
        <font-awesome-icon icon="wifi" />
        <span>Devices</span>
      </router-link>
      <router-link to="/alerts" class="nav-item" active-class="active">
        <font-awesome-icon icon="triangle-exclamation" />
        <span>Alerts</span>
        <span class="badge">3</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
defineEmits(['close']);
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: var(--bg-primary);
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding-top: 20px;
  transition: transform 0.3s ease;
  z-index: 1000;
}

.sidebar-header {
  padding: 0 24px;
  margin-bottom: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-img {
  width: 32px;
  height: auto;
}

.logo-text {
  font-family: var(--font-titles);
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--secondary-color);
}

.close-btn {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--secondary-color);
  cursor: pointer;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 16px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  border-radius: 8px;
  transition: background-color 0.2s, color 0.2s;
  position: relative;
}

.nav-item svg {
  width: 20px;
  margin-right: 16px;
  color: #7f8c8d;
}

.nav-item:hover {
  background-color: #e8ebf2;
}

.nav-item.active {
  background-color: #e8ebf2;
  color: var(--secondary-color);
  font-weight: 600;
}

.nav-item.active svg {
  color: var(--secondary-color);
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: -16px;
  top: 50%;
  transform: translateY(-50%);
  height: 24px;
  width: 4px;
  background-color: var(--secondary-color);
  border-radius: 0 4px 4px 0;
}

.badge {
  margin-left: auto;
  background-color: #e74c3c;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 12px;
}

/* Responsiveness */
@media (max-width: 1024px) {
  .sidebar {
    position: fixed;
    transform: translateX(-100%);
  }
  
  .sidebar.is-open {
    transform: translateX(0);
  }
  
  .close-btn {
    display: block;
  }
}
</style>
