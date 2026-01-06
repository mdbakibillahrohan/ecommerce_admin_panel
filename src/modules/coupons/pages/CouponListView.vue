<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { couponsApi, type Coupon } from '@/modules/coupons/api/coupons'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  SearchOutlined,
  FilterOutlined,
  DownloadOutlined,
  PrinterOutlined,
  ReloadOutlined,
  TagOutlined,
  PercentageOutlined,
  DollarOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import dayjs from 'dayjs'

const router = useRouter()
const dayjsInstance = dayjs

// State
const loading = ref(false)
const coupons = ref<Coupon[]>([])
const searchQuery = ref('')
const selectedStatus = ref<string>('')
const selectedType = ref<string>('')
const selectedRowKeys = ref<number[]>([])

onMounted(() => {
  fetchCoupons()
})

async function fetchCoupons() {
  loading.value = true
  try {
    coupons.value = await couponsApi.getAll()
  } catch (error) {
    message.error('Failed to fetch coupons')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// Statistics
const statistics = computed(() => {
  const total = coupons.value.length
  const active = coupons.value.filter(c => getCouponStatus(c).text === 'Active').length
  const expired = coupons.value.filter(c => getCouponStatus(c).text === 'Expired').length
  const totalUsage = coupons.value.reduce((sum, c) => sum + c.used_count, 0)

  return { total, active, expired, totalUsage }
})

// Filtered coupons
const filteredCoupons = computed(() => {
  return coupons.value.filter(coupon => {
    const matchesSearch = !searchQuery.value ||
      coupon.code.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesStatus = !selectedStatus.value ||
      getCouponStatus(coupon).text === selectedStatus.value

    const matchesType = !selectedType.value ||
      coupon.discount_type === selectedType.value

    return matchesSearch && matchesStatus && matchesType
  })
})

function handleCreate() {
  router.push('/coupons/create')
}

function handleEdit(id: number) {
  router.push(`/coupons/${id}/edit`)
}

async function handleDelete(coupon: Coupon) {
  Modal.confirm({
    title: 'Delete Coupon',
    content: `Are you sure you want to delete coupon "${coupon.code}"?`,
    okText: 'Delete',
    okType: 'danger',
    cancelText: 'Cancel',
    async onOk() {
      try {
        await couponsApi.delete(coupon.id)
        message.success('Coupon deleted')
        fetchCoupons()
      } catch (error) {
        message.error('Failed to delete coupon')
        console.error(error)
      }
    },
  })
}

async function handleBulkDelete() {
  if (selectedRowKeys.value.length === 0) return

  Modal.confirm({
    title: 'Delete Coupons',
    content: `Are you sure you want to delete ${selectedRowKeys.value.length} coupon(s)?`,
    okText: 'Delete',
    okType: 'danger',
    cancelText: 'Cancel',
    async onOk() {
      try {
        await Promise.all(selectedRowKeys.value.map(id => couponsApi.delete(id)))
        message.success(`${selectedRowKeys.value.length} coupon(s) deleted`)
        selectedRowKeys.value = []
        fetchCoupons()
      } catch (error) {
        message.error('Failed to delete coupons')
        console.error(error)
      }
    },
  })
}

function copyCode(code: string) {
  navigator.clipboard.writeText(code)
  message.success('Code copied to clipboard')
}

function getCouponStatus(coupon: Coupon) {
  const now = dayjsInstance()

  if (!coupon.is_active) return { text: 'Inactive', color: 'default' }
  if (coupon.expires_at && dayjsInstance(coupon.expires_at).isBefore(now)) return { text: 'Expired', color: 'red' }
  if (coupon.starts_at && dayjsInstance(coupon.starts_at).isAfter(now)) return { text: 'Scheduled', color: 'blue' }
  if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) return { text: 'Limit Reached', color: 'orange' }
  return { text: 'Active', color: 'green' }
}

function formatDiscount(coupon: Coupon) {
  if (coupon.discount_type === 'PERCENTAGE') {
    return `${coupon.discount_value}%`
  }
  return `৳${coupon.discount_value}`
}

function clearFilters() {
  searchQuery.value = ''
  selectedStatus.value = ''
  selectedType.value = ''
}

function handleExport(format: string) {
  message.success(`Exporting as ${format}...`)
}

function handlePrint() {
  window.print()
}

const columns = [
  { title: 'Code', dataIndex: 'code', key: 'code', width: 180 },
  { title: 'Type', key: 'type', width: 120 },
  { title: 'Discount', key: 'discount', width: 120 },
  { title: 'Usage', key: 'usage', width: 140 },
  { title: 'Validity', key: 'validity', width: 220 },
  { title: 'Status', key: 'status', width: 120, align: 'center' as const },
  { title: 'Actions', key: 'actions', width: 120, align: 'center' as const, fixed: 'right' as const },
]

const rowSelection = {
  selectedRowKeys: selectedRowKeys,
  onChange: (keys: number[]) => {
    selectedRowKeys.value = keys
  },
}
</script>

<template>
  <div class="coupon-list-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Coupons & Promotions</h1>
        <p class="page-subtitle">Manage discount codes and promotional offers</p>
      </div>
      <a-button type="primary" size="large" class="create-btn" @click="handleCreate">
        <template #icon>
          <PlusOutlined />
        </template>
        Create Coupon
      </a-button>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon-wrapper"
          style="background: linear-gradient(135deg, oklch(0.72 0.15 198) 0%, oklch(0.65 0.18 210) 100%)">
          <TagOutlined class="stat-icon" />
        </div>
        <div class="stat-content">
          <div class="stat-label">Total Coupons</div>
          <div class="stat-value">{{ statistics.total }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-wrapper"
          style="background: linear-gradient(135deg, oklch(0.75 0.20 145) 0%, oklch(0.65 0.22 155) 100%)">
          <CheckCircleOutlined class="stat-icon" />
        </div>
        <div class="stat-content">
          <div class="stat-label">Active Coupons</div>
          <div class="stat-value">{{ statistics.active }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-wrapper"
          style="background: linear-gradient(135deg, oklch(0.75 0.18 50) 0%, oklch(0.68 0.20 40) 100%)">
          <PercentageOutlined class="stat-icon" />
        </div>
        <div class="stat-content">
          <div class="stat-label">Total Usage</div>
          <div class="stat-value">{{ statistics.totalUsage }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon-wrapper"
          style="background: linear-gradient(135deg, oklch(0.70 0.19 15) 0%, oklch(0.62 0.21 20) 100%)">
          <DollarOutlined class="stat-icon" />
        </div>
        <div class="stat-content">
          <div class="stat-label">Expired</div>
          <div class="stat-value">{{ statistics.expired }}</div>
        </div>
      </div>
    </div>

    <!-- Filters and Actions -->
    <div class="filters-section">
      <div class="filters-left">
        <a-input v-model:value="searchQuery" placeholder="Search by coupon code..." class="search-input" allow-clear>
          <template #prefix>
            <SearchOutlined />
          </template>
        </a-input>

        <a-select v-model:value="selectedStatus" placeholder="Status" class="filter-select" allow-clear>
          <template #suffixIcon>
            <FilterOutlined />
          </template>
          <a-select-option value="Active">Active</a-select-option>
          <a-select-option value="Inactive">Inactive</a-select-option>
          <a-select-option value="Expired">Expired</a-select-option>
          <a-select-option value="Scheduled">Scheduled</a-select-option>
          <a-select-option value="Limit Reached">Limit Reached</a-select-option>
        </a-select>

        <a-select v-model:value="selectedType" placeholder="Type" class="filter-select" allow-clear>
          <template #suffixIcon>
            <FilterOutlined />
          </template>
          <a-select-option value="PERCENTAGE">Percentage</a-select-option>
          <a-select-option value="FIXED">Fixed Amount</a-select-option>
        </a-select>

        <a-button @click="clearFilters" v-if="searchQuery || selectedStatus || selectedType">
          Clear Filters
        </a-button>
      </div>

      <div class="filters-right">
        <a-button @click="fetchCoupons" :loading="loading">
          <template #icon>
            <ReloadOutlined />
          </template>
          Refresh
        </a-button>

        <a-dropdown>
          <a-button>
            <template #icon>
              <DownloadOutlined />
            </template>
            Export
          </a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item key="csv" @click="handleExport('CSV')">Export as CSV</a-menu-item>
              <a-menu-item key="pdf" @click="handleExport('PDF')">Export as PDF</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

        <a-button @click="handlePrint">
          <template #icon>
            <PrinterOutlined />
          </template>
          Print
        </a-button>
      </div>
    </div>

    <!-- Bulk Actions -->
    <div class="bulk-actions" v-if="selectedRowKeys.length > 0">
      <span class="bulk-text">{{ selectedRowKeys.length }} coupon(s) selected</span>
      <a-button danger @click="handleBulkDelete">
        <template #icon>
          <DeleteOutlined />
        </template>
        Delete Selected
      </a-button>
    </div>

    <!-- Coupons Table -->
    <div class="table-wrapper">
      <a-table :columns="columns" :data-source="filteredCoupons" :loading="loading" :row-selection="rowSelection"
        :pagination="{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total: number) => `Total ${total} coupons`,
        }" :scroll="{ x: 1200 }" row-key="id" class="coupons-table">
        <template #bodyCell="{ column, record }">
          <!-- Code -->
          <template v-if="column.key === 'code'">
            <div class="code-cell">
              <code class="coupon-code">{{ record.code }}</code>
              <a-button type="text" size="small" class="copy-btn" @click="copyCode(record.code)">
                <template #icon>
                  <CopyOutlined />
                </template>
              </a-button>
            </div>
          </template>

          <!-- Type -->
          <template v-if="column.key === 'type'">
            <a-tag :color="record.discount_type === 'PERCENTAGE' ? 'blue' : 'purple'">
              {{ record.discount_type === 'PERCENTAGE' ? 'Percentage' : 'Fixed' }}
            </a-tag>
          </template>

          <!-- Discount -->
          <template v-if="column.key === 'discount'">
            <div class="discount-cell">
              <span class="discount-value">{{ formatDiscount(record) }}</span>
              <span v-if="record.min_order_amount" class="min-order">
                Min: ৳{{ record.min_order_amount }}
              </span>
            </div>
          </template>

          <!-- Usage -->
          <template v-if="column.key === 'usage'">
            <div class="usage-cell">
              <a-progress v-if="record.usage_limit"
                :percent="Math.round((record.used_count / record.usage_limit) * 100)"
                :format="() => `${record.used_count}/${record.usage_limit}`" size="small"
                :status="record.used_count >= record.usage_limit ? 'exception' : 'normal'"
                :stroke-color="'oklch(0.72 0.15 198)'" />
              <span v-else class="unlimited-usage">{{ record.used_count }} uses</span>
            </div>
          </template>

          <!-- Validity -->
          <template v-if="column.key === 'validity'">
            <div class="validity-cell">
              <div v-if="record.starts_at" class="validity-row">
                <span class="validity-label">From:</span>
                <span class="validity-date">{{ dayjsInstance(record.starts_at).format('MMM D, YYYY') }}</span>
              </div>
              <div v-if="record.expires_at" class="validity-row">
                <span class="validity-label">To:</span>
                <span class="validity-date">{{ dayjsInstance(record.expires_at).format('MMM D, YYYY') }}</span>
              </div>
              <span v-if="!record.starts_at && !record.expires_at" class="no-restrictions">
                No restrictions
              </span>
            </div>
          </template>

          <!-- Status -->
          <template v-if="column.key === 'status'">
            <a-tag :color="getCouponStatus(record).color" class="status-tag">
              {{ getCouponStatus(record).text }}
            </a-tag>
          </template>

          <!-- Actions -->
          <template v-if="column.key === 'actions'">
            <a-space :size="4">
              <a-tooltip title="Edit">
                <a-button type="text" size="small" class="action-btn" @click="handleEdit(record.id)">
                  <template #icon>
                    <EditOutlined />
                  </template>
                </a-button>
              </a-tooltip>
              <a-tooltip title="Delete">
                <a-button type="text" size="small" danger class="action-btn" @click="handleDelete(record)">
                  <template #icon>
                    <DeleteOutlined />
                  </template>
                </a-button>
              </a-tooltip>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<style scoped>
.coupon-list-page {
  min-height: 100vh;
  background: var(--background);
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}

.header-content {
  flex: 1;
  min-width: 250px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
}

.create-btn {
  height: 40px;
  padding: 0 24px;
  font-weight: 600;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Statistics Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: oklch(0.72 0.15 198);
}

.stat-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon {
  font-size: 24px;
  color: white;
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-label {
  font-size: 13px;
  color: var(--muted-foreground);
  margin-bottom: 4px;
  font-weight: 500;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--foreground);
  line-height: 1;
}

/* Filters Section */
.filters-section {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.filters-left,
.filters-right {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.search-input {
  width: 280px;
  height: 40px;
  border-radius: 8px;
}

.filter-select {
  width: 160px;
  height: 40px;
}

.filter-select :deep(.ant-select-selector) {
  height: 40px !important;
  border-radius: 8px !important;
  display: flex;
  align-items: center;
}

/* Bulk Actions */
.bulk-actions {
  background: oklch(0.72 0.15 198 / 0.1);
  border: 1px solid oklch(0.72 0.15 198);
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.bulk-text {
  font-weight: 600;
  color: oklch(0.72 0.15 198);
}

/* Table Wrapper */
.table-wrapper {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

.coupons-table :deep(.ant-table) {
  background: var(--card);
}

.coupons-table :deep(.ant-table-thead > tr > th) {
  background: var(--muted);
  color: var(--foreground);
  font-weight: 600;
  border-bottom: 1px solid var(--border);
}

.coupons-table :deep(.ant-table-tbody > tr) {
  transition: all 0.2s ease;
}

.coupons-table :deep(.ant-table-tbody > tr:hover) {
  background: var(--accent);
}

.coupons-table :deep(.ant-table-tbody > tr > td) {
  border-bottom: 1px solid var(--border);
}

/* Code Cell */
.code-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.coupon-code {
  padding: 6px 12px;
  background: linear-gradient(135deg, oklch(0.72 0.15 198) 0%, oklch(0.65 0.18 210) 100%);
  color: white;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.copy-btn {
  opacity: 0.6;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  opacity: 1;
  color: oklch(0.72 0.15 198);
}

/* Discount Cell */
.discount-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.discount-value {
  font-weight: 700;
  font-size: 16px;
  color: oklch(0.75 0.20 145);
}

.min-order {
  font-size: 12px;
  color: var(--muted-foreground);
}

/* Usage Cell */
.usage-cell {
  min-width: 120px;
}

.unlimited-usage {
  color: var(--muted-foreground);
  font-size: 13px;
}

/* Validity Cell */
.validity-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.validity-row {
  display: flex;
  gap: 6px;
  font-size: 13px;
}

.validity-label {
  color: var(--muted-foreground);
  min-width: 40px;
}

.validity-date {
  color: var(--foreground);
  font-weight: 500;
}

.no-restrictions {
  color: var(--muted-foreground);
  font-size: 13px;
  font-style: italic;
}

/* Status Tag */
.status-tag {
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 6px;
}

/* Action Buttons */
.action-btn {
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: scale(1.1);
}

/* Responsive */
@media (max-width: 768px) {
  .coupon-list-page {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }

  .filters-left,
  .filters-right {
    width: 100%;
    flex-direction: column;
  }

  .search-input,
  .filter-select {
    width: 100%;
  }

  .bulk-actions {
    flex-direction: column;
    align-items: stretch;
  }
}

/* Print Styles */
@media print {

  .page-header,
  .filters-section,
  .bulk-actions,
  .action-btn {
    display: none !important;
  }
}
</style>
