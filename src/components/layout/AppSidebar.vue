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
  // MenuOutlined,
  // WalletOutlined,
  // TransactionOutlined,
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
        path: '/orders',
        badge: 12,
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
    ],
  },
  {
    key: 'promotion',
    label: 'Promotion Management',
    items: [
      {
        key: 'campaigns',
        icon: CodepenOutlined,
        label: 'Campaigns',
        path: '/campaigns',
        children: [
          { key: 'basic-campaigns', label: 'Basic Campaigns', path: '/campaigns' },
          { key: 'item-campaigns', label: 'Item Campaigns', path: '/coupons' },
          { key: 'coupon-campaigns', label: 'Coupon Campaigns', path: '/coupons' },
        ],
      },
      {
        key: 'banner',
        icon: BookOutlined,
        label: 'Banner',
        path: '/banner',
      },
      {
        key: 'advertisement',
        icon: CloudOutlined,
        label: 'Advertisement',
        path: '/advertisement',
      }
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
    ],
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
        key: 'content',
        icon: FileTextOutlined,
        label: 'Content',
        path: '/content',
        children: [
          { key: 'pages', label: 'Pages', path: '/content/pages' },
          { key: 'menus', label: 'Menus', path: '/content/menus' },
          { key: 'blog', label: 'Blog Posts', path: '/content/blog' },
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
        path: '/billing',
        children: [
          { key: 'subscription', label: 'Subscription', path: '/billing/subscription' },
          { key: 'payments', label: 'Transactions', path: '/billing/payments' },
          { key: 'invoices', label: 'Invoices', path: '/billing/invoices' },
        ],
      },
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
        <a-image :preview="false" :width="collapsed ? 40 : 100" src="/images/logo.png" />
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

<!-- Your original <style scoped> remains 100% unchanged -->
<style scoped>
.sidebar-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f9fafb;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:global(.dark) .sidebar-container {
  background: #1a1d23;
}

/* Logo Section */
.logo-section {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
  transition: border-color 0.3s ease;
}

:global(.dark) .logo-section {
  border-bottom-color: #2d3139;
}

.logo-wrapper {
  transition: all 0.3s ease;
}

/* Search Section */
.search-section {
  padding: 16px;
  flex-shrink: 0;
}

.menu-search-input {
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #d1d5db;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.menu-search-input:hover {
  border-color: #9ca3af;
}

.menu-search-input:focus-within {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

:global(.dark) .menu-search-input {
  background: #2d3139;
  border-color: #3d4148;
}

:global(.dark) .menu-search-input :deep(.ant-input) {
  background: transparent;
  color: #f3f4f6;
}

:global(.dark) .menu-search-input :deep(.ant-input::placeholder) {
  color: #6b7280;
}

.search-icon {
  color: #9ca3af;
  font-size: 16px;
}

/* Menu Section */
.menu-section {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 0;
}

.menu-section::-webkit-scrollbar {
  width: 6px;
}

.menu-section::-webkit-scrollbar-track {
  background: transparent;
}

.menu-section::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

:global(.dark) .menu-section::-webkit-scrollbar-thumb {
  background: #3d4148;
}

/* Menu Group */
.menu-group {
  margin-bottom: 24px;
}

.group-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #6b7280;
  padding: 8px 20px;
  margin-bottom: 4px;
  transition: color 0.3s ease;
}

:global(.dark) .group-label {
  color: #6b7280;
}

.group-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 8px 16px;
}

:global(.dark) .group-divider {
  background: #2d3139;
}

/* Menu Items */
.menu-items {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 12px;
}

.menu-item {
  position: relative;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-item-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  color: #4b5563;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

:global(.dark) .menu-item-content {
  color: #9ca3af;
}

.menu-icon {
  font-size: 18px;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.menu-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  background: #ef4444;
  color: #ffffff;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

.expand-icon {
  font-size: 10px;
  color: #9ca3af;
  transition: all 0.2s ease;
}

/* Hover State */
.menu-item:hover {
  background: #f3f4f6;
}

:global(.dark) .menu-item:hover {
  background: #2d3139;
}

.menu-item:hover .menu-item-content {
  color: #1f2937;
}

:global(.dark) .menu-item:hover .menu-item-content {
  color: #f3f4f6;
}

/* Active State */
.menu-item.active {
  background: #ffffff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

:global(.dark) .menu-item.active {
  background: #2d3139;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);
}

.menu-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 0 2px 2px 0;
}

.menu-item.active .menu-item-content {
  color: #1f2937;
  font-weight: 600;
}

:global(.dark) .menu-item.active .menu-item-content {
  color: #f3f4f6;
}

.menu-item.active .menu-icon {
  color: #6366f1;
}

/* Submenu Items */
.submenu-items {
  padding-left: 24px;
  margin-top: 2px;
  margin-bottom: 2px;
}

.submenu-item {
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 2px;
}

.submenu-item-content {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px 8px 20px;
  color: #6b7280;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s ease;
}

:global(.dark) .submenu-item-content {
  color: #9ca3af;
}

.submenu-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #d1d5db;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

:global(.dark) .submenu-dot {
  background: #6b7280;
}

.submenu-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Submenu Hover State */
.submenu-item:hover {
  background: #f3f4f6;
}

:global(.dark) .submenu-item:hover {
  background: #2d3139;
}

.submenu-item:hover .submenu-item-content {
  color: #1f2937;
}

:global(.dark) .submenu-item:hover .submenu-item-content {
  color: #f3f4f6;
}

.submenu-item:hover .submenu-dot {
  background: #6366f1;
  transform: scale(1.3);
}

/* Submenu Active State */
.submenu-item.active {
  background: #ffffff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

:global(.dark) .submenu-item.active {
  background: #2d3139;
}

.submenu-item.active .submenu-item-content {
  color: #1f2937;
  font-weight: 600;
}

:global(.dark) .submenu-item.active .submenu-item-content {
  color: #f3f4f6;
}

.submenu-item.active .submenu-dot {
  background: #6366f1;
  transform: scale(1.5);
}

/* Submenu Animation */
.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.submenu-enter-to,
.submenu-leave-from {
  opacity: 1;
  max-height: 500px;
  transform: translateY(0);
}

/* Collapsed State */
.sidebar-container:has(.logo-section) .menu-items {
  padding: 0 8px;
}

.menu-item-content:has(.menu-icon:only-child) {
  justify-content: center;
  padding: 10px 8px;
}
</style>
