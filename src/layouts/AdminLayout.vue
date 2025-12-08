<script lang="ts" setup>
import { ref, computed } from 'vue'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  ShopOutlined,
  CreditCardOutlined,
  FileTextOutlined,
  SkinOutlined,
  GiftOutlined,
  StarOutlined,
  SearchOutlined,
  BellOutlined,
  SettingOutlined,
  CheckOutlined,
  CloseOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons-vue'

// State
const collapsed = ref(false)
const selectedKeys = ref(['dashboard'])
const openKeys = ref(['products', 'billing', 'content'])

// Store Switcher State
const stores = ref([
  { id: 1, name: 'Main Store', domain: 'mainstore.com', active: true },
  { id: 2, name: 'Fashion Hub', domain: 'fashionhub.com', active: false },
  { id: 3, name: 'Tech World', domain: 'techworld.com', active: false },
])
const currentStore = computed(() => stores.value.find((s) => s.active))
const storePopoverVisible = ref(false)

function selectStore(store) {
  stores.value.forEach((s) => (s.active = false))
  store.active = true
  storePopoverVisible.value = false
}

// Menu Search State
const menuSearchQuery = ref('')
const menuItems = [
  { key: 'dashboard', label: 'Dashboard', icon: 'DashboardOutlined' },
  { key: 'products-list', label: 'Products', icon: 'ShoppingOutlined', parent: 'Catalog' },
  { key: 'categories-list', label: 'Categories', icon: 'ShoppingOutlined', parent: 'Catalog' },
  { key: 'inventory-list', label: 'Inventory', icon: 'ShoppingOutlined', parent: 'Catalog' },
  { key: 'orders-list', label: 'Orders', icon: 'ShoppingCartOutlined' },
  { key: 'customers-list', label: 'Customers', icon: 'UserOutlined' },
  { key: 'reviews-list', label: 'Reviews', icon: 'StarOutlined' },
  { key: 'coupons-list', label: 'Coupons', icon: 'GiftOutlined' },
  { key: 'stores-list', label: 'My Stores', icon: 'ShopOutlined' },
  { key: 'pages-list', label: 'Pages', icon: 'FileTextOutlined', parent: 'Content' },
  { key: 'menus-list', label: 'Menus', icon: 'FileTextOutlined', parent: 'Content' },
  { key: 'themes-list', label: 'Themes', icon: 'SkinOutlined' },
  { key: 'subscription', label: 'Subscription', icon: 'CreditCardOutlined', parent: 'Billing' },
  { key: 'payments-list', label: 'Transactions', icon: 'CreditCardOutlined', parent: 'Billing' },
]
const filteredMenuItems = computed(() => {
  if (!menuSearchQuery.value) return []
  const query = menuSearchQuery.value.toLowerCase()
  return menuItems.filter(
    (item) =>
      item.label.toLowerCase().includes(query) ||
      (item.parent && item.parent.toLowerCase().includes(query)),
  )
})

function selectMenuItem(item) {
  selectedKeys.value = [item.key]
  menuSearchQuery.value = ''
}

// Global Search State
const globalSearchQuery = ref('')
const globalSearchVisible = ref(false)
const globalSearchResults = computed(() => {
  if (!globalSearchQuery.value) return { products: [], orders: [], customers: [], pages: [] }
  const query = globalSearchQuery.value.toLowerCase()
  return {
    products: [
      { id: 1, name: 'iPhone 15 Pro', sku: 'IPH-15-PRO' },
      { id: 2, name: 'Samsung Galaxy S24', sku: 'SAM-S24' },
      { id: 3, name: 'MacBook Air M3', sku: 'MAC-AIR-M3' },
    ].filter((p) => p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query)),
    orders: [
      { id: 'ORD-001', customer: 'John Doe', total: '$599.00' },
      { id: 'ORD-002', customer: 'Jane Smith', total: '$1,299.00' },
    ].filter((o) => o.id.toLowerCase().includes(query) || o.customer.toLowerCase().includes(query)),
    customers: [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    ].filter((c) => c.name.toLowerCase().includes(query) || c.email.toLowerCase().includes(query)),
    pages: [
      { id: 1, title: 'About Us', slug: '/about' },
      { id: 2, title: 'Contact', slug: '/contact' },
    ].filter((p) => p.title.toLowerCase().includes(query)),
  }
})
const hasGlobalResults = computed(() => {
  const r = globalSearchResults.value
  return r.products.length || r.orders.length || r.customers.length || r.pages.length
})

