<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { couponsApi, type CreateCouponDto, type DiscountType } from '@/api/coupons'
import {
  SaveOutlined,
  ArrowLeftOutlined,
  ThunderboltOutlined,
  PercentageOutlined,
  DollarOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  TagOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import dayjs from 'dayjs'

const router = useRouter()
const route = useRoute()

const isEdit = computed(() => !!route.params.id)
const couponId = computed(() => route.params.id ? Number(route.params.id) : null)

// State
const loading = ref(false)
const saving = ref(false)
const formRef = ref<FormInstance>()

const formState = ref<CreateCouponDto & { dateRange?: [dayjs.Dayjs, dayjs.Dayjs] }>({
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

// Computed
const estimatedSavings = computed(() => {
  if (!formState.value.discount_value) return 0
  if (formState.value.discount_type === 'FIXED') {
    return formState.value.discount_value
  } else {
    const orderAmount = formState.value.min_order_amount || 1000
    const discount = (orderAmount * formState.value.discount_value) / 100
    if (formState.value.max_discount_amount) {
      return Math.min(discount, formState.value.max_discount_amount)
    }
    return discount
  }
})

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
  message.success('Code generated successfully')
}

function copyToClipboard() {
  if (formState.value.code) {
    navigator.clipboard.writeText(formState.value.code)
    message.success('Code copied to clipboard')
  }
}
</script>

<template>
  <div class="coupon-form-page">
    <a-spin :spinning="loading" class="page-spinner">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-left">
          <a-button class="back-button" size="large" @click="router.push('/coupons')">
            <template #icon>
              <ArrowLeftOutlined />
            </template>
          </a-button>
          <div class="header-content">
            <h1>{{ isEdit ? 'Edit Coupon' : 'Create New Coupon' }}</h1>
            <p>{{ isEdit ? 'Update coupon details and settings' : 'Create a new discount coupon for your customers' }}
            </p>
          </div>
        </div>
        <div class="header-actions">
          <a-space :size="12">
            <a-button size="large" @click="router.push('/coupons')">Cancel</a-button>
            <a-button type="primary" size="large" :loading="saving" @click="handleSubmit">
              <template #icon>
                <SaveOutlined />
              </template>
              {{ isEdit ? 'Update' : 'Create' }} Coupon
            </a-button>
          </a-space>
        </div>
      </div>

      <!-- Form Content -->
      <a-row :gutter="24">
        <a-col :xs="24" :lg="16">
          <!-- Basic Information -->
          <div class="form-section">
            <div class="section-header">
              <TagOutlined class="section-icon" />
              <div>
                <h2>Basic Information</h2>
                <p>Set up the coupon code and description</p>
              </div>
            </div>
            <div class="section-content">
              <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
                <a-row :gutter="16">
                  <a-col :xs="24" :sm="14">
                    <a-form-item label="Coupon Code" name="code">
                      <a-input v-model:value="formState.code" placeholder="e.g., SUMMER2024" size="large"
                        class="code-input">
                        <template #prefix>
                          <TagOutlined />
                        </template>
                      </a-input>
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="10">
                    <a-form-item label=" ">
                      <a-space class="code-actions">
                        <a-button size="large" @click="generateCode" class="generate-btn">
                          <template #icon>
                            <ThunderboltOutlined />
                          </template>
                          Generate
                        </a-button>
                        <a-button size="large" @click="copyToClipboard" :disabled="!formState.code">
                          Copy
                        </a-button>
                      </a-space>
                    </a-form-item>
                  </a-col>
                </a-row>

                <a-form-item label="Description (Optional)" name="description">
                  <a-textarea v-model:value="formState.description"
                    placeholder="Brief description of this coupon, e.g., 'Summer sale discount for all products'"
                    :rows="3" :maxlength="200" show-count />
                </a-form-item>
              </a-form>
            </div>
          </div>

          <!-- Discount Settings -->
          <div class="form-section">
            <div class="section-header">
              <PercentageOutlined class="section-icon" />
              <div>
                <h2>Discount Configuration</h2>
                <p>Configure discount type and value</p>
              </div>
            </div>
            <div class="section-content">
              <a-form :model="formState" layout="vertical">
                <a-row :gutter="16">
                  <a-col :xs="24" :sm="12">
                    <a-form-item label="Discount Type">
                      <a-select v-model:value="formState.discount_type" size="large" class="type-select">
                        <a-select-option value="PERCENTAGE">
                          <div class="select-option">
                            <PercentageOutlined />
                            <span>Percentage Discount</span>
                          </div>
                        </a-select-option>
                        <a-select-option value="FIXED">
                          <div class="select-option">
                            <DollarOutlined />
                            <span>Fixed Amount</span>
                          </div>
                        </a-select-option>
                      </a-select>
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="12">
                    <a-form-item label="Discount Value" name="discount_value">
                      <a-input-number v-model:value="formState.discount_value" :min="0"
                        :max="formState.discount_type === 'PERCENTAGE' ? 100 : undefined"
                        :precision="formState.discount_type === 'PERCENTAGE' ? 0 : 2" size="large"
                        class="discount-input">
                        <template #addonAfter>
                          {{ formState.discount_type === 'PERCENTAGE' ? '%' : '৳' }}
                        </template>
                      </a-input-number>
                    </a-form-item>
                  </a-col>
                </a-row>

                <div class="info-card">
                  <InfoCircleOutlined class="info-icon" />
                  <div class="info-content">
                    <strong>Estimated Savings:</strong>
                    <span class="savings-amount">৳{{ estimatedSavings.toFixed(2) }}</span>
                    <span class="savings-hint">
                      {{ formState.discount_type === 'PERCENTAGE'
                        ? `Based on ${formState.min_order_amount || 1000}৳ order`
                        : 'Fixed discount amount' }}
                    </span>
                  </div>
                </div>

                <a-row :gutter="16">
                  <a-col :xs="24" :sm="12">
                    <a-form-item>
                      <template #label>
                        <span>Minimum Order Amount</span>
                        <a-tooltip title="Customers must spend at least this amount to use the coupon">
                          <InfoCircleOutlined class="label-info" />
                        </a-tooltip>
                      </template>
                      <a-input-number v-model:value="formState.min_order_amount" :min="0" size="large"
                        placeholder="No minimum" class="amount-input">
                        <template #addonBefore>৳</template>
                      </a-input-number>
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="12" v-if="formState.discount_type === 'PERCENTAGE'">
                    <a-form-item>
                      <template #label>
                        <span>Maximum Discount Cap</span>
                        <a-tooltip title="Cap the maximum discount amount for percentage-based coupons">
                          <InfoCircleOutlined class="label-info" />
                        </a-tooltip>
                      </template>
                      <a-input-number v-model:value="formState.max_discount_amount" :min="0" size="large"
                        placeholder="No maximum" class="amount-input">
                        <template #addonBefore>৳</template>
                      </a-input-number>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </div>
          </div>

          <!-- Usage & Validity -->
          <div class="form-section">
            <div class="section-header">
              <CalendarOutlined class="section-icon" />
              <div>
                <h2>Usage & Validity Period</h2>
                <p>Set usage limits and validity dates</p>
              </div>
            </div>
            <div class="section-content">
              <a-form :model="formState" layout="vertical">
                <a-row :gutter="16">
                  <a-col :xs="24" :sm="12">
                    <a-form-item>
                      <template #label>
                        <span>Usage Limit</span>
                        <a-tooltip title="Total number of times this coupon can be used">
                          <InfoCircleOutlined class="label-info" />
                        </a-tooltip>
                      </template>
                      <a-input-number v-model:value="formState.usage_limit" :min="1" size="large"
                        placeholder="Unlimited" class="usage-input" />
                    </a-form-item>
                  </a-col>
                  <a-col :xs="24" :sm="12">
                    <a-form-item label="Validity Period">
                      <a-range-picker v-model:value="formState.dateRange" size="large" :show-time="false"
                        format="YYYY-MM-DD" class="date-picker" placeholder="['Start Date', 'End Date']" />
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </div>
          </div>
        </a-col>

        <!-- Sidebar -->
        <a-col :xs="24" :lg="8">
          <!-- Status Card -->
          <div class="sidebar-section">
            <div class="section-header-small">
              <h3>Status</h3>
            </div>
            <div class="section-content-small">
              <div class="status-toggle">
                <a-switch v-model:checked="formState.is_active" size="default" class="custom-switch" />
                <div class="status-info">
                  <div class="status-label">
                    {{ formState.is_active ? 'Active' : 'Inactive' }}
                  </div>
                  <div class="status-hint">
                    {{ formState.is_active
                      ? 'Customers can use this coupon'
                      : 'Coupon is currently disabled' }}
                  </div>
                </div>
              </div>

              <div class="status-indicator" :class="{ active: formState.is_active }">
                <component :is="formState.is_active ? CheckCircleOutlined : CloseCircleOutlined"
                  class="indicator-icon" />
                <span>{{ formState.is_active ? 'Ready to Use' : 'Not Available' }}</span>
              </div>
            </div>
          </div>

          <!-- Preview Card -->
          <div class="sidebar-section preview-section">
            <div class="section-header-small">
              <h3>Coupon Preview</h3>
              <span class="preview-badge">Live Preview</span>
            </div>
            <div class="coupon-preview">
              <div class="preview-border">
                <div class="preview-content">
                  <div class="preview-header">
                    <div class="preview-icon">
                      <TagOutlined />
                    </div>
                    <div class="preview-label">Discount Coupon</div>
                  </div>

                  <div class="preview-code">
                    {{ formState.code || 'COUPON CODE' }}
                  </div>

                  <div class="preview-discount">
                    <span class="discount-value">
                      {{ formState.discount_value || 0 }}{{ formState.discount_type === 'PERCENTAGE' ? '%' : '৳' }}
                    </span>
                    <span class="discount-label">OFF</span>
                  </div>

                  <div class="preview-divider"></div>

                  <div class="preview-details">
                    <div v-if="formState.min_order_amount" class="detail-item">
                      <DollarOutlined />
                      <span>Min. order: ৳{{ formState.min_order_amount }}</span>
                    </div>
                    <div v-if="formState.usage_limit" class="detail-item">
                      <InfoCircleOutlined />
                      <span>Limited to {{ formState.usage_limit }} uses</span>
                    </div>
                    <div v-if="formState.dateRange" class="detail-item">
                      <CalendarOutlined />
                      <span>Valid until {{ formState.dateRange[1].format('MMM DD, YYYY') }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="sidebar-section">
            <div class="section-header-small">
              <h3>Quick Summary</h3>
            </div>
            <div class="section-content-small">
              <div class="stat-item">
                <div class="stat-label">Discount Type</div>
                <div class="stat-value">
                  {{ formState.discount_type === 'PERCENTAGE' ? 'Percentage' : 'Fixed Amount' }}
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Discount Value</div>
                <div class="stat-value highlight">
                  {{ formState.discount_value || 0 }}{{ formState.discount_type === 'PERCENTAGE' ? '%' : '৳' }}
                </div>
              </div>
              <div class="stat-item" v-if="formState.min_order_amount">
                <div class="stat-label">Minimum Order</div>
                <div class="stat-value">৳{{ formState.min_order_amount }}</div>
              </div>
              <div class="stat-item" v-if="formState.usage_limit">
                <div class="stat-label">Usage Limit</div>
                <div class="stat-value">{{ formState.usage_limit }} times</div>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<style scoped>
.coupon-form-page {
  min-height: 100%;
  background: var(--background);
}

.page-spinner {
  width: 100%;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}

.header-left {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.back-button {
  background: var(--muted);
  border: 1px solid var(--border);
  color: var(--foreground);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: oklch(0.72 0.12 192);
  border-color: oklch(0.72 0.12 192);
  color: white;
  transform: translateX(-4px);
}

.header-content h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.header-content p {
  color: var(--muted-foreground);
  margin: 0;
  font-size: 14px;
}

.header-actions {
  display: flex;
  align-items: center;
}

/* Form Sections */
.form-section {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  margin-bottom: 24px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.form-section:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
  border-bottom: 1px solid var(--border);
  background: var(--muted);
}

.section-icon {
  font-size: 24px;
  color: oklch(0.72 0.12 192);
  margin-top: 4px;
}

.section-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 4px 0;
}

.section-header p {
  font-size: 13px;
  color: var(--muted-foreground);
  margin: 0;
}

.section-content {
  padding: 24px;
}

/* Form Inputs */
.code-input {
  text-transform: uppercase;
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 1px;
}

.code-actions {
  width: 100%;
  display: flex;
}

.code-actions .a-button {
  flex: 1;
}

.generate-btn {
  background: oklch(0.72 0.12 192);
  border-color: oklch(0.72 0.12 192);
  color: white;
}

.generate-btn:hover {
  background: oklch(0.68 0.14 192);
  border-color: oklch(0.68 0.14 192);
}

.type-select,
.discount-input,
.amount-input,
.usage-input,
.date-picker {
  width: 100%;
}

.select-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label-info {
  margin-left: 4px;
  color: var(--muted-foreground);
  cursor: help;
}

/* Info Card */
.info-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: oklch(0.95 0.02 192);
  border: 1px solid oklch(0.85 0.05 192);
  border-radius: 8px;
  margin-bottom: 16px;
}

:global(.dark) .info-card {
  background: oklch(0.25 0.05 192);
  border-color: oklch(0.35 0.05 192);
}

.info-icon {
  font-size: 20px;
  color: oklch(0.72 0.12 192);
}

.info-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.info-content strong {
  color: var(--foreground);
  font-size: 14px;
}

.savings-amount {
  font-size: 18px;
  font-weight: 700;
  color: oklch(0.72 0.12 192);
}

.savings-hint {
  font-size: 12px;
  color: var(--muted-foreground);
}

/* Sidebar Sections */
.sidebar-section {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  margin-bottom: 24px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.sidebar-section:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.section-header-small {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  background: var(--muted);
}

.section-header-small h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
}

.preview-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 8px;
  background: oklch(0.72 0.12 192);
  color: white;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-content-small {
  padding: 20px;
}

/* Status */
.status-toggle {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--muted);
  border-radius: 8px;
  margin-bottom: 16px;
}

.status-info {
  flex: 1;
}

.status-label {
  font-size: 15px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 4px;
}

.status-hint {
  font-size: 12px;
  color: var(--muted-foreground);
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: oklch(0.95 0.05 0);
  border: 1px solid oklch(0.85 0.05 0);
  border-radius: 8px;
  color: oklch(0.45 0.1 0);
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.status-indicator.active {
  background: oklch(0.95 0.05 160);
  border-color: oklch(0.85 0.08 160);
  color: oklch(0.45 0.15 160);
}

:global(.dark) .status-indicator {
  background: oklch(0.25 0.05 0);
  border-color: oklch(0.35 0.05 0);
}

:global(.dark) .status-indicator.active {
  background: oklch(0.25 0.08 160);
  border-color: oklch(0.35 0.1 160);
}

.indicator-icon {
  font-size: 16px;
}

/* Coupon Preview */
.preview-section .section-content-small {
  padding: 0;
}

.coupon-preview {
  padding: 20px;
}

.preview-border {
  background: linear-gradient(135deg, oklch(0.72 0.12 192), oklch(0.65 0.15 220));
  padding: 2px;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
}

.preview-border::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }

  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

.preview-content {
  background: var(--card);
  border-radius: 14px;
  padding: 24px;
  position: relative;
  z-index: 1;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.preview-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, oklch(0.72 0.12 192), oklch(0.65 0.15 220));
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
}

