<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ordersApi, type Order, type OrderStatus } from '@/modules/orders/api/orders'
import {
  ArrowLeftOutlined,
  PrinterOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CarOutlined,
  GiftOutlined,
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()

const orderId = computed(() => Number(route.params.id))

// State
const loading = ref(false)
const order = ref<Order | null>(null)
const updatingStatus = ref(false)
const showStatusModal = ref(false)
const showTrackingModal = ref(false)

const newStatus = ref<OrderStatus>('PENDING')
const adminNotes = ref('')
const trackingNumber = ref('')
const shippingCarrier = ref('')

onMounted(() => {
  fetchOrder()
})

async function fetchOrder() {
  loading.value = true
  try {
    order.value = await ordersApi.getById(orderId.value)
  } catch (error) {
    message.error('Failed to fetch order')
    console.error(error)
    router.push('/orders')
  } finally {
    loading.value = false
  }
}

async function handleUpdateStatus() {
  updatingStatus.value = true
  try {
    await ordersApi.updateStatus(orderId.value, {
      status: newStatus.value,
      admin_notes: adminNotes.value || undefined,
    })
    message.success('Order status updated')
    showStatusModal.value = false
    fetchOrder()
  } catch (error) {
    message.error('Failed to update status')
    console.error(error)
  } finally {
    updatingStatus.value = false
  }
}

async function handleUpdateTracking() {
  updatingStatus.value = true
  try {
    await ordersApi.updateTracking(orderId.value, {
      tracking_number: trackingNumber.value,
      shipping_carrier: shippingCarrier.value || undefined,
    })
    message.success('Tracking info updated')
    showTrackingModal.value = false
    fetchOrder()
  } catch (error) {
    message.error('Failed to update tracking')
    console.error(error)
  } finally {
    updatingStatus.value = false
  }
}

function openStatusModal() {
  if (order.value) {
    newStatus.value = order.value.status
    adminNotes.value = order.value.admin_notes || ''
  }
  showStatusModal.value = true
}

function openTrackingModal() {
  if (order.value) {
    trackingNumber.value = order.value.tracking_number || ''
    shippingCarrier.value = order.value.shipping_carrier || ''
  }
  showTrackingModal.value = true
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

const itemColumns = [
  { title: 'Product', key: 'product' },
  { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', align: 'center' as const, width: 100 },
  { title: 'Unit Price', dataIndex: 'unit_price', key: 'unit_price', align: 'right' as const, width: 120 },
  { title: 'Total', dataIndex: 'total_price', key: 'total_price', align: 'right' as const, width: 120 },
]
</script>

<template>
  <div class="order-detail">
    <a-spin :spinning="loading">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-left">
          <a-button type="text" @click="router.push('/orders')">
            <template #icon>
              <ArrowLeftOutlined />
            </template>
          </a-button>
          <div>
            <h1>Order {{ order?.order_number }}</h1>
            <p>{{ order ? dayjs(order.created_at).format('MMMM D, YYYY [at] h:mm A') : '' }}</p>
          </div>
        </div>
        <div class="header-right" v-if="order">
          <a-space>
            <a-tag :color="getStatusColor(order.status)" size="large">
              {{ order.status }}
            </a-tag>
            <a-button @click="openStatusModal">Update Status</a-button>
            <a-button @click="openTrackingModal">
              <template #icon>
                <CarOutlined />
              </template>
              Tracking
            </a-button>
          </a-space>
        </div>
      </div>

      <template v-if="order">
        <a-row :gutter="24">
          <!-- Main Content -->
          <a-col :xs="24" :lg="16">
            <!-- Order Items -->
            <a-card title="Order Items" :bordered="false" class="section-card">
              <a-table :columns="itemColumns" :data-source="order.items" :pagination="false" row-key="id">
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'product'">
                    <div class="product-cell">
                      <a-avatar :src="record.product?.thumbnail?.url" :size="48" shape="square" class="product-avatar">
                        {{ record.product_name.charAt(0) }}
                      </a-avatar>
                      <div class="product-info">
                        <span class="product-name">{{ record.product_name }}</span>
                        <span v-if="record.variant_name" class="variant-name">
                          {{ record.variant_name }}
                        </span>
                      </div>
                    </div>
                  </template>
                  <template v-if="column.key === 'unit_price'">
                    {{ formatCurrency(record.unit_price) }}
                  </template>
                  <template v-if="column.key === 'total_price'">
                    <strong>{{ formatCurrency(record.total_price) }}</strong>
                  </template>
                </template>
              </a-table>

              <!-- Order Summary -->
              <div class="order-summary">
                <div class="summary-row">
                  <span>Subtotal</span>
                  <span>{{ formatCurrency(order.subtotal) }}</span>
                </div>
                <div class="summary-row" v-if="order.discount_amount > 0">
                  <span>Discount</span>
                  <span class="discount">-{{ formatCurrency(order.discount_amount) }}</span>
                </div>
                <div class="summary-row">
                  <span>Shipping</span>
                  <span>{{ formatCurrency(order.shipping_cost) }}</span>
                </div>
                <div class="summary-row" v-if="order.tax_amount > 0">
                  <span>Tax</span>
                  <span>{{ formatCurrency(order.tax_amount) }}</span>
                </div>
                <a-divider style="margin: 12px 0" />
                <div class="summary-row total">
                  <span>Total</span>
                  <span>{{ formatCurrency(order.total) }}</span>
                </div>
              </div>
            </a-card>

            <!-- Order Timeline -->
            <a-card title="Order Timeline" :bordered="false" class="section-card">
              <a-timeline>
                <a-timeline-item color="green">
                  <p><strong>Order Placed</strong></p>
                  <p class="timeline-date">{{ dayjs(order.created_at).format('MMM D, YYYY h:mm A') }}</p>
                </a-timeline-item>
                <a-timeline-item v-if="order.shipped_at" color="purple">
                  <p><strong>Order Shipped</strong></p>
                  <p class="timeline-date">{{ dayjs(order.shipped_at).format('MMM D, YYYY h:mm A') }}</p>
                  <p v-if="order.tracking_number" class="tracking-info">
                    Tracking: {{ order.tracking_number }}
                    <span v-if="order.shipping_carrier"> ({{ order.shipping_carrier }})</span>
                  </p>
                </a-timeline-item>
                <a-timeline-item v-if="order.delivered_at" color="green">
                  <p><strong>Order Delivered</strong></p>
                  <p class="timeline-date">{{ dayjs(order.delivered_at).format('MMM D, YYYY h:mm A') }}</p>
                </a-timeline-item>
              </a-timeline>
            </a-card>
          </a-col>

          <!-- Sidebar -->
          <a-col :xs="24" :lg="8">
            <!-- Customer Info -->
            <a-card title="Customer" :bordered="false" class="section-card">
              <div class="customer-section">
                <a-avatar :size="48" class="customer-avatar">
                  {{ order.user?.first_name?.charAt(0) || 'U' }}
                </a-avatar>
                <div class="customer-details">
                  <h4>{{ order.user?.first_name }} {{ order.user?.last_name }}</h4>
                  <p>{{ order.user?.email }}</p>
                </div>
              </div>
            </a-card>

            <!-- Shipping Address -->
            <a-card title="Shipping Address" :bordered="false" class="section-card" v-if="order.shipping_address">
              <div class="address-content">
                <p><strong>{{ order.shipping_address.full_name }}</strong></p>
                <p>{{ order.shipping_address.phone }}</p>
                <p>{{ order.shipping_address.address_line1 }}</p>
                <p v-if="order.shipping_address.address_line2">{{ order.shipping_address.address_line2 }}</p>
                <p>{{ order.shipping_address.city }}, {{ order.shipping_address.state }}</p>
                <p>{{ order.shipping_address.postal_code }}, {{ order.shipping_address.country }}</p>
              </div>
            </a-card>

            <!-- Payment Info -->
            <a-card title="Payment" :bordered="false" class="section-card" v-if="order.payment">
              <a-descriptions :column="1" size="small">
                <a-descriptions-item label="Status">
                  <a-tag :color="order.payment.status === 'COMPLETED' ? 'green' : 'orange'">
                    {{ order.payment.status }}
                  </a-tag>
                </a-descriptions-item>
                <a-descriptions-item label="Method">
                  {{ order.payment.payment_method }}
                </a-descriptions-item>
                <a-descriptions-item label="Amount">
                  {{ formatCurrency(order.payment.amount) }}
                </a-descriptions-item>
                <a-descriptions-item label="Transaction ID" v-if="order.payment.transaction_id">
                  {{ order.payment.transaction_id }}
                </a-descriptions-item>
              </a-descriptions>
            </a-card>

            <!-- Notes -->
            <a-card title="Notes" :bordered="false" class="section-card" v-if="order.notes || order.admin_notes">
              <div v-if="order.notes" class="note-section">
                <h5>Customer Note</h5>
                <p>{{ order.notes }}</p>
              </div>
              <a-divider v-if="order.notes && order.admin_notes" />
              <div v-if="order.admin_notes" class="note-section">
                <h5>Admin Note</h5>
                <p>{{ order.admin_notes }}</p>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </template>
    </a-spin>

    <!-- Status Update Modal -->
    <a-modal v-model:open="showStatusModal" title="Update Order Status" @ok="handleUpdateStatus"
      :confirm-loading="updatingStatus">
      <a-form layout="vertical">
        <a-form-item label="Status">
          <a-select v-model:value="newStatus" style="width: 100%">
            <a-select-option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Admin Notes">
          <a-textarea v-model:value="adminNotes" placeholder="Internal notes about this status change" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Tracking Modal -->
    <a-modal v-model:open="showTrackingModal" title="Update Tracking Information" @ok="handleUpdateTracking"
      :confirm-loading="updatingStatus">
      <a-form layout="vertical">
        <a-form-item label="Tracking Number" required>
          <a-input v-model:value="trackingNumber" placeholder="Enter tracking number" />
        </a-form-item>
        <a-form-item label="Shipping Carrier">
          <a-input v-model:value="shippingCarrier" placeholder="e.g., DHL, FedEx, Pathao" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>
.order-detail {
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

.header-left {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.header-left h1 {
  font-size: 24px;
  font-weight: 700;
  color: #262626;
  margin: 0 0 4px 0;
}

.header-left p {
  color: #8c8c8c;
  margin: 0;
}

.section-card {
  margin-bottom: 24px;
}

.product-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  flex-shrink: 0;
}

.product-info {
  display: flex;
  flex-direction: column;
}

.product-name {
  font-weight: 500;
  color: #262626;
}

.variant-name {
  font-size: 12px;
  color: #8c8c8c;
}

.order-summary {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  max-width: 300px;
  margin-left: auto;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  color: #595959;
}

.summary-row.total {
  font-size: 18px;
  font-weight: 700;
  color: #262626;
}

.summary-row .discount {
  color: #52c41a;
}

.timeline-date {
  font-size: 13px;
  color: #8c8c8c;
  margin: 4px 0 0 0;
}

.tracking-info {
  font-size: 13px;
  color: #667eea;
  margin: 4px 0 0 0;
}

.customer-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.customer-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.customer-details h4 {
  margin: 0 0 4px 0;
  font-weight: 600;
}

.customer-details p {
  margin: 0;
  color: #8c8c8c;
  font-size: 13px;
}

.address-content p {
  margin: 0 0 4px 0;
  color: #595959;
}

.note-section h5 {
  margin: 0 0 8px 0;
  color: #8c8c8c;
  font-size: 12px;
  text-transform: uppercase;
}

.note-section p {
  margin: 0;
  color: #262626;
}
</style>
