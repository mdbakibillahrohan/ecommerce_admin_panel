<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  DashboardOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  ShopOutlined,
  CreditCardOutlined,
  FileTextOutlined,
  SkinOutlined,
  GiftOutlined,
  StarOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

defineProps<{
  collapsed: boolean
}>()

defineEmits<{
  (e: 'update:collapsed', value: boolean): void
}>()

// Menu state
const openKeys = ref(['catalog', 'content', 'billing'])

// Menu items configuration
const menuItems = [
  {
    key: 'dashboard',
    icon: DashboardOutlined,
    label: 'Dashboard',
    path: '/dashboard',
  },
  {
    key: 'catalog',
    icon: ShoppingOutlined,
    label: 'Catalog',
    children: [
      { key: 'products', label: 'Products', path: '/products' },
      { key: 'categories', label: 'Categories', path: '/categories' },
      { key: 'inventory', label: 'Inventory', path: '/inventory' },
    ],
  },
  {
    key: 'orders',
    icon: ShoppingCartOutlined,
    label: 'Orders',
    path: '/orders',
  },
  {
    key: 'customers',
    icon: UserOutlined,
    label: 'Customers',
    path: '/customers',
  },
  {
    key: 'reviews',
    icon: StarOutlined,
    label: 'Reviews',
    path: '/reviews',
  },
  {
    key: 'coupons',
    icon: GiftOutlined,
    label: 'Coupons',
    path: '/coupons',
  },
  {
    key: 'stores',
    icon: ShopOutlined,
    label: 'My Stores',
    path: '/stores',
  },
  {
    key: 'content',
    icon: FileTextOutlined,
    label: 'Content',
    children: [
      { key: 'pages', label: 'Pages', path: '/content/pages' },
      { key: 'menus', label: 'Menus', path: '/content/menus' },
    ],
  },
  {
    key: 'themes',
    icon: SkinOutlined,
    label: 'Themes',
    path: '/themes',
  },
  {
    key: 'billing',
    icon: CreditCardOutlined,
    label: 'Billing',
    children: [
      { key: 'subscription', label: 'Subscription', path: '/billing/subscription' },
      { key: 'payments', label: 'Transactions', path: '/payments' },
    ],
  },
]

// Selected keys based on current route
const selectedKeys = computed(() => {
  const path = route.path
  for (const item of menuItems) {
    if (item.path === path) return [item.key]
    if (item.children) {
      for (const child of item.children) {
        if (path.startsWith(child.path)) return [child.key]
      }
    }
  }
  return ['dashboard']
})

function handleMenuClick({ key }: { key: string }) {
  const findPath = (items: typeof menuItems): string | null => {
    for (const item of items) {
      if (item.key === key && item.path) return item.path
      if (item.children) {
        for (const child of item.children) {
          if (child.key === key) return child.path
        }
      }
    }
    return null
  }
  const path = findPath(menuItems)
  if (path) router.push(path)
}
</script>

<template>
  <div class="sidebar-container">
    <!-- Logo Section -->
    <div class="logo-section">
      <div class="logo-icon">
        <a-image :preview="false" :width="100" src="/images/logo.png" />
      </div>
      <!-- <transition name="fade">
        <span v-if="!collapsed" class="logo-text">Adaptix</span>
      </transition> -->
    </div>

    <!-- Navigation Menu -->
    <div class="menu-section">
      <a-menu
        :selected-keys="selectedKeys"
        v-model:open-keys="openKeys"
        mode="inline"
        :inline-collapsed="collapsed"
        class="sidebar-menu"
        @click="handleMenuClick"
      >
        <template v-for="item in menuItems" :key="item.key">
          <!-- Menu Item with Children -->
          <a-sub-menu v-if="item.children" :key="item.key">
            <template #title>
              <component :is="item.icon" />
              <span>{{ item.label }}</span>
            </template>
            <a-menu-item v-for="child in item.children" :key="child.key">
              {{ child.label }}
            </a-menu-item>
          </a-sub-menu>

          <!-- Simple Menu Item -->
          <a-menu-item v-if="!item.children" :key="item.key">
            <component :is="item.icon" />
            <span>{{ item.label }}</span>
          </a-menu-item>
        </template>
      </a-menu>
    </div>
  </div>
</template>

<style scoped>
.sidebar-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffffff;
  transition: background-color 0.3s ease;
}

:global(.dark) .sidebar-container {
  background: #1f2937;
}

.logo-section {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 0 16px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
  transition: border-color 0.3s ease;
}

:global(.dark) .logo-section {
  border-bottom-color: #374151;
}

.logo-icon {
  /* width: 36px;
  height: 36px; */
  /* background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); */
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  /* font-size: 18px; */
  /* flex-shrink: 0; */
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  letter-spacing: -0.5px;
  white-space: nowrap;
  transition: color 0.3s ease;
}

:global(.dark) .logo-text {
  color: #f3f4f6;
}

.menu-section {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 0;
}

.sidebar-menu {
  border-right: none !important;
  background: transparent;
}

.sidebar-menu :deep(.ant-menu-item) {
  margin: 4px 8px;
  border-radius: 8px;
  height: 44px;
  line-height: 44px;
  color: #4b5563;
  transition: all 0.2s ease;
}

:global(.dark) .sidebar-menu :deep(.ant-menu-item) {
  color: #9ca3af;
}

.sidebar-menu :deep(.ant-menu-item:hover) {
  background: #f3f4f6;
  color: #1f2937;
}

:global(.dark) .sidebar-menu :deep(.ant-menu-item:hover) {
  background: #374151;
  color: #f3f4f6;
}

.sidebar-menu :deep(.ant-menu-item-selected) {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%) !important;
  color: #ffffff !important;
}

.sidebar-menu :deep(.ant-menu-item-selected:hover) {
  background: linear-gradient(135deg, #5558e3 0%, #7c4ddb 100%) !important;
}

.sidebar-menu :deep(.ant-menu-submenu-title) {
  margin: 4px 8px;
  border-radius: 8px;
  height: 44px;
  line-height: 44px;
  color: #4b5563;
  transition: all 0.2s ease;
}

:global(.dark) .sidebar-menu :deep(.ant-menu-submenu-title) {
  color: #9ca3af;
}

.sidebar-menu :deep(.ant-menu-submenu-title:hover) {
  background: #f3f4f6;
  color: #1f2937;
}

:global(.dark) .sidebar-menu :deep(.ant-menu-submenu-title:hover) {
  background: #374151;
  color: #f3f4f6;
}

.sidebar-menu :deep(.ant-menu-sub.ant-menu-inline) {
  background: transparent;
}

.sidebar-menu :deep(.ant-menu-sub .ant-menu-item) {
  padding-left: 48px !important;
  height: 40px;
  line-height: 40px;
}

:global(.dark) .sidebar-menu :deep(.ant-menu-submenu-arrow) {
  color: #9ca3af;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
