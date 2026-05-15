<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="brand">
        <img src="@/assets/logo/logo-nexora.svg" alt="Nexora Logo" class="brand-logo" />
        <div class="brand-info">
          <h1 class="brand-name">Nexora</h1>
          <p class="brand-tagline">IoT Management</p>
        </div>
      </div>
      <button class="close-btn" @click="$emit('close')">
        <font-awesome-icon icon="xmark" />
      </button>
    </div>

    <nav class="sidebar-nav">
      <router-link to="/dashboard" class="nav-link" active-class="active">
        <font-awesome-icon icon="house" class="nav-icon" />
        <span class="nav-text">Home</span>
      </router-link>
      <router-link to="/buildings" class="nav-link" active-class="active">
        <font-awesome-icon icon="building" class="nav-icon" />
        <span class="nav-text">Properties</span>
      </router-link>
      <router-link to="/devices" class="nav-link" active-class="active">
        <font-awesome-icon icon="signal" class="nav-icon" />
        <span class="nav-text">Devices</span>
      </router-link>
      <router-link to="/alerts" class="nav-link" active-class="active">
        <font-awesome-icon icon="bell" class="nav-icon" />
        <span class="nav-text">Alerts</span>
      </router-link>
      <router-link to="/reports" class="nav-link" active-class="active">
        <font-awesome-icon icon="chart-column" class="nav-icon" />
        <span class="nav-text">Reports</span>
      </router-link>
      <router-link to="/settings" class="nav-link" active-class="active">
        <font-awesome-icon icon="gear" class="nav-icon" />
        <span class="nav-text">Settings</span>
      </router-link>
      <router-link to="/subscription" class="nav-link" active-class="active">
        <font-awesome-icon icon="address-card" class="nav-icon" />
        <span class="nav-text">Subscription</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <div class="user-profile">
        <div class="user-avatar">
          <font-awesome-icon icon="user" />
        </div>
        <div class="user-info">
          <p class="user-name">Admin Operator</p>
          <p class="user-role">FLEET MANAGER</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
defineEmits(['close']);
</script>

<style scoped>
.sidebar {
  width: 280px;
  background-color: #173183; /* Deep Blue from design */
  height: 100vh;
  display: flex;
  flex-direction: column;
  color: #ffffff;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
}

.sidebar-header {
  padding: 32px 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.brand-logo {
  width: 42px;
  height: 42px;
  filter: drop-shadow(0 0 8px rgba(249, 115, 22, 0.3));
}

.brand-name {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.5px;
  color: #ffffff;
}

.brand-tagline {
  font-size: 0.85rem;
  color: #94a3b8;
  margin: 0;
  font-weight: 400;
}

.close-btn {
  display: none;
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #ffffff;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 12px;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 14px 28px;
  text-decoration: none;
  color: #cbd5e1;
  transition: all 0.25s ease;
  position: relative;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.nav-link.active {
  background-color: #f97316; /* Vibrant Orange */
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.2);
}

.nav-icon {
  width: 20px;
  font-size: 1.2rem;
  margin-right: 18px;
  opacity: 0.9;
}

.nav-text {
  font-weight: 500;
  font-size: 1rem;
}

.sidebar-footer {
  padding: 24px;
  background-color: rgba(0, 0, 0, 0.15);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 14px;
}

.user-avatar {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #334155, #0f172a);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  color: #94a3b8;
  overflow: hidden;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
  color: #ffffff;
}

.user-role {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 2px 0 0 0;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-weight: 500;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .sidebar {
    position: fixed;
    left: 0;
    top: 0;
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
