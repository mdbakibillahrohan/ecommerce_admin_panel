<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { couponsApi, type CreateCouponDto, type DiscountType } from '@/api/coupons'
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import dayjs, { Dayjs } from 'dayjs'

const router = useRouter()
const route = useRoute()

const isEdit = computed(() => !!route.params.id)
const couponId = computed(() => route.params.id ? Number(route.params.id) : null)

// State
const loading = ref(false)
const saving = ref(false)
const formRef = ref<FormInstance>()

const formState = ref<CreateCouponDto & { dateRange?: [Dayjs, Dayjs] }>({
  code: '',
  description: '',
  discount_type: 'PERCENTAGE',
  discount_value: 10,
  min_order_amount: undefined,
  max_discount_amount: undefined,
  usage_limit: undefined,
  is_active: true,
  dateRange: undefined,
})

const rules = {
  code: [
    { required: true, message: 'Coupon code is required' },
    { pattern: /^[A-Z0-9]+$/, message: 'Code must be uppercase alphanumeric' },
  ],
  discount_value: [{ required: true, message: 'Discount value is required' }],
}

onMounted(async () => {
  if (isEdit.value && couponId.value) {
    await fetchCoupon(couponId.value)
  }
})

async function fetchCoupon(id: number) {
  loading.value = true
  try {
    const coupon = await couponsApi.getById(id)
    formState.value = {
      code: coupon.code,
      description: coupon.description || '',
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_order_amount: coupon.min_order_amount || undefined,
      max_discount_amount: coupon.max_discount_amount || undefined,
      usage_limit: coupon.usage_limit || undefined,
      is_active: coupon.is_active,
      dateRange: coupon.starts_at && coupon.expires_at 
        ? [dayjs(coupon.starts_at), dayjs(coupon.expires_at)]
        : undefined,
    }
  } catch (error) {
    message.error('Failed to fetch coupon')
    console.error(error)
    router.push('/coupons')
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    saving.value = true

    const data: CreateCouponDto = {
      code: formState.value.code.toUpperCase(),
      description: formState.value.description || undefined,
      discount_type: formState.value.discount_type,
      discount_value: formState.value.discount_value,
      min_order_amount: formState.value.min_order_amount,
      max_discount_amount: formState.value.max_discount_amount,
      usage_limit: formState.value.usage_limit,
      is_active: formState.value.is_active,
      starts_at: formState.value.dateRange?.[0]?.toISOString(),
      expires_at: formState.value.dateRange?.[1]?.toISOString(),
    }

    if (isEdit.value && couponId.value) {
      await couponsApi.update(couponId.value, data)
      message.success('Coupon updated successfully')
    } else {
      await couponsApi.create(data)
      message.success('Coupon created successfully')
    }

    router.push('/coupons')
  } catch (error: any) {
    if (error.errorFields) {
      message.error('Please check the form for errors')
    } else {
      message.error('Failed to save coupon')
      console.error(error)
    }
  } finally {
    saving.value = false
  }
}

function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  formState.value.code = code
}
</script>

