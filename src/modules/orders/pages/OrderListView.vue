<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import CommonPageHeader from '@/modules/shared/components/ui/CommonPageHeader.vue'
import CommonTable from '@/modules/shared/components/ui/CommonTable.vue'
import CommonStatsGrid from '@/modules/shared/components/ui/CommonStatsGrid.vue'
import { ordersApi, type Order, type OrderQuery, type OrderStatus } from '@/modules/orders/api/orders'
import {
  SearchOutlined,
  EyeOutlined,
  ReloadOutlined,
  DownloadOutlined,
  PrinterOutlined,
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'

// router is unused here, it was probably for navigation but fetchOrders is used instead.
// const router = useRouter()
const dayjsInstance = dayjs // Assign dayjs to a constant to avoid conditional calls

// State
const loading = ref(false)
const orders = ref<Order[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedRowKeys = ref<number[]>([])
const orderDetailVisible = ref(false)
const statusModalVisible = ref(false)
const selectedOrder = ref<Order | null>(null)
const newStatus = ref<OrderStatus>()

const statistics = ref({
  totalOrders: 0,
  totalRevenue: 0,
  pendingOrders: 0,
  completedOrders: 0,
})

const statsData = computed(() => [
  {
    label: 'Total Orders',
    value: statistics.value.totalOrders,
    icon: ShoppingCartOutlined,
    iconStyle: { background: 'linear-gradient(135deg, oklch(0.7 0.15 210) 0%, oklch(0.65 0.18 220) 100%)' }
  },
  {
    label: 'Total Revenue',
    value: formatCurrency(statistics.value.totalRevenue),
    icon: DollarOutlined,
    iconStyle: { background: 'linear-gradient(135deg, oklch(0.7 0.19 330) 0%, oklch(0.65 0.2 345) 100%)' }
  },
  {
    label: 'Pending Orders',
    value: statistics.value.pendingOrders,
    icon: ClockCircleOutlined,
    iconStyle: { background: 'linear-gradient(135deg, oklch(0.75 0.15 35) 0%, oklch(0.7 0.18 25) 100%)' },
    type: 'warning'
  },
  {
    label: 'Delivered',
    value: statistics.value.completedOrders,
    icon: CheckCircleOutlined,
    iconStyle: { background: 'linear-gradient(135deg, oklch(0.75 0.15 140) 0%, oklch(0.7 0.18 150) 100%)' },
    type: 'success'
  }
])

// Filters
const searchText = ref('')
const selectedStatus = ref<OrderStatus | undefined>()
const dateRange = ref<[dayjs.Dayjs, dayjs.Dayjs] | null>(null)
const sortField = ref<string | undefined>('created_at')
const sortOrder = ref<'ascend' | 'descend' | undefined>('descend')

onMounted(() => {
  fetchOrders()
  fetchStatistics()
})

async function fetchOrders() {
  loading.value = true
  try {
    const query: OrderQuery = {
      page: currentPage.value,
      limit: pageSize.value,
      search: searchText.value || undefined,
      status: selectedStatus.value,
      start_date: dateRange.value?.[0]?.format('YYYY-MM-DD'),
      end_date: dateRange.value?.[1]?.format('YYYY-MM-DD'),
    }
    const response = await ordersApi.getAll(query)
    orders.value = response.data
    total.value = response.total
  } catch (error) {
    message.error('Failed to fetch orders')
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function fetchStatistics() {
  try {
    const stats = await ordersApi.getStats()
    statistics.value = stats
  } catch (error) {
    console.error('Failed to fetch statistics', error)
  }
}

function handleSearch() {
  currentPage.value = 1
  fetchOrders()
}

function handleTableChange(pagination: { current: number; pageSize: number; total: number }, _filters: Record<string, string[] | null>, sorter: { field?: string; order?: 'ascend' | 'descend' }) {
  currentPage.value = pagination.current
  pageSize.value = pagination.pageSize

  if (sorter.field && sorter.order) {
    sortField.value = sorter.field
    sortOrder.value = sorter.order
  } else {
    sortField.value = undefined
    sortOrder.value = undefined
  }

  fetchOrders()
}

function handleViewOrder(order: Order) {
  selectedOrder.value = order
  orderDetailVisible.value = true
}

function handleEditStatus(order: Order) {
  selectedOrder.value = order
  newStatus.value = order.status
  statusModalVisible.value = true
}

async function handleUpdateStatus() {
  if (!selectedOrder.value || !newStatus.value) return

  try {
    await ordersApi.updateStatus(selectedOrder.value.id, { status: newStatus.value })
    message.success('Order status updated successfully')
    statusModalVisible.value = false
    fetchOrders()
    fetchStatistics()
  } catch {
    message.error('Failed to update order status')
  }
}

async function handleBulkStatusUpdate(status: OrderStatus) {
  if (selectedRowKeys.value.length === 0) {
    message.warning('Please select orders first')
    return
  }

  try {
    await Promise.all(
      selectedRowKeys.value.map(id => ordersApi.updateStatus(id, { status }))
    )
    message.success(`Updated ${selectedRowKeys.value.length} orders`)
    selectedRowKeys.value = []
    fetchOrders()
    fetchStatistics()
  } catch {
    message.error('Failed to update orders')
  }
}

function handleExport(format: 'csv' | 'pdf') {
  message.success(`Exporting ${selectedRowKeys.value.length || total.value} orders as ${format.toUpperCase()}`)
  // Implement actual export logic here
}

function handlePrint() {
  window.print()
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
  }).format(value)
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    PENDING: 'orange',
    CONFIRMED: 'blue',
    PROCESSING: 'cyan',
    SHIPPED: 'purple',
    DELIVERED: 'green',
    CANCELLED: 'red',
    REFUNDED: 'volcano',
  }
  return colors[status] || 'default'
}

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'REFUNDED', label: 'Refunded' },
]

