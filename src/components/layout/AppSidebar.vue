<!-- eslint-disable @typescript-eslint/no-explicit-any -->
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
  SearchOutlined,
  DownOutlined,
  RightOutlined,
  CodepenOutlined,
  BookOutlined,
  CloudOutlined,
  ToolOutlined,
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()

defineProps<{
  collapsed: boolean
}>()

defineEmits<{
  (e: 'update:collapsed', value: boolean): void
}>()

// Search state
const searchQuery = ref('')
const expandedKeys = ref<string[]>(['products', 'content', 'billing'])

// ──────────────────────────────────────────────────────────────
// Menu item types
// ──────────────────────────────────────────────────────────────
interface MenuItem {
  key: string
  icon: any // Ant Design Icon component
  label: string
  path: string
  badge?: number
  children?: {
    key: string
    label: string
    path: string
  }[]
}

interface MenuGroup {
  key: string
  label: string
  items: MenuItem[]
}

// Menu groups configuration
const menuGroups: MenuGroup[] = [
  {
    key: 'main',
    label: 'Main',
    items: [
      {
        key: 'dashboard',
        icon: DashboardOutlined,
        label: 'Dashboard',
        path: '/dashboard',
      },
      {
        key: 'orders',
        icon: ShoppingCartOutlined,
        label: 'Orders',
        path: 12,
        path: '/orders',
      },
    ],
  },
  {
    key: 'sales',
    label: 'Sales Channels',
    items: [
      {
        key: 'products',
        icon: ShoppingOutlined,
        label: 'Products',
        path: '/products',
        children: [
          { key: 'all-products', label: 'All Products', path: '/products' },
          { key: 'categories', label: 'Categories', path: '/categories' },
          { key: 'inventory', label: 'Inventory', path: '/inventory' },
          { key: 'collections', label: 'Collections', path: '/collections' },
        ],
      },
      {
        key: 'coupons',
        icon: GiftOutlined,
        label: 'Coupons',
        path: '/coupons',
      },
      {
        key: 'promotions',
        icon: CodepenOutlined,
        label: 'Promotions',
        path: '/promotions',
      },
    ],
  },
  {
    key: 'customer',
    label: 'Customer',
    items: [
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
        key: 'team',
        icon: UserOutlined, // Reusing UserOutlined for staff
        label: 'Team & Staff',
        path: '/team',
      },
    ],
  },
  {
    key: 'content',
    label: 'Content & Media',
    items: [
      {
        key: 'media',
        icon: CloudOutlined,
        label: 'Media Library',
        path: '/media',
      },
      {
        key: 'pages',
        icon: FileTextOutlined,
        label: 'Pages',
        path: '/content/pages',
      },
      {
        key: 'sliders',
        icon: BookOutlined,
        label: 'Sliders',
        path: '/content/sliders',
      }
    ]
  },
  {
    key: 'settings',
    label: 'Settings',
    items: [
      {
        key: 'stores',
        icon: ShopOutlined,
        label: 'My Stores',
        path: '/stores',
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
        path: '/billing',
        children: [
          { key: 'subscription', label: 'Subscription', path: '/billing/subscription' },
          { key: 'payments', label: 'Transactions', path: '/payments' },
          { key: 'invoices', label: 'Invoices', path: '/billing/invoices' },
        ],
      },
      {
        key: 'configuration',
        icon: ToolOutlined,
        label: 'Configuration',
        path: '/settings',
        children: [
          { key: 'general', label: 'General', path: '/settings/general' },
          { key: 'shipping', label: 'Shipping', path: '/settings/shipping' },
          { key: 'tax', label: 'Tax', path: '/settings/tax' },
          { key: 'payments-settings', label: 'Payment Methods', path: '/settings/payments' },
          { key: 'checkout-settings', label: 'Checkout Settings', path: '/settings/checkout' },
        ]
      }
    ],
  },
]

// Selected key based on current route
const selectedKey = computed(() => {
  const path = route.path
  for (const group of menuGroups) {
    for (const item of group.items) {
      if (item.children) {
        for (const child of item.children) {
          if (path.startsWith(child.path)) return child.key
        }
      }
      if (path.startsWith(item.path)) return item.key
    }
  }
  return 'dashboard'
})

