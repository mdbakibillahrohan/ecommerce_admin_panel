<template>
  <div class="customer-list-container">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-title">
          <h1>Customers</h1>
          <p>Manage your customer relationships and track engagement</p>
        </div>
        <div class="header-actions">
          <a-button @click="handleExport('csv')" class="action-btn">
            <template #icon>
              <i class="icon-download"></i>
            </template>
            Export
          </a-button>
          <a-button type="primary" @click="router.push('/customers/new')" class="action-btn-primary">
            <template #icon>
              <i class="icon-plus"></i>
            </template>
            Add Customer
          </a-button>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <template v-if="loading">
        <StatCardSkeleton v-for="i in 4" :key="i" />
      </template>
      <template v-else>
        <div class="stat-card">
          <div class="stat-icon"
            style="background: linear-gradient(135deg, oklch(0.65 0.25 210) 0%, oklch(0.55 0.20 220) 100%)">
            <i class="icon-users"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">Total Customers</div>
            <div class="stat-value">{{ statistics.totalCustomers }}</div>
            <div class="stat-change positive">+{{ statistics.newThisMonth }} this month</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon"
            style="background: linear-gradient(135deg, oklch(0.65 0.25 160) 0%, oklch(0.55 0.20 170) 100%)">
            <i class="icon-dollar"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">Total Revenue</div>
            <div class="stat-value">BDT {{ formatCurrency(statistics.totalRevenue) }}</div>
            <div class="stat-change positive">+12.5% vs last month</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon"
            style="background: linear-gradient(135deg, oklch(0.75 0.20 140) 0%, oklch(0.65 0.15 150) 100%)">
            <i class="icon-shopping"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">Avg Order Value</div>
            <div class="stat-value">BDT {{ formatCurrency(statistics.avgOrderValue) }}</div>
            <div class="stat-change positive">+8.3% increase</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon"
            style="background: linear-gradient(135deg, oklch(0.70 0.25 40) 0%, oklch(0.60 0.20 50) 100%)">
            <i class="icon-repeat"></i>
          </div>
          <div class="stat-content">
            <div class="stat-label">Repeat Customers</div>
            <div class="stat-value">{{ statistics.repeatCustomers }}%</div>
            <div class="stat-change positive">+5.2% retention</div>
          </div>
        </div>
      </template>
    </div>

    <!-- Filters Section -->
    <div class="filters-section">
      <div class="filters-row">
        <a-input-search v-model:value="searchQuery" placeholder="Search by name, email, or phone..."
          class="search-input" @search="handleSearch">
          <template #prefix>
            <i class="icon-search"></i>
          </template>
        </a-input-search>

        <a-select v-model:value="filters.group" placeholder="All Groups" class="filter-select" allowClear
          @change="handleFilterChange">
          <a-select-option value="">All Groups</a-select-option>
          <a-select-option value="vip">VIP Customers</a-select-option>
          <a-select-option value="wholesale">Wholesale</a-select-option>
          <a-select-option value="retail">Retail</a-select-option>
        </a-select>

        <a-select v-model:value="filters.status" placeholder="All Status" class="filter-select" allowClear
          @change="handleFilterChange">
          <a-select-option value="">All Status</a-select-option>
          <a-select-option value="active">Active</a-select-option>
          <a-select-option value="inactive">Inactive</a-select-option>
        </a-select>

        <a-range-picker v-model:value="filters.dateRange" class="filter-date" @change="handleFilterChange" />

        <a-button @click="clearFilters" class="clear-filters-btn">
          <i class="icon-close"></i>
          Clear Filters
        </a-button>
      </div>

      <div class="bulk-actions" v-if="selectedRowKeys.length > 0">
        <span class="selected-count">{{ selectedRowKeys.length }} selected</span>
        <a-button @click="handleBulkAction('group')" class="bulk-btn">
          <i class="icon-tag"></i>
          Assign Group
        </a-button>
        <a-button @click="handleBulkAction('export')" class="bulk-btn">
          <i class="icon-download"></i>
          Export Selected
        </a-button>
        <a-button danger @click="handleBulkAction('delete')" class="bulk-btn">
          <i class="icon-trash"></i>
          Delete
        </a-button>
      </div>
    </div>

    <!-- Customer Table -->
    <div class="table-container">
      <TableSkeleton v-if="loading" :columns="6" :rows="8" />
      <a-table v-else :columns="columns" :data-source="customers" :pagination="pagination" :row-selection="rowSelection"
        @change="handleTableChange" rowKey="id">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'customer'">
            <div class="customer-info">
              <a-avatar :size="40" :src="record.avatar" class="customer-avatar">
                {{ getInitials(record.first_name, record.last_name) }}
              </a-avatar>
              <div class="customer-details">
                <a @click="viewCustomerDetails(record)" class="customer-name">
                  {{ record.first_name }} {{ record.last_name }}
                </a>
                <span class="customer-email">{{ record.email }}</span>
              </div>
            </div>
          </template>

          <template v-if="column.key === 'orders'">
            <div class="orders-cell">
              <span class="orders-count">{{ record.orders_count || 0 }}</span>
              <span class="orders-label">orders</span>
            </div>
          </template>

          <template v-if="column.key === 'spent'">
            <div class="spent-cell">
              <span class="spent-amount">BDT {{ formatCurrency(record.total_spent || 0) }}</span>
              <div class="spent-bar">
                <div class="spent-progress" :style="{ width: getSpentPercentage(record.total_spent) }"></div>
              </div>
            </div>
          </template>

          <template v-if="column.key === 'groups'">
            <div class="groups-cell">
              <a-tag v-for="group in (record.groups || []).slice(0, 2)" :key="group.id" class="group-tag">
                {{ group.name }}
              </a-tag>
              <a-tag v-if="(record.groups || []).length > 2" class="more-tag">
                +{{ (record.groups || []).length - 2 }}
              </a-tag>
            </div>
          </template>

          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 'active' ? 'success' : 'default'" class="status-tag">
              {{ record.status === 'active' ? 'Active' : 'Inactive' }}
            </a-tag>
          </template>

          <template v-if="column.key === 'created_at'">
            <div class="date-cell">
              <span class="date-text">{{ formatDate(record.created_at) }}</span>
              <span class="date-time">{{ formatTime(record.created_at) }}</span>
            </div>
          </template>

          <template v-if="column.key === 'actions'">
            <div class="actions-cell">
              <a-button type="text" @click="viewCustomerDetails(record)" class="action-icon">
                <i class="icon-eye"></i>
              </a-button>
              <a-button type="text" @click="editCustomer(record)" class="action-icon">
                <i class="icon-edit"></i>
              </a-button>
              <a-button type="text" danger @click="deleteCustomer(record)" class="action-icon">
                <i class="icon-trash"></i>
              </a-button>
            </div>
          </template>
        </template>
      </a-table>
    </div>

    <!-- Customer Details Drawer -->
    <a-drawer v-model:open="detailsDrawerVisible" title="Customer Details" placement="right" :width="600"
      class="customer-drawer">
      <div v-if="selectedCustomer" class="drawer-content">
        <!-- Customer Header -->
        <div class="drawer-header">
          <a-avatar :size="80" :src="selectedCustomer.avatar" class="drawer-avatar">
            {{ getInitials(selectedCustomer.first_name, selectedCustomer.last_name) }}
          </a-avatar>
          <div class="drawer-info">
            <h2>{{ selectedCustomer.first_name }} {{ selectedCustomer.last_name }}</h2>
            <p>{{ selectedCustomer.email }}</p>
            <a-tag :color="selectedCustomer.status === 'active' ? 'success' : 'default'" class="status-tag">
              {{ selectedCustomer.status === 'active' ? 'Active' : 'Inactive' }}
            </a-tag>
          </div>
        </div>

        <!-- Customer Stats -->
        <div class="drawer-stats">
          <div class="drawer-stat">
            <span class="drawer-stat-label">Total Orders</span>
            <span class="drawer-stat-value">{{ selectedCustomer.orders_count || 0 }}</span>
          </div>
          <div class="drawer-stat">
            <span class="drawer-stat-label">Total Spent</span>
            <span class="drawer-stat-value">BDT {{ formatCurrency(selectedCustomer.total_spent || 0) }}</span>
          </div>
          <div class="drawer-stat">
            <span class="drawer-stat-label">Avg Order</span>
            <span class="drawer-stat-value">BDT {{ formatCurrency((selectedCustomer.total_spent || 0) /
              (selectedCustomer.orders_count || 1)) }}</span>
          </div>
        </div>

        <!-- Customer Details -->
        <div class="drawer-section">
          <h3>Contact Information</h3>
          <div class="detail-row">
            <span class="detail-label">Email</span>
            <span class="detail-value">{{ selectedCustomer.email }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Phone</span>
            <span class="detail-value">{{ selectedCustomer.phone || 'Not provided' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Address</span>
            <span class="detail-value">{{ selectedCustomer.address || 'Not provided' }}</span>
          </div>
        </div>

        <div class="drawer-section">
          <h3>Customer Groups</h3>
          <div class="groups-list">
            <a-tag v-for="group in (selectedCustomer.groups || [])" :key="group.id" class="group-tag">
              {{ group.name }}
            </a-tag>
            <span v-if="!selectedCustomer.groups || selectedCustomer.groups.length === 0" class="empty-text">
              No groups assigned
            </span>
          </div>
        </div>

        <div class="drawer-section">
          <h3>Account Information</h3>
          <div class="detail-row">
            <span class="detail-label">Customer Since</span>
            <span class="detail-value">{{ formatDate(selectedCustomer.created_at) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Last Order</span>
            <span class="detail-value">{{ selectedCustomer.last_order_date ?
              formatDate(selectedCustomer.last_order_date) :
              'No orders yet' }}</span>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="drawer-actions">
          <a-button type="primary" block @click="editCustomer(selectedCustomer)">
            Edit Customer
          </a-button>
          <a-button block @click="router.push(`/orders?customer=${selectedCustomer.id}`)">
            View Orders
          </a-button>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import TableSkeleton from '@/modules/shared/components/skeletons/TableSkeleton.vue'
import StatCardSkeleton from '@/modules/shared/components/skeletons/StatCardSkeleton.vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { customerService, type Customer, type CustomerQueryParams } from '@/modules/customers/services/customer.service'
import dayjs, { type Dayjs } from 'dayjs'

const router = useRouter()
const loading = ref(false)
const customers = ref<Customer[]>([])
const searchQuery = ref('')
const detailsDrawerVisible = ref(false)
const selectedCustomer = ref<Customer | null>(null)
const selectedRowKeys = ref<number[]>([])

const filters = ref({
  group: '',
  status: '',
  dateRange: null as [Dayjs, Dayjs] | null,
})

const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
})

const statistics = ref({
  totalCustomers: 1247,
  newThisMonth: 89,
  totalRevenue: 456789,
  avgOrderValue: 3450,
  repeatCustomers: 68,
})

const columns = [
  { title: 'Customer', key: 'customer', width: 250 },
  { title: 'Orders', key: 'orders', align: 'center' as const, width: 100 },
  { title: 'Total Spent', key: 'spent', width: 200 },
  { title: 'Groups', key: 'groups', width: 200 },
  { title: 'Status', key: 'status', align: 'center' as const, width: 100 },
  { title: 'Joined', key: 'created_at', width: 150 },
  { title: 'Actions', key: 'actions', align: 'center' as const, width: 120, fixed: 'right' as const },
]

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: number[]) => {
    selectedRowKeys.value = keys
  },
}))