const columns = [
  {
    title: 'Order #',
    dataIndex: 'order_number',
    key: 'order_number',
    width: 140,
    sorter: true,
  },
  {
    title: 'Customer',
    key: 'customer',
    width: 220,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    width: 130,
    align: 'center' as const,
    filters: statusOptions.map(s => ({ text: s.label, value: s.value })),
  },
  {
    title: 'Payment',
    key: 'payment',
    width: 120,
    align: 'center' as const,
  },
  {
    title: 'Items',
    key: 'items',
    width: 80,
    align: 'center' as const,
  },
  {
    title: 'Total',
    dataIndex: 'total',
    key: 'total',
    width: 130,
    align: 'right' as const,
    sorter: true,
  },
  {
    title: 'Date',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 160,
    sorter: true,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 120,
    align: 'center' as const,
    fixed: 'right' as const,
  },
]

const pagination = computed(() => ({
  current: currentPage.value,
  pageSize: pageSize.value,
  total: total.value,
  showSizeChanger: true,
  showQuickJumper: true,
  pageSizeOptions: ['10', '20', '50', '100'],
  showTotal: (total: number) => `Total ${total} orders`,
}))

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: number[]) => {
    selectedRowKeys.value = keys
  },
}))

const hasSelectedRows = computed(() => selectedRowKeys.value.length > 0)
</script>

