<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { couponsApi, type Coupon } from '@/api/coupons'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import dayjs from 'dayjs'

const router = useRouter()

// State
const loading = ref(false)
const coupons = ref<Coupon[]>([])

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

function copyCode(code: string) {
  navigator.clipboard.writeText(code)
  message.success('Code copied to clipboard')
}

function getCouponStatus(coupon: Coupon) {
  const now = dayjs()
  
  if (!coupon.is_active) return { text: 'Inactive', color: 'default' }
  if (coupon.expires_at && dayjs(coupon.expires_at).isBefore(now)) return { text: 'Expired', color: 'red' }
  if (coupon.starts_at && dayjs(coupon.starts_at).isAfter(now)) return { text: 'Scheduled', color: 'blue' }
  if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) return { text: 'Limit Reached', color: 'orange' }
  return { text: 'Active', color: 'green' }
}

function formatDiscount(coupon: Coupon) {
  if (coupon.discount_type === 'PERCENTAGE') {
    return `${coupon.discount_value}% off`
  }
  return `৳${coupon.discount_value} off`
}

const columns = [
  { title: 'Code', dataIndex: 'code', key: 'code', width: 150 },
  { title: 'Discount', key: 'discount', width: 150 },
  { title: 'Usage', key: 'usage', width: 120, align: 'center' as const },
  { title: 'Validity', key: 'validity', width: 200 },
  { title: 'Status', key: 'status', width: 120, align: 'center' as const },
  { title: 'Actions', key: 'actions', width: 150, align: 'center' as const },
]
</script>

<template>
  <div class="coupon-list">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-left">
        <h1>Coupons</h1>
        <p>Manage discount codes and promotions</p>
      </div>
      <div class="header-right">
        <a-button type="primary" @click="handleCreate">
          <template #icon><PlusOutlined /></template>
          Create Coupon
        </a-button>
      </div>
    </div>

    <!-- Coupons Table -->
    <a-card :bordered="false" class="table-card">
      <a-table
        :columns="columns"
        :data-source="coupons"
        :loading="loading"
        :pagination="false"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <!-- Code -->
          <template v-if="column.key === 'code'">
            <div class="code-cell">
              <code class="coupon-code">{{ record.code }}</code>
              <a-button type="text" size="small" @click="copyCode(record.code)">
                <template #icon><CopyOutlined /></template>
              </a-button>
            </div>
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
            <a-progress 
              v-if="record.usage_limit"
              :percent="Math.round((record.used_count / record.usage_limit) * 100)"
              :format="() => `${record.used_count}/${record.usage_limit}`"
              size="small"
              :status="record.used_count >= record.usage_limit ? 'exception' : 'normal'"
            />
            <span v-else class="text-muted">{{ record.used_count }} uses</span>
          </template>

          <!-- Validity -->
          <template v-if="column.key === 'validity'">
            <div class="validity-cell">
              <span v-if="record.starts_at">
                From: {{ dayjs(record.starts_at).format('MMM D, YYYY') }}
              </span>
              <span v-if="record.expires_at">
                To: {{ dayjs(record.expires_at).format('MMM D, YYYY') }}
              </span>
              <span v-if="!record.starts_at && !record.expires_at" class="text-muted">
                No date restrictions
              </span>
            </div>
          </template>

          <!-- Status -->
          <template v-if="column.key === 'status'">
            <a-tag :color="getCouponStatus(record).color">
              {{ getCouponStatus(record).text }}
            </a-tag>
          </template>

          <!-- Actions -->
          <template v-if="column.key === 'actions'">
            <a-space>
              <a-tooltip title="Edit">
                <a-button type="text" size="small" @click="handleEdit(record.id)">
                  <template #icon><EditOutlined /></template>
                </a-button>
              </a-tooltip>
              <a-tooltip title="Delete">
                <a-button type="text" size="small" danger @click="handleDelete(record)">
                  <template #icon><DeleteOutlined /></template>
                </a-button>
              </a-tooltip>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<style scoped>
.coupon-list {
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

.code-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.coupon-code {
  padding: 4px 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
}

.discount-cell {
  display: flex;
  flex-direction: column;
}

.discount-value {
  font-weight: 600;
  color: #52c41a;
}

.min-order {
  font-size: 12px;
  color: #8c8c8c;
}

.validity-cell {
  display: flex;
  flex-direction: column;
  font-size: 13px;
  color: #595959;
}

.text-muted {
  color: #bfbfbf;
}
</style>
