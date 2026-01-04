<template>
  <div class="tax-settings mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Tax Settings</h1>
      <a-button type="primary" @click="showAddModal">
        <template #icon>
          <PlusOutlined />
        </template>
        Add Tax Rate
      </a-button>
    </div>

    <!-- Global Tax Configuration -->
    <a-card :bordered="true" class="shadow-sm! rounded-lg! mb-6!" style="border: 1px solid #e5e7eb;">
      <h3 class="text-base font-semibold text-gray-900 mb-4">Global Configuration</h3>

      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <div class="font-medium text-gray-900">All prices include tax</div>
            <div class="text-sm text-gray-500">Display prices with tax included for customers</div>
          </div>
          <a-switch v-model:checked="globalSettings.pricesIncludeTax" />
        </div>

        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <div class="font-medium text-gray-900">Calculate tax based on</div>
            <div class="text-sm text-gray-500">Choose how to determine tax rates</div>
          </div>
          <a-select v-model:value="globalSettings.taxCalculationBasis" style="width: 200px">
            <a-select-option value="shipping">Shipping address</a-select-option>
            <a-select-option value="billing">Billing address</a-select-option>
            <a-select-option value="store">Store location</a-select-option>
          </a-select>
        </div>

        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <div class="font-medium text-gray-900">Show tax breakdown</div>
            <div class="text-sm text-gray-500">Display detailed tax information at checkout</div>
          </div>
          <a-switch v-model:checked="globalSettings.showTaxBreakdown" />
        </div>
      </div>
    </a-card>

    <!-- Tax Rates List -->
    <a-card :bordered="true" class="shadow-sm! rounded-lg!" style="border: 1px solid #e5e7eb; background: white;">
      <div class="flex! justify-between! items-center! mb-4!">
        <h3 class="text-base! font-semibold! text-gray-900!">Tax Rates</h3>
        <a-input-search v-model:value="searchQuery" placeholder="Search tax rates..." style="width: 250px" />
      </div>

      <div v-if="filteredTaxRates.length === 0" class="text-center! py-8!">
        <a-empty description="No tax rates configured">
          <a-button type="primary" @click="showAddModal">Add Your First Tax Rate</a-button>
        </a-empty>
      </div>

      <div v-else class="space-y-4!">
        <a-card v-for="rate in filteredTaxRates" :key="rate.id" :bordered="true" class="tax-rate-card"
          :class="{ 'opacity-60': !rate.enabled }">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-3">
                <h4 class="text-base font-semibold text-gray-900">{{ rate.name }}</h4>
                <a-tag :color="rate.enabled ? 'green' : 'default'" class="rounded-full">
                  {{ rate.enabled ? 'Active' : 'Inactive' }}
                </a-tag>
                <a-tag v-if="rate.isCompound" color="orange" class="rounded-full">Compound</a-tag>
              </div>

              <div class="space-y-2 text-sm">
                <div class="flex items-center gap-2 text-gray-700">
                  <EnvironmentOutlined class="text-gray-400" />
                  <span><strong class="font-medium">Region:</strong> {{ rate.region }}</span>
                </div>
                <div class="flex items-center gap-2 text-gray-700">
                  <PercentageOutlined class="text-gray-400" />
                  <span><strong class="font-medium">Rate:</strong> {{ rate.rate }}%</span>
                </div>
                <div v-if="rate.categories.length > 0" class="flex items-center gap-2 text-gray-700">
                  <TagOutlined class="text-gray-400" />
                  <span><strong class="font-medium">Categories:</strong> {{ rate.categories.join(', ') }}</span>
                </div>
                <div v-if="rate.priority" class="flex items-center gap-2 text-gray-700">
                  <SortAscendingOutlined class="text-gray-400" />
                  <span><strong class="font-medium">Priority:</strong> {{ rate.priority }}</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <a-switch v-model:checked="rate.enabled" @change="toggleTaxRate(rate)" />
              <a-dropdown>
                <a-button type="text" size="small">
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
        </a-card>
      </div>
    </a-card>

    <!-- Add/Edit Tax Rate Modal -->
    <a-modal v-model:open="modalVisible" :title="editingRate ? 'Edit Tax Rate' : 'Add Tax Rate'" @ok="handleSubmit"
      @cancel="handleCancel" width="600px">
      <a-form :model="formData" layout="vertical" class="mt-4">
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
          <div class="text-xs text-gray-500 mt-1">
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
        ...formData.value,

      }
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
.tax-settings {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* Added custom styling for tax rate cards with proper borders, shadows, and hover effects */
.tax-rate-card {
  border: 1px solid #e5e7eb !important;
  border-radius: 8px;
  background: #ffffff;
  transition: all 0.3s ease;
}

.tax-rate-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #d1d5db !important;
}

.tax-rate-card.opacity-60 {
  background: #f9fafb;
}

/* Improved spacing utility for consistent gaps */
.space-y-4>*+* {
  margin-top: 1rem;
}
</style>