// Notifications State
const notificationVisible = ref(false)
const notifications = ref([
  {
    id: 1,
    type: 'success',
    title: 'Order Completed',
    message: 'Order #ORD-001 has been delivered successfully.',
    time: '5 min ago',
    read: false,
  },
  {
    id: 2,
    type: 'warning',
    title: 'Low Stock Alert',
    message: 'iPhone 15 Pro is running low on stock (5 left).',
    time: '15 min ago',
    read: false,
  },
  {
    id: 3,
    type: 'error',
    title: 'Payment Failed',
    message: 'Payment for Order #ORD-003 failed.',
    time: '1 hour ago',
    read: false,
  },
  {
    id: 4,
    type: 'info',
    title: 'New Customer',
    message: 'A new customer has registered on your store.',
    time: '2 hours ago',
    read: true,
  },
  {
    id: 5,
    type: 'success',
    title: 'Review Posted',
    message: 'New 5-star review on MacBook Air M3.',
    time: '3 hours ago',
    read: true,
  },
])
const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)

function markAsRead(notification) {
  notification.read = true
}

function markAllAsRead() {
  notifications.value.forEach((n) => (n.read = true))
}

function removeNotification(id) {
  const index = notifications.value.findIndex((n) => n.id === id)
  if (index > -1) notifications.value.splice(index, 1)
}

function getNotificationIcon(type) {
  switch (type) {
    case 'success':
      return CheckCircleOutlined
    case 'warning':
      return WarningOutlined
    case 'error':
      return CloseCircleOutlined
    default:
      return InfoCircleOutlined
  }
}

// User data (mock)
const user = ref({
  name: 'John Admin',
  email: 'john@admin.com',
  avatar: null,
})

function handleLogout() {
  console.log('Logging out...')
}

// Sidebar width
const sidebarWidth = computed(() => (collapsed.value ? 80 : 260))
</script>

