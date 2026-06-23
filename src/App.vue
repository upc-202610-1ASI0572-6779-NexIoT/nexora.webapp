<template>
  <div id="app-container">
    <router-view v-if="isFullPageRoute" />

    <div v-else class="dashboard-layout">
      <div :class="['sidebar-overlay', { 'is-active': isSidebarOpen }]" @click="isSidebarOpen = false"></div>

      <SidebarMenu
          :class="{ 'is-open': isSidebarOpen }"
          @close="isSidebarOpen = false"
          @open-settings="isSettingsOpen = true"
          @open-profile="isProfileOpen = true"
      />

      <ProfileModal
          :is-open="isProfileOpen"
          @close="isProfileOpen = false"
          @request-edit="handleOpenEdit"
      />

      <EditProfileModal
          v-if="isEditProfileOpen"
          @close="handleCloseEdit"
          @saved="handleSaveEdit"
      />

      <div class="main-content">
        <HeaderTop
          @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
          @edit-profile="requestEditProfile"
        />
        <router-view />
      </div>
    </div>

    <SettingsModal :is-open="isSettingsOpen" @close="isSettingsOpen = false" />
  </div>
</template>

<script setup>
import { ref, computed, provide, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/contexts/iam/auth/presentation/store/authStore';
import SidebarMenu from './shared/presentation/components/SidebarMenu.vue';
import HeaderTop from './shared/presentation/components/HeaderTop.vue';
import SettingsModal from './contexts/iam/settings/presentation/components/SettingsModal.vue';
import ProfileModal from "@/contexts/iam/profile/presentation/components/ProfileModal.vue";
import EditProfileModal from "@/contexts/iam/profile/presentation/components/EditProfileModal.vue";

const route = useRoute();
const authStore = useAuthStore();
const isSidebarOpen = ref(false);
const isSettingsOpen = ref(false);
const isProfileOpen = ref(false);
const isEditProfileOpen = ref(false);

const editProfileRequested = ref(false);
provide('editProfileRequested', editProfileRequested);

const globalBreadcrumbs = ref(null);
provide('globalBreadcrumbs', globalBreadcrumbs);

function requestEditProfile() {
  editProfileRequested.value = true;
}

onMounted(() => {
  if (authStore.token && !authStore.user) {
    authStore.fetchUser();
  }
});

// Control de flujo entre Modales de Perfil
function handleOpenEdit() {
  isProfileOpen.value = false;
  isEditProfileOpen.value = true;
}

function handleCloseEdit() {
  isEditProfileOpen.value = false;
  isProfileOpen.value = true;
}

function handleSaveEdit() {
  isEditProfileOpen.value = false;
  isProfileOpen.value = true;
}

const isFullPageRoute = computed(() => {
  return ['login', 'register', 'plan-selection', 'checkout', 'subscription-confirmation'].includes(route.name);
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