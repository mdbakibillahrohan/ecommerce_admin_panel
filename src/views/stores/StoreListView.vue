<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ShopOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  ShoppingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  FileTextOutlined,
  StarOutlined
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'

const router = useRouter()
const loading = ref(false)
const searchText = ref('')
const selectedZone = ref('All Zones')
const selectedStatus = ref('all')

interface Store {
  id: number
  name: string
  slug: string
  logo: string
  owner: string
  email: string
  phone: string
  zone: string
  featured: boolean
  status: boolean
  createdAt: string
  totalTransactions: number
  commission: number
  lastActivity: string
}

const stores = ref<Store[]>([
  {
    id: 1,
    name: 'Country Fair',
    slug: 'country-fair',
    logo: '🏪',
    owner: 'John Doe',
    email: 'john@countryfair.com',
    phone: '+1234567890',
    zone: 'Main Demo Zone',
    featured: false,
    status: false,
    createdAt: '2024-01-15',
    totalTransactions: 234,
    commission: 456.78,
    lastActivity: '2 hours ago'
  },
  {
    id: 2,
    name: 'Supermarket',
    slug: 'supermarket',
    logo: '🛒',
    owner: 'Jane Smith',
    email: 'jane@supermarket.com',
    phone: '+1234567891',
    zone: 'Main Demo Zone',
    featured: true,
    status: true,
    createdAt: '2024-01-10',
    totalTransactions: 567,
    commission: 1234.56,
    lastActivity: '30 minutes ago'
  },
  {
    id: 3,
    name: 'Fast Market',
    slug: 'fast-market',
    logo: '⚡',
    owner: 'Bob Johnson',
    email: 'bob@fastmarket.com',
    phone: '+1234567892',
    zone: 'Main Demo Zone',
    featured: false,
    status: true,
    createdAt: '2024-01-08',
    totalTransactions: 345,
    commission: 789.12,
    lastActivity: '1 hour ago'
  },
  {
    id: 4,
    name: 'Fresh Groceries',
    slug: 'fresh-groceries',
    logo: '🥬',
    owner: 'Alice Williams',
    email: 'alice@freshgroceries.com',
    phone: '+1234567893',
    zone: 'North Zone',
    featured: true,
    status: true,
    createdAt: '2024-01-05',
    totalTransactions: 678,
    commission: 1567.89,
    lastActivity: '15 minutes ago'
  },
  {
    id: 5,
    name: 'City Mart',
    slug: 'city-mart',
    logo: '🏙️',
    owner: 'Charlie Brown',
    email: 'charlie@citymart.com',
    phone: '+1234567894',
    zone: 'South Zone',
    featured: false,
    status: true,
    createdAt: '2024-01-12',
    totalTransactions: 123,
    commission: 234.56,
    lastActivity: '3 hours ago'
  },
  {
    id: 6,
    name: 'Organic Store',
    slug: 'organic-store',
    logo: '🌿',
    owner: 'Diana Prince',
    email: 'diana@organicstore.com',
    phone: '+1234567895',
    zone: 'East Zone',
    featured: true,
    status: true,
    createdAt: '2024-01-03',
    totalTransactions: 890,
    commission: 2345.67,
    lastActivity: '20 minutes ago'
  },
  {
    id: 7,
    name: 'Night Market',
    slug: 'night-market',
    logo: '🌙',
    owner: 'Edward Norton',
    email: 'edward@nightmarket.com',
    phone: '+1234567896',
    zone: 'West Zone',
    featured: false,
    status: false,
    createdAt: '2024-01-18',
    totalTransactions: 45,
    commission: 89.12,
    lastActivity: '1 day ago'
  },
  {
    id: 8,
    name: 'Corner Shop',
    slug: 'corner-shop',
    logo: '🏘️',
    owner: 'Fiona Green',
    email: 'fiona@cornershop.com',
    phone: '+1234567897',
    zone: 'Main Demo Zone',
    featured: false,
    status: true,
    createdAt: '2024-01-14',
    totalTransactions: 456,
    commission: 890.45,
    lastActivity: '45 minutes ago'
  },
  {
    id: 9,
    name: 'Mega Store',
    slug: 'mega-store',
    logo: '🏬',
    owner: 'George Harris',
    email: 'george@megastore.com',
    phone: '+1234567898',
    zone: 'North Zone',
    featured: true,
    status: true,
    createdAt: '2024-01-01',
    totalTransactions: 1234,
    commission: 3456.78,
    lastActivity: '10 minutes ago'
  },
  {
    id: 10,
    name: 'Local Market',
    slug: 'local-market',
    logo: '🏠',
    owner: 'Helen Clark',
    email: 'helen@localmarket.com',
    phone: '+1234567899',
    zone: 'South Zone',
    featured: false,
    status: true,
    createdAt: '2024-01-11',
    totalTransactions: 234,
    commission: 456.78,
    lastActivity: '2 hours ago'
  },
  {
    id: 11,
    name: 'Premium Grocery',
    slug: 'premium-grocery',
    logo: '💎',
    owner: 'Ian Wright',
    email: 'ian@premiumgrocery.com',
    phone: '+1234567800',
    zone: 'East Zone',
    featured: true,
    status: true,
    createdAt: '2024-01-02',
    totalTransactions: 789,
    commission: 1890.12,
    lastActivity: '25 minutes ago'
  },
  {
    id: 12,
    name: 'Budget Shop',
    slug: 'budget-shop',
    logo: '💰',
    owner: 'Julia Roberts',
    email: 'julia@budgetshop.com',
    phone: '+1234567801',
    zone: 'West Zone',
    featured: false,
    status: true,
    createdAt: '2024-01-09',
    totalTransactions: 345,
    commission: 567.89,
    lastActivity: '1 hour ago'
  },
  {
    id: 13,
    name: 'Express Store',
    slug: 'express-store',
    logo: '🚀',
    owner: 'Kevin Lee',
    email: 'kevin@expressstore.com',
    phone: '+1234567802',
    zone: 'Main Demo Zone',
    featured: false,
    status: true,
    createdAt: '2024-01-07',
    totalTransactions: 567,
    commission: 1123.45,
    lastActivity: '35 minutes ago'
  },
  {
    id: 14,
    name: 'Family Mart',
    slug: 'family-mart',
    logo: '👨‍👩‍👧‍👦',
    owner: 'Laura Martinez',
    email: 'laura@familymart.com',
    phone: '+1234567803',
    zone: 'North Zone',
    featured: false,
    status: false,
    createdAt: '2024-01-20',
    totalTransactions: 23,
    commission: 45.67,
    lastActivity: '2 days ago'
  },
  {
    id: 15,
    name: 'Elite Shopping',
    slug: 'elite-shopping',
    logo: '👑',
    owner: 'Michael Anderson',
    email: 'michael@eliteshopping.com',
    phone: '+1234567804',
    zone: 'South Zone',
    featured: true,
    status: true,
    createdAt: '2024-01-04',
    totalTransactions: 901,
    commission: 2234.56,
    lastActivity: '5 minutes ago'
  }
])

