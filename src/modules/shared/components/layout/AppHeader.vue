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
    <div class="header-content">
      <div class="header-left">
        <a-button type="text" class="collapse-btn" @click="emit('toggle-sidebar')">
          <MenuUnfoldOutlined v-if="props.collapsed" class="menu-icon" />
          <MenuFoldOutlined v-else class="menu-icon" />
        </a-button>
        <GlobalSearch />
      </div>

      <div class="header-right">
        <ThemeToggle />
        <NotificationDropdown />
        <StoreSwitcher />
        <UserDropdown />
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Using actual CSS variables from globals.css that respond to theme changes */
.app-header {
  height: 70px;
  background: var(--background);
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 99;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.header-content {
  width: 100%;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.app-header:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.03);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.collapse-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: var(--muted-foreground);
  font-size: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.collapse-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--primary);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 12px;
  z-index: -1;
}

.collapse-btn:hover::before {
  opacity: 0.1;
}

.collapse-btn:hover {
  background: var(--accent);
  color: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.15);
}

.collapse-btn:active {
  transform: translateY(0);
}

.menu-icon {
  transition: transform 0.3s ease;
}

.collapse-btn:hover .menu-icon {
  transform: scale(1.1);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 768px) {
  .app-header {
    height: 60px;
  }

  .header-content {
    padding: 0 16px;
  }

  .header-left {
    gap: 12px;
  }

  .header-right {
    gap: 6px;
  }

  .collapse-btn {
    width: 40px;
    height: 40px;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.app-header {
  animation: slideDown 0.3s ease-out;
}

.collapse-btn:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
</style>
