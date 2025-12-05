<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ordersApi, type Order, type OrderQuery, type OrderStatus } from '@/api/orders'
import {
  SearchOutlined,
  EyeOutlined,
  ReloadOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'

const router = useRouter()

// State
const loading = ref(false)
const orders = ref<Order[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// Filters
const searchText = ref('')
const selectedStatus = ref<OrderStatus | undefined>()
const dateRange = ref<[dayjs.Dayjs, dayjs.Dayjs] | null>(null)

onMounted(() => {
  fetchOrders()
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

function handleSearch() {
  currentPage.value = 1
  fetchOrders()
}

function handleTableChange(pagination: any) {
  currentPage.value = pagination.current
  pageSize.value = pagination.pageSize
  fetchOrders()
}

function handleViewOrder(id: number) {
  router.push(`/orders/${id}`)
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
  { title: 'Order #', dataIndex: 'order_number', key: 'order_number', width: 140 },
  { title: 'Customer', key: 'customer', width: 200 },
  { title: 'Status', dataIndex: 'status', key: 'status', width: 120, align: 'center' as const },
  { title: 'Payment', key: 'payment', width: 120, align: 'center' as const },
  { title: 'Items', key: 'items', width: 80, align: 'center' as const },
  { title: 'Total', dataIndex: 'total', key: 'total', width: 120, align: 'right' as const },
  { title: 'Date', dataIndex: 'created_at', key: 'created_at', width: 140 },
  { title: 'Actions', key: 'actions', width: 80, align: 'center' as const, fixed: 'right' as const },
]

const pagination = computed(() => ({
  current: currentPage.value,
  pageSize: pageSize.value,
  total: total.value,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `Total ${total} orders`,
}))
</script>

<template>
  <div class="order-list">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-left">
        <h1>Orders</h1>
        <p>Manage customer orders</p>
      </div>
      <div class="header-right">
        <a-button @click="fetchOrders" :loading="loading">
          <template #icon><ReloadOutlined /></template>
          Refresh
        </a-button>
      </div>
    </div>

    <!-- Filters Card -->
    <a-card :bordered="false" class="filter-card">
      <a-row :gutter="16" align="middle">
        <a-col :xs="24" :sm="12" :md="6">
          <a-input-search
            v-model:value="searchText"
            placeholder="Search orders..."
            allow-clear
            @search="handleSearch"
            @pressEnter="handleSearch"
          >
            <template #prefix><SearchOutlined /></template>
          </a-input-search>
        </a-col>
        <a-col :xs="24" :sm="12" :md="5">
          <a-select
            v-model:value="selectedStatus"
            placeholder="All Status"
            allow-clear
            style="width: 100%"
            @change="handleSearch"
          >
            <a-select-option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :xs="24" :sm="12" :md="7">
          <a-range-picker
            v-model:value="dateRange"
            style="width: 100%"
            @change="handleSearch"
          />
        </a-col>
        <a-col>
          <a-button @click="() => { searchText = ''; selectedStatus = undefined; dateRange = null; handleSearch(); }">
            Clear Filters
          </a-button>
        </a-col>
      </a-row>
    </a-card>

    <!-- Orders Table -->
    <a-card :bordered="false" class="table-card">
      <a-table
        :columns="columns"
        :data-source="orders"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        :scroll="{ x: 1000 }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <!-- Order Number -->
          <template v-if="column.key === 'order_number'">
            <a-typography-link @click="handleViewOrder(record.id)">
              {{ record.order_number }}
            </a-typography-link>
          </template>

          <!-- Customer -->
          <template v-if="column.key === 'customer'">
            <div class="customer-cell">
              <a-avatar :size="32" class="customer-avatar">
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
            <a-tag :color="getStatusColor(record.status)">
              {{ record.status }}
            </a-tag>
          </template>

          <!-- Payment -->
          <template v-if="column.key === 'payment'">
            <a-tag v-if="record.payment" :color="record.payment.status === 'COMPLETED' ? 'green' : 'orange'">
              {{ record.payment.status }}
            </a-tag>
            <span v-else class="text-muted">-</span>
          </template>

          <!-- Items Count -->
          <template v-if="column.key === 'items'">
            <a-badge :count="record.items?.length || 0" :number-style="{ backgroundColor: '#667eea' }" />
          </template>

          <!-- Total -->
          <template v-if="column.key === 'total'">
            <span class="order-total">{{ formatCurrency(record.total) }}</span>
          </template>

          <!-- Date -->
          <template v-if="column.key === 'created_at'">
            <div class="date-cell">
              <span>{{ dayjs(record.created_at).format('MMM D, YYYY') }}</span>
              <span class="time">{{ dayjs(record.created_at).format('h:mm A') }}</span>
            </div>
          </template>

          <!-- Actions -->
          <template v-if="column.key === 'actions'">
            <a-tooltip title="View Details">
              <a-button type="text" size="small" @click="handleViewOrder(record.id)">
                <template #icon><EyeOutlined /></template>
              </a-button>
            </a-tooltip>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<style scoped>
.order-list {
  min-height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
}

.header-left h1 {
  font-size: 28px;
  font-weight: 700;
  color: #262626;
  margin: 0 0 4px 0;
}

.header-left p {
  color: #8c8c8c;
  margin: 0;
}

.filter-card {
  margin-bottom: 24px;
}

.table-card :deep(.ant-card-body) {
  padding: 0;
}

.customer-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.customer-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  flex-shrink: 0;
}

.customer-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.customer-name {
  font-weight: 500;
  color: #262626;
}

.customer-email {
  font-size: 12px;
  color: #8c8c8c;
}

.order-total {
  font-weight: 600;
  color: #262626;
}

.date-cell {
  display: flex;
  flex-direction: column;
}

.date-cell .time {
  font-size: 12px;
  color: #8c8c8c;
}

.text-muted {
  color: #bfbfbf;
}
</style>