<template>
  <div class="coupon-form">
    <a-spin :spinning="loading">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-left">
          <a-button type="text" @click="router.push('/coupons')">
            <template #icon><ArrowLeftOutlined /></template>
          </a-button>
          <div>
            <h1>{{ isEdit ? 'Edit Coupon' : 'Create Coupon' }}</h1>
            <p>{{ isEdit ? 'Update coupon details' : 'Create a new discount coupon' }}</p>
          </div>
        </div>
        <div class="header-right">
          <a-space>
            <a-button @click="router.push('/coupons')">Cancel</a-button>
            <a-button type="primary" :loading="saving" @click="handleSubmit">
              <template #icon><SaveOutlined /></template>
              {{ isEdit ? 'Update' : 'Create' }} Coupon
            </a-button>
          </a-space>
        </div>
      </div>

      <!-- Form -->
      <a-row :gutter="24">
        <a-col :xs="24" :lg="16">
          <a-card title="Coupon Details" :bordered="false" class="form-card">
            <a-form
              ref="formRef"
              :model="formState"
              :rules="rules"
              layout="vertical"
            >
              <a-row :gutter="16">
                <a-col :span="16">
                  <a-form-item label="Coupon Code" name="code">
                    <a-input
                      v-model:value="formState.code"
                      placeholder="SUMMER20"
                      size="large"
                      style="text-transform: uppercase"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label=" ">
                    <a-button @click="generateCode" block size="large">
                      Generate Code
                    </a-button>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-form-item label="Description" name="description">
                <a-textarea
                  v-model:value="formState.description"
                  placeholder="e.g., Summer sale discount"
                  :rows="2"
                />
              </a-form-item>

              <a-divider>Discount Settings</a-divider>

              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="Discount Type">
                    <a-select v-model:value="formState.discount_type" size="large">
                      <a-select-option value="PERCENTAGE">Percentage (%)</a-select-option>
                      <a-select-option value="FIXED">Fixed Amount (৳)</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="Discount Value" name="discount_value">
                    <a-input-number
                      v-model:value="formState.discount_value"
                      :min="0"
                      :max="formState.discount_type === 'PERCENTAGE' ? 100 : undefined"
                      style="width: 100%"
                      size="large"
                    >
                      <template #addonAfter>
                        {{ formState.discount_type === 'PERCENTAGE' ? '%' : '৳' }}
                      </template>
                    </a-input-number>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="Minimum Order Amount">
                    <a-input-number
                      v-model:value="formState.min_order_amount"
                      :min="0"
                      style="width: 100%"
                      placeholder="No minimum"
                    >
                      <template #addonBefore>৳</template>
                    </a-input-number>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="Maximum Discount" v-if="formState.discount_type === 'PERCENTAGE'">
                    <a-input-number
                      v-model:value="formState.max_discount_amount"
                      :min="0"
                      style="width: 100%"
                      placeholder="No maximum"
                    >
                      <template #addonBefore>৳</template>
                    </a-input-number>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-divider>Usage & Validity</a-divider>

              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="Usage Limit">
                    <a-input-number
                      v-model:value="formState.usage_limit"
                      :min="1"
                      style="width: 100%"
                      placeholder="Unlimited"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="Valid Date Range">
                    <a-range-picker
                      v-model:value="formState.dateRange"
                      style="width: 100%"
                      :show-time="false"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form>
          </a-card>
        </a-col>

        <a-col :xs="24" :lg="8">
          <a-card title="Status" :bordered="false" class="form-card">
            <a-form-item label="Active">
              <a-switch
                v-model:checked="formState.is_active"
                checked-children="Active"
                un-checked-children="Inactive"
              />
            </a-form-item>
            <p class="status-hint">
              {{ formState.is_active ? 'This coupon can be used by customers' : 'This coupon is disabled' }}
            </p>
          </a-card>

          <a-card title="Preview" :bordered="false" class="form-card preview-card">
            <div class="coupon-preview">
              <div class="preview-code">{{ formState.code || 'CODE' }}</div>
              <div class="preview-discount">
                {{ formState.discount_value || 0 }}{{ formState.discount_type === 'PERCENTAGE' ? '%' : '৳' }} OFF
              </div>
              <div v-if="formState.min_order_amount" class="preview-condition">
                Min. order: ৳{{ formState.min_order_amount }}
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<style scoped>
.coupon-form {
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

.form-card {
  margin-bottom: 24px;
}

.status-hint {
  font-size: 13px;
  color: #8c8c8c;
  margin: 0;
}

.preview-card .coupon-preview {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  color: #fff;
}

.preview-code {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 2px;
  margin-bottom: 8px;
}

.preview-discount {
  font-size: 18px;
  font-weight: 600;
  opacity: 0.9;
}

.preview-condition {
  font-size: 13px;
  opacity: 0.8;
  margin-top: 8px;
}
</style>
