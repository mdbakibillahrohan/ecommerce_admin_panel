<template>
  <div class="shipping-settings-container">
    <!-- Added professional gradient header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">Shipping Settings</h1>
          <p class="page-subtitle">Manage your shipping zones and rates</p>
        </div>
        <a-button type="primary" size="large" class="add-zone-btn" @click="showAddZoneModal">
          <template #icon>
            <PlusOutlined />
          </template>
          Add Shipping Zone
        </a-button>
      </div>
    </div>

    <!-- Shipping Zones List -->
    <div v-if="shippingZones.length > 0" class="zones-list">
      <a-card v-for="zone in shippingZones" :key="zone.id" :bordered="false" class="zone-card">
        <!-- Improved zone header with better visual hierarchy -->
        <div class="zone-header">
          <div class="zone-info">
            <div class="zone-title-row">
              <h3 class="zone-name">{{ zone.name }}</h3>
              <a-tag :color="zone.enabled ? 'success' : 'error'" class="status-tag">
                {{ zone.enabled ? 'Active' : 'Inactive' }}
              </a-tag>
            </div>
            <p class="zone-countries">{{ zone.countries.join(', ') }}</p>
          </div>
          <div class="zone-actions">
            <a-switch v-model:checked="zone.enabled" :checked-children="'ON'" :un-checked-children="'OFF'"
              class="zone-toggle" />
            <a-dropdown>
              <a-button type="text" class="more-btn">
                <template #icon>
                  <MoreOutlined />
                </template>
              </a-button>
              <template #overlay>
                <a-menu class="action-menu">
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

        <!-- Enhanced shipping rates section -->
        <div class="rates-section">
          <div class="rates-header">
            <h4 class="rates-title">Shipping Rates</h4>
            <a-button type="link" size="small" class="add-rate-link" @click="addRate(zone)">
              + Add Rate
            </a-button>
          </div>

          <div class="rates-list">
            <div v-for="rate in zone.rates" :key="rate.id" class="rate-card">
              <div class="rate-content">
                <div class="rate-icon-wrapper">
                  <component :is="getShippingIcon(rate.type)" class="rate-icon" />
                </div>
                <div class="rate-details">
                  <p class="rate-name">{{ rate.name }}</p>
                  <p class="rate-description">{{ rate.description }}</p>
                  <div class="rate-meta">
                    <span v-if="rate.minOrder" class="meta-item">
                      Min order: ${{ rate.minOrder }}
                    </span>
                    <span v-if="rate.deliveryTime" class="meta-item">
                      {{ rate.deliveryTime }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="rate-price-actions">
                <div class="rate-price-box">
                  <p class="rate-price">
                    {{ rate.price === 0 ? 'FREE' : `$${rate.price.toFixed(2)}` }}
                  </p>
                  <p v-if="rate.type === 'weight-based'" class="price-unit">
                    per kg
                  </p>
                </div>
                <div class="rate-actions">
                  <a-button type="text" size="small" class="action-btn" @click="editRate(zone, rate)">
                    <EditOutlined />
                  </a-button>
                  <a-button type="text" danger size="small" class="action-btn" @click="deleteRate(zone.id, rate.id)">
                    <DeleteOutlined />
                  </a-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-card>
    </div>

    <!-- Enhanced empty state -->
    <a-card v-else :bordered="false" class="empty-state-card">
      <div class="empty-state">
        <div class="empty-icon">
          <InboxOutlined />
        </div>
        <h3 class="empty-title">No shipping zones configured</h3>
        <p class="empty-description">
          Configure where you ship and how much you charge. Set up zones based on countries or regions, then add
          shipping
          rates for each zone.
        </p>
        <a-button type="primary" size="large" @click="showAddZoneModal">
          Create Your First Shipping Zone
        </a-button>
      </div>
    </a-card>

    <!-- Add/Edit Zone Modal -->
    <a-modal v-model:open="isZoneModalVisible" :title="editingZone ? 'Edit Shipping Zone' : 'Add Shipping Zone'"
      @ok="saveZone" width="600px" class="shipping-modal">
      <a-form layout="vertical" class="modal-form">
        <a-form-item label="Zone Name" required>
          <a-input v-model:value="zoneForm.name" placeholder="e.g., North America, Europe" size="large" />
        </a-form-item>
        <a-form-item label="Countries/Regions" required>
          <a-select v-model:value="zoneForm.countries" mode="tags" placeholder="Select or type countries" size="large"
            :options="countryOptions" />
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
      @ok="saveRate" width="600px" class="shipping-modal">
      <a-form layout="vertical" class="modal-form">
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
const zoneForm = reactive<{
  name: string
  countries: string[]
  enabled: boolean
}>({
  name: '',
  countries: [],
  enabled: true
})

const rateForm = reactive<{
  name: string
  description: string
  type: 'flat-rate' | 'free' | 'weight-based' | 'express'
  price: number
  minOrder?: number
  deliveryTime: string
}>({
  name: '',
  description: '',
  type: 'flat-rate',
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
      const zone = shippingZones.value[index]
      if (zone) {
        zone.name = zoneForm.name
        zone.countries = zoneForm.countries
        zone.enabled = zoneForm.enabled
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
      const rate = zone.rates[index]
      if (rate) {
        rate.name = rateForm.name
        rate.description = rateForm.description
        rate.type = rateForm.type
        rate.price = rateForm.price
        rate.minOrder = rateForm.minOrder
        rate.deliveryTime = rateForm.deliveryTime
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
/* Replaced all hardcoded colors with CSS variables and removed Tailwind */
.shipping-settings-container {
  margin: 0 auto;
}

.page-header {
  background: linear-gradient(135deg, oklch(0.6 0.15 192) 0%, oklch(0.55 0.14 195) 100%);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.header-text {
  flex: 1;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.add-zone-btn {
  height: 48px;
  padding: 0 28px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.add-zone-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.zones-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.zone-card {
  background: var(--card);
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.zone-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.zone-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}

.zone-info {
  flex: 1;
}

.zone-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.zone-name {
  font-size: 22px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0;
  letter-spacing: -0.3px;
}

.status-tag {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 12px;
}

.zone-countries {
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
}

.zone-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.zone-toggle {
  background: var(--muted);
}

.more-btn {
  color: var(--muted-foreground);
  transition: all 0.2s ease;
}

.more-btn:hover {
  color: var(--foreground);
  background: var(--muted);
}

.rates-section {
  margin-top: 24px;
}

.rates-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.rates-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--muted-foreground);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.add-rate-link {
  color: oklch(0.6 0.15 192);
  font-weight: 600;
  padding: 4px 8px;
}

.add-rate-link:hover {
  color: oklch(0.55 0.14 195);
}

.rates-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rate-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: var(--muted);
  border-radius: 12px;
  border: 1px solid var(--border);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.rate-card:hover {
  background: var(--accent);
  border-color: oklch(0.6 0.15 192);
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.1);
  transform: translateX(4px);
}

.rate-content {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.rate-icon-wrapper {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, oklch(0.6 0.15 192) 0%, oklch(0.55 0.14 195) 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.2);
  transition: all 0.3s ease;
}

.rate-card:hover .rate-icon-wrapper {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(13, 148, 136, 0.3);
}

.rate-icon {
  font-size: 24px;
  color: white;
}

.rate-details {
  flex: 1;
}

.rate-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 4px 0;
}

.rate-description {
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0 0 8px 0;
}

.rate-meta {
  display: flex;
  gap: 16px;
}

.meta-item {
  font-size: 12px;
  color: var(--muted-foreground);
  font-weight: 500;
}

.rate-price-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.rate-price-box {
  text-align: right;
}

.rate-price {
  font-size: 20px;
  font-weight: 700;
  color: oklch(0.6 0.15 192);
  margin: 0;
}

.price-unit {
  font-size: 12px;
  color: var(--muted-foreground);
  margin: 4px 0 0 0;
}

.rate-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: var(--accent);
  transform: scale(1.1);
}

.empty-state-card {
  background: var(--card);
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.empty-state {
  text-align: center;
  padding: 60px 32px;
}

.empty-icon {
  font-size: 80px;
  color: var(--muted-foreground);
  opacity: 0.3;
  margin-bottom: 24px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

.empty-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0 0 12px 0;
}

.empty-description {
  font-size: 15px;
  color: var(--muted-foreground);
  max-width: 500px;
  margin: 0 auto 32px auto;
  line-height: 1.6;
}

.modal-form {
  margin-top: 24px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .shipping-settings-container {
    padding: 16px;
  }

  .page-header {
    padding: 24px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-title {
    font-size: 24px;
  }

  .add-zone-btn {
    width: 100%;
  }

  .zone-header {
    flex-direction: column;
    gap: 16px;
  }

  .zone-actions {
    width: 100%;
    justify-content: space-between;
  }

  .rate-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .rate-price-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