// Filtered menu groups based on search
const filteredMenuGroups = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return menuGroups

  return menuGroups
    .map((group) => {
      const matchingItems = group.items
        .map((item) => {
          const itemMatches = item.label.toLowerCase().includes(query)

          if (item.children) {
            const matchingChildren = item.children.filter((child) =>
              child.label.toLowerCase().includes(query)
            )
            if (matchingChildren.length > 0) {
              return { ...item, children: matchingChildren }
            }
          }

          if (itemMatches) return item
          return null
        })
        .filter((i): i is MenuItem => i !== null)

      if (matchingItems.length > 0) {
        return { ...group, items: matchingItems }
      }
      return null
    })
    .filter((g): g is MenuGroup => g !== null)
})

function handleMenuClick(path: string) {
  router.push(path)
}

function toggleExpanded(key: string) {
  const index = expandedKeys.value.indexOf(key)
  if (index > -1) {
    expandedKeys.value.splice(index, 1)
  } else {
    expandedKeys.value.push(key)
  }
}

function isExpanded(key: string) {
  return expandedKeys.value.includes(key)
}
</script>

<template>
  <div class="sidebar-container">
    <!-- Logo Section -->
    <div class="logo-section">
      <div class="logo-wrapper">
        <div class="logo-circle">
          <a-image :preview="false" :width="collapsed ? 32 : 40" src="/images/logo.png" />
        </div>
        <div v-if="!collapsed" class="brand-info">
          <div class="brand-name">Adaptive innovate</div>
        </div>
      </div>
    </div>

    <!-- Search Section -->
    <div v-if="!collapsed" class="search-section">
      <a-input v-model:value="searchQuery" placeholder="Search menu..." allow-clear size="large"
        class="menu-search-input">
        <template #prefix>
          <SearchOutlined class="search-icon" />
        </template>
      </a-input>
    </div>

    <!-- Navigation Menu with Groups -->
    <div class="menu-section">
      <div v-for="group in filteredMenuGroups" :key="group.key" class="menu-group">
        <!-- Group Label (Separator) -->
        <div v-if="!collapsed" class="group-label">
          {{ group.label }}
        </div>
        <div v-else class="group-divider"></div>

        <!-- Menu Items -->
        <div class="menu-items">
          <div v-for="item in group.items" :key="item.key">
            <!-- Parent Menu Item -->
            <div class="menu-item" :class="{
              active: selectedKey === item.key && !item.children,
              'has-children': item.children
            }" @click="item.children ? toggleExpanded(item.key) : handleMenuClick(item.path)">
              <div class="menu-item-content">
                <component :is="item.icon" class="menu-icon" />
                <span v-if="!collapsed" class="menu-label">{{ item.label }}</span>
                <span v-if="!collapsed && item.badge" class="menu-badge">
                  {{ item.badge }}
                </span>
                <component v-if="!collapsed && item.children" :is="isExpanded(item.key) ? DownOutlined : RightOutlined"
                  class="expand-icon" />
              </div>
            </div>

            <!-- Submenu Items – only render when sidebar is NOT collapsed -->
            <transition v-if="!collapsed && item.children" name="submenu">
              <div v-if="isExpanded(item.key)" class="submenu-items">
                <div v-for="child in item.children" :key="child.key" class="submenu-item"
                  :class="{ active: selectedKey === child.key }" @click.stop="handleMenuClick(child.path)">
                  <div class="submenu-item-content">
                    <span class="submenu-dot"></span>
                    <span class="submenu-label">{{ child.label }}</span>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Updated sidebar to use CSS variables for theme support with teal color scheme */
.sidebar-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: linear-gradient(180deg,
      oklch(0.35 0.08 195) 0%,
      oklch(0.28 0.08 195) 100%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.logo-section {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.03);
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
}

.logo-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg,
      oklch(0.55 0.18 195) 0%,
      oklch(0.65 0.20 195) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px oklch(0.55 0.18 195 / 0.4);
  transition: all 0.3s ease;
}

.logo-circle:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 16px oklch(0.55 0.18 195 / 0.5);
}

.brand-info {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.2;
}

.search-section {
  padding: 16px;
  flex-shrink: 0;
}

.menu-search-input {
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.menu-search-input:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.2);
}

.menu-search-input:focus-within {
  background: rgba(255, 255, 255, 0.15);
  border-color: oklch(0.55 0.18 195);
  box-shadow: 0 0 0 3px oklch(0.55 0.18 195 / 0.15);
}

.menu-search-input :deep(.ant-input) {
  background: transparent;
  color: #ffffff;
  font-size: 13px;
}

.menu-search-input :deep(.ant-input::placeholder) {
  color: rgba(255, 255, 255, 0.5);
}