const fetchCustomers = async () => {
  loading.value = true
  try {
    const { current, pageSize } = pagination.value
    const params: CustomerQueryParams = {
      page: current,
      limit: pageSize,
    }
    if (searchQuery.value) params.search = searchQuery.value
    if (filters.value.group) params.group = filters.value.group
    if (filters.value.status) params.status = filters.value.status

    const data = await customerService.getCustomers(params)
    customers.value = data.data
    pagination.value.total = data.total
  } catch (error: unknown) {
    if (error instanceof Error) {
      message.error(error.message)
    } else {
      message.error('Failed to fetch customers')
    }
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.value.current = 1
  fetchCustomers()
}

const handleFilterChange = () => {
  pagination.value.current = 1
  fetchCustomers()
}

const clearFilters = () => {
  searchQuery.value = ''
  filters.value = {
    group: '',
    status: '',
    dateRange: null,
  }
  fetchCustomers()
}

const handleTableChange = (pag: { current: number; pageSize: number; total: number }) => {
  pagination.value = pag
  fetchCustomers()
}

const viewCustomerDetails = (customer: Customer) => {
  selectedCustomer.value = customer
  detailsDrawerVisible.value = true
}

const editCustomer = (customer: Customer) => {
  router.push(`/customers/${customer.id}/edit`)
}

const deleteCustomer = async (customer: Customer) => {
  message.success(`Customer ${customer.first_name} deleted successfully`)
}

const handleBulkAction = (action: string) => {
  message.success(`Bulk action: ${action}`)
}

const handleExport = (format: string) => {
  message.success(`Exporting customers as ${format}`)
}

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-BD').format(value)
}