const zones = ['All Zones', 'Main Demo Zone', 'North Zone', 'South Zone', 'East Zone', 'West Zone']

// Statistics
const totalStores = computed(() => stores.value.length)
const activeStores = computed(() => stores.value.filter(s => s.status).length)
const inactiveStores = computed(() => stores.value.filter(s => !s.status).length)
const newlyJoinedStores = computed(() => {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  return stores.value.filter(s => new Date(s.createdAt) > oneWeekAgo).length
})

const totalTransactions = computed(() =>
  stores.value.reduce((sum, store) => sum + store.totalTransactions, 0)
)

const totalCommission = computed(() =>
  stores.value.reduce((sum, store) => sum + store.commission, 0)
)

const totalWithdrawals = computed(() => 3500.00) // Mock data

// Filtered stores
const filteredStores = computed(() => {
  return stores.value.filter(store => {
    const matchesSearch = !searchText.value ||
      store.name.toLowerCase().includes(searchText.value.toLowerCase()) ||
      store.owner.toLowerCase().includes(searchText.value.toLowerCase())

    const matchesZone = selectedZone.value === 'All Zones' || store.zone === selectedZone.value

    const matchesStatus = selectedStatus.value === 'all' ||
      (selectedStatus.value === 'active' && store.status) ||
      (selectedStatus.value === 'inactive' && !store.status)

    return matchesSearch && matchesZone && matchesStatus
  })
})