<template>
  <a-layout class="admin-layout">
    <!-- Fixed Sidebar -->
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      :width="260"
      :collapsed-width="80"
      class="sidebar"
      theme="dark"
    >
      <!-- Logo -->
      <div class="logo">
        <div class="logo-icon">
          <ShopOutlined />
        </div>
        <transition name="fade">
          <span v-if="!collapsed" class="logo-text">Admin Panel</span>
        </transition>
      </div>

      <!-- Menu Search -->
      <div class="menu-search" v-if="!collapsed">
        <a-input placeholder="Search Menu" />
      </div>

      <!-- Navigation Menu -->
      <a-menu
        v-model:selectedKeys="selectedKeys"
        v-model:openKeys="openKeys"
        theme="dark"
        mode="inline"
        class="nav-menu"
      >
        <a-menu-item key="dashboard">
          <DashboardOutlined />
          <span>Dashboard</span>
        </a-menu-item>

        <a-sub-menu key="products">
          <template #title>
            <ShoppingOutlined />
            <span>Catalog</span>
          </template>
          <a-menu-item key="products-list">Products</a-menu-item>
          <a-menu-item key="categories-list">Categories</a-menu-item>
          <a-menu-item key="inventory-list">Inventory</a-menu-item>
        </a-sub-menu>

        <a-menu-item key="orders-list">
          <ShoppingCartOutlined />
          <span>Orders</span>
        </a-menu-item>

        <a-menu-item key="customers-list">
          <UserOutlined />
          <span>Customers</span>
        </a-menu-item>

        <a-menu-item key="reviews-list">
          <StarOutlined />
          <span>Reviews</span>
        </a-menu-item>

        <a-menu-item key="coupons-list">
          <GiftOutlined />
          <span>Coupons</span>
        </a-menu-item>

        <a-menu-item key="stores-list">
          <ShopOutlined />
          <span>My Stores</span>
        </a-menu-item>

        <a-sub-menu key="content">
          <template #title>
            <FileTextOutlined />
            <span>Content</span>
          </template>
          <a-menu-item key="pages-list">Pages</a-menu-item>
          <a-menu-item key="menus-list">Menus</a-menu-item>
        </a-sub-menu>

        <a-menu-item key="themes-list">
          <SkinOutlined />
          <span>Themes</span>
        </a-menu-item>

        <a-sub-menu key="billing">
          <template #title>
            <CreditCardOutlined />
            <span>Billing</span>
          </template>
          <a-menu-item key="subscription">Subscription</a-menu-item>
          <a-menu-item key="payments-list">Transactions</a-menu-item>
        </a-sub-menu>
      </a-menu>

      <!-- Collapse Toggle -->
      <div class="sidebar-footer">
        <a-button type="text" class="collapse-btn" @click="collapsed = !collapsed">
          <MenuUnfoldOutlined v-if="collapsed" />
          <MenuFoldOutlined v-else />
        </a-button>
      </div>
    </a-layout-sider>

    <!-- Main Layout -->
    <a-layout class="main-layout" :style="{ marginLeft: sidebarWidth + 'px' }">
      <!-- Header -->
      <a-layout-header class="header">
        <div class="header-left">
          <!-- Global Search -->
          <a-popover
            v-model:open="globalSearchVisible"
            placement="bottomLeft"
            trigger="click"
            :overlay-style="{ width: '480px' }"
          >
            <template #content>
              <div class="global-search-results">
                <template v-if="hasGlobalResults">
                  <!-- Products -->
                  <div v-if="globalSearchResults.products.length" class="result-section">
                    <div class="section-title">Products</div>
                    <div
                      v-for="product in globalSearchResults.products"
                      :key="product.id"
                      class="result-item"
                    >
                      <ShoppingOutlined class="result-icon" />
                      <div class="result-info">
                        <div class="result-name">{{ product.name }}</div>
                        <div class="result-meta">SKU: {{ product.sku }}</div>
                      </div>
                    </div>
                  </div>
                  <!-- Orders -->
                  <div v-if="globalSearchResults.orders.length" class="result-section">
                    <div class="section-title">Orders</div>
                    <div
                      v-for="order in globalSearchResults.orders"
                      :key="order.id"
                      class="result-item"
                    >
                      <ShoppingCartOutlined class="result-icon" />
                      <div class="result-info">
                        <div class="result-name">{{ order.id }}</div>
                        <div class="result-meta">{{ order.customer }} · {{ order.total }}</div>
                      </div>
                    </div>
                  </div>
                  <!-- Customers -->
                  <div v-if="globalSearchResults.customers.length" class="result-section">
                    <div class="section-title">Customers</div>
                    <div
                      v-for="customer in globalSearchResults.customers"
                      :key="customer.id"
                      class="result-item"
                    >
                      <UserOutlined class="result-icon" />
                      <div class="result-info">
                        <div class="result-name">{{ customer.name }}</div>
                        <div class="result-meta">{{ customer.email }}</div>
                      </div>
                    </div>
                  </div>
                  <!-- Pages -->
                  <div v-if="globalSearchResults.pages.length" class="result-section">
                    <div class="section-title">Pages</div>
                    <div
                      v-for="page in globalSearchResults.pages"
                      :key="page.id"
                      class="result-item"
                    >
                      <FileTextOutlined class="result-icon" />
                      <div class="result-info">
                        <div class="result-name">{{ page.title }}</div>
                        <div class="result-meta">{{ page.slug }}</div>
                      </div>
                    </div>
                  </div>
                </template>
                <div v-else-if="globalSearchQuery" class="no-results">
                  <SearchOutlined style="font-size: 24px; color: #bfbfbf; margin-bottom: 8px" />
                  <div>No results found for "{{ globalSearchQuery }}"</div>
                </div>
                <div v-else class="search-hint">
                  <SearchOutlined style="font-size: 24px; color: #bfbfbf; margin-bottom: 8px" />
                  <div>Search for products, orders, customers...</div>
                </div>
              </div>
            </template>
            <a-input
              v-model:value="globalSearchQuery"
              placeholder="Search everything..."
              style="width: 320px"
              allow-clear
              @focus="globalSearchVisible = true"
            >
              <template #prefix>
                <SearchOutlined />
              </template>
              <template #suffix>
                <a-tag size="small" color="default">⌘K</a-tag>
              </template>
            </a-input>
          </a-popover>
        </div>

        <div class="header-right">
          <!-- Store Switcher -->
          <a-popover v-model:open="storePopoverVisible" placement="bottomRight" trigger="click">
            <template #content>
              <div class="store-switcher-content">
                <div class="store-switcher-title">Switch Store</div>
                <div
                  v-for="store in stores"
                  :key="store.id"
                  class="store-item"
                  :class="{ active: store.active }"
                  @click="selectStore(store)"
                >
                  <div class="store-info">
                    <div class="store-name">{{ store.name }}</div>
                    <div class="store-domain">{{ store.domain }}</div>
                  </div>
                  <CheckOutlined v-if="store.active" class="check-icon" />
                </div>
                <a-divider style="margin: 12px 0" />
                <a-button type="dashed" block size="small">
                  <template #icon><ShopOutlined /></template>
                  Add New Store
                </a-button>
              </div>
            </template>
            <a-button type="text" class="store-btn">
              <ShopOutlined />
              <span class="store-name-text">{{ currentStore?.name }}</span>
            </a-button>
          </a-popover>

          <!-- Notifications -->
          <a-popover
            v-model:open="notificationVisible"
            placement="bottomRight"
            trigger="click"
            :overlay-style="{ width: '380px' }"
          >
            <template #content>
              <div class="notification-panel">
                <div class="notification-header">
                  <span class="notification-title">Notifications</span>
                  <a-button
                    type="link"
                    size="small"
                    @click="markAllAsRead"
                    :disabled="unreadCount === 0"
                  >
                    Mark all as read
                  </a-button>
                </div>
                <div class="notification-list">
                  <div
                    v-for="notification in notifications"
                    :key="notification.id"
                    class="notification-item"
                    :class="{ unread: !notification.read }"
                  >
                    <div class="notification-icon" :class="notification.type">
                      <component :is="getNotificationIcon(notification.type)" />
                    </div>
                    <div class="notification-content">
                      <div class="notification-item-title">{{ notification.title }}</div>
                      <div class="notification-message">{{ notification.message }}</div>
                      <div class="notification-time">{{ notification.time }}</div>
                    </div>
                    <div class="notification-actions">
                      <a-button
                        v-if="!notification.read"
                        type="text"
                        size="small"
                        @click.stop="markAsRead(notification)"
                      >
                        <CheckOutlined />
                      </a-button>
                      <a-button
                        type="text"
                        size="small"
                        danger
                        @click.stop="removeNotification(notification.id)"
                      >
                        <CloseOutlined />
                      </a-button>
                    </div>
                  </div>
                </div>
                <div class="notification-footer">
                  <a-button type="link" block>View All Notifications</a-button>
                </div>
              </div>
            </template>
            <a-badge :count="unreadCount" :offset="[-4, 4]">
              <a-button type="text" class="icon-btn">
                <BellOutlined style="font-size: 18px" />
              </a-button>
            </a-badge>
          </a-popover>

          <!-- User Profile Dropdown -->
          <a-dropdown placement="bottomRight">
            <a-button type="text" class="user-dropdown">
              <a-avatar :size="32" class="user-avatar">
                <template #icon><UserOutlined /></template>
              </a-avatar>
              <span class="user-name">{{ user.name }}</span>
            </a-button>
            <template #overlay>
              <a-menu>
                <div class="user-menu-header">
                  <a-avatar :size="48" class="user-avatar-large">
                    <template #icon><UserOutlined /></template>
                  </a-avatar>
                  <div class="user-menu-info">
                    <div class="user-menu-name">{{ user.name }}</div>
                    <div class="user-menu-email">{{ user.email }}</div>
                  </div>
                </div>
                <a-menu-divider />
                <a-menu-item key="profile">
                  <UserOutlined />
                  <span>My Profile</span>
                </a-menu-item>
                <a-menu-item key="settings">
                  <SettingOutlined />
                  <span>Settings</span>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" @click="handleLogout" danger>
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
        <div class="content-wrapper">
          <RouterView />
        </div>
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
  background: #f0f2f5;
}

