<template>
  <div class="promotion-form-container">
    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <a-button class="back-button" @click="router.back()">
          <template #icon>
            <arrow-left-outlined />
          </template>
          Back
        </a-button>
        <div class="header-title-section">
          <h1 class="page-title">
            <gift-outlined class="title-icon" />
            {{ pageTitle }}
          </h1>
          <p class="page-subtitle">
            {{ pageSubtitle }}
          </p>
        </div>
      </div>
      <div class="header-actions">
        <a-button @click="router.back()" class="cancel-btn">Cancel</a-button>
        <a-button type="primary" :loading="submitting" @click="handleSubmit" class="save-btn">
          <template #icon>
            <save-outlined />
          </template>
          {{ saveButtonText }}
        </a-button>
      </div>
    </div>

    <div class="form-layout">
      <!-- Main Form Section -->
      <div class="main-section">
        <a-form ref="formRef" layout="vertical" :model="formState" :loading="loading">
          <!-- Basic Information -->
          <div class="form-section">
            <div class="section-header">
              <info-circle-outlined class="section-icon" />
              <div>
                <h3 class="section-title">Basic Information</h3>
                <p class="section-description">Enter the basic details of your promotion</p>
              </div>
            </div>
            <div class="section-content">
              <div class="form-row">
                <a-form-item label="Promotion Name" name="name"
                  :rules="[{ required: true, message: 'Please enter promotion name' }]" class="form-item-full">
                  <a-input v-model:value="formState.name" placeholder="e.g., Summer Sale 2024" size="large">
                    <template #prefix>
                      <tag-outlined />
                    </template>
                  </a-input>
                </a-form-item>
              </div>

              <div class="form-row">
                <a-form-item label="Slug (URL Code)" name="slug"
                  :rules="[{ required: true, message: 'Please enter slug' }]" class="form-item-half">
                  <a-input v-model:value="formState.slug" placeholder="summer-sale-2024" size="large">
                    <template #prefix>
                      <link-outlined />
                    </template>
                  </a-input>
                  <template #extra>
                    <span class="field-hint">URL-friendly identifier for this promotion</span>
                  </template>
                </a-form-item>

                <a-form-item label="Promotion Type" name="type"
                  :rules="[{ required: true, message: 'Please select type' }]" class="form-item-half">
                  <a-select v-model:value="formState.type" size="large" placeholder="Select type">
                    <a-select-option value="FLASH_SALE">
                      <thunderbolt-outlined /> Flash Sale
                    </a-select-option>
                    <a-select-option value="SEASONAL_OFFER">
                      <calendar-outlined /> Seasonal Offer
                    </a-select-option>
                    <a-select-option value="CLEARANCE">
                      <percentage-outlined /> Clearance
                    </a-select-option>
                    <a-select-option value="NEW_ARRIVAL">
                      <star-outlined /> New Arrival
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </div>

              <div class="form-row">
                <a-form-item label="Description" name="description" class="form-item-full">
                  <a-textarea v-model:value="formState.description" :rows="4"
                    placeholder="Describe what this promotion is about..." size="large" />
                </a-form-item>
              </div>
            </div>
          </div>

          <!-- Discount Configuration -->
          <div class="form-section">
            <div class="section-header">
              <percentage-outlined class="section-icon" />
              <div>
                <h3 class="section-title">Discount Configuration</h3>
                <p class="section-description">Configure the discount amount and type</p>
              </div>
            </div>
            <div class="section-content">
              <div class="form-row">
                <a-form-item label="Discount Type" name="discount_type"
                  :rules="[{ required: true, message: 'Please select discount type' }]" class="form-item-half">
                  <a-select v-model:value="formState.discount_type" size="large" placeholder="Select type">
                    <a-select-option value="PERCENTAGE">
                      <percentage-outlined /> Percentage (%)
                    </a-select-option>
                    <a-select-option value="FIXED_AMOUNT">
                      <dollar-outlined /> Fixed Amount
                    </a-select-option>
                  </a-select>
                </a-form-item>

                <a-form-item label="Discount Value" name="discount_value"
                  :rules="[{ required: true, message: 'Please enter discount value' }]" class="form-item-half">
                  <a-input-number v-model:value="formState.discount_value" :min="0"
                    :max="formState.discount_type === 'PERCENTAGE' ? 100 : undefined" size="large"
                    class="input-number-full"
                    :formatter="value => formState.discount_type === 'PERCENTAGE' ? `${value}%` : `$ ${value}`"
                    :parser="value => value.replace(/\$\s?|%/g, '')" />
                  <template #extra>
                    <span class="field-hint">
                      {{ formState.discount_type === 'PERCENTAGE' ? 'Enter percentage (0-100)' : 'Enter fixed amount' }}
                    </span>
                  </template>
                </a-form-item>
              </div>

              <div class="discount-preview" v-if="formState.discount_value > 0">
                <div class="preview-badge">
                  <span class="preview-label">Discount Preview:</span>
                  <span class="preview-value">
                    {{ formState.discount_type === 'PERCENTAGE'
                      ? `${formState.discount_value}% OFF`
                      : `$${formState.discount_value} OFF`
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Schedule Settings -->
          <div class="form-section">
            <div class="section-header">
              <clock-circle-outlined class="section-icon" />
              <div>
                <h3 class="section-title">Schedule Settings</h3>
                <p class="section-description">Set the start and end dates for this promotion</p>
              </div>
            </div>
            <div class="section-content">
              <div class="form-row">
                <a-form-item label="Start Date & Time" name="start_date"
                  :rules="[{ required: true, message: 'Please select start date' }]" class="form-item-half">
                  <a-date-picker v-model:value="formState.start_date" show-time size="large" class="date-picker-full"
                    format="YYYY-MM-DD HH:mm" placeholder="Select start date" />
                </a-form-item>

                <a-form-item label="End Date & Time" name="end_date"
                  :rules="[{ required: true, message: 'Please select end date' }]" class="form-item-half">
                  <a-date-picker v-model:value="formState.end_date" show-time size="large" class="date-picker-full"
                    format="YYYY-MM-DD HH:mm" placeholder="Select end date" :disabled-date="disabledDate" />
                </a-form-item>
              </div>

              <div class="duration-info" v-if="formState.start_date && formState.end_date">
                <calendar-outlined />
                <span>Duration: {{ calculateDuration() }}</span>
              </div>
            </div>
          </div>
        </a-form>
      </div>

      <!-- Sidebar -->
      <div class="sidebar-section">
        <!-- Status Card -->
        <div class="sidebar-card">
          <div class="card-header">
            <h4 class="card-title">Status</h4>
          </div>
          <div class="card-content">
            <div class="status-toggle">
              <div class="toggle-info">
                <span class="toggle-label">Active Status</span>
                <span class="toggle-hint">{{ formState.is_active ? 'Promotion is active' : 'Promotion is inactive'
                }}</span>
              </div>
              <a-switch v-model:checked="formState.is_active" />
            </div>
            <div class="status-indicator" :class="{ active: formState.is_active }">
              <div class="indicator-dot"></div>
              <span>{{ formState.is_active ? 'Active' : 'Inactive' }}</span>
            </div>
          </div>
        </div>

        <!-- Preview Card -->
        <div class="sidebar-card promotion-preview">
          <div class="card-header">
            <h4 class="card-title">Promotion Preview</h4>
          </div>
          <div class="card-content">
            <div class="preview-card">
              <div class="preview-header">
                <div class="preview-badge-large">
                  {{ formState.discount_type === 'PERCENTAGE'
                    ? `${formState.discount_value || 0}%`
                    : `$${formState.discount_value || 0}`
                  }}
                  <span class="preview-off">OFF</span>
                </div>
              </div>
              <div class="preview-body">
                <h5 class="preview-name">{{ formState.name || 'Promotion Name' }}</h5>
                <p class="preview-description">{{ formState.description || 'Description will appear here' }}</p>
                <div class="preview-type">
                  <a-tag color="purple">{{ formatType(formState.type) }}</a-tag>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Summary -->
        <div class="sidebar-card">
          <div class="card-header">
            <h4 class="card-title">Quick Summary</h4>
          </div>
          <div class="card-content">
            <div class="summary-list">
              <div class="summary-item">
                <span class="summary-label">Type</span>
                <span class="summary-value">{{ formatType(formState.type) }}</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Discount</span>
                <span class="summary-value">
                  {{ formState.discount_type === 'PERCENTAGE'
                    ? `${formState.discount_value || 0}%`
                    : `$${formState.discount_value || 0}`
                  }}
                </span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Status</span>
                <a-tag :color="formState.is_active ? 'success' : 'default'">
                  {{ formState.is_active ? 'Active' : 'Inactive' }}
                </a-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import dayjs, { Dayjs } from 'dayjs'
import {
  ArrowLeftOutlined,
  SaveOutlined,
  GiftOutlined,
  InfoCircleOutlined,
  TagOutlined,
  LinkOutlined,
  ThunderboltOutlined,
  CalendarOutlined,
  PercentageOutlined,
  StarOutlined,
  DollarOutlined,
  ClockCircleOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const formRef = ref()
const loading = ref(false)
const submitting = ref(false)

const isEdit = computed(() => route.params.id !== undefined)

const formState = reactive({
  name: '',
  slug: '',
  description: '',
  type: 'FLASH_SALE',
  discount_type: 'PERCENTAGE',
  discount_value: 0,
  start_date: null as Dayjs | null,
  end_date: null as Dayjs | null,
  is_active: true,
})

const fetchPromotion = async (id: number) => {
  loading.value = true
  try {
    // Replace with your actual service
    // const data = await promotionService.getPromotion(id)
    const data = {
      name: 'Summer Sale',
      slug: 'summer-sale',
      description: 'Get amazing discounts this summer',
      type: 'SEASONAL_OFFER',
      discount_type: 'PERCENTAGE',
      discount_value: 25,
      start_date: '2024-06-01T00:00:00',
      end_date: '2024-08-31T23:59:59',
      is_active: true
    }

    Object.assign(formState, {
      ...data,
      start_date: dayjs(data.start_date),
      end_date: dayjs(data.end_date)
    })
  } catch (error) {
    message.error('Failed to load promotion')
    router.back()
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    submitting.value = true

    const payload = {
      ...formState,
      start_date: formState.start_date?.toISOString(),
      end_date: formState.end_date?.toISOString()
    }

    if (isEdit.value) {
      // await promotionService.updatePromotion(Number(route.params.id), payload)
      message.success('Promotion updated successfully')
    } else {
      // await promotionService.createPromotion(payload)
      message.success('Promotion created successfully')
    }
    router.push('/promotions')
  } catch (error) {
    if (error?.errorFields) {
      message.error('Please fill in all required fields')
    } else {
      message.error('Failed to save promotion')
    }
  } finally {
    submitting.value = false
  }
}

const disabledDate = (current: Dayjs) => {
  if (!formState.start_date) return false
  return current && current < formState.start_date.startOf('day')
}

const calculateDuration = () => {
  if (!formState.start_date || !formState.end_date) return ''
  const days = formState.end_date.diff(formState.start_date, 'day')
  const hours = formState.end_date.diff(formState.start_date, 'hour') % 24
  return `${days} days ${hours} hours`
}

const formatType = (type: string) => {
  const types: Record<string, string> = {
    FLASH_SALE: 'Flash Sale',
    SEASONAL_OFFER: 'Seasonal Offer',
    CLEARANCE: 'Clearance',
    NEW_ARRIVAL: 'New Arrival'
  }
  return types[type] || type
}

const pageTitle = computed(() => isEdit.value ? 'Edit Promotion' : 'Create New Promotion')
const pageSubtitle = computed(() => isEdit.value ? 'Update promotion details and configuration' : 'Set up a new promotional campaign for your products')
const saveButtonText = computed(() => isEdit.value ? 'Update Promotion' : 'Create Promotion')

onMounted(() => {
  if (isEdit.value) {
    fetchPromotion(Number(route.params.id))
  }
})
</script>

<style scoped>
.promotion-form-container {
  background: var(--background);
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  padding: 24px;
  background: linear-gradient(135deg, oklch(0.65 0.15 195) 0%, oklch(0.55 0.15 200) 100%);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-content {
  flex: 1;
}

.back-button {
  margin-bottom: 16px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

.header-title-section {
  color: white;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: white;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 32px;
}

.page-subtitle {
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  backdrop-filter: blur(10px);
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}

.save-btn {
  background: white;
  color: oklch(0.55 0.15 195);
  border: none;
  font-weight: 600;
}

.save-btn:hover {
  background: rgba(255, 255, 255, 0.9);
  color: oklch(0.55 0.15 195);
}

.form-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
}

.main-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-section {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.form-section:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.section-icon {
  font-size: 24px;
  color: oklch(0.65 0.15 195);
  margin-top: 4px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: var(--foreground);
}

.section-description {
  font-size: 13px;
  margin: 0;
  color: var(--muted-foreground);
}

.section-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-item-full {
  grid-column: 1 / -1;
}

.form-item-half {
  grid-column: span 1;
}

.field-hint {
  font-size: 12px;
  color: var(--muted-foreground);
}

.input-number-full {
  width: 100%;
}

.date-picker-full {
  width: 100%;
}

.discount-preview {
  background: linear-gradient(135deg, oklch(0.95 0.02 195) 0%, oklch(0.98 0.01 200) 100%);
  border: 2px dashed oklch(0.65 0.15 195);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

:global(.dark) .discount-preview {
  background: linear-gradient(135deg, oklch(0.25 0.02 195) 0%, oklch(0.2 0.01 200) 100%);
}

.preview-badge {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.preview-label {
  font-size: 14px;
  color: var(--muted-foreground);
}

.preview-value {
  font-size: 24px;
  font-weight: 700;
  color: oklch(0.55 0.15 195);
}

.duration-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: var(--muted);
  border-radius: 8px;
  color: var(--muted-foreground);
  font-size: 13px;
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sidebar-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.card-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
  background: var(--muted);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: var(--foreground);
}

.card-content {
  padding: 20px;
}

.status-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.toggle-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.toggle-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
}

.toggle-hint {
  font-size: 12px;
  color: var(--muted-foreground);
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--muted);
  border-radius: 8px;
  color: var(--muted-foreground);
  font-size: 13px;
  font-weight: 500;
}

.status-indicator.active {
  background: oklch(0.95 0.05 140);
  color: oklch(0.45 0.15 140);
}

:global(.dark) .status-indicator.active {
  background: oklch(0.3 0.05 140);
  color: oklch(0.7 0.15 140);
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--muted-foreground);
}

.status-indicator.active .indicator-dot {
  background: oklch(0.55 0.15 140);
  animation: pulse 2s infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.promotion-preview .card-content {
  padding: 0;
}

.preview-card {
  position: relative;
  overflow: hidden;
}

.preview-header {
  background: linear-gradient(135deg, oklch(0.65 0.15 195) 0%, oklch(0.55 0.15 200) 100%);
  padding: 32px 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.preview-header::before {
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

.preview-badge-large {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  font-size: 48px;
  font-weight: 700;
  color: white;
  line-height: 1;
}

.preview-off {
  font-size: 16px;
  font-weight: 600;
  margin-top: 4px;
  opacity: 0.9;
}

.preview-body {
  padding: 20px;
}

.preview-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--foreground);
}

.preview-description {
  font-size: 13px;
  margin: 0 0 12px 0;
  color: var(--muted-foreground);
  line-height: 1.5;
}

.preview-type {
  display: flex;
  gap: 8px;
}

.summary-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--muted);
  border-radius: 8px;
  font-size: 13px;
}

.summary-label {
  color: var(--muted-foreground);
  font-weight: 500;
}

.summary-value {
  color: var(--foreground);
  font-weight: 600;
}

@media (max-width: 1024px) {
  .form-layout {
    grid-template-columns: 1fr;
  }

  .sidebar-section {
    order: -1;
  }
}

@media (max-width: 768px) {
  .promotion-form-container {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-item-half {
    grid-column: 1 / -1;
  }
}
</style>