// Table columns
const columns = [
  {
    title: 'SI',
    dataIndex: 'id',
    key: 'id',
    width: 60,
    align: 'center'
  },
  {
    title: 'Store Information',
    key: 'storeInfo',
    width: 250
  },
  {
    title: 'Owner Information',
    key: 'ownerInfo',
    width: 220
  },
  {
    title: 'Zone',
    dataIndex: 'zone',
    key: 'zone',
    width: 180
  },
  {
    title: 'Featured',
    key: 'featured',
    width: 100,
    align: 'center'
  },
  {
    title: 'Status',
    key: 'status',
    width: 100,
    align: 'center'
  },
  {
    title: 'Action',
    key: 'action',
    width: 150,
    align: 'center',
    fixed: 'right'
  }
]

// Actions
const handleView = (store: Store) => {
  message.info(`Viewing store: ${store.name}`)
  // router.push(`/stores/${store.id}`)
}

const handleEdit = (store: Store) => {
  message.info(`Editing store: ${store.name}`)
  // router.push(`/stores/${store.id}/edit`)
}

const handleDelete = (store: Store) => {
  Modal.confirm({
    title: 'Delete Store',
    content: `Are you sure you want to delete "${store.name}"? This action cannot be undone.`,
    okText: 'Delete',
    okType: 'danger',
    cancelText: 'Cancel',
    onOk() {
      const index = stores.value.findIndex(s => s.id === store.id)
      if (index > -1) {
        stores.value.splice(index, 1)
        message.success(`Store "${store.name}" has been deleted`)
      }
    }
  })
}

const toggleFeatured = (store: Store) => {
  store.featured = !store.featured
  message.success(`Store ${store.featured ? 'featured' : 'unfeatured'} successfully`)
}

const toggleStatus = (store: Store) => {
  store.status = !store.status
  message.success(`Store ${store.status ? 'activated' : 'deactivated'} successfully`)
}

const handleExport = () => {
  message.success('Export functionality will be implemented')
}

const handleAddStore = () => {
  router.push('/stores/create')
}

onMounted(() => {
  // Load data
})
</script>

