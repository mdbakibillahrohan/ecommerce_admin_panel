<script lang="ts" setup>
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import GlobalSearch from './GlobalSearch.vue'
import NotificationDropdown from './NotificationDropdown.vue'
import UserDropdown from './UserDropdown.vue'
import StoreSwitcher from './StoreSwitcher.vue'
import ThemeToggle from './ThemeToggle.vue'

const props = defineProps<{
  collapsed: boolean
}>()

const emit = defineEmits<{
  (e: 'toggle-sidebar'): void
}>()
</script>

<template>
  <header class="app-header">
    <div class="header-left">
      <a-button type="text" class="collapse-btn" @click="emit('toggle-sidebar')">
        <MenuUnfoldOutlined v-if="props.collapsed" />
        <MenuFoldOutlined v-else />
      </a-button>
      <GlobalSearch />
    </div>

    <div class="header-right">
      <!-- Added ThemeToggle component -->
      <ThemeToggle />
      <NotificationDropdown />
      <StoreSwitcher />
      <UserDropdown />
    </div>
  </header>
</template>

<style scoped>
.app-header {
  height: 64px;
  background: #ffffff;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  z-index: 99;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

/* Added dark mode styles */
:global(.dark) .app-header {
  background: #1f2937;
  border-bottom-color: #374151;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #4b5563;
  font-size: 18px;
  transition: all 0.2s ease;
}

.collapse-btn:hover {
  background: #f3f4f6;
  color: #1f2937;
}

:global(.dark) .collapse-btn {
  color: #9ca3af;
}

:global(.dark) .collapse-btn:hover {
  background: #374151;
  color: #f3f4f6;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
