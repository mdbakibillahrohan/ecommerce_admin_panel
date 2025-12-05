<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  InboxOutlined,
  TagOutlined,
  DollarOutlined,
  StarOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const collapsed = ref(false)
const selectedKeys = computed(() => [route.name as string])

const menuItems = [
  {
    key: 'dashboard',
    icon: DashboardOutlined,
    label: 'Dashboard',
    path: '/dashboard',
  },
  {
    key: 'products',
    icon: ShoppingOutlined,
    label: 'Products',
    path: '/products',
  },
  {
    key: 'categories',
    icon: AppstoreOutlined,
    label: 'Categories',
    path: '/categories',
  },
  {
    key: 'orders',
    icon: ShoppingCartOutlined,
    label: 'Orders',
    path: '/orders',
  },
  {
    key: 'inventory',
    icon: InboxOutlined,
    label: 'Inventory',
    path: '/inventory',
  },
  {
    key: 'coupons',
    icon: TagOutlined,
    label: 'Coupons',
    path: '/coupons',
  },
  {
    key: 'payments',
    icon: DollarOutlined,
    label: 'Payments',
    path: '/payments',
  },
  {
    key: 'reviews',
    icon: StarOutlined,
    label: 'Reviews',
    path: '/reviews',
  },
]

function handleMenuClick({ key }: { key: string }) {
  const item = menuItems.find(m => m.key === key)
  if (item) {
    router.push(item.path)
  }
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <a-layout class="admin-layout">
    <!-- Sidebar -->
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      class="sidebar"
      :width="260"
      theme="dark"
    >
      <div class="logo">
        <span v-if="!collapsed" class="logo-text">E-Commerce Admin</span>
        <span v-else class="logo-icon">EA</span>
      </div>
      
      <a-menu
        theme="dark"
        mode="inline"
        :selected-keys="selectedKeys"
        @click="handleMenuClick"
      >
        <a-menu-item v-for="item in menuItems" :key="item.key">
          <component :is="item.icon" />
          <span>{{ item.label }}</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>

    <!-- Main Content -->
    <a-layout class="main-layout">
      <!-- Header -->
      <a-layout-header class="header">
        <div class="header-left">
          <a-button
            type="text"
            class="trigger"
            @click="collapsed = !collapsed"
          >
            <MenuFoldOutlined v-if="!collapsed" />
            <MenuUnfoldOutlined v-else />
          </a-button>
        </div>
        
        <div class="header-right">
          <a-dropdown>
            <a-button type="text" class="user-dropdown">
              <a-avatar :size="32" class="user-avatar">
                <template #icon><UserOutlined /></template>
              </a-avatar>
              <span class="user-name">{{ authStore.fullName }}</span>
            </a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item key="settings">
                  <SettingOutlined />
                  <span>Settings</span>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" @click="handleLogout">
                  <LogoutOutlined />
                  <span>Logout</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <!-- Content -->
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>

      <!-- Footer -->
      <a-layout-footer class="footer">
        E-Commerce Admin Panel ©{{ new Date().getFullYear() }}
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<style scoped>
.admin-layout {
  min-height: 100vh;
}

.sidebar {
  background: linear-gradient(180deg, #001529 0%, #002140 100%);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
}

.sidebar :deep(.ant-layout-sider-children) {
  display: flex;
  flex-direction: column;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  margin: 16px;
  border-radius: 8px;
}

.logo-text {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.logo-icon {
  color: #fff;
  font-size: 20px;
  font-weight: 700;
}

.sidebar :deep(.ant-menu) {
  background: transparent;
  border-right: none;
  padding: 0 8px;
}

.sidebar :deep(.ant-menu-item) {
  margin: 4px 0;
  border-radius: 8px;
  height: 44px;
  line-height: 44px;
}

.sidebar :deep(.ant-menu-item-selected) {
  background: linear-gradient(90deg, #1890ff 0%, #096dd9 100%);
}

.sidebar :deep(.ant-menu-item:hover:not(.ant-menu-item-selected)) {
  background: rgba(255, 255, 255, 0.08);
}

.main-layout {
  background: #f0f2f5;
}

.header {
  background: #fff;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
}

.trigger {
  font-size: 18px;
  padding: 0 16px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 12px;
}

.user-avatar {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
}

.user-name {
  font-weight: 500;
  color: #262626;
}

.content {
  margin: 24px;
  min-height: calc(100vh - 64px - 70px - 48px);
}

.footer {
  text-align: center;
  background: transparent;
  color: #8c8c8c;
  padding: 16px 24px;
}
</style>