<template>
  <div class="stores-list-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-icon">
          <shop-outlined />
        </div>
        <div class="header-text">
          <h1>Stores</h1>
          <span class="store-count">{{ totalStores }}</span>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-container">
      <div class="stat-card total">
        <div class="stat-icon">
          <shopping-outlined />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ totalStores }}</div>
          <div class="stat-label">Total stores</div>
        </div>
      </div>

      <div class="stat-card active">
        <div class="stat-icon">
          <check-circle-outlined />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ activeStores }}</div>
          <div class="stat-label">Active stores</div>
        </div>
      </div>

      <div class="stat-card inactive">
        <div class="stat-icon">
          <close-circle-outlined />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ inactiveStores }}</div>
          <div class="stat-label">Inactive stores</div>
        </div>
      </div>

      <div class="stat-card new">
        <div class="stat-icon">
          <clock-circle-outlined />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ newlyJoinedStores }}</div>
          <div class="stat-label">Newly joined stores</div>
        </div>
      </div>
    </div>

    <!-- Financial Summary -->
    <div class="financial-summary">
      <div class="financial-item">
        <file-text-outlined class="financial-icon" />
        <span class="financial-label">TOTAL TRANSACTIONS</span>
        <span class="financial-value">{{ totalTransactions }}</span>
      </div>

      <div class="divider-vertical"></div>

      <div class="financial-item success">
        <dollar-outlined class="financial-icon" />
        <span class="financial-label">COMMISSION EARNED</span>
        <span class="financial-value">${{ totalCommission.toFixed(2) }}</span>
      </div>

      <div class="divider-vertical"></div>

      <div class="financial-item danger">
        <file-text-outlined class="financial-icon" />
        <span class="financial-label">TOTAL STORE WITHDRAWALS</span>
        <span class="financial-value">${{ totalWithdrawals.toFixed(2) }}</span>
      </div>
    </div>

    <!-- Filters and Actions -->
    <div class="content-card">
      <div class="table-header">
        <h2 class="table-title">Stores List</h2>
        <div class="table-actions">
          <a-select v-model:value="selectedZone" class="zone-filter">
            <a-select-option v-for="zone in zones" :key="zone" :value="zone">
              {{ zone }}
            </a-select-option>
          </a-select>

          <a-input v-model:value="searchText" placeholder="Ex : Search Store Name" class="search-input" allow-clear>
            <template #prefix>
              <search-outlined />
            </template>
          </a-input>

          <a-button @click="handleExport" class="export-btn">
            <template #icon>
              <export-outlined />
            </template>
            Export
          </a-button>
        </div>
      </div>

      <!-- Table -->
      <div class="table-container">
        <a-table :columns="columns" :data-source="filteredStores"
          :pagination="{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Total ${total} stores` }"
          :loading="loading" row-key="id" :scroll="{ x: 1200 }">
          <!-- Store Information -->
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'storeInfo'">
              <div class="store-info">
                <div class="store-logo">{{ record.logo }}</div>
                <div class="store-details">
                  <div class="store-name">{{ record.name }}</div>
                  <div class="store-id">Id:{{ record.id }}</div>
                </div>
              </div>
            </template>

            <!-- Owner Information -->
            <template v-if="column.key === 'ownerInfo'">
              <div class="owner-info">
                <div class="owner-name">{{ record.owner }}</div>
                <div class="owner-contact">{{ record.email }}</div>
              </div>
            </template>

            <!-- Featured Toggle -->
            <template v-if="column.key === 'featured'">
              <a-switch :checked="record.featured" @change="toggleFeatured(record)" size="small" />
            </template>

            <!-- Status Toggle -->
            <template v-if="column.key === 'status'">
              <a-switch :checked="record.status" @change="toggleStatus(record)" size="small" />
            </template>

            <!-- Actions -->
            <template v-if="column.key === 'action'">
              <div class="action-buttons">
                <a-tooltip title="View">
                  <a-button type="text" class="action-btn view-btn" @click="handleView(record)">
                    <eye-outlined />
                  </a-button>
                </a-tooltip>

                <a-tooltip title="Edit">
                  <a-button type="text" class="action-btn edit-btn" @click="handleEdit(record)">
                    <edit-outlined />
                  </a-button>
                </a-tooltip>

                <a-tooltip title="Delete">
                  <a-button type="text" class="action-btn delete-btn" @click="handleDelete(record)">
                    <delete-outlined />
                  </a-button>
                </a-tooltip>
              </div>
            </template>
          </template>
        </a-table>
      </div>
    </div>

    <!-- Floating Add Button -->
    <a-button type="primary" class="floating-add-btn" @click="handleAddStore">
      <template #icon>
        <plus-outlined />
      </template>
    </a-button>
  </div>
</template>

<style scoped>
.stores-list-page {
  background: #f5f5f5;
  min-height: 100vh;
  position: relative;
}

/* Page Header */
.page-header {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #ffffff;
}

