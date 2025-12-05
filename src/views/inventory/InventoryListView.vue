<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { inventoryApi, type Inventory, type BulkUpdateItem } from '@/api/inventory'
import {
  SearchOutlined,
  WarningOutlined,
  ReloadOutlined,
  EditOutlined,
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'

// State
const loading = ref(false)
const inventory = ref<Inventory[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(20)
const showUpdateModal = ref(false)
const showBulkModal = ref(false)
const updating = ref(false)

// Current edit item
const editItem = ref<Inventory | null>(null)
const newQuantity = ref(0)
const newThreshold = ref(5)

// Bulk update
const bulkItems = ref<{ id: number; name: string; quantity: number }[]>([])

// Filter
const showLowStockOnly = ref(false)

onMounted(() => {
  fetchInventory()
})

async function fetchInventory() {
  loading.value = true
  try {
    if (showLowStockOnly.value) {
      const data = await inventoryApi.getLowStock()
      inventory.value = data
      total.value = data.length
    } else {
      const response = await inventoryApi.getAll(currentPage.value, pageSize.value)
      inventory.value = response.data
      total.value = response.total
    }
  } catch (error) {
    message.error('Failed to fetch inventory')
    console.error(error)
  } finally {
    loading.value = false
  }
}

function handleEdit(item: Inventory) {
  editItem.value = item
  newQuantity.value = item.quantity
  newThreshold.value = item.low_stock_threshold
  showUpdateModal.value = true
}

async function handleUpdate() {
  if (!editItem.value) return
  
  updating.value = true
  try {
    await inventoryApi.update(editItem.value.id, {
      quantity: newQuantity.value,
      low_stock_threshold: newThreshold.value,
    })
    message.success('Inventory updated')
    showUpdateModal.value = false
    fetchInventory()
  } catch (error) {
    message.error('Failed to update inventory')
    console.error(error)
  } finally {
    updating.value = false
  }
}

function openBulkModal() {
  bulkItems.value = inventory.value.slice(0, 10).map(item => ({
    id: item.id,
    name: item.product?.name || 'Unknown',
    quantity: item.quantity,
  }))
  showBulkModal.value = true
}

async function handleBulkUpdate() {
  updating.value = true
  try {
    const items: BulkUpdateItem[] = bulkItems.value.map(item => ({
      id: item.id,
      quantity: item.quantity,
    }))
    await inventoryApi.bulkUpdate(items)
    message.success('Bulk update successful')
    showBulkModal.value = false
    fetchInventory()
  } catch (error) {
    message.error('Failed to bulk update')
    console.error(error)
  } finally {
    updating.value = false
  }
}

function handleTableChange(pagination: any) {
  currentPage.value = pagination.current
  pageSize.value = pagination.pageSize
  fetchInventory()
}

function getStockStatus(item: Inventory) {
  if (item.quantity <= 0) return { text: 'Out of Stock', color: 'red' }
  if (item.quantity <= item.low_stock_threshold) return { text: 'Low Stock', color: 'orange' }
  return { text: 'In Stock', color: 'green' }
}

const columns = [
  { title: 'Product', key: 'product', width: 300 },
  { title: 'SKU', key: 'sku', width: 120 },
  { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', width: 100, align: 'center' as const },
  { title: 'Reserved', dataIndex: 'reserved_quantity', key: 'reserved', width: 100, align: 'center' as const },
  { title: 'Available', key: 'available', width: 100, align: 'center' as const },
  { title: 'Threshold', dataIndex: 'low_stock_threshold', key: 'threshold', width: 100, align: 'center' as const },
  { title: 'Status', key: 'status', width: 120, align: 'center' as const },
  { title: 'Actions', key: 'actions', width: 80, align: 'center' as const },
]

const pagination = computed(() => ({
  current: currentPage.value,
  pageSize: pageSize.value,
  total: total.value,
  showSizeChanger: true,
  showTotal: (total: number) => `Total ${total} items`,
}))
</script>

<template>
  <div class="inventory-list">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-left">
        <h1>Inventory</h1>
        <p>Manage product stock levels</p>
      </div>
      <div class="header-right">
        <a-space>
          <a-switch
            v-model:checked="showLowStockOnly"
            checked-children="Low Stock"
            un-checked-children="All"
            @change="fetchInventory"
          />
          <a-button @click="openBulkModal">Bulk Update</a-button>
          <a-button @click="fetchInventory" :loading="loading">
            <template #icon><ReloadOutlined /></template>
            Refresh
          </a-button>
        </a-space>
      </div>
    </div>

    <!-- Inventory Table -->
    <a-card :bordered="false" class="table-card">
      <a-table
        :columns="columns"
        :data-source="inventory"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        :scroll="{ x: 900 }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <!-- Product -->
          <template v-if="column.key === 'product'">
            <div class="product-cell">
              <a-avatar 
                :src="record.product?.thumbnail?.url" 
                :size="40" 
                shape="square"
                class="product-avatar"
              >
                {{ record.product?.name?.charAt(0) || '?' }}
              </a-avatar>
              <div class="product-info">
                <span class="product-name">{{ record.product?.name || 'Unknown Product' }}</span>
                <span v-if="record.variant" class="variant-name">
                  Variant: {{ record.variant.name }}
                </span>
              </div>
            </div>
          </template>

          <!-- SKU -->
          <template v-if="column.key === 'sku'">
            <code v-if="record.product?.sku || record.variant?.sku">
              {{ record.variant?.sku || record.product?.sku }}
            </code>
            <span v-else class="text-muted">-</span>
          </template>

          <!-- Available -->
          <template v-if="column.key === 'available'">
            <span :style="{ fontWeight: 600, color: record.quantity - record.reserved_quantity <= 0 ? '#ff4d4f' : '#52c41a' }">
              {{ record.quantity - record.reserved_quantity }}
            </span>
          </template>

          <!-- Status -->
          <template v-if="column.key === 'status'">
            <a-tag :color="getStockStatus(record).color">
              <WarningOutlined v-if="getStockStatus(record).color !== 'green'" style="margin-right: 4px" />
              {{ getStockStatus(record).text }}
            </a-tag>
          </template>

          <!-- Actions -->
          <template v-if="column.key === 'actions'">
            <a-tooltip title="Edit Stock">
              <a-button type="text" size="small" @click="handleEdit(record)">
                <template #icon><EditOutlined /></template>
              </a-button>
            </a-tooltip>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Update Modal -->
    <a-modal
      v-model:open="showUpdateModal"
      title="Update Inventory"
      @ok="handleUpdate"
      :confirm-loading="updating"
    >
      <div v-if="editItem" class="update-form">
        <div class="product-preview">
          <strong>{{ editItem.product?.name }}</strong>
          <span v-if="editItem.variant"> - {{ editItem.variant.name }}</span>
        </div>
        
        <a-form layout="vertical">
          <a-form-item label="Stock Quantity">
            <a-input-number v-model:value="newQuantity" :min="0" style="width: 100%" />
          </a-form-item>
          <a-form-item label="Low Stock Threshold">
            <a-input-number v-model:value="newThreshold" :min="0" style="width: 100%" />
          </a-form-item>
        </a-form>
      </div>
    </a-modal>

    <!-- Bulk Update Modal -->
    <a-modal
      v-model:open="showBulkModal"
      title="Bulk Update Inventory"
      width="600px"
      @ok="handleBulkUpdate"
      :confirm-loading="updating"
    >
      <a-list :data-source="bulkItems" size="small">
        <template #renderItem="{ item }">
          <a-list-item>
            <span style="flex: 1">{{ item.name }}</span>
            <a-input-number
              v-model:value="item.quantity"
              :min="0"
              style="width: 100px"
            />
          </a-list-item>
        </template>
      </a-list>
    </a-modal>
  </div>
</template>

<style scoped>
.inventory-list {
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
}

.variant-name {
  font-size: 12px;
  color: #8c8c8c;
}

.text-muted {
  color: #bfbfbf;
}

.product-preview {
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
  margin-bottom: 16px;
}
</style>
