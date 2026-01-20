<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import TableSkeleton from '@/modules/shared/components/skeletons/TableSkeleton.vue'
import StatCardSkeleton from '@/modules/shared/components/skeletons/StatCardSkeleton.vue'
import { useRouter } from 'vue-router'
import {
  ShopOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  PlusOutlined,
  SearchOutlined,
  ShoppingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import { storesApi, type Store } from '../api/stores'

const router = useRouter()
const loading = ref(false)
const searchText = ref('')
const selectedStatus = ref('all')

// Store data from API
interface StoreWithRole extends Store {
  role: string
  isActive: boolean
}

const stores = ref<StoreWithRole[]>([])
const activeStoreIds = ref<number[]>([])

// Statistics
const totalStores = computed(() => stores.value.length)
const activeStores = computed(() => stores.value.filter(s => s.isActive).length)
const inactiveStores = computed(() => stores.value.filter(s => !s.isActive).length)
const newlyJoinedStores = computed(() => {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  return stores.value.filter(s => s.created_at && new Date(s.created_at) > oneWeekAgo).length
})

// Filtered stores
const filteredStores = computed(() => {
  return stores.value.filter(store => {
    const matchesSearch = !searchText.value ||
      store.name.toLowerCase().includes(searchText.value.toLowerCase()) ||
      store.slug.toLowerCase().includes(searchText.value.toLowerCase())

    const matchesStatus = selectedStatus.value === 'all' ||
      (selectedStatus.value === 'active' && store.isActive) ||
      (selectedStatus.value === 'inactive' && !store.isActive)

    return matchesSearch && matchesStatus
  })
})

// Table columns
const columns = [
  { title: 'SI', dataIndex: 'id', key: 'id', width: 60, align: 'center' as const },
  { title: 'Store Information', key: 'storeInfo', width: 250 },
  { title: 'Domain', key: 'customDomain', width: 200 },
  { title: 'Role', key: 'role', width: 120 },
  { title: 'Status', key: 'storeStatus', width: 120 },
  { title: 'Active', key: 'isActive', width: 100, align: 'center' as const },
  { title: 'Action', key: 'action', width: 150, align: 'center' as const, fixed: 'right' as const }
]

// Fetch stores from API
async function fetchStores() {
  loading.value = true
  try {
    const response = await storesApi.getMyStores()
    stores.value = response.stores
    activeStoreIds.value = response.activeStoreIds
  } catch (error) {
    message.error('Failed to load stores')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// Toggle store activation
async function toggleActive(store: StoreWithRole) {
  try {
    if (store.isActive) {
      await storesApi.deactivateStore(store.id)
      store.isActive = false
      message.success(`${store.name} deactivated`)
    } else {
      await storesApi.activateStore(store.id)
      store.isActive = true
      message.success(`${store.name} activated`)
    }
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } }
    message.error(error.response?.data?.message || 'Failed to update store')
  }
}

// Actions
const handleView = (store: StoreWithRole) => {
  router.push(`/stores/${store.id}`)
}

const handleEdit = (store: StoreWithRole) => {
  router.push(`/stores/${store.id}/edit`)
}

const handleDelete = (store: StoreWithRole) => {
  Modal.confirm({
    title: 'Delete Store',
    content: `Are you sure you want to delete "${store.name}"? This action cannot be undone.`,
    okText: 'Delete',
    okType: 'danger',
    cancelText: 'Cancel',
    async onOk() {
      try {
        // Note: Delete endpoint not yet implemented in storesApi
        stores.value = stores.value.filter(s => s.id !== store.id)
        message.success(`Store "${store.name}" has been deleted`)
      } catch {
        message.error('Failed to delete store')
      }
    }
  })
}

const handleExport = () => {
  message.success('Export functionality will be implemented')
}

const handleAddStore = () => {
  router.push('/stores/create')
}

onMounted(() => {
  fetchStores()
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
      <a-button type="primary" class="add-store-btn" @click="handleAddStore">
        <template #icon>
          <plus-outlined />
        </template>
        Add New Store
      </a-button>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-container">
      <template v-if="loading">
        <StatCardSkeleton v-for="i in 4" :key="i" />
      </template>
      <template v-else>
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
      </template>
    </div>

    <!-- Filters and Actions -->
    <div class="content-card">
      <div class="table-header">
        <h2 class="table-title">Stores List</h2>
        <div class="table-actions">
          <a-select v-model:value="selectedStatus" class="status-filter" style="width: 150px">
            <a-select-option value="all">All Status</a-select-option>
            <a-select-option value="active">Active Only</a-select-option>
            <a-select-option value="inactive">Inactive Only</a-select-option>
          </a-select>

          <a-input v-model:value="searchText" placeholder="Search stores..." class="search-input" allow-clear>
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
        <TableSkeleton v-if="loading" :rows="5" :columns="6" />
        <a-table v-else :columns="columns" :data-source="filteredStores"
          :pagination="{ pageSize: 10, showSizeChanger: true, showTotal: (total: number) => `Total ${total} stores` }"
          :loading="loading" row-key="id" :scroll="{ x: 1000 }">
          <template #bodyCell="{ column, record }">
            <!-- Store Information -->
            <template v-if="column.key === 'storeInfo'">
              <div class="store-info">
                <div class="store-logo">
                  <img v-if="record.logo_url" :src="record.logo_url" alt="logo" class="logo-img" />
                  <span v-else>{{ record.name?.charAt(0) || '🏪' }}</span>
                </div>
                <div class="store-details">
                  <div class="store-name">{{ record.name }}</div>
                  <div class="store-id">{{ record.slug }}</div>
                </div>
              </div>
            </template>

            <!-- Domain -->
            <template v-if="column.key === 'customDomain'">
              <div class="domain-info">
                <span v-if="record.custom_domain" class="custom-domain">
                  <shop-outlined /> {{ record.custom_domain }}
                </span>
                <span v-else class="slug-domain">
                  {{ record.slug }}.platform.com
                </span>
              </div>
            </template>

            <!-- Role -->
            <template v-if="column.key === 'role'">
              <a-tag :color="record.role === 'OWNER' ? 'gold' : 'blue'">
                {{ record.role?.replace('_', ' ') || 'Member' }}
              </a-tag>
            </template>

            <!-- Status -->
            <template v-if="column.key === 'storeStatus'">
              <a-tag
                :color="record.status === 'ACTIVE' ? 'success' : record.status === 'PENDING' ? 'warning' : 'default'">
                {{ record.status || 'Unknown' }}
              </a-tag>
            </template>

            <!-- Active Toggle -->
            <template v-if="column.key === 'isActive'">
              <a-switch :checked="record.isActive" @change="toggleActive(record)" size="small" />
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
/* Updated to use CSS variables for proper theming */
.stores-list-page {
  background: var(--background);
  min-height: 100vh;
  position: relative;
}

/* Page Header */
.page-header {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, oklch(0.65 0.2 190) 0%, oklch(0.6 0.18 195) 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.25);
}

.header-text {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-text h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0;
}

.store-count {
  background: var(--muted);
  color: var(--muted-foreground);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.add-store-btn {
  background: linear-gradient(135deg, oklch(0.65 0.2 190) 0%, oklch(0.6 0.18 195) 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.25);
  height: 40px;
  padding: 0 24px;
  font-weight: 600;
}

.add-store-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(13, 148, 136, 0.35);
}

/* Statistics Cards */
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
  background: linear-gradient(90deg, oklch(0.65 0.2 190) 0%, oklch(0.6 0.18 195) 100%);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border-color: oklch(0.65 0.2 190);
}

.stat-card.total::before {
  background: linear-gradient(90deg, oklch(0.65 0.2 230) 0%, oklch(0.65 0.2 250) 100%);
}

.stat-card.active::before {
  background: linear-gradient(90deg, oklch(0.7 0.18 145) 0%, oklch(0.72 0.16 165) 100%);
}

.stat-card.inactive::before {
  background: linear-gradient(90deg, oklch(0.7 0.15 45) 0%, oklch(0.72 0.13 60) 100%);
}

.stat-card.new::before {
  background: linear-gradient(90deg, oklch(0.65 0.2 190) 0%, oklch(0.6 0.18 195) 100%);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  background: var(--muted);
  color: var(--muted-foreground);
  transition: all 0.3s ease;
}

.stat-card.total .stat-icon {
  background: oklch(0.65 0.2 230 / 0.15);
  color: oklch(0.65 0.2 230);
}

.stat-card.active .stat-icon {
  background: oklch(0.7 0.18 145 / 0.15);
  color: oklch(0.7 0.18 145);
}

.stat-card.inactive .stat-icon {
  background: oklch(0.7 0.15 45 / 0.15);
  color: oklch(0.7 0.15 45);
}

.stat-card.new .stat-icon {
  background: oklch(0.65 0.2 190 / 0.15);
  color: oklch(0.65 0.2 190);
}

.stat-card:hover .stat-icon {
  transform: scale(1.1) rotate(5deg);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--foreground);
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: var(--muted-foreground);
  font-weight: 500;
}

