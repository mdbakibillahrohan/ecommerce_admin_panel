<template>
  <div class="tax-settings-container">
    <!-- Gradient Header with Professional Styling -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">Tax Settings</h1>
          <p class="page-subtitle">Manage tax rates and global tax configuration</p>
        </div>
        <a-button type="primary" @click="showAddModal" class="add-button">
          <template #icon>
            <PlusOutlined />
          </template>
          Add Tax Rate
        </a-button>
      </div>
    </div>

    <!-- Custom Styled Cards -->
    <div class="settings-content">
      <!-- Global Tax Configuration -->
      <div class="settings-card">
        <div class="card-header">
          <h3 class="card-title">Global Configuration</h3>
          <p class="card-subtitle">Configure how taxes are calculated and displayed</p>
        </div>

        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-label">All prices include tax</div>
              <div class="setting-description">Display prices with tax included for customers</div>
            </div>
            <a-switch v-model:checked="globalSettings.pricesIncludeTax" />
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-label">Calculate tax based on</div>
              <div class="setting-description">Choose how to determine tax rates</div>
            </div>
            <a-select v-model:value="globalSettings.taxCalculationBasis" class="setting-select">
              <a-select-option value="shipping">Shipping address</a-select-option>
              <a-select-option value="billing">Billing address</a-select-option>
              <a-select-option value="store">Store location</a-select-option>
            </a-select>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-label">Show tax breakdown</div>
              <div class="setting-description">Display detailed tax information at checkout</div>
            </div>
            <a-switch v-model:checked="globalSettings.showTaxBreakdown" />
          </div>
        </div>
      </div>

      <!-- Tax Rates List -->
      <div class="settings-card">
        <div class="card-header">
          <div>
            <h3 class="card-title">Tax Rates</h3>
            <p class="card-subtitle">Manage tax rates for different regions</p>
          </div>
          <a-input-search v-model:value="searchQuery" placeholder="Search tax rates..." class="search-input" />
        </div>

        <div v-if="filteredTaxRates.length === 0" class="empty-state">
          <a-empty description="No tax rates configured">
            <a-button type="primary" @click="showAddModal">Add Your First Tax Rate</a-button>
          </a-empty>
        </div>

        <!-- Enhanced Tax Rate Cards with Better Visual Hierarchy -->
        <div v-else class="tax-rates-grid">
          <div v-for="rate in filteredTaxRates" :key="rate.id" class="tax-rate-card"
            :class="{ 'inactive': !rate.enabled }">
            <div class="rate-card-content">
              <div class="rate-header">
                <h4 class="rate-name">{{ rate.name }}</h4>
                <div class="rate-badges">
                  <a-tag :color="rate.enabled ? 'success' : 'default'" class="status-badge">
                    {{ rate.enabled ? 'Active' : 'Inactive' }}
                  </a-tag>
                  <a-tag v-if="rate.isCompound" color="warning" class="compound-badge">
                    Compound
                  </a-tag>
                </div>
              </div>

              <div class="rate-details">
                <div class="detail-row">
                  <EnvironmentOutlined class="detail-icon" />
                  <span class="detail-label">Region:</span>
                  <span class="detail-value">{{ rate.region }}</span>
                </div>
                <div class="detail-row">
                  <PercentageOutlined class="detail-icon" />
                  <span class="detail-label">Rate:</span>
                  <span class="detail-value">{{ rate.rate }}%</span>
                </div>
                <div v-if="rate.categories.length > 0" class="detail-row">
                  <TagOutlined class="detail-icon" />
                  <span class="detail-label">Categories:</span>
                  <span class="detail-value">{{ rate.categories.join(', ') }}</span>
                </div>
                <div v-if="rate.priority" class="detail-row">
                  <SortAscendingOutlined class="detail-icon" />
                  <span class="detail-label">Priority:</span>
                  <span class="detail-value">{{ rate.priority }}</span>
                </div>
              </div>
            </div>

            <div class="rate-actions">
              <a-switch v-model:checked="rate.enabled" @change="toggleTaxRate(rate)" size="small" />
              <a-dropdown>
                <a-button type="text" size="small" class="action-button">
                  <MoreOutlined />
                </a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="editTaxRate(rate)">
                      <EditOutlined /> Edit
                    </a-menu-item>
                    <a-menu-item @click="duplicateTaxRate(rate)">
                      <CopyOutlined /> Duplicate
                    </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item danger @click="confirmDelete(rate)">
                      <DeleteOutlined /> Delete
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Tax Rate Modal -->
    <a-modal v-model:open="modalVisible" :title="editingRate ? 'Edit Tax Rate' : 'Add Tax Rate'" @ok="handleSubmit"
      @cancel="handleCancel" width="600px" class="tax-modal">
      <a-form :model="formData" layout="vertical" class="tax-form">
        <a-form-item label="Tax Rate Name" required>
          <a-input v-model:value="formData.name" placeholder="e.g., California State Tax" />
        </a-form-item>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="Region/Country" required>
              <a-input v-model:value="formData.region" placeholder="e.g., California, US" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Tax Rate (%)" required>
              <a-input-number v-model:value="formData.rate" :min="0" :max="100" :step="0.01" style="width: 100%" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="Product Categories">
          <a-select v-model:value="formData.categories" mode="multiple"
            placeholder="Select categories (leave empty for all)" style="width: 100%">
            <a-select-option value="Electronics">Electronics</a-select-option>
            <a-select-option value="Clothing">Clothing</a-select-option>
            <a-select-option value="Food & Beverage">Food & Beverage</a-select-option>
            <a-select-option value="Books">Books</a-select-option>
            <a-select-option value="Digital Goods">Digital Goods</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="Priority">
          <a-input-number v-model:value="formData.priority" :min="1" placeholder="1 = highest priority"
            style="width: 100%" />
          <div class="form-hint">
            Higher priority rates are applied first when multiple rates match
          </div>
        </a-form-item>

        <a-form-item>
          <a-checkbox v-model:checked="formData.isCompound">
            Compound tax (calculated on subtotal + other taxes)
          </a-checkbox>
        </a-form-item>

        <a-form-item>
          <a-checkbox v-model:checked="formData.enabled">
            Enable this tax rate
          </a-checkbox>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { message, Modal } from 'ant-design-vue'
