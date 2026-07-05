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
          @open-profile="isProfileOpen = true"
          @edit-profile="requestEditProfile"
        />
        <div class="main-content-scrollable">
          <router-view />
          <footer v-if="route.name !== 'property-edit' && route.name !== 'property-registration'" class="global-footer">
            <div class="footer-left">
              <span>&copy; 2026 Nexora. Todos los derechos reservados.</span>
            </div>
            <div class="footer-right">
              <a href="https://upc-202610-1asi0572-6779-nexiot.github.io/nexora.website/terms_conditions.html" target="_blank" rel="noopener noreferrer">Términos y Condiciones</a>
              <a href="https://upc-202610-1asi0572-6779-nexiot.github.io/nexora.website/privacy_policy.html" target="_blank" rel="noopener noreferrer">Política de Privacidad</a>
            </div>
          </footer>
        </div>
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
  min-width: 0;
  height: 100vh;
  overflow: hidden;
}

.main-content-scrollable {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
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

.global-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 32px;
  background-color: white;
  border-top: 1px solid #eaeaea;
  font-size: 0.8rem;
  color: #7f8c8d;
  margin-top: auto;
  flex-shrink: 0;
}

.footer-left span {
  white-space: nowrap;
}

.footer-right {
  display: flex;
  gap: 24px;
}

.footer-right a {
  color: #1a3673;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.footer-right a:hover {
  color: #e67e22;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .global-footer {
    flex-direction: column;
    gap: 8px;
    padding: 12px 16px;
    text-align: center;
  }
  .footer-right {
    gap: 16px;
  }
}
</style>