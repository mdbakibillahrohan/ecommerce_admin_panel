<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { paymentsApi, type Payment } from '@/api/payments'
import {
  ReloadOutlined,
  RollbackOutlined,
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import dayjs from 'dayjs'

// State
const loading = ref(false)
const payments = ref<Payment[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const showRefundModal = ref(false)
const refunding = ref(false)

// Refund
const refundPayment = ref<Payment | null>(null)
const refundAmount = ref(0)
const refundReason = ref('')

onMounted(() => {
  fetchPayments()
})

async function fetchPayments() {
  loading.value = true
  try {
    const response = await paymentsApi.getAll(currentPage.value, pageSize.value)
    payments.value = response.data
    total.value = response.total
  } catch (error) {
    message.error('Failed to fetch payments')
    console.error(error)
  } finally {
    loading.value = false
  }
}

function handleTableChange(pagination: any) {
  currentPage.value = pagination.current
  pageSize.value = pagination.pageSize
  fetchPayments()
}

function openRefundModal(payment: Payment) {
  refundPayment.value = payment
  refundAmount.value = payment.amount
  refundReason.value = ''
  showRefundModal.value = true
}

async function handleRefund() {
  if (!refundPayment.value) return
  
  refunding.value = true
  try {
    await paymentsApi.refund(refundPayment.value.id, {
      amount: refundAmount.value,
      reason: refundReason.value || undefined,
    })
    message.success('Payment refunded successfully')
    showRefundModal.value = false
    fetchPayments()
  } catch (error) {
    message.error('Failed to process refund')
    console.error(error)
  } finally {
    refunding.value = false
  }
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
    COMPLETED: 'green',
    FAILED: 'red',
    REFUNDED: 'purple',
  }
  return colors[status] || 'default'
}

const columns = [
  { title: 'Transaction ID', dataIndex: 'transaction_id', key: 'transaction_id', width: 180 },
  { title: 'Order', key: 'order', width: 140 },
  { title: 'Customer', key: 'customer', width: 200 },
  { title: 'Method', dataIndex: 'payment_method', key: 'method', width: 120 },
  { title: 'Amount', dataIndex: 'amount', key: 'amount', width: 120, align: 'right' as const },
  { title: 'Status', dataIndex: 'status', key: 'status', width: 120, align: 'center' as const },
  { title: 'Date', dataIndex: 'created_at', key: 'date', width: 150 },
  { title: 'Actions', key: 'actions', width: 100, align: 'center' as const },
]

const pagination = computed(() => ({
  current: currentPage.value,
  pageSize: pageSize.value,
  total: total.value,
  showSizeChanger: true,
  showTotal: (total: number) => `Total ${total} payments`,
}))
</script>

<template>
  <div class="payment-list">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-left">
        <h1>Payments</h1>
        <p>View and manage payment transactions</p>
      </div>
      <div class="header-right">
        <a-button @click="fetchPayments" :loading="loading">
          <template #icon><ReloadOutlined /></template>
          Refresh
        </a-button>
      </div>
    </div>

    <!-- Payments Table -->
    <a-card :bordered="false" class="table-card">
      <a-table
        :columns="columns"
        :data-source="payments"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        :scroll="{ x: 1100 }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <!-- Transaction ID -->
          <template v-if="column.key === 'transaction_id'">
            <code v-if="record.transaction_id">{{ record.transaction_id }}</code>
            <span v-else class="text-muted">-</span>
          </template>

          <!-- Order -->
          <template v-if="column.key === 'order'">
            <router-link v-if="record.order" :to="`/orders/${record.order.id}`">
              {{ record.order.order_number }}
            </router-link>
            <span v-else class="text-muted">-</span>
          </template>

          <!-- Customer -->
          <template v-if="column.key === 'customer'">
            <div v-if="record.order?.user" class="customer-cell">
              <span class="customer-name">
                {{ record.order.user.first_name }} {{ record.order.user.last_name }}
              </span>
              <span class="customer-email">{{ record.order.user.email }}</span>
            </div>
            <span v-else class="text-muted">-</span>
          </template>

          <!-- Amount -->
          <template v-if="column.key === 'amount'">
            <span class="amount">{{ formatCurrency(record.amount) }}</span>
            <div v-if="record.refund_amount" class="refund-amount">
              Refunded: {{ formatCurrency(record.refund_amount) }}
            </div>
          </template>

          <!-- Status -->
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)">
              {{ record.status }}
            </a-tag>
          </template>

          <!-- Date -->
          <template v-if="column.key === 'date'">
            <div class="date-cell">
              <span>{{ dayjs(record.created_at).format('MMM D, YYYY') }}</span>
              <span class="time">{{ dayjs(record.created_at).format('h:mm A') }}</span>
            </div>
          </template>

          <!-- Actions -->
          <template v-if="column.key === 'actions'">
            <a-tooltip title="Refund" v-if="record.status === 'COMPLETED'">
              <a-button type="text" size="small" @click="openRefundModal(record)">
                <template #icon><RollbackOutlined /></template>
              </a-button>
            </a-tooltip>
            <span v-else class="text-muted">-</span>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Refund Modal -->
    <a-modal
      v-model:open="showRefundModal"
      title="Process Refund"
      @ok="handleRefund"
      :confirm-loading="refunding"
      ok-text="Process Refund"
      ok-type="primary"
    >
      <div v-if="refundPayment" class="refund-form">
        <a-alert 
          type="warning" 
          message="This action cannot be undone"
          show-icon
          style="margin-bottom: 16px"
        />
        
        <a-descriptions :column="1" size="small" bordered>
          <a-descriptions-item label="Original Amount">
            {{ formatCurrency(refundPayment.amount) }}
          </a-descriptions-item>
          <a-descriptions-item label="Payment Method">
            {{ refundPayment.payment_method }}
          </a-descriptions-item>
        </a-descriptions>

        <a-form layout="vertical" style="margin-top: 16px">
          <a-form-item label="Refund Amount">
            <a-input-number
              v-model:value="refundAmount"
              :min="0"
              :max="refundPayment.amount"
              style="width: 100%"
            >
              <template #addonBefore>৳</template>
            </a-input-number>
          </a-form-item>
          <a-form-item label="Reason for Refund">
            <a-textarea
              v-model:value="refundReason"
              placeholder="Enter reason for refund"
              :rows="3"
            />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
.payment-list {
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

.table-card :deep(.ant-card-body) {
  padding: 0;
}

.customer-cell {
  display: flex;
  flex-direction: column;
}

.customer-name {
  font-weight: 500;
}

.customer-email {
  font-size: 12px;
  color: #8c8c8c;
}

.amount {
  font-weight: 600;
}

.refund-amount {
  font-size: 12px;
  color: #722ed1;
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