<template>
  <div class="order-list-container">
    <CommonPageHeader title="Orders" subtitle="Manage and track customer orders">
      <template #actions>
        <a-button @click="handlePrint" class="action-btn">
          <template #icon>
            <PrinterOutlined />
          </template>
          Print
        </a-button>
        <a-dropdown>
          <a-button class="action-btn">
            <template #icon>
              <DownloadOutlined />
            </template>
            Export
          </a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="handleExport('csv')">Export as CSV</a-menu-item>
              <a-menu-item @click="handleExport('pdf')">Export as PDF</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
        <a-button type="primary" @click="fetchOrders" :loading="loading" class="refresh-btn">
          <template #icon>
            <ReloadOutlined />
          </template>
          Refresh
        </a-button>
      </template>
    </CommonPageHeader>

    <CommonStatsGrid :stats="statsData" :loading="loading" />



    <!-- Filters Section -->
    <a-card :bordered="false" class="filter-card">
      <div class="filter-header">
        <FilterOutlined class="filter-icon" />
        <span class="filter-title">Filters</span>
      </div>
      <a-row :gutter="[16, 16]" align="middle">
        <a-col :xs="24" :sm="12" :md="6" :lg="5">
          <a-input-search v-model:value="searchText" placeholder="Search by order # or customer..." allow-clear
            @search="handleSearch" @pressEnter="handleSearch" class="filter-input">
            <template #prefix>
              <SearchOutlined />
            </template>
          </a-input-search>
        </a-col>
        <a-col :xs="24" :sm="12" :md="5" :lg="4">
          <a-select v-model:value="selectedStatus" placeholder="All Status" allow-clear style="width: 100%"
            @change="handleSearch" class="filter-select">
            <a-select-option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :xs="24" :sm="16" :md="8" :lg="6">
          <a-range-picker v-model:value="dateRange" style="width: 100%" @change="handleSearch" class="filter-date" />
        </a-col>
        <a-col :xs="24" :sm="8" :md="5" :lg="3">
          <a-button block
            @click="() => { searchText = ''; selectedStatus = undefined; dateRange = null; handleSearch(); }"
            class="clear-btn">
            Clear All
          </a-button>
        </a-col>
      </a-row>
    </a-card>

    <!-- Bulk Actions Bar -->
    <a-card v-if="hasSelectedRows" :bordered="false" class="bulk-actions-card">
      <div class="bulk-actions-content">
        <span class="selection-count">{{ selectedRowKeys.length }} orders selected</span>
        <div class="bulk-actions">
          <a-dropdown>
            <a-button type="primary">
              Update Status
            </a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item v-for="status in statusOptions" :key="status.value"
                  @click="handleBulkStatusUpdate(status.value)">
                  {{ status.label }}
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <a-button danger @click="() => message.warning('Bulk delete not implemented')">
            <template #icon>
              <DeleteOutlined />
            </template>
            Delete Selected
          </a-button>
        </div>
      </div>
    </a-card>

    <!-- Orders Table -->
    <div class="table-container">
      <CommonTable :columns="columns" :data-source="orders" :loading="loading" :pagination="pagination"
        :row-selection="rowSelection" row-key="id" :scroll="{ x: 1100 }" @change="handleTableChange">
        <template #bodyCell="{ column, record }">
          <!-- Order Number -->
          <template v-if="column.key === 'order_number'">
            <a-typography-link @click="handleViewOrder(record)" class="order-link">
              <strong>{{ record.order_number }}</strong>
            </a-typography-link>
          </template>

          <!-- Customer -->
          <template v-if="column.key === 'customer'">
            <div class="customer-cell">
              <a-avatar :size="36" class="customer-avatar">
                {{ record.user?.first_name?.charAt(0) || 'U' }}
              </a-avatar>
              <div class="customer-info">
                <span class="customer-name">
                  {{ record.user?.first_name }} {{ record.user?.last_name }}
                </span>
                <span class="customer-email">{{ record.user?.email }}</span>
              </div>
            </div>
          </template>

          <!-- Status -->
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)" class="status-tag">
              {{ record.status }}
            </a-tag>
          </template>

          <!-- Payment -->
          <template v-if="column.key === 'payment'">
            <a-tag v-if="record.payment" :color="record.payment.status === 'COMPLETED' ? 'green' : 'orange'">
              {{ record.payment.status }}
            </a-tag>
            <span v-else class="text-muted">N/A</span>
          </template>

          <!-- Items Count -->
          <template v-if="column.key === 'items'">
            <a-badge :count="record.items?.length || 0" :number-style="{ backgroundColor: 'oklch(0.65 0.2 195)' }" />
          </template>

          <!-- Total -->
          <template v-if="column.key === 'total'">
            <span class="order-total">{{ formatCurrency(record.total) }}</span>
          </template>

          <!-- Date -->
          <template v-if="column.key === 'created_at'">
            <div class="date-cell">
              <span class="date">{{ dayjsInstance(record.created_at).format('MMM D, YYYY') }}</span>
              <span class="time">{{ dayjsInstance(record.created_at).format('h:mm A') }}</span>
            </div>
          </template>

          <!-- Actions -->
          <template v-if="column.key === 'actions'">
            <div class="action-buttons">
              <a-tooltip title="View Details">
                <a-button type="text" size="small" @click="handleViewOrder(record)" class="action-icon-btn">
                  <template #icon>
                    <EyeOutlined />
                  </template>
                </a-button>
              </a-tooltip>
              <a-tooltip title="Update Status">
                <a-button type="text" size="small" @click="handleEditStatus(record)" class="action-icon-btn">
                  <template #icon>
                    <EditOutlined />
                  </template>
                </a-button>
              </a-tooltip>
            </div>
          </template>
        </template>
      </CommonTable>
    </div>

    <!-- Order Details Drawer -->
    <a-drawer v-model:open="orderDetailVisible" title="Order Details" width="600" :body-style="{ padding: 0 }"
      class="order-drawer">
      <div v-if="selectedOrder" class="order-details">
        <div class="detail-section">
          <h3 class="section-title">Order Information</h3>
          <div class="detail-row">
            <span class="detail-label">Order Number:</span>
            <span class="detail-value">{{ selectedOrder.order_number }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status:</span>
            <a-tag :color="getStatusColor(selectedOrder.status)">{{ selectedOrder.status }}</a-tag>
          </div>
          <div class="detail-row">
            <span class="detail-label">Order Date:</span>
            <span class="detail-value">{{ dayjsInstance(selectedOrder.created_at).format('MMMM D, YYYY h:mm A')
            }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Total Amount:</span>
            <span class="detail-value total">{{ formatCurrency(selectedOrder.total) }}</span>
          </div>
        </div>

        <div class="detail-section">
          <h3 class="section-title">Customer Information</h3>
          <div class="detail-row">
            <span class="detail-label">Name:</span>
            <span class="detail-value">{{ selectedOrder.user?.first_name }} {{ selectedOrder.user?.last_name
            }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Email:</span>
            <span class="detail-value">{{ selectedOrder.user?.email }}</span>
          </div>
        </div>

        <div class="detail-section">
          <h3 class="section-title">Order Items</h3>
          <div v-for="item in selectedOrder.items" :key="item.id" class="order-item">
            <div class="item-info">
              <span class="item-name">{{ item.product_name }}</span>
              <span class="item-quantity">Qty: {{ item.quantity }}</span>
            </div>
            <span class="item-price">{{ formatCurrency(item.unit_price * item.quantity) }}</span>
          </div>
        </div>
      </div>
    </a-drawer>

    <!-- Status Update Modal -->
    <a-modal v-model:open="statusModalVisible" title="Update Order Status" @ok="handleUpdateStatus"
      class="status-modal">
      <div class="modal-content">
        <p class="modal-label">Select new status for order {{ selectedOrder?.order_number }}:</p>
        <a-select v-model:value="newStatus" style="width: 100%" size="large">
          <a-select-option v-for="status in statusOptions" :key="status.value" :value="status.value">
            {{ status.label }}
          </a-select-option>
        </a-select>
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
.order-list-container {
  min-height: 100vh;
  background: var(--background);
}

/* Page Header */
.page-header {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 20px;
}

.header-left .page-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0 0 6px 0;
  line-height: 1.2;
}

.header-left .page-subtitle {
  font-size: 15px;
  color: var(--muted-foreground);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-btn,
.refresh-btn {
  height: 40px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.refresh-btn {
  background: oklch(0.65 0.2 195);
  border-color: oklch(0.65 0.2 195);
}

.refresh-btn:hover {
  background: oklch(0.6 0.2 195);
  border-color: oklch(0.6 0.2 195);
  transform: translateY(-2px);
}

/* Statistics Grid */
.statistics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
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
  gap: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, oklch(0.65 0.2 195), oklch(0.6 0.2 180));
  transform: scaleY(0);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.stat-card:hover::before {
  transform: scaleY(1);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: linear-gradient(135deg, oklch(0.65 0.2 195), oklch(0.6 0.2 180));
  color: white;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 13px;
  color: var(--muted-foreground);
  margin: 0 0 6px 0;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0;
  line-height: 1;
}

/* Filter Card */
.filter-card {
  margin-bottom: 20px;
  border-radius: 12px;
  border: 1px solid var(--border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.filter-card :deep(.ant-card-body) {
  padding: 24px;
}

.filter-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.filter-icon {
  font-size: 18px;
  color: oklch(0.65 0.2 195);
}

.filter-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
}

.filter-input :deep(.ant-input),
.filter-select :deep(.ant-select-selector),
.filter-date :deep(.ant-picker) {
  height: 40px;
  border-radius: 8px;
  border-color: var(--border);
}

.clear-btn {
  height: 40px;
  border-radius: 8px;
  border-color: var(--border);
  transition: all 0.3s;
}

.clear-btn:hover {
  border-color: oklch(0.65 0.2 195);
  color: oklch(0.65 0.2 195);
}

/* Bulk Actions */
.bulk-actions-card {
  margin-bottom: 20px;
  border-radius: 12px;
  border: 2px solid oklch(0.65 0.2 195);
  background: oklch(0.98 0.02 195);
}

.bulk-actions-card :deep(.ant-card-body) {
  padding: 16px 24px;
}

.bulk-actions-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.selection-count {
  font-size: 15px;
  font-weight: 600;
  color: oklch(0.65 0.2 195);
}

.bulk-actions {
  display: flex;
  gap: 12px;
}

/* Table Card */
.table-card {
  border-radius: 12px;
  border: 1px solid var(--border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.table-card :deep(.ant-card-body) {
  padding: 0;
}

.orders-table :deep(.ant-table) {
  background: var(--card);
}

.orders-table :deep(.ant-table-thead > tr > th) {
  background: var(--muted);
  color: var(--foreground);
  font-weight: 600;
  border-bottom: 2px solid var(--border);
  padding: 16px;
}

.orders-table :deep(.ant-table-tbody > tr) {
  transition: all 0.2s;
}

.orders-table :deep(.ant-table-tbody > tr:hover) {
  background: var(--accent);
}

.orders-table :deep(.ant-table-tbody > tr > td) {
  padding: 16px;
  border-bottom: 1px solid var(--border);
}

/* Table Cells */
.order-link {
  color: oklch(0.65 0.2 195);
  font-weight: 600;
  transition: all 0.2s;
}

.order-link:hover {
  color: oklch(0.6 0.2 195);
}

.customer-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.customer-avatar {
  background: linear-gradient(135deg, oklch(0.65 0.2 195), oklch(0.6 0.2 180));
  flex-shrink: 0;
  font-weight: 600;
}

.customer-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.customer-name {
  font-weight: 600;
  color: var(--foreground);
  font-size: 14px;
}

.customer-email {
  font-size: 12px;
  color: var(--muted-foreground);
}

.status-tag {
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 6px;
}

.order-total {
  font-weight: 700;
  color: var(--foreground);
  font-size: 15px;
}

.date-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.date-cell .date {
  color: var(--foreground);
  font-weight: 500;
}

.date-cell .time {
  font-size: 12px;
  color: var(--muted-foreground);
}

.text-muted {
  color: var(--muted-foreground);
}

.action-buttons {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.action-icon-btn {
  color: var(--muted-foreground);
  transition: all 0.2s;
}

.action-icon-btn:hover {
  color: oklch(0.65 0.2 195);
  background: oklch(0.98 0.02 195);
}

/* Order Drawer */
.order-drawer :deep(.ant-drawer-header) {
  background: linear-gradient(135deg, oklch(0.65 0.2 195), oklch(0.6 0.2 180));
  color: white;
  border: none;
}

.order-drawer :deep(.ant-drawer-title) {
  color: white;
  font-weight: 600;
  font-size: 18px;
}

.order-drawer :deep(.ant-drawer-close) {
  color: white;
}

.order-details {
  padding: 24px;
}

.detail-section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}

.detail-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
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
  padding: 10px 0;
}

.detail-label {
  font-size: 14px;
  color: var(--muted-foreground);
  font-weight: 500;
}

.detail-value {
  font-size: 14px;
  color: var(--foreground);
  font-weight: 600;
}

.detail-value.total {
  font-size: 18px;
  color: oklch(0.65 0.2 195);
}

.order-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--muted);
  border-radius: 8px;
  margin-bottom: 8px;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
}

.item-quantity {
  font-size: 12px;
  color: var(--muted-foreground);
}

.item-price {
  font-size: 15px;
  font-weight: 700;
  color: var(--foreground);
}

/* Status Modal */
.status-modal :deep(.ant-modal-header) {
  background: linear-gradient(135deg, oklch(0.65 0.2 195), oklch(0.6 0.2 180));
  border: none;
}

.status-modal :deep(.ant-modal-title) {
  color: white;
  font-weight: 600;
}

.modal-content {
  padding: 8px 0;
}

.modal-label {
  margin-bottom: 16px;
  color: var(--foreground);
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .order-list-container {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
  }

  .header-actions {
    width: 100%;
    justify-content: stretch;
  }

  .header-actions button {
    flex: 1;
  }

  .statistics-grid {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
  }

  .stat-card {
    padding: 16px;
    flex-direction: column;
    text-align: center;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }

  .stat-value {
    font-size: 24px;
  }
}

@media print {

  .page-header,
  .filter-card,
  .bulk-actions-card,
  .action-buttons {
    display: none;
  }
}
</style>