/* Fixed Sidebar */
.sidebar {
  position: fixed !important;
  left: 0;
  top: 0;
  bottom: 0;
  height: 100vh;
  z-index: 100;
  /* background: linear-gradient(180deg, #001529 0%, #002140 100%); */
  background-color: #10ac84;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar :deep(.ant-layout-sider-children) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Logo */
.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* background: rgba(255, 255, 255, 0.95); */
  margin: 0;
  gap: 10px;
}

.logo-icon {
  font-size: 24px;
  color: #fff;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #001529;
  white-space: nowrap;
  color: #fff;
}

/* Menu Search */
.menu-search {
  padding: 12px 16px;
}

.menu-search :deep(.ant-input) {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
}

.menu-search :deep(.ant-input::placeholder) {
  color: rgba(255, 255, 255, 0.5);
}

.menu-search-results {
  max-height: 300px;
  overflow-y: auto;
}

.menu-search-item {
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background 0.2s;
}

.menu-search-item:hover {
  background: #f5f5f5;
}

/* Navigation Menu */
.nav-menu {
  flex: 1;
  overflow-y: auto;
  background: transparent !important;
  border-right: none;
  padding: 0 8px;
}

.nav-menu :deep(.ant-menu-item) {
  margin: 4px 0;
  /* border-radius: 8px; */
  height: 44px;
  line-height: 44px;
}