.preview-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
  color: var(--muted-foreground);
}

.preview-code {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: 3px;
  text-align: center;
  color: var(--foreground);
  margin: 16px 0;
  font-family: 'Courier New', monospace;
  word-break: break-all;
}

.preview-discount {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
}

.discount-value {
  font-size: 48px;
  font-weight: 800;
  background: linear-gradient(135deg, oklch(0.72 0.12 192), oklch(0.65 0.15 220));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.discount-label {
  font-size: 20px;
  font-weight: 700;
  color: var(--muted-foreground);
}

.preview-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border), transparent);
  margin: 20px 0;
}

.preview-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--muted-foreground);
}

.detail-item :deep(.anticon) {
  color: oklch(0.72 0.12 192);
}

/* Quick Stats */
.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  font-size: 13px;
  color: var(--muted-foreground);
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
}

.stat-value.highlight {
  color: oklch(0.72 0.12 192);
  font-size: 16px;
}

/* Responsive */
@media (max-width: 768px) {
  .coupon-form-page {
    padding: 16px;
  }

  .page-header {
    margin-bottom: 24px;
  }

  .header-content h1 {
    font-size: 24px;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions .a-space {
    width: 100%;
    display: flex;
  }

  .header-actions .a-button {
    flex: 1;
  }

  .preview-code {
    font-size: 24px;
  }

  .discount-value {
    font-size: 36px;
  }
}
</style>
