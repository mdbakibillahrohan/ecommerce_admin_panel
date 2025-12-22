<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import { useUserStore } from '@/stores/user'

// Sidebar state
const collapsed = ref(false)

// Sidebar dimensions
const SIDEBAR_WIDTH = 240
const SIDEBAR_COLLAPSED_WIDTH = 80

const sidebarWidth = computed(() => (collapsed.value ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH))

const userStore = useUserStore();

function toggleSidebar() {
  collapsed.value = !collapsed.value
}

onMounted(async () => {
  await userStore.fetchLoggedInUser();

});

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
.admin-layout {
  min-height: 100vh;
  background: #f8fafc;
  transition: background-color 0.3s ease;
}

:global(.dark) .admin-layout {
  background: #111827;
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
  border-right: 1px solid #e5e7eb;
  transition:
    border-color 0.3s ease,
    box-shadow 0.3s ease;
}

:global(.dark) .sidebar {
  border-right-color: #374151;
  box-shadow: 1px 0 10px rgba(0, 0, 0, 0.3);
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
  background: #f8fafc;
  transition: background-color 0.3s ease;
}

:global(.dark) .content {
  background: #111827;
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
  border-top: 1px solid #e5e7eb;
  transition: border-color 0.3s ease;
}

:global(.dark) .footer {
  border-top-color: #374151;
}

.footer-content {
  color: #9ca3af;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.footer-divider {
  color: #e5e7eb;
  transition: color 0.3s ease;
}

:global(.dark) .footer-divider {
  color: #4b5563;
}
</style>
