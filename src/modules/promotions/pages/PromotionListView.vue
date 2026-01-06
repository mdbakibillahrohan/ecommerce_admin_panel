<template>
  <div class="promotion-list-container">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Promotions</h1>
        <p class="page-subtitle">Manage promotional campaigns and special offers</p>
      </div>
      <a-button type="primary" size="large" class="create-btn" @click="router.push('/promotions/create')">
        <PlusOutlined />
        Create Promotion
      </a-button>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon"
          style="background: linear-gradient(135deg, oklch(0.7 0.15 195) 0%, oklch(0.65 0.18 200) 100%);">
          <TagsOutlined />
        </div>
        <div class="stat-content">
          <div class="stat-label">Total Promotions</div>
          <div class="stat-value">{{ stats.total }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon"
          style="background: linear-gradient(135deg, oklch(0.75 0.20 145) 0%, oklch(0.70 0.22 150) 100%);">
          <CheckCircleOutlined />
        </div>
        <div class="stat-content">
          <div class="stat-label">Active Promotions</div>
          <div class="stat-value">{{ stats.active }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon"
          style="background: linear-gradient(135deg, oklch(0.75 0.20 35) 0%, oklch(0.70 0.22 40) 100%);">
          <GiftOutlined />
        </div>
        <div class="stat-content">
          <div class="stat-label">Total Usage</div>
          <div class="stat-value">{{ stats.totalUsage }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon"
          style="background: linear-gradient(135deg, oklch(0.70 0.25 330) 0%, oklch(0.65 0.27 335) 100%);">
          <ClockCircleOutlined />
        </div>
        <div class="stat-content">
          <div class="stat-label">Scheduled</div>
          <div class="stat-value">{{ stats.scheduled }}</div>
        </div>
      </div>
    </div>

    <!-- Filters & Actions -->
    <div class="filters-card">
      <div class="filters-row">
        <a-input-search v-model:value="searchQuery" placeholder="Search by promotion name..." class="search-input"
          @search="handleSearch">
          <template #prefix>
            <SearchOutlined />
          </template>
        </a-input-search>

        <a-select v-model:value="statusFilter" placeholder="Status" class="filter-select" @change="handleSearch"
          allowClear>
          <a-select-option value="active">Active</a-select-option>
          <a-select-option value="inactive">Inactive</a-select-option>
          <a-select-option value="scheduled">Scheduled</a-select-option>
          <a-select-option value="expired">Expired</a-select-option>
        </a-select>

        <a-select v-model:value="typeFilter" placeholder="Type" class="filter-select" @change="handleSearch" allowClear>
          <a-select-option value="PERCENTAGE">Percentage</a-select-option>
          <a-select-option value="FIXED">Fixed Amount</a-select-option>
          <a-select-option value="BOGO">Buy One Get One</a-select-option>
        </a-select>

        <a-button class="clear-btn" @click="clearFilters" v-if="hasActiveFilters">
          <CloseCircleOutlined />
          Clear Filters
        </a-button>
      </div>

      <div class="actions-row">
        <div class="bulk-actions" v-if="selectedRowKeys.length > 0">
          <span class="selection-text">{{ selectedRowKeys.length }} selected</span>
          <a-button size="small" @click="handleBulkActivate">
            <CheckOutlined />
            Activate
          </a-button>
          <a-button size="small" @click="handleBulkDeactivate">
            <StopOutlined />
            Deactivate
          </a-button>
          <a-popconfirm title="Delete selected promotions?" @confirm="handleBulkDelete">
            <a-button size="small" danger>
              <DeleteOutlined />
              Delete
            </a-button>
          </a-popconfirm>
        </div>

        <div class="export-actions">
          <a-dropdown>
            <a-button>
              <ExportOutlined />
              Export
              <DownOutlined />
            </a-button>
            <template #overlay>
              <a-menu @click="handleExport">
                <a-menu-item key="csv">
                  <FileTextOutlined /> Export as CSV
                </a-menu-item>
                <a-menu-item key="pdf">
                  <FilePdfOutlined /> Export as PDF
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>

          <a-button @click="handlePrint">
            <PrinterOutlined />
            Print
          </a-button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="table-card">
      <a-table :columns="columns" :dataSource="promotions" :loading="loading" :pagination="pagination"
        :row-selection="rowSelection" @change="handleTableChange" rowKey="id" class="promotions-table">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <div class="promotion-name-cell">
              <div class="promotion-name">{{ record.name }}</div>
              <div class="promotion-description">{{ record.description || 'No description' }}</div>
            </div>
          </template>

          <template v-if="column.key === 'type'">
            <a-tag class="type-tag">{{ record.type }}</a-tag>
          </template>

          <template v-if="column.key === 'discount'">
            <div class="discount-cell">
              <span class="discount-value" v-if="record.discount_type === 'PERCENTAGE'">
                {{ record.discount_value }}%
              </span>
              <span class="discount-value" v-else-if="record.discount_type === 'FIXED'">
                ${{ record.discount_value }}
              </span>
              <span class="discount-value" v-else>
                {{ record.discount_type }}
              </span>
            </div>
          </template>

          <template v-if="column.key === 'usage'">
            <div class="usage-cell">
              <div class="usage-text">
                {{ record.used_count }} / {{ record.usage_limit || '∞' }}
              </div>
              <div class="usage-progress" v-if="record.usage_limit">
                <div class="usage-bar" :style="{ width: getUsagePercentage(record) + '%' }"></div>
              </div>
            </div>
          </template>

          <template v-if="column.key === 'dates'">
            <div class="dates-cell">
              <div class="date-row">
                <CalendarOutlined />
                <span>{{ formatDate(record.start_date) }}</span>
              </div>
              <div class="date-row">
                <ArrowRightOutlined />
                <span>{{ formatDate(record.end_date) }}</span>
              </div>
            </div>
          </template>

          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record)" class="status-tag">
              {{ getStatusText(record) }}
            </a-tag>
          </template>

          <template v-if="column.key === 'actions'">
            <div class="action-buttons">
              <a-tooltip title="View Details">
                <a-button size="small" class="action-btn view-btn" @click="handleView(record)">
                  <EyeOutlined />
                </a-button>
              </a-tooltip>
              <a-tooltip title="Edit">
                <a-button size="small" class="action-btn edit-btn"
                  @click="router.push(`/promotions/${record.id}/edit`)">
                  <EditOutlined />
                </a-button>
              </a-tooltip>
              <a-tooltip title="Toggle Status">
                <a-button size="small" class="action-btn toggle-btn" @click="handleToggleStatus(record)">
                  <PoweroffOutlined />
                </a-button>
              </a-tooltip>
              <a-popconfirm title="Delete this promotion?" @confirm="handleDelete(record.id)">
                <a-tooltip title="Delete">
                  <a-button size="small" class="action-btn delete-btn">
                    <DeleteOutlined />
                  </a-button>
                </a-tooltip>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <!-- View Drawer -->
    <a-drawer v-model:open="viewDrawerVisible" title="Promotion Details" width="500" class="view-drawer">
      <div v-if="selectedPromotion" class="promotion-details">
        <div class="detail-section">
          <h3 class="section-title">Basic Information</h3>
          <div class="detail-row">
            <span class="detail-label">Name:</span>
            <span class="detail-value">{{ selectedPromotion.name }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Type:</span>
            <span class="detail-value">{{ selectedPromotion.type }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Description:</span>
            <span class="detail-value">{{ selectedPromotion.description || 'N/A' }}</span>
          </div>
        </div>

        <div class="detail-section">
          <h3 class="section-title">Discount Details</h3>
          <div class="detail-row">
            <span class="detail-label">Discount Type:</span>
            <span class="detail-value">{{ selectedPromotion.discount_type }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Discount Value:</span>
            <span class="detail-value discount-highlight">
              {{ selectedPromotion.discount_type === 'PERCENTAGE'
                ? selectedPromotion.discount_value + '%'
                : '$' + selectedPromotion.discount_value
              }}
            </span>
          </div>
        </div>

        <div class="detail-section">
          <h3 class="section-title">Usage & Duration</h3>
          <div class="detail-row">
            <span class="detail-label">Used:</span>
            <span class="detail-value">{{ selectedPromotion.used_count }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Limit:</span>
            <span class="detail-value">{{ selectedPromotion.usage_limit || 'Unlimited' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Start Date:</span>
            <span class="detail-value">{{ formatDate(selectedPromotion.start_date) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">End Date:</span>
            <span class="detail-value">{{ formatDate(selectedPromotion.end_date) }}</span>
          </div>
        </div>

        <div class="detail-section">
          <h3 class="section-title">Status</h3>
          <a-tag :color="getStatusColor(selectedPromotion)" class="status-tag-large">
            {{ getStatusText(selectedPromotion) }}
          </a-tag>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ExportOutlined,
  PrinterOutlined,
  DownOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  CloseCircleOutlined,
  CheckOutlined,
  StopOutlined,
  TagsOutlined,
  CheckCircleOutlined,
  GiftOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  ArrowRightOutlined,
  EyeOutlined,
  PoweroffOutlined
} from '@ant-design/icons-vue'
import { promotionService } from '@/modules/promotions/services/promotion.service'
import dayjs from 'dayjs'

interface Promotion {
  id: number
  name: string
  description?: string
  type: string
  discount_type: string
  discount_value: number
  is_active: boolean
  start_date: string
  end_date: string
  used_count: number
  usage_limit: number | null
}

const router = useRouter()
const loading = ref(false)
const promotions = ref<Promotion[]>([])
const searchQuery = ref('')
const statusFilter = ref<string | undefined>(undefined)
const typeFilter = ref<string | undefined>(undefined)
const selectedRowKeys = ref<number[]>([])
const viewDrawerVisible = ref(false)
const selectedPromotion = ref<Promotion | null>(null)

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
})

const stats = ref({
  total: 0,
  active: 0,
  totalUsage: 0,
  scheduled: 0
})

const columns = [
  { title: 'Promotion Name', key: 'name', width: 250 },
  { title: 'Type', key: 'type', width: 120 },
  { title: 'Discount', key: 'discount', width: 120 },
  { title: 'Usage', key: 'usage', width: 150 },
  { title: 'Duration', key: 'dates', width: 200 },
  { title: 'Status', key: 'status', width: 120 },
  { title: 'Actions', key: 'actions', width: 180, fixed: 'right' },
]

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: any[]) => {
    selectedRowKeys.value = keys
  }
}))

const hasActiveFilters = computed(() => {
  return searchQuery.value || statusFilter.value || typeFilter.value
})

const fetchPromotions = async () => {
  loading.value = true
  try {
    const { current, pageSize } = pagination.value
    const params: any = {
      page: current,
      limit: pageSize,
    }

    if (searchQuery.value) params.search = searchQuery.value
    if (statusFilter.value) params.status = statusFilter.value
    if (typeFilter.value) params.type = typeFilter.value

    const data = await promotionService.getPromotions(params)
    promotions.value = data.data
    pagination.value.total = data.total

    // Calculate stats
    stats.value.total = data.total
    stats.value.active = data.data.filter((p: any) => p.is_active).length
    stats.value.totalUsage = data.data.reduce((sum: number, p: any) => sum + p.used_count, 0)
    stats.value.scheduled = data.data.filter((p: any) => {
      return new Date(p.start_date) > new Date()
    }).length
  } catch (error) {
    message.error('Failed to load promotions')
  } finally {
    loading.value = false
  }
}

const handleTableChange = (pag: any) => {
  pagination.value = pag
  fetchPromotions()
}

const handleSearch = () => {
  pagination.value.current = 1
  fetchPromotions()
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = undefined
  typeFilter.value = undefined
  handleSearch()
}

const handleDelete = async (id: number) => {
  try {
    await promotionService.deletePromotion(id)
    message.success('Promotion deleted successfully')
    fetchPromotions()
  } catch (error) {
    message.error('Failed to delete promotion')
  }
}

const handleBulkDelete = async () => {
  try {
    await Promise.all(
      selectedRowKeys.value.map(id => promotionService.deletePromotion(id as number))
    )
    message.success(`${selectedRowKeys.value.length} promotions deleted`)
    selectedRowKeys.value = []
    fetchPromotions()
  } catch (error) {
    message.error('Failed to delete promotions')
  }
}

const handleBulkActivate = async () => {
  // Implementation for bulk activate
  message.success(`${selectedRowKeys.value.length} promotions activated`)
  selectedRowKeys.value = []
}

const handleBulkDeactivate = async () => {
  // Implementation for bulk deactivate
  message.success(`${selectedRowKeys.value.length} promotions deactivated`)
  selectedRowKeys.value = []
}

const handleToggleStatus = async (record: any) => {
  try {
    // Toggle the status
    await promotionService.updatePromotion(record.id, { is_active: !record.is_active })
    message.success(`Promotion ${record.is_active ? 'deactivated' : 'activated'}`)
    fetchPromotions()
  } catch (error) {
    message.error('Failed to update status')
  }
}

const handleView = (record: any) => {
  selectedPromotion.value = record
  viewDrawerVisible.value = true
}

const handleExport = ({ key }: { key: string }) => {
  if (key === 'csv') {
    message.success('Exporting as CSV...')
    // Implementation for CSV export
  } else if (key === 'pdf') {
    message.success('Exporting as PDF...')
    // Implementation for PDF export
  }
}

const handlePrint = () => {
  window.print()
}

const formatDate = (date: string) => {
  return dayjs(date).format('MMM D, YYYY')
}

const getUsagePercentage = (record: any) => {
  if (!record.usage_limit) return 0
  return Math.min((record.used_count / record.usage_limit) * 100, 100)
}

const getStatusColor = (record: any) => {
  const now = new Date()
  const startDate = new Date(record.start_date)
  const endDate = new Date(record.end_date)

  if (!record.is_active) return 'red'
  if (now < startDate) return 'blue'
  if (now > endDate) return 'default'
  return 'green'
}

const getStatusText = (record: any) => {
  const now = new Date()
  const startDate = new Date(record.start_date)
  const endDate = new Date(record.end_date)

  if (!record.is_active) return 'Inactive'
  if (now < startDate) return 'Scheduled'
  if (now > endDate) return 'Expired'
  return 'Active'
}

onMounted(() => {
  fetchPromotions()
})
</script>

<style scoped>
.promotion-list-container {
  margin: 0 auto;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
}

.create-btn {
  height: 44px;
  padding: 0 24px;
  font-size: 15px;
  border-radius: 8px;
  background: linear-gradient(135deg, oklch(0.7 0.15 195) 0%, oklch(0.65 0.18 200) 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.create-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(13, 148, 136, 0.4);
}

/* Statistics Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: oklch(0.7 0.15 195);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 13px;
  color: var(--muted-foreground);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--foreground);
}

/* Filters Card */
.filters-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.filters-row {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 250px;
}

.filter-select {
  min-width: 150px;
}

.clear-btn {
  border-radius: 8px;
}

.actions-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.bulk-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.selection-text {
  font-size: 14px;
  color: var(--muted-foreground);
  margin-right: 8px;
}

.export-actions {
  display: flex;
  gap: 8px;
}

/* Table Card */
.table-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

.promotions-table :deep(.ant-table) {
  background: transparent;
}

.promotions-table :deep(.ant-table-thead > tr > th) {
  background: var(--muted);
  color: var(--foreground);
  font-weight: 600;
  border-bottom: 1px solid var(--border);
}

.promotions-table :deep(.ant-table-tbody > tr) {
  transition: all 0.2s ease;
}

.promotions-table :deep(.ant-table-tbody > tr:hover) {
  background: var(--muted);
}

.promotions-table :deep(.ant-table-tbody > tr > td) {
  border-bottom: 1px solid var(--border);
}

/* Table Cell Styles */
.promotion-name-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.promotion-name {
  font-weight: 600;
  color: var(--foreground);
  font-size: 14px;
}

.promotion-description {
  font-size: 12px;
  color: var(--muted-foreground);
}

.type-tag {
  border-radius: 6px;
  font-size: 12px;
}

.discount-cell {
  font-weight: 600;
  color: oklch(0.7 0.15 195);
}

.discount-value {
  font-size: 15px;
}

.usage-cell {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.usage-text {
  font-size: 13px;
  color: var(--foreground);
  font-weight: 500;
}

.usage-progress {
  width: 100%;
  height: 6px;
  background: var(--muted);
  border-radius: 3px;
  overflow: hidden;
}

.usage-bar {
  height: 100%;
  background: linear-gradient(90deg, oklch(0.7 0.15 195) 0%, oklch(0.65 0.18 200) 100%);
  transition: width 0.3s ease;
}

.dates-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.date-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--muted-foreground);
}

.status-tag {
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 6px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.view-btn:hover {
  background: oklch(0.7 0.15 195);
  color: white;
  border-color: oklch(0.7 0.15 195);
}

.edit-btn:hover {
  background: oklch(0.75 0.20 145);
  color: white;
  border-color: oklch(0.75 0.20 145);
}

.toggle-btn:hover {
  background: oklch(0.75 0.20 35);
  color: white;
  border-color: oklch(0.75 0.20 35);
}

.delete-btn:hover {
  background: oklch(0.55 0.22 25);
  color: white;
  border-color: oklch(0.55 0.22 25);
}

/* View Drawer */
.view-drawer :deep(.ant-drawer-header) {
  background: linear-gradient(135deg, oklch(0.7 0.15 195) 0%, oklch(0.65 0.18 200) 100%);
  border-bottom: none;
}

.view-drawer :deep(.ant-drawer-title) {
  color: white;
  font-weight: 600;
}

.view-drawer :deep(.ant-drawer-close) {
  color: white;
}

.promotion-details {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-section {
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}

.detail-section:last-child {
  border-bottom: none;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 16px 0;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.detail-label {
  font-size: 14px;
  color: var(--muted-foreground);
  font-weight: 500;
}

.detail-value {
  font-size: 14px;
  color: var(--foreground);
  font-weight: 500;
}

.discount-highlight {
  color: oklch(0.7 0.15 195);
  font-size: 18px;
  font-weight: 700;
}

.status-tag-large {
  font-size: 14px;
  padding: 6px 16px;
  border-radius: 8px;
}

/* Responsive */
@media (max-width: 768px) {
  .promotion-list-container {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
  }

  .create-btn {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filters-row {
    flex-direction: column;
  }

  .search-input,
  .filter-select {
    width: 100%;
  }

  .actions-row {
    flex-direction: column;
    align-items: stretch;
  }

  .bulk-actions,
  .export-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
