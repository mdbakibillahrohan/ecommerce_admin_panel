<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useDashboardStore } from '@/modules/dashboard/store'
import StatCard from '@/modules/dashboard/components/StatCard.vue'
import SalesChart from '@/modules/dashboard/components/SalesChart.vue'
import OrderStatusChart from '@/modules/dashboard/components/OrderStatusChart.vue'
import {
  UserOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  DollarOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  RiseOutlined,
  FallOutlined,
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

const dashboardStore = useDashboardStore()
const selectedPeriod = ref<'today' | 'week' | 'month' | 'year'>('month')

onMounted(() => {
  dashboardStore.fetchDashboard({ period: selectedPeriod.value })
})

const overview = computed(() => dashboardStore.dashboardData?.overview)
const orders = computed(() => dashboardStore.dashboardData?.orders)
const sales = computed(() => dashboardStore.dashboardData?.sales)
const products = computed(() => dashboardStore.dashboardData?.products)
const recentOrders = computed(() => dashboardStore.dashboardData?.recentOrders || [])
const topProducts = computed(() => dashboardStore.dashboardData?.topProducts || [])
const lowStockAlerts = computed(() => dashboardStore.dashboardData?.lowStockAlerts || [])
const recentActivity = computed(() => dashboardStore.dashboardData?.recentActivity || [])

function handlePeriodChange(period: 'today' | 'week' | 'month' | 'year') {
  selectedPeriod.value = period
  dashboardStore.fetchDashboard({ period })
}

function refreshDashboard() {
  dashboardStore.fetchDashboard({ period: selectedPeriod.value })
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

function getStockStatusColor(status: string) {
  const colors: Record<string, string> = {
    out_of_stock: 'red',
    critical: 'orange',
    low: 'gold',
  }
  return colors[status] || 'default'
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'order':
      return ShoppingCartOutlined
    case 'user':
      return UserOutlined
    case 'product':
      return ShoppingOutlined
    case 'payment':
      return DollarOutlined
    default:
      return ClockCircleOutlined
  }
}

const orderColumns = [
  { title: 'Order #', dataIndex: 'orderNumber', key: 'orderNumber' },
  { title: 'Customer', dataIndex: 'customerName', key: 'customerName' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  { title: 'Items', dataIndex: 'itemCount', key: 'itemCount', align: 'center' as const },
  { title: 'Total', dataIndex: 'total', key: 'total', align: 'right' as const },
  { title: 'Date', dataIndex: 'createdAt', key: 'createdAt' },
]
</script>

<template>
  <div class="dashboard">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-left">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your store.</p>
      </div>
      <div class="header-right">
        <a-radio-group v-model:value="selectedPeriod" button-style="solid" @change="handlePeriodChange(selectedPeriod)">
          <a-radio-button value="today">Today</a-radio-button>
          <a-radio-button value="week">Week</a-radio-button>
          <a-radio-button value="month">Month</a-radio-button>
          <a-radio-button value="year">Year</a-radio-button>
        </a-radio-group>
        <a-button @click="refreshDashboard" :loading="dashboardStore.loading">
          <template #icon>
            <ReloadOutlined />
          </template>
          Refresh
        </a-button>
      </div>
    </div>

    <!-- Loading State -->
    <a-spin :spinning="dashboardStore.loading" tip="Loading dashboard...">
      <!-- Overview Stats -->
      <a-row :gutter="[24, 24]" class="stats-row">
        <a-col :xs="24" :sm="12" :lg="6">
          <StatCard title="Total Users" :value="overview?.totalUsers || 0" :icon="UserOutlined" color="#667eea"
            :trend="overview?.newUsersThisWeek" trendLabel="new this week" />
        </a-col>
        <a-col :xs="24" :sm="12" :lg="6">
          <StatCard title="Total Orders" :value="overview?.totalOrders || 0" :icon="ShoppingCartOutlined"
            color="#52c41a" :trend="overview?.todayOrders" trendLabel="today" />
        </a-col>
        <a-col :xs="24" :sm="12" :lg="6">
          <StatCard title="Total Products" :value="overview?.totalProducts || 0" :icon="ShoppingOutlined"
            color="#fa8c16" />
        </a-col>
        <a-col :xs="24" :sm="12" :lg="6">
          <StatCard title="Total Revenue" :value="formatCurrency(overview?.totalRevenue || 0)" :icon="DollarOutlined"
            color="#eb2f96" :trend="formatCurrency(overview?.todayRevenue || 0)" trendLabel="today" isFormatted />
        </a-col>
      </a-row>

      <!-- Charts Row -->
      <a-row :gutter="[24, 24]" class="charts-row">
        <a-col :xs="24" :lg="16">
          <a-card title="Sales Overview" :bordered="false" class="chart-card">
            <template #extra>
              <div class="chart-stats">
                <div class="stat-item">
                  <span class="stat-label">Total Revenue</span>
                  <span class="stat-value">{{ formatCurrency(sales?.totalRevenue || 0) }}</span>
                </div>
                <a-divider type="vertical" />
                <div class="stat-item" :class="{ positive: (sales?.comparison?.growthPercentage || 0) >= 0 }">
                  <component :is="(sales?.comparison?.growthPercentage || 0) >= 0 ? RiseOutlined : FallOutlined
                    " />
                  <span>{{ Math.abs(sales?.comparison?.growthPercentage || 0).toFixed(1) }}%</span>
                </div>
              </div>
            </template>
            <SalesChart :data="sales?.data || []" />
          </a-card>
        </a-col>
        <a-col :xs="24" :lg="8">
          <a-card title="Order Status" :bordered="false" class="chart-card">
            <OrderStatusChart :data="orders" />
          </a-card>
        </a-col>
      </a-row>

      <!-- Content Row -->
      <a-row :gutter="[24, 24]" class="content-row">
        <!-- Recent Orders -->
        <a-col :xs="24" :xl="14">
          <a-card title="Recent Orders" :bordered="false" class="table-card">
            <template #extra>
              <router-link to="/orders">View All</router-link>
            </template>
            <a-table :columns="orderColumns" :data-source="recentOrders" :pagination="false" size="small" row-key="id">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'orderNumber'">
                  <a-typography-link @click="() => $router.push(`/orders/${record.id}`)">
                    {{ record.orderNumber }}
                  </a-typography-link>
                </template>
                <template v-if="column.key === 'status'">
                  <a-tag :color="getStatusColor(record.status)">
                    {{ record.status }}
                  </a-tag>
                </template>
                <template v-if="column.key === 'total'">
                  {{ formatCurrency(record.total) }}
                </template>
                <template v-if="column.key === 'createdAt'">
                  {{ dayjs(record.createdAt).fromNow() }}
                </template>
              </template>
            </a-table>
          </a-card>
        </a-col>

        <!-- Top Products -->
        <a-col :xs="24" :xl="10">
          <a-card title="Top Selling Products" :bordered="false" class="list-card">
            <template #extra>
              <router-link to="/products">View All</router-link>
            </template>
            <a-list :data-source="topProducts" item-layout="horizontal" :split="false">
              <template #renderItem="{ item, index }">
                <a-list-item>
                  <a-list-item-meta>
                    <template #avatar>
                      <a-avatar :style="{
                        background: `linear-gradient(135deg, ${['oklch(0.65 0.18 210)', 'oklch(0.7 0.17 150)', 'oklch(0.7 0.15 50)', 'oklch(0.65 0.2 350)', 'oklch(0.6 0.2 280)'][index % 5]} 0%, ${['oklch(0.55 0.2 280)', 'oklch(0.6 0.19 145)', 'oklch(0.6 0.17 45)', 'oklch(0.55 0.22 345)', 'oklch(0.5 0.22 275)'][index % 5]} 100%)`,
                      }">
                        {{ index + 1 }}
                      </a-avatar>
                    </template>
                    <template #title>
                      <router-link :to="`/products/${item.id}/edit`">
                        {{ item.name }}
                      </router-link>
                    </template>
                    <template #description>
                      <div class="product-stats">
                        <span>{{ item.unitsSold }} sold</span>
                        <a-divider type="vertical" />
                        <span>{{ formatCurrency(item.revenue) }}</span>
                        <a-divider type="vertical" />
                        <a-rate :value="item.averageRating" disabled allow-half :style="{ fontSize: '12px' }" />
                      </div>
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
          </a-card>
        </a-col>
      </a-row>

      <!-- Bottom Row -->
      <a-row :gutter="[24, 24]" class="bottom-row">
        <!-- Low Stock Alerts -->
        <a-col :xs="24" :lg="12">
          <a-card title="Low Stock Alerts" :bordered="false" class="alert-card">
            <template #extra>
              <a-badge :count="lowStockAlerts.length" :number-style="{ backgroundColor: '#ff4d4f' }" />
            </template>
            <a-list v-if="lowStockAlerts.length > 0" :data-source="lowStockAlerts.slice(0, 5)" item-layout="horizontal"
              size="small">
              <template #renderItem="{ item }">
                <a-list-item>
                  <a-list-item-meta>
                    <template #avatar>
                      <WarningOutlined :style="{
                        fontSize: '20px',
                        color: getStockStatusColor(item.status) === 'red' ? '#ff4d4f' : '#faad14',
                      }" />
                    </template>
                    <template #title>
                      {{ item.productName }}
                      <span v-if="item.variantName" class="variant-name">
                        ({{ item.variantName }})
                      </span>
                    </template>
                    <template #description>
                      <a-tag :color="getStockStatusColor(item.status)">
                        {{ item.currentStock }} / {{ item.threshold }}
                      </a-tag>
                      <span class="stock-status">{{ item.status.replace('_', ' ') }}</span>
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </template>
            </a-list>
            <a-empty v-else description="No low stock alerts" :image="false" />
          </a-card>
        </a-col>

        <!-- Recent Activity -->
        <a-col :xs="24" :lg="12">
          <a-card title="Recent Activity" :bordered="false" class="activity-card">
            <a-timeline v-if="recentActivity.length > 0">
              <a-timeline-item v-for="activity in recentActivity.slice(0, 6)"
                :key="activity.entityId + activity.timestamp" :color="activity.type === 'order'
                  ? 'green'
                  : activity.type === 'payment'
                    ? 'blue'
                    : 'gray'
                  ">
                <template #dot>
                  <component :is="getActivityIcon(activity.type)" style="font-size: 16px" />
                </template>
                <p class="activity-description">{{ activity.description }}</p>
                <p class="activity-time">{{ dayjs(activity.timestamp).fromNow() }}</p>
              </a-timeline-item>
            </a-timeline>
            <a-empty v-else description="No recent activity" :image="false" />
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<style scoped>
.dashboard {
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
  color: var(--foreground);
  margin: 0 0 4px 0;
}

