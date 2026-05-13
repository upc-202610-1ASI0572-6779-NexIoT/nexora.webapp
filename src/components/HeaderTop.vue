<template>
  <header class="dashboard-header">
    <button class="menu-btn" @click="$emit('toggle-sidebar')">
      <font-awesome-icon icon="bars" />
    </button>
    
    <div class="search-bar">
      <font-awesome-icon icon="magnifying-glass" class="search-icon" />
      <input type="text" placeholder="Search buildings, devices..." />
    </div>
    
    <div class="header-actions">
      <button class="icon-btn">
        <font-awesome-icon icon="bell" />
      </button>
      <div class="user-profile">
        <span class="avatar">AR</span>
      </div>
    </div>
  </header>
</template>

<script setup>
defineEmits(['toggle-sidebar']);
</script>

<style scoped>
.dashboard-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 16px 32px;
  background-color: transparent;
  gap: 24px;
}

.menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 1.2rem;
  color: var(--secondary-color);
  cursor: pointer;
  margin-right: auto;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: transparent;
  border-bottom: 1px solid transparent;
  padding: 4px 8px;
  margin-right: auto;
}

.search-bar:focus-within {
  border-bottom: 1px solid var(--secondary-color);
}

.search-icon {
  color: #7f8c8d;
  margin-right: 8px;
}

.search-bar input {
  border: none;
  background: transparent;
  outline: none;
  font-family: var(--font-general);
  color: var(--text-color);
  width: 200px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-btn {
  background: none;
  border: none;
  color: #2f2f2f;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.2s;
}

.icon-btn:hover {
  color: var(--primary-color);
}

.user-profile {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.avatar {
  background-color: var(--secondary-color);
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  font-family: var(--font-titles);
}

/* Responsiveness */
@media (max-width: 1024px) {
  .menu-btn {
    display: block;
  }
  
  .search-bar {
    display: none; /* Hide search on mobile header to save space */
  }
  
  .dashboard-header {
    padding: 12px 16px;
  }
}
</style>
