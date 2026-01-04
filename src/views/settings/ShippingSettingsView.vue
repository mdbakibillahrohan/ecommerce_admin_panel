<template>
  <div class="shipping-settings mx-auto">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Shipping Settings</h1>
        <p class="text-gray-500 mt-1">Manage your shipping zones and rates</p>
      </div>
      <a-button type="primary" size="large" @click="showAddZoneModal">
        <template #icon>
          <PlusOutlined />
        </template>
        Add Shipping Zone
      </a-button>
    </div>

    <!-- Shipping Zones List -->
    <div v-if="shippingZones.length > 0" class="space-y-4">
      <a-card v-for="zone in shippingZones" :key="zone.id" :bordered="false"
        class="shadow-sm hover:shadow-md transition-shadow duration-200 rounded-lg">
        <!-- Zone Header -->
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-xl font-semibold text-gray-900">{{ zone.name }}</h3>
              <a-tag :color="zone.enabled ? 'green' : 'red'">
                {{ zone.enabled ? 'Active' : 'Inactive' }}
              </a-tag>
            </div>
            <p class="text-gray-600 text-sm">{{ zone.countries.join(', ') }}</p>
          </div>
          <div class="flex gap-2">
            <a-switch v-model:checked="zone.enabled" :checked-children="'ON'" :un-checked-children="'OFF'" />
            <a-dropdown>
              <a-button type="text" class="ml-2">
                <template #icon>
                  <MoreOutlined />
                </template>
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="editZone(zone)">
                    <EditOutlined /> Edit Zone
                  </a-menu-item>
                  <a-menu-item @click="addRate(zone)">
                    <PlusOutlined /> Add Rate
                  </a-menu-item>
                  <a-menu-divider />
                  <a-menu-item danger @click="deleteZone(zone.id)">
                    <DeleteOutlined /> Delete Zone
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </div>

        <!-- Shipping Rates -->
        <div class="mt-4">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-sm font-medium text-gray-700 uppercase tracking-wide">Shipping Rates</h4>
            <a-button type="link" size="small" @click="addRate(zone)">
              + Add Rate
            </a-button>
          </div>

          <div class="space-y-2">
            <div v-for="rate in zone.rates" :key="rate.id"
              class="flex items-center justify-between !p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors !my-[20px]">
              <div class="flex items-center gap-4 flex-1">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <component :is="getShippingIcon(rate.type)" class="text-blue-600 text-xl" />
                </div>
                <div class="flex-1">
                  <p class="font-medium text-gray-900">{{ rate.name }}</p>
                  <p class="text-sm text-gray-500">{{ rate.description }}</p>
                  <div class="flex gap-4 mt-1">
                    <span v-if="rate.minOrder" class="text-xs text-gray-500">
                      Min order: ${{ rate.minOrder }}
                    </span>
                    <span v-if="rate.deliveryTime" class="text-xs text-gray-500">
                      {{ rate.deliveryTime }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <div class="text-right">
                  <p class="text-lg font-bold text-gray-900">
                    {{ rate.price === 0 ? 'FREE' : `$${rate.price.toFixed(2)}` }}
                  </p>
                  <p v-if="rate.type === 'weight-based'" class="text-xs text-gray-500">
                    per kg
                  </p>
                </div>
                <a-button type="text" size="small" @click="editRate(zone, rate)">
                  <EditOutlined />
                </a-button>
                <a-button type="text" danger size="small" @click="deleteRate(zone.id, rate.id)">
                  <DeleteOutlined />
                </a-button>
              </div>
            </div>
          </div>
        </div>
      </a-card>
    </div>

    <!-- Empty State -->
    <a-card v-else :bordered="false" class="shadow-sm rounded-lg">
      <a-empty description="No shipping zones configured">
        <template #image>
          <InboxOutlined style="font-size: 64px; color: #d9d9d9" />
        </template>
        <a-button type="primary" @click="showAddZoneModal">
          Create Your First Shipping Zone
        </a-button>
      </a-empty>
      <div class="text-center mt-4">
        <p class="text-gray-500 text-sm max-w-md mx-auto">
          Configure where you ship and how much you charge. Set up zones based on countries or regions, then add
          shipping
          rates for each zone.
        </p>
      </div>
    </a-card>

    <!-- Add/Edit Zone Modal -->
    <a-modal v-model:open="isZoneModalVisible" :title="editingZone ? 'Edit Shipping Zone' : 'Add Shipping Zone'"
      @ok="saveZone" width="600px">
      <a-form layout="vertical" class="mt-4">
        <a-form-item label="Zone Name" required>
          <a-input v-model:value="zoneForm.name" placeholder="e.g., North America, Europe" size="large" />
        </a-form-item>
        <a-form-item label="Countries/Regions" required>
          <a-select v-model:value="zoneForm.countries" mode="tags" placeholder="Select or type countries" size="large"
            style="width: 100%" :options="countryOptions" />
        </a-form-item>
        <a-form-item label="Status">
          <a-switch v-model:checked="zoneForm.enabled">
            <template #checkedChildren>Active</template>
            <template #unCheckedChildren>Inactive</template>
          </a-switch>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Add/Edit Rate Modal -->
    <a-modal v-model:open="isRateModalVisible" :title="editingRate ? 'Edit Shipping Rate' : 'Add Shipping Rate'"
      @ok="saveRate" width="600px">
      <a-form layout="vertical" class="mt-4">
        <a-form-item label="Rate Name" required>
          <a-input v-model:value="rateForm.name" placeholder="e.g., Standard Shipping" size="large" />
        </a-form-item>
        <a-form-item label="Description">
          <a-textarea v-model:value="rateForm.description" placeholder="Brief description of this shipping method"
            :rows="2" />
        </a-form-item>
        <a-form-item label="Shipping Type" required>
          <a-select v-model:value="rateForm.type" size="large">
            <a-select-option value="flat-rate">Flat Rate</a-select-option>
            <a-select-option value="free">Free Shipping</a-select-option>
            <a-select-option value="weight-based">Weight Based</a-select-option>
            <a-select-option value="express">Express</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="Price" required>
          <a-input-number v-model:value="rateForm.price" :min="0" :precision="2" prefix="$" size="large"
            style="width: 100%" />
        </a-form-item>
        <a-form-item label="Minimum Order (optional)">
          <a-input-number v-model:value="rateForm.minOrder" :min="0" :precision="2" prefix="$" size="large"
            style="width: 100%" />
        </a-form-item>
        <a-form-item label="Estimated Delivery Time">
          <a-input v-model:value="rateForm.deliveryTime" placeholder="e.g., 3-5 business days" size="large" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  InboxOutlined,
  RocketOutlined,
  CarOutlined,
  GiftOutlined,
  ThunderboltOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

interface ShippingRate {
  id: string
  name: string
  description: string
  type: 'flat-rate' | 'free' | 'weight-based' | 'express'
  price: number
  minOrder?: number
  deliveryTime?: string
}

interface ShippingZone {
  id: string
  name: string
  countries: string[]
  enabled: boolean
  rates: ShippingRate[]
}

// Demo data
const shippingZones = ref<ShippingZone[]>([
  {
    id: '1',
    name: 'United States',
    countries: ['United States'],
    enabled: true,
    rates: [
      {
        id: 'r1',
        name: 'Standard Shipping',
        description: 'Delivery within 5-7 business days',
        type: 'flat-rate',
        price: 9.99,
        deliveryTime: '5-7 business days'
      },
      {
        id: 'r2',
        name: 'Express Shipping',
        description: 'Fast delivery within 2-3 business days',
        type: 'express',
        price: 19.99,
        deliveryTime: '2-3 business days'
      },
      {
        id: 'r3',
        name: 'Free Shipping',
        description: 'Free standard shipping on orders over $50',
        type: 'free',
        price: 0,
        minOrder: 50,
        deliveryTime: '7-10 business days'
      }
    ]
  },
  {
    id: '2',
    name: 'Europe',
    countries: ['United Kingdom', 'Germany', 'France', 'Italy', 'Spain'],
    enabled: true,
    rates: [
      {
        id: 'r4',
        name: 'Standard EU Shipping',
        description: 'Delivery to EU countries',
        type: 'flat-rate',
        price: 14.99,
        deliveryTime: '7-10 business days'
      },
      {
        id: 'r5',
        name: 'Express EU Shipping',
        description: 'Priority delivery to EU countries',
        type: 'express',
        price: 29.99,
        deliveryTime: '3-5 business days'
      }
    ]
  },
  {
    id: '3',
    name: 'Asia Pacific',
    countries: ['Australia', 'Japan', 'Singapore', 'South Korea'],
    enabled: false,
    rates: [
      {
        id: 'r6',
        name: 'Standard International',
        description: 'Economy shipping to Asia Pacific region',
        type: 'flat-rate',
        price: 24.99,
        deliveryTime: '10-15 business days'
      }
    ]
  }
])

const countryOptions = [
  { value: 'United States', label: 'United States' },
  { value: 'Canada', label: 'Canada' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Germany', label: 'Germany' },
  { value: 'France', label: 'France' },
  { value: 'Australia', label: 'Australia' },
  { value: 'Japan', label: 'Japan' },
]

// Modals
const isZoneModalVisible = ref(false)
const isRateModalVisible = ref(false)
const editingZone = ref<ShippingZone | null>(null)
const editingRate = ref<ShippingRate | null>(null)
const currentZone = ref<ShippingZone | null>(null)

// Forms
const zoneForm = reactive({
  name: '',
  countries: [],
  enabled: true
})

const rateForm = reactive({
  name: '',
  description: '',
  type: 'flat-rate' as const,
  price: 0,
  minOrder: undefined,
  deliveryTime: ''
})

// Helper functions
const getShippingIcon = (type: string) => {
  switch (type) {
    case 'express':
      return RocketOutlined
    case 'free':
      return GiftOutlined
    case 'weight-based':
      return ThunderboltOutlined
    default:
      return CarOutlined
  }
}

// Zone actions
const showAddZoneModal = () => {
  editingZone.value = null
  zoneForm.name = ''
  zoneForm.countries = []
  zoneForm.enabled = true
  isZoneModalVisible.value = true
}

const editZone = (zone: ShippingZone) => {
  editingZone.value = zone
  zoneForm.name = zone.name
  zoneForm.countries = [...zone.countries]
  zoneForm.enabled = zone.enabled
  isZoneModalVisible.value = true
}

const saveZone = () => {
  if (!zoneForm.name || zoneForm.countries.length === 0) {
    message.error('Please fill in all required fields')
    return
  }

  if (editingZone.value) {
    // Update existing zone
    const index = shippingZones.value.findIndex(z => z.id === editingZone.value!.id)
    if (index !== -1) {
      shippingZones.value[index] = {
        ...shippingZones.value[index],
        name: zoneForm.name,
        countries: zoneForm.countries,
        enabled: zoneForm.enabled
      }
      message.success('Shipping zone updated successfully')
    }
  } else {
    // Add new zone
    const newZone: ShippingZone = {
      id: Date.now().toString(),
      name: zoneForm.name,
      countries: zoneForm.countries,
      enabled: zoneForm.enabled,
      rates: []
    }
    shippingZones.value.push(newZone)
    message.success('Shipping zone created successfully')
  }

  isZoneModalVisible.value = false
}

const deleteZone = (zoneId: string) => {
  const index = shippingZones.value.findIndex(z => z.id === zoneId)
  if (index !== -1) {
    shippingZones.value.splice(index, 1)
    message.success('Shipping zone deleted successfully')
  }
}

// Rate actions
const addRate = (zone: ShippingZone) => {
  currentZone.value = zone
  editingRate.value = null
  rateForm.name = ''
  rateForm.description = ''
  rateForm.type = 'flat-rate'
  rateForm.price = 0
  rateForm.minOrder = undefined
  rateForm.deliveryTime = ''
  isRateModalVisible.value = true
}

const editRate = (zone: ShippingZone, rate: ShippingRate) => {
  currentZone.value = zone
  editingRate.value = rate
  rateForm.name = rate.name
  rateForm.description = rate.description
  rateForm.type = rate.type
  rateForm.price = rate.price
  rateForm.minOrder = rate.minOrder
  rateForm.deliveryTime = rate.deliveryTime || ''
  isRateModalVisible.value = true
}

const saveRate = () => {
  if (!rateForm.name || !currentZone.value) {
    message.error('Please fill in all required fields')
    return
  }

  const zone = shippingZones.value.find(z => z.id === currentZone.value!.id)
  if (!zone) return

  if (editingRate.value) {
    // Update existing rate
    const index = zone.rates.findIndex(r => r.id === editingRate.value!.id)
    if (index !== -1) {
      zone.rates[index] = {
        ...zone.rates[index],
        name: rateForm.name,
        description: rateForm.description,
        type: rateForm.type,
        price: rateForm.price,
        minOrder: rateForm.minOrder,
        deliveryTime: rateForm.deliveryTime
      }
      message.success('Shipping rate updated successfully')
    }
  } else {
    // Add new rate
    const newRate: ShippingRate = {
      id: Date.now().toString(),
      name: rateForm.name,
      description: rateForm.description,
      type: rateForm.type,
      price: rateForm.price,
      minOrder: rateForm.minOrder,
      deliveryTime: rateForm.deliveryTime
    }
    zone.rates.push(newRate)
    message.success('Shipping rate added successfully')
  }

  isRateModalVisible.value = false
}

const deleteRate = (zoneId: string, rateId: string) => {
  const zone = shippingZones.value.find(z => z.id === zoneId)
  if (!zone) return

  const index = zone.rates.findIndex(r => r.id === rateId)
  if (index !== -1) {
    zone.rates.splice(index, 1)
    message.success('Shipping rate deleted successfully')
  }
}
</script>

<style scoped>
.shipping-settings {
  min-height: 100vh;
}
</style>