.header-left p {
  color: var(--muted-foreground);
  margin: 0;
}

.header-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.stats-row {
  margin-bottom: 24px;
}

.charts-row {
  margin-bottom: 24px;
}

.chart-card {
  height: 100%;
}

.chart-card :deep(.ant-card-body) {
  padding-top: 12px;
}

.chart-stats {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-label {
  color: var(--muted-foreground);
  font-size: 13px;
}

.stat-value {
  font-weight: 600;
  color: var(--foreground);
}

.stat-item.positive {
  color: oklch(0.7 0.17 150);
}

.content-row {
  margin-bottom: 24px;
}

.table-card :deep(.ant-card-body) {
  padding: 0;
}

.table-card :deep(.ant-card-extra) {
  color: var(--primary);
}

.table-card :deep(.ant-card-extra):hover {
  color: var(--primary-hover);
}

.table-card :deep(.ant-table-wrapper) {
  padding: 0 24px 24px;
}

.list-card :deep(.ant-list-item) {
  padding: 12px 0;
}

.list-card :deep(.ant-card-extra) {
  color: var(--primary);
}

.list-card :deep(.ant-card-extra):hover {
  color: var(--primary-hover);
}

.product-stats {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--muted-foreground);
}

.bottom-row :deep(.ant-card) {
  height: 100%;
}

.variant-name {
  color: var(--muted-foreground);
  font-size: 13px;
}

.stock-status {
  margin-left: 8px;
  text-transform: capitalize;
  color: var(--muted-foreground);
  font-size: 13px;
}

.activity-description {
  margin: 0;
  color: var(--foreground);
}

.activity-time {
  margin: 4px 0 0 0;
  font-size: 12px;
  color: var(--muted-foreground);
}

.alert-card :deep(.ant-list-item) {
  padding: 8px 0;
}
</style>