import {
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  EnvironmentOutlined,
  PercentageOutlined,
  TagOutlined,
  SortAscendingOutlined
} from '@ant-design/icons-vue'

interface TaxRate {
  id: number
  name: string
  region: string
  rate: number
  categories: string[]
  priority: number
  isCompound: boolean
  enabled: boolean
}

interface GlobalSettings {
  pricesIncludeTax: boolean
  taxCalculationBasis: string
  showTaxBreakdown: boolean
}

// Global settings
const globalSettings = ref<GlobalSettings>({
  pricesIncludeTax: true,
  taxCalculationBasis: 'shipping',
  showTaxBreakdown: true
})

// Tax rates data
const taxRates = ref<TaxRate[]>([
  {
    id: 1,
    name: 'California State Tax',
    region: 'California, US',
    rate: 7.25,
    categories: [],
    priority: 1,
    isCompound: false,
    enabled: true
  },
  {
    id: 2,
    name: 'Los Angeles County Tax',
    region: 'Los Angeles, CA',
    rate: 2.25,
    categories: [],
    priority: 2,
    isCompound: true,
    enabled: true
  },
  {
    id: 3,
    name: 'EU VAT - Standard',
    region: 'European Union',
    rate: 20.0,
    categories: ['Electronics', 'Clothing'],
    priority: 1,
    isCompound: false,
    enabled: true
  },
  {
    id: 4,
    name: 'EU VAT - Reduced',
    region: 'European Union',
    rate: 5.0,
    categories: ['Books', 'Food & Beverage'],
    priority: 1,
    isCompound: false,
    enabled: true
  },
  {
    id: 5,
    name: 'UK VAT',
    region: 'United Kingdom',
    rate: 20.0,
    categories: [],
    priority: 1,
    isCompound: false,
    enabled: true
  },
  {
    id: 6,
    name: 'Canada GST',
    region: 'Canada',
    rate: 5.0,
    categories: [],
    priority: 1,
    isCompound: false,
    enabled: true
  },
  {
    id: 7,
    name: 'Ontario PST',
    region: 'Ontario, Canada',
    rate: 8.0,
    categories: [],
    priority: 2,
    isCompound: true,
    enabled: true
  },
  {
    id: 8,
    name: 'Digital Goods - US',
    region: 'United States',
    rate: 6.0,
    categories: ['Digital Goods'],
    priority: 1,
    isCompound: false,
    enabled: false
  }
])

// Search and filter
const searchQuery = ref('')
const filteredTaxRates = computed(() => {
  if (!searchQuery.value) return taxRates.value

  const query = searchQuery.value.toLowerCase()
  return taxRates.value.filter(rate =>
    rate.name.toLowerCase().includes(query) ||
    rate.region.toLowerCase().includes(query) ||
    rate.categories.some(cat => cat.toLowerCase().includes(query))
  )
})

// Modal state
const modalVisible = ref(false)
const editingRate = ref<TaxRate | null>(null)
const formData = ref({
  name: '',
  region: '',
  rate: 0,
  categories: [] as string[],
  priority: 1,
  isCompound: false,
  enabled: true
})

// Modal actions
const showAddModal = () => {
  editingRate.value = null
  formData.value = {
    name: '',
    region: '',
    rate: 0,
    categories: [],
    priority: 1,
    isCompound: false,
    enabled: true
  }
  modalVisible.value = true
}