.search-icon {
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
}

.menu-section {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 0 16px;
}

.menu-section::-webkit-scrollbar {
  width: 5px;
}

.menu-section::-webkit-scrollbar-track {
  background: transparent;
}

.menu-section::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.menu-section::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}

.menu-group {
  margin-bottom: 20px;
}

.group-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.4);
  padding: 12px 24px 8px;
  margin-bottom: 4px;
}

.group-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 12px 20px;
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 0 12px;
}

.menu-item {
  position: relative;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.menu-item::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.05);
  opacity: 0;
  transition: opacity 0.25s ease;
  border-radius: 10px;
}

.menu-item-content {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 11px 14px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.25s ease;
  position: relative;
  z-index: 1;
}

.menu-icon {
  font-size: 19px;
  flex-shrink: 0;
  transition: all 0.25s ease;
  color: rgba(255, 255, 255, 0.75);
}

.menu-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

.menu-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: #ffffff;
  border-radius: 12px;
  min-width: 22px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.4);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.08);
  }
}

.expand-icon {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  transition: all 0.25s ease;
}

.menu-item:hover::before {
  opacity: 1;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(3px);
}

.menu-item:hover .menu-item-content {
  color: #ffffff;
}

.menu-item:hover .menu-icon {
  color: #ffffff;
  transform: scale(1.1);
}

.menu-item:hover .expand-icon {
  color: rgba(255, 255, 255, 0.8);
  transform: rotate(0deg);
}

/* Updated active state to use teal OKLCH colors */
.menu-item.active {
  background: linear-gradient(135deg,
      oklch(0.55 0.18 195 / 0.25) 0%,
      oklch(0.60 0.18 195 / 0.2) 100%);
  box-shadow: 0 4px 12px oklch(0.55 0.18 195 / 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid oklch(0.55 0.18 195 / 0.3);
}

.menu-item.active::after {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 60%;
  background: linear-gradient(180deg,
      oklch(0.55 0.18 195) 0%,
      oklch(0.65 0.20 195) 100%);
  border-radius: 0 4px 4px 0;
  box-shadow: 0 0 12px oklch(0.55 0.18 195 / 0.6);
}

.menu-item.active .menu-item-content {
  color: #ffffff;
  font-weight: 600;
}

.menu-item.active .menu-icon {
  color: oklch(0.75 0.15 195);
  transform: scale(1.15);
}

.submenu-items {
  padding-left: 28px;
  margin-top: 4px;
  margin-bottom: 4px;
}

.submenu-item {
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 2px;
  position: relative;
}

.submenu-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
}

.submenu-item-content {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px 9px 16px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.submenu-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
  transition: all 0.25s ease;
}

.submenu-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.submenu-item:hover {
  background: rgba(255, 255, 255, 0.06);
  transform: translateX(3px);
}

.submenu-item:hover::before {
  background: oklch(0.55 0.18 195);
  width: 3px;
}

.submenu-item:hover .submenu-item-content {
  color: #ffffff;
}

.submenu-item:hover .submenu-dot {
  background: oklch(0.55 0.18 195);
  transform: scale(1.4);
  box-shadow: 0 0 8px oklch(0.55 0.18 195 / 0.6);
}

/* Updated submenu active state with teal colors */
.submenu-item.active {
  background: oklch(0.55 0.18 195 / 0.15);
}

.submenu-item.active::before {
  background: linear-gradient(180deg,
      oklch(0.55 0.18 195) 0%,
      oklch(0.65 0.20 195) 100%);
  width: 3px;
  box-shadow: 0 0 8px oklch(0.75 0.15 195 / 0.5);
}

.submenu-item.active .submenu-item-content {
  color: #ffffff;
  font-weight: 600;
}

.submenu-item.active .submenu-dot {
  background: oklch(0.75 0.15 195);
  transform: scale(1.6);
  box-shadow: 0 0 10px oklch(0.75 0.15 195 / 0.8);
}

.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-8px);
}

.submenu-enter-to,
.submenu-leave-from {
  opacity: 1;
  max-height: 500px;
  transform: translateY(0);
}

.sidebar-container:has(.logo-section) .menu-items {
  padding: 0 8px;
}

.menu-item-content:has(.menu-icon:only-child) {
  justify-content: center;
  padding: 10px 8px;
}

.menu-item.has-children:hover .expand-icon {
  transform: translateX(2px);
}

.menu-item.has-children .expand-icon {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