/* .nav-menu :deep(.ant-menu-item-selected) {
  background: linear-gradient(90deg, #1890ff 0%, #096dd9 100%) !important;
} */

.nav-menu :deep(.ant-menu-submenu-title) {
  margin: 4px 0;
  /* border-radius: 8px; */
  height: 44px;
  line-height: 44px;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.collapse-btn {
  width: 100%;
  color: rgba(255, 255, 255, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
}

.collapse-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

/* Main Layout */
.main-layout {
  transition: margin-left 0.2s;
  min-height: 100vh;
}

/* Header */
.header {
  background: #10ac84;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 99;
  height: 64px;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Store Switcher */
.store-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 12px;
  /* border-radius: 8px; */
  color: #fff;
}

.store-btn:hover {
  background: #f5f5f5;
}

.store-name-text {
  font-weight: 500;
}

.store-switcher-content {
  width: 260px;
}

.store-switcher-title {
  font-weight: 600;
  margin-bottom: 12px;
  color: #262626;
}

.store-item {
  padding: 10px 12px;
  /* border-radius: 8px; */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background 0.2s;
  margin-bottom: 4px;
}

.store-item:hover {
  background: #f5f5f5;
}

.store-item.active {
  background: #e6f7ff;
  border: 1px solid #91d5ff;
}

.store-info .store-name {
  font-weight: 500;
  color: #262626;
}

.store-info .store-domain {
  font-size: 12px;
  color: #8c8c8c;
}

.check-icon {
  color: #1890ff;
}

/* Icon Button */
.icon-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #fff;
}

.icon-btn:hover {
  background: #f5f5f5;
}

/* Notification Panel */
.notification-panel {
  margin: -12px -16px;
}

.notification-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.notification-title {
  font-weight: 600;
  font-size: 15px;
}

.notification-list {
  max-height: 360px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;
}

.notification-item:hover {
  background: #fafafa;
}

.notification-item.unread {
  background: #f6ffed;
}

.notification-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification-icon.success {
  background: #f6ffed;
  color: #52c41a;
}

.notification-icon.warning {
  background: #fffbe6;
  color: #faad14;
}

.notification-icon.error {
  background: #fff2f0;
  color: #ff4d4f;
}

.notification-icon.info {
  background: #e6f7ff;
  color: #1890ff;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-item-title {
  font-weight: 500;
  color: #262626;
  margin-bottom: 2px;
}

.notification-message {
  font-size: 13px;
  color: #595959;
  line-height: 1.4;
}

.notification-time {
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 4px;
}

.notification-actions {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.notification-footer {
  padding: 8px 16px;
  border-top: 1px solid #f0f0f0;
}

/* User Dropdown */
.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 12px;
  border-radius: 8px;
}

.user-dropdown:hover {
  background: #f5f5f5;
}

.user-avatar {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
}

.user-name {
  font-weight: 500;
  color: #262626;
}

.user-menu-header {
  display: flex;
  gap: 12px;
  padding: 16px;
  align-items: center;
}

.user-avatar-large {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
}

.user-menu-name {
  font-weight: 600;
  color: #262626;
}

.user-menu-email {
  font-size: 12px;
  color: #8c8c8c;
}

/* Global Search Results */
.global-search-results {
  max-height: 400px;
  overflow-y: auto;
}

.result-section {
  margin-bottom: 16px;
}

.result-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 12px;
  font-weight: 600;
  color: #8c8c8c;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.result-item:hover {
  background: #f5f5f5;
}

.result-icon {
  color: #8c8c8c;
  font-size: 16px;
}

.result-name {
  font-weight: 500;
  color: #262626;
}

.result-meta {
  font-size: 12px;
  color: #8c8c8c;
}

.no-results,
.search-hint {
  padding: 24px;
  text-align: center;
  color: #8c8c8c;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Content */
.content {
  margin: 24px;
  min-height: calc(100vh - 64px - 70px - 48px);
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

/* Footer */
.footer {
  text-align: center;
  background: transparent;
  color: #8c8c8c;
  padding: 16px 24px;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
