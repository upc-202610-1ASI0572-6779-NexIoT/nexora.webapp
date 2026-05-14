<!-- src/App.vue -->
<template>
  <div id="app-container">
    <router-view v-if="isFullPageRoute" />
    
    <div v-else class="dashboard-layout">
      <div :class="['sidebar-overlay', { 'is-active': isSidebarOpen }]" @click="isSidebarOpen = false"></div>
      <SidebarMenu :class="{ 'is-open': isSidebarOpen }" @close="isSidebarOpen = false" />
      
      <div class="main-content">
        <HeaderTop @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import SidebarMenu from '@/components/SidebarMenu.vue';
import HeaderTop from '@/components/HeaderTop.vue';

const route = useRoute();
const isSidebarOpen = ref(false);

const isFullPageRoute = computed(() => {
  return route.name === 'login';
});
</script>

<style>
.dashboard-layout {
  display: flex;
  height: 100vh;
  width: 100vw;
  background-color: var(--bg-primary, #f1f5f9);
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  min-width: 0;
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
</style>