const formatDate = (date: string) => {
  return dayjs(date).format('MMM D, YYYY')
}

const formatTime = (date: string) => {
  return dayjs(date).format('h:mm A')
}

const getSpentPercentage = (spent: number) => {
  const max = 100000
  return `${Math.min((spent / max) * 100, 100)}%`
}

onMounted(() => {
  fetchCustomers()
})
</script>

<style scoped>
.customer-list-container {
  min-height: 100vh;
  background: var(--background);
}

/* Header Section */
.page-header {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.header-title h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0 0 4px 0;
}

.header-title p {
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.action-btn,
.action-btn-primary {
  height: 40px;
  padding: 0 20px;
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-btn {
  background: var(--background);
  border: 1px solid var(--border);
  color: var(--foreground);
}

.action-btn:hover {
  border-color: oklch(0.65 0.25 180);
  color: oklch(0.65 0.25 180);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.15);
}

.action-btn-primary {
  background: linear-gradient(135deg, oklch(0.65 0.25 180) 0%, oklch(0.55 0.20 190) 100%);
  border: none;
  color: white;
}

.action-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(13, 148, 136, 0.3);
}

/* Statistics Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  gap: 16px;
  align-items: flex-start;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: oklch(0.65 0.25 180);
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
  margin-bottom: 4px;
}

.stat-change {
  font-size: 12px;
  font-weight: 500;
}

.stat-change.positive {
  color: oklch(0.65 0.20 160);
}

/* Filters Section */
.filters-section {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.filters-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.search-input {
  flex: 1;
  min-width: 250px;
}

.search-input :deep(.ant-input) {
  height: 40px;
  border-radius: 8px;
  border-color: var(--border);
  background: var(--background);
  color: var(--foreground);
}

.search-input :deep(.ant-input:focus) {
  border-color: oklch(0.65 0.25 180);
  box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.1);
}