.header-text {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-text h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.store-count {
  background: #f0f0f0;
  color: #595959;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

/* Statistics Cards */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

.stat-card.total::before {
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
}

.stat-card.active::before {
  background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
}

.stat-card.inactive::before {
  background: linear-gradient(90deg, #fa709a 0%, #fee140 100%);
}

.stat-card.new::before {
  background: linear-gradient(90deg, #fccb90 0%, #d57eeb 100%);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  background: #f5f5f5;
  color: #595959;
}

.stat-card.total .stat-icon {
  background: #e6f7ff;
  color: #1890ff;
}

.stat-card.active .stat-icon {
  background: #f6ffed;
  color: #52c41a;
}

.stat-card.inactive .stat-icon {
  background: #fff2e8;
  color: #fa8c16;
}

.stat-card.new .stat-icon {
  background: #fff1f0;
  color: #f5222d;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #8c8c8c;
  font-weight: 500;
}

/* Financial Summary */
.financial-summary {
  background: #ffffff;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.financial-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.financial-icon {
  font-size: 20px;
  color: #595959;
}

.financial-item.success .financial-icon {
  color: #52c41a;
}

.financial-item.danger .financial-icon {
  color: #f5222d;
}

.financial-label {
  font-size: 12px;
  color: #8c8c8c;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-right: 8px;
}

.financial-value {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
}

.financial-item.success .financial-value {
  color: #52c41a;
}

.financial-item.danger .financial-value {
  color: #f5222d;
}

.divider-vertical {
  width: 1px;
  height: 40px;
  background: #e8e8e8;
}

/* Content Card */
.content-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 20px;
  flex-wrap: wrap;
}

.table-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.table-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.zone-filter {
  min-width: 180px;
}

.search-input {
  min-width: 250px;
}

.export-btn {
  border-color: #52c41a;
  color: #52c41a;
}

.export-btn:hover {
  background: #52c41a;
  color: #ffffff;
  border-color: #52c41a;
}

/* Table Container */
.table-container {
  overflow-x: auto;
}

/* Store Info */
.store-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.store-logo {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.store-details {
  flex: 1;
}

.store-name {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.store-id {
  font-size: 13px;
  color: #8c8c8c;
}

/* Owner Info */
.owner-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.owner-name {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
}

.owner-contact {
  font-size: 13px;
  color: #8c8c8c;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.view-btn {
  color: #1890ff;
  background: #e6f7ff;
  border: 1px solid #91d5ff;
}

.view-btn:hover {
  background: #1890ff;
  color: #ffffff;
  border-color: #1890ff;
}

.edit-btn {
  color: #52c41a;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
}

.edit-btn:hover {
  background: #52c41a;
  color: #ffffff;
  border-color: #52c41a;
}

.delete-btn {
  color: #f5222d;
  background: #fff1f0;
  border: 1px solid #ffa39e;
}

.delete-btn:hover {
  background: #f5222d;
  color: #ffffff;
  border-color: #f5222d;
}

/* Floating Add Button */
.floating-add-btn {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
  z-index: 999;
  transition: all 0.3s ease;
}

.floating-add-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(24, 144, 255, 0.5);
}

/* Responsive */
@media (max-width: 768px) {
  .stores-list-page {
    padding: 16px;
  }

  .stats-container {
    grid-template-columns: 1fr;
  }

  .financial-summary {
    flex-direction: column;
    gap: 16px;
  }

  .divider-vertical {
    width: 100%;
    height: 1px;
  }

  .table-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .table-actions {
    width: 100%;
    flex-direction: column;
  }

  .zone-filter,
  .search-input {
    width: 100%;
  }
}

/* Ant Design Table Customization */
:deep(.ant-table) {
  font-size: 14px;
}

:deep(.ant-table-thead > tr > th) {
  background: #fafafa;
  color: #595959;
  font-weight: 600;
  border-bottom: 2px solid #e8e8e8;
}

:deep(.ant-table-tbody > tr:hover > td) {
  background: #f5f5f5;
}

:deep(.ant-table-tbody > tr > td) {
  border-bottom: 1px solid #f0f0f0;
}

:deep(.ant-switch-checked) {
  background: #52c41a;
}
</style>
