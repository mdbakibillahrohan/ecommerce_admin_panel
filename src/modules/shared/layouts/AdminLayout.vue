<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import AppSidebar from '../components/layout/AppSidebar.vue'
import AppHeader from '../components/layout/AppHeader.vue'
import { useUserStore } from '@/modules/auth/store/user'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/auth/store'
import { useStoreStore } from '@/modules/stores/store/store'

// Sidebar state
const collapsed = ref(false)

// Sidebar dimensions
const SIDEBAR_WIDTH = 240
const SIDEBAR_COLLAPSED_WIDTH = 80

const sidebarWidth = computed(() => (collapsed.value ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH))

const userStore = useUserStore()
const authStore = useAuthStore()
const storeStore = useStoreStore()

const router = useRouter()

function toggleSidebar() {
  collapsed.value = !collapsed.value
}

const getUserData = async () => {
  try {
    await userStore.fetchLoggedInUser()
  } catch (error: any) {
    if (error) {
      authStore.logout()
      router.push('/login')
    }
  }
}

onMounted(async () => {
  await getUserData()
  await storeStore.fetchCurrentUserStores()
})
</script>

<template>
  <a-layout class="admin-layout">
    <!-- Fixed Sidebar -->
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible :width="SIDEBAR_WIDTH"
      :collapsed-width="SIDEBAR_COLLAPSED_WIDTH" class="sidebar" theme="light">
      <AppSidebar :collapsed="collapsed" @update:collapsed="collapsed = $event" />
    </a-layout-sider>

    <!-- Main Layout -->
    <a-layout class="main-layout" :style="{ marginLeft: sidebarWidth + 'px' }">
      <!-- Header -->
      <AppHeader :collapsed="collapsed" @toggle-sidebar="toggleSidebar" />

      <!-- Content -->
      <a-layout-content class="content">
        <div class="content-wrapper">
          <RouterView />
        </div>
      </a-layout-content>

      <!-- Footer -->
      <a-layout-footer class="footer">
        <div class="footer-content">
          <span>E-Commerce Admin Panel</span>
          <span class="footer-divider">|</span>
          <span>&copy; {{ new Date().getFullYear() }} Adaptix Innovate</span>
        </div>
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<style scoped>
/* Replaced all hardcoded colors with CSS variables for proper theme switching */
.admin-layout {
  min-height: 100vh;
  background: var(--background);
  transition: background-color 0.3s ease;
}

/* Fixed Sidebar */
.sidebar {
  position: fixed !important;
  left: 0;
  top: 0;
  bottom: 0;
  height: 100vh;
  z-index: 100;
  box-shadow: 1px 0 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--border);
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease,
    background-color 0.3s ease;
}

.sidebar :deep(.ant-layout-sider-children) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Main Layout */
.main-layout {
  transition: margin-left 0.2s ease;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Content */
.content {
  flex: 1;
  padding: 24px;
  background: var(--background);
  transition: background-color 0.3s ease;
}

.content-wrapper {
  max-width: 1600px;
  margin: 0 auto;
}

/* Footer */
.footer {
  background: transparent;
  padding: 16px 24px;
  text-align: center;
  border-top: 1px solid var(--border);
  transition: border-color 0.3s ease;
}

.footer-content {
  color: var(--muted-foreground);
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.footer-divider {
  color: var(--border);
  transition: color 0.3s ease;
}

/* Responsive Design */
@media (max-width: 768px) {
  .content {
    padding: 16px;
  }

  .sidebar {
    box-shadow: 2px 0 15px rgba(0, 0, 0, 0.1);
  }
}
</style>