/* Financial Summary */
.financial-summary {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.financial-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.financial-icon {
  font-size: 20px;
  color: var(--muted-foreground);
}

.financial-item.success .financial-icon {
  color: oklch(0.7 0.18 145);
}

.financial-item.danger .financial-icon {
  color: oklch(0.65 0.2 25);
}

.financial-label {
  font-size: 12px;
  color: var(--muted-foreground);
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-right: 8px;
}

.financial-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--foreground);
}

.financial-item.success .financial-value {
  color: oklch(0.7 0.18 145);
}

.financial-item.danger .financial-value {
  color: oklch(0.65 0.2 25);
}

.divider-vertical {
  width: 1px;
  height: 40px;
  background: var(--border);
}

/* Content Card */
.content-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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
  color: var(--foreground);
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
  border-color: oklch(0.7 0.18 145);
  color: oklch(0.7 0.18 145);
  font-weight: 600;
}

.export-btn:hover {
  background: oklch(0.7 0.18 145 / 0.1);
  border-color: oklch(0.7 0.18 145);
  color: oklch(0.7 0.18 145);
}

/* Table Styles */
.table-container {
  overflow-x: auto;
}

.store-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.store-logo {
  width: 40px;
  height: 40px;
  background: var(--primary-lighter);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-weight: 700;
  font-size: 18px;
  overflow: hidden;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.domain-info {
  display: flex;
  flex-direction: column;
}

.custom-domain {
  font-weight: 600;
  color: var(--primary);
}

.slug-domain {
  color: var(--muted-foreground);
  font-size: 12px;
}

.store-details {
  flex: 1;
}

.store-name {
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 4px;
}

.store-id {
  font-size: 12px;
  color: var(--muted-foreground);
}

.owner-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.owner-name {
  font-weight: 500;
  color: var(--foreground);
}

.owner-contact {
  font-size: 12px;
  color: var(--muted-foreground);
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.action-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.view-btn {
  color: oklch(0.65 0.2 230);
}

.view-btn:hover {
  background: oklch(0.65 0.2 230 / 0.1);
  color: oklch(0.65 0.2 230);
}

.edit-btn {
  color: oklch(0.65 0.2 190);
}

.edit-btn:hover {
  background: oklch(0.65 0.2 190 / 0.1);
  color: oklch(0.65 0.2 190);
}

.delete-btn {
  color: oklch(0.65 0.2 25);
}

.delete-btn:hover {
  background: oklch(0.65 0.2 25 / 0.1);
  color: oklch(0.65 0.2 25);
}

/* Floating Add Button */
.floating-add-btn {
  position: fixed;
  right: 32px;
  bottom: 32px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, oklch(0.65 0.2 190) 0%, oklch(0.6 0.18 195) 100%);
  border: none;
  box-shadow: 0 8px 24px rgba(13, 148, 136, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  z-index: 999;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.floating-add-btn:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 32px rgba(13, 148, 136, 0.45);
}

.floating-add-btn:active {
  transform: translateY(-2px) scale(1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .stores-list-page {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .add-store-btn {
    width: 100%;
  }

  .stats-container {
    grid-template-columns: 1fr;
  }

  .financial-summary {
    flex-direction: column;
    gap: 16px;
  }

  .divider-vertical {
    display: none;
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

  .floating-add-btn {
    right: 20px;
    bottom: 20px;
  }
}
</style>