const editTaxRate = (rate: TaxRate) => {
  editingRate.value = rate
  formData.value = {
    name: rate.name,
    region: rate.region,
    rate: rate.rate,
    categories: [...rate.categories],
    priority: rate.priority,
    isCompound: rate.isCompound,
    enabled: rate.enabled
  }
  modalVisible.value = true
}

const handleSubmit = () => {
  if (!formData.value.name || !formData.value.region || formData.value.rate === 0) {
    message.error('Please fill in all required fields')
    return
  }

  if (editingRate.value) {
    // Update existing rate
    const index = taxRates.value.findIndex(r => r.id === editingRate.value!.id)
    if (index !== -1) {
      taxRates.value[index] = {
        ...taxRates.value[index],
        ...formData.value
      } as TaxRate
      message.success('Tax rate updated successfully')
    }
  } else {
    // Add new rate
    const newRate: TaxRate = {
      id: Date.now(),
      ...formData.value
    }
    taxRates.value.push(newRate)
    message.success('Tax rate added successfully')
  }

  modalVisible.value = false
}

const handleCancel = () => {
  modalVisible.value = false
}

// Tax rate actions
const toggleTaxRate = (rate: TaxRate) => {
  message.success(`Tax rate ${rate.enabled ? 'enabled' : 'disabled'}`)
}

const duplicateTaxRate = (rate: TaxRate) => {
  const newRate: TaxRate = {
    ...rate,
    id: Date.now(),
    name: `${rate.name} (Copy)`,
    enabled: false
  }
  taxRates.value.push(newRate)
  message.success('Tax rate duplicated successfully')
}

const confirmDelete = (rate: TaxRate) => {
  Modal.confirm({
    title: 'Delete Tax Rate',
    content: `Are you sure you want to delete "${rate.name}"? This action cannot be undone.`,
    okText: 'Delete',
    okType: 'danger',
    onOk: () => {
      const index = taxRates.value.findIndex(r => r.id === rate.id)
      if (index !== -1) {
        taxRates.value.splice(index, 1)
        message.success('Tax rate deleted successfully')
      }
    }
  })
}
</script>

<style scoped>
/* Replaced all Tailwind with custom CSS using CSS variables for theming */
.tax-settings-container {
  margin: 0 auto;
}

.page-header {
  background: linear-gradient(135deg, oklch(0.6 0.15 180) 0%, oklch(0.55 0.13 185) 100%);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(13, 148, 136, 0.15);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.header-left {
  flex: 1;
}

.page-title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: white;
  letter-spacing: -0.5px;
}

.page-subtitle {
  margin: 8px 0 0 0;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
}

.add-button {
  height: 40px;
  padding: 0 24px;
  font-weight: 500;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.settings-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.settings-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 16px;
}

.card-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
}

.card-subtitle {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: var(--muted-foreground);
}

.search-input {
  width: 280px;
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: var(--muted);
  border-radius: 10px;
  border: 1px solid var(--border);
  transition: all 0.3s ease;
}

.setting-item:hover {
  background: var(--accent);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.1);
}

.setting-info {
  flex: 1;
}

.setting-label {
  font-size: 15px;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 4px;
}

.setting-description {
  font-size: 13px;
  color: var(--muted-foreground);
}

.setting-select {
  width: 200px;
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
}

.tax-rates-grid {
  display: grid;
  gap: 16px;
}

.tax-rate-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tax-rate-card:hover {
  border-color: oklch(0.6 0.15 180);
  box-shadow: 0 8px 24px rgba(13, 148, 136, 0.12);
  transform: translateY(-2px);
}

.tax-rate-card.inactive {
  opacity: 0.6;
  background: var(--muted);
}

.rate-card-content {
  flex: 1;
}

.rate-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.rate-name {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
  color: var(--foreground);
}

.rate-badges {
  display: flex;
  gap: 8px;
}

.status-badge,
.compound-badge {
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.rate-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--foreground);
}

.detail-icon {
  color: oklch(0.6 0.15 180);
  font-size: 14px;
}

.detail-label {
  font-weight: 500;
  color: var(--muted-foreground);
}

.detail-value {
  color: var(--foreground);
}

.rate-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-button {
  color: var(--muted-foreground);
  transition: all 0.2s ease;
}

.action-button:hover {
  color: oklch(0.6 0.15 180);
  background: var(--accent);
}

.tax-form {
  margin-top: 24px;
}

.form-hint {
  margin-top: 8px;
  font-size: 12px;
  color: var(--muted-foreground);
}

/* Responsive design */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .card-header {
    flex-direction: column;
  }

  .search-input {
    width: 100%;
  }

  .tax-rate-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .rate-actions {
    width: 100%;
    justify-content: space-between;
    padding-top: 16px;
    border-top: 1px solid var(--border);
  }
}
</style>