.filter-select,
.filter-date {
  min-width: 180px;
}

.filter-select :deep(.ant-select-selector),
.filter-date :deep(.ant-picker) {
  height: 40px;
  border-radius: 8px;
  border-color: var(--border);
  background: var(--background);
}

.clear-filters-btn {
  height: 40px;
  padding: 0 16px;
  border-radius: 8px;
  border-color: var(--border);
  color: var(--muted-foreground);
  transition: all 0.3s;
}

.clear-filters-btn:hover {
  border-color: oklch(0.70 0.20 20);
  color: oklch(0.70 0.20 20);
}

.bulk-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.selected-count {
  font-size: 14px;
  font-weight: 600;
  color: oklch(0.65 0.25 180);
  margin-right: auto;
}

.bulk-btn {
  height: 36px;
  padding: 0 16px;
  border-radius: 8px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s;
}

/* Table Container */
.table-container {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

.table-container :deep(.ant-table) {
  background: transparent;
}

.table-container :deep(.ant-table-thead > tr > th) {
  background: var(--muted);
  color: var(--foreground);
  font-weight: 600;
  border-bottom: 1px solid var(--border);
}

.table-container :deep(.ant-table-tbody > tr) {
  transition: all 0.2s;
}

.table-container :deep(.ant-table-tbody > tr:hover) {
  background: var(--muted);
}

.table-container :deep(.ant-table-tbody > tr > td) {
  border-bottom: 1px solid var(--border);
}

/* Customer Info Cell */
.customer-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.customer-avatar {
  background: linear-gradient(135deg, oklch(0.65 0.25 180) 0%, oklch(0.55 0.20 190) 100%);
  color: white;
  font-weight: 600;
  flex-shrink: 0;
}

.customer-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.customer-name {
  font-weight: 600;
  color: var(--foreground);
  transition: color 0.2s;
}

.customer-name:hover {
  color: oklch(0.65 0.25 180);
}

.customer-email {
  font-size: 13px;
  color: var(--muted-foreground);
}

/* Orders Cell */
.orders-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.orders-count {
  font-size: 18px;
  font-weight: 700;
  color: var(--foreground);
}

.orders-label {
  font-size: 12px;
  color: var(--muted-foreground);
}

/* Spent Cell */
.spent-cell {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.spent-amount {
  font-weight: 600;
  color: var(--foreground);
}

.spent-bar {
  height: 4px;
  background: var(--muted);
  border-radius: 2px;
  overflow: hidden;
}

.spent-progress {
  height: 100%;
  background: linear-gradient(90deg, oklch(0.65 0.25 180) 0%, oklch(0.55 0.20 190) 100%);
  transition: width 0.3s;
}

/* Groups Cell */
.groups-cell {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.group-tag {
  background: oklch(0.65 0.25 180 / 0.1);
  color: oklch(0.65 0.25 180);
  border: 1px solid oklch(0.65 0.25 180 / 0.2);
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 12px;
}

.more-tag {
  background: var(--muted);
  color: var(--muted-foreground);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 12px;
}

/* Status Tag */
.status-tag {
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

/* Date Cell */
.date-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.date-text {
  font-size: 14px;
  color: var(--foreground);
}

.date-time {
  font-size: 12px;
  color: var(--muted-foreground);
}

/* Actions Cell */
.actions-cell {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.action-icon {
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.action-icon:hover {
  background: var(--muted);
  transform: scale(1.1);
}

/* Customer Drawer */
.customer-drawer :deep(.ant-drawer-header) {
  background: linear-gradient(135deg, oklch(0.65 0.25 180) 0%, oklch(0.55 0.20 190) 100%);
  border: none;
}

.customer-drawer :deep(.ant-drawer-title) {
  color: white;
  font-weight: 600;
}

.customer-drawer :deep(.ant-drawer-close) {
  color: white;
}

.customer-drawer :deep(.ant-drawer-body) {
  background: var(--background);
  padding: 0;
}

.drawer-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
}

.drawer-header {
  display: flex;
  gap: 16px;
  align-items: center;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}

.drawer-avatar {
  background: linear-gradient(135deg, oklch(0.65 0.25 180) 0%, oklch(0.55 0.20 190) 100%);
  color: white;
  font-weight: 700;
  font-size: 32px;
}

.drawer-info h2 {
  font-size: 20px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0 0 4px 0;
}

.drawer-info p {
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0 0 8px 0;
}

.drawer-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.drawer-stat {
  background: var(--muted);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: center;
}

.drawer-stat-label {
  font-size: 12px;
  color: var(--muted-foreground);
}

.drawer-stat-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--foreground);
}

.drawer-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.drawer-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  background: var(--muted);
  border-radius: 8px;
}

.detail-label {
  font-size: 14px;
  color: var(--muted-foreground);
}

.detail-value {
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  text-align: right;
}

.groups-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.empty-text {
  font-size: 14px;
  color: var(--muted-foreground);
  font-style: italic;
}

.drawer-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}

/* Icon Placeholders */
.icon-users::before {
  content: '👥';
}

.icon-dollar::before {
  content: '💰';
}

.icon-shopping::before {
  content: '🛍️';
}

.icon-repeat::before {
  content: '🔄';
}

.icon-download::before {
  content: '⬇️';
}

.icon-plus::before {
  content: '+';
}

.icon-search::before {
  content: '🔍';
}

.icon-close::before {
  content: '✕';
}

.icon-tag::before {
  content: '🏷️';
}

.icon-trash::before {
  content: '🗑️';
}

.icon-eye::before {
  content: '👁️';
}

.icon-edit::before {
  content: '✏️';
}

/* Responsive Design */
@media (max-width: 768px) {
  .customer-list-container {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filters-row {
    flex-direction: column;
  }

  .search-input,
  .filter-select,
  .filter-date {
    width: 100%;
  }
}
</style>
