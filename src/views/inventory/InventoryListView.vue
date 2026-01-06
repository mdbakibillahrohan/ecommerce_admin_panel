<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { inventoryApi, type Inventory, type BulkUpdateItem } from '@/api/inventory'
import {
  SearchOutlined,
  WarningOutlined,
  ReloadOutlined,
  EditOutlined,
  InboxOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
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
const searchText = ref('')

onMounted(() => {
  fetchInventory()
})

// Computed statistics
const statistics = computed(() => {
  const totalItems = inventory.value.length
  const lowStock = inventory.value.filter(item =>
    item.quantity <= item.low_stock_threshold && item.quantity > 0
  ).length
  const outOfStock = inventory.value.filter(item => item.quantity <= 0).length
  const totalValue = inventory.value.reduce((sum, item) =>
    sum + (item.quantity * (item.product?.price || 0)), 0
  )

  return { totalItems, lowStock, outOfStock, totalValue }
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
    message.success('Inventory updated successfully')
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
    message.success('Bulk update completed successfully')
    showBulkModal.value = false
    fetchInventory()
  } catch (error) {
    message.error('Failed to perform bulk update')
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
  <div class="inventory-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">Inventory Management</h1>
          <p class="page-subtitle">Monitor and manage your product stock levels</p>
        </div>
        <div class="action-section">
          <a-space :size="12">
            <a-switch v-model:checked="showLowStockOnly" checked-children="Low Stock" un-checked-children="All Items"
              @change="fetchInventory" />
            <a-button class="action-btn" @click="openBulkModal">
              <EditOutlined />
              Bulk Update
            </a-button>
            <a-button class="action-btn refresh-btn" @click="fetchInventory" :loading="loading">
              <ReloadOutlined />
              Refresh
            </a-button>
          </a-space>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon"
          style="background: linear-gradient(135deg, oklch(0.7 0.15 210) 0%, oklch(0.65 0.18 220) 100%)">
          <InboxOutlined />
        </div>
        <div class="stat-content">
          <div class="stat-label">Total Items</div>
          <div class="stat-value">{{ statistics.totalItems }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon"
          style="background: linear-gradient(135deg, oklch(0.75 0.15 140) 0%, oklch(0.7 0.18 150) 100%)">
          <CheckCircleOutlined />
        </div>
        <div class="stat-content">
          <div class="stat-label">Inventory Value</div>
          <div class="stat-value">${{ statistics.totalValue.toFixed(2) }}</div>
        </div>
      </div>

      <div class="stat-card warning">
        <div class="stat-icon"
          style="background: linear-gradient(135deg, oklch(0.75 0.15 50) 0%, oklch(0.7 0.18 40) 100%)">
          <WarningOutlined />
        </div>
        <div class="stat-content">
          <div class="stat-label">Low Stock</div>
          <div class="stat-value">{{ statistics.lowStock }}</div>
        </div>
      </div>

      <div class="stat-card danger">
        <div class="stat-icon"
          style="background: linear-gradient(135deg, oklch(0.7 0.2 20) 0%, oklch(0.65 0.22 15) 100%)">
          <ExclamationCircleOutlined />
        </div>
        <div class="stat-content">
          <div class="stat-label">Out of Stock</div>
          <div class="stat-value">{{ statistics.outOfStock }}</div>
        </div>
      </div>
    </div>

    <!-- Inventory Table -->
    <div class="table-container">
      <a-table :columns="columns" :data-source="inventory" :loading="loading" :pagination="pagination" row-key="id"
        :scroll="{ x: 900 }" @change="handleTableChange">
        <template #bodyCell="{ column, record }">
          <!-- Product -->
          <template v-if="column.key === 'product'">
            <div class="product-cell">
              <a-avatar :src="record.product?.thumbnail?.url" :size="48" shape="square" class="product-avatar">
                {{ record.product?.name?.charAt(0) || '?' }}
              </a-avatar>
              <div class="product-info">
                <span class="product-name">{{ record.product?.name || 'Unknown Product' }}</span>
                <span v-if="record.variant" class="variant-name">
                  {{ record.variant.name }}
                </span>
              </div>
            </div>
          </template>

          <!-- SKU -->
          <template v-if="column.key === 'sku'">
            <code v-if="record.product?.sku || record.variant?.sku" class="sku-code">
              {{ record.variant?.sku || record.product?.sku }}
            </code>
            <span v-else class="text-muted">-</span>
          </template>

          <!-- Available -->
          <template v-if="column.key === 'available'">
            <span class="available-qty" :class="{ 'low': record.quantity - record.reserved_quantity <= 0 }">
              {{ record.quantity - record.reserved_quantity }}
            </span>
          </template>

          <!-- Status -->
          <template v-if="column.key === 'status'">
            <a-tag :color="getStockStatus(record).color" class="status-tag">
              <WarningOutlined v-if="getStockStatus(record).color !== 'green'" />
              {{ getStockStatus(record).text }}
            </a-tag>
          </template>

          <!-- Actions -->
          <template v-if="column.key === 'actions'">
            <a-tooltip title="Edit Stock">
              <button class="action-icon-btn" @click="handleEdit(record)">
                <EditOutlined />
              </button>
            </a-tooltip>
          </template>
        </template>
      </a-table>
    </div>

    <!-- Update Modal -->
    <a-modal v-model:open="showUpdateModal" :footer="null" width="500px" class="custom-modal">
      <div v-if="editItem" class="modal-content">
        <div class="modal-header">
          <div class="modal-icon">
            <EditOutlined />
          </div>
          <div>
            <h3 class="modal-title">Update Inventory</h3>
            <p class="modal-subtitle">Adjust stock levels and thresholds</p>
          </div>
        </div>

        <div class="product-preview">
          <div class="preview-label">Product</div>
          <div class="preview-value">
            {{ editItem.product?.name }}
            <span v-if="editItem.variant" class="preview-variant">{{ editItem.variant.name }}</span>
          </div>
        </div>

        <a-form layout="vertical" class="update-form">
          <a-form-item label="Stock Quantity">
            <a-input-number v-model:value="newQuantity" :min="0" size="large" style="width: 100%"
              placeholder="Enter quantity" />
            <div class="form-hint">Current: {{ editItem.quantity }}</div>
          </a-form-item>

          <a-form-item label="Low Stock Threshold">
            <a-input-number v-model:value="newThreshold" :min="0" size="large" style="width: 100%"
              placeholder="Enter threshold" />
            <div class="form-hint">Alert when stock falls below this level</div>
          </a-form-item>
        </a-form>

        <div class="modal-actions">
          <a-button size="large" @click="showUpdateModal = false">Cancel</a-button>
          <a-button type="primary" size="large" :loading="updating" @click="handleUpdate">
            Update Inventory
          </a-button>
        </div>
      </div>
    </a-modal>

    <!-- Bulk Update Modal -->
    <a-modal v-model:open="showBulkModal" :footer="null" width="650px" class="custom-modal">
      <div class="modal-content">
        <div class="modal-header">
          <div class="modal-icon">
            <EditOutlined />
          </div>
          <div>
            <h3 class="modal-title">Bulk Update Inventory</h3>
            <p class="modal-subtitle">Update multiple items at once</p>
          </div>
        </div>

        <div class="bulk-list">
          <div v-for="item in bulkItems" :key="item.id" class="bulk-item">
            <span class="bulk-item-name">{{ item.name }}</span>
            <a-input-number v-model:value="item.quantity" :min="0" size="large" class="bulk-input" />
          </div>
        </div>

        <div class="modal-actions">
          <a-button size="large" @click="showBulkModal = false">Cancel</a-button>
          <a-button type="primary" size="large" :loading="updating" @click="handleBulkUpdate">
            Update All
          </a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
.inventory-page {
  background: var(--background);
  min-height: 100%;
}

.page-header {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  flex-wrap: wrap;
}

.title-section {
  flex: 1;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: var(--foreground);
  background: linear-gradient(135deg, oklch(0.65 0.2 200) 0%, oklch(0.6 0.22 210) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 15px;
  color: var(--muted-foreground);
  margin: 0;
}

.action-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-btn {
  height: 40px;
  padding: 0 20px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--border);
  background: var(--background);
  color: var(--foreground);
}

.action-btn:hover {
  border-color: oklch(0.65 0.2 200);
  color: oklch(0.65 0.2 200);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Statistics Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: oklch(0.65 0.2 200);
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: var(--muted-foreground);
  margin-bottom: 8px;
  font-weight: 500;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--foreground);
  line-height: 1;
}

/* Table Container */
.table-container {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
}

.table-container :deep(.ant-table) {
  background: transparent;
}

.table-container :deep(.ant-table-thead > tr > th) {
  background: var(--muted);
  color: var(--foreground);
  font-weight: 600;
  border-bottom: 1px solid var(--border);
}

.table-container :deep(.ant-table-tbody > tr) {
  transition: all 0.2s ease;
}

.table-container :deep(.ant-table-tbody > tr:hover) {
  background: var(--accent) !important;
}

.table-container :deep(.ant-table-tbody > tr > td) {
  border-bottom: 1px solid var(--border);
}

/* Product Cell */
.product-cell {
  display: flex;
  align-items: center;
  gap: 16px;
}

.product-avatar {
  background: linear-gradient(135deg, oklch(0.65 0.2 200) 0%, oklch(0.6 0.22 210) 100%);
  border-radius: 12px;
  flex-shrink: 0;
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-name {
  font-weight: 600;
  color: var(--foreground);
  font-size: 14px;
}

.variant-name {
  font-size: 12px;
  color: var(--muted-foreground);
}

.sku-code {
  padding: 4px 8px;
  background: var(--muted);
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 12px;
  font-family: 'Monaco', 'Courier New', monospace;
  color: oklch(0.65 0.2 200);
}

.available-qty {
  font-weight: 700;
  font-size: 16px;
  color: oklch(0.7 0.18 150);
}

.available-qty.low {
  color: oklch(0.7 0.2 20);
}

.status-tag {
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.action-icon-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--border);
  background: var(--background);
  color: var(--foreground);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-icon-btn:hover {
  background: oklch(0.65 0.2 200);
  color: white;
  border-color: oklch(0.65 0.2 200);
  transform: scale(1.1);
}

/* Custom Modal */
.custom-modal :deep(.ant-modal-content) {
  border-radius: 16px;
  overflow: hidden;
}

.modal-content {
  padding: 8px;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}

.modal-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, oklch(0.65 0.2 200) 0%, oklch(0.6 0.22 210) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  flex-shrink: 0;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: var(--foreground);
}

.modal-subtitle {
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 4px 0 0 0;
}

.product-preview {
  background: var(--muted);
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
}

.preview-label {
  font-size: 12px;
  color: var(--muted-foreground);
  margin-bottom: 4px;
  font-weight: 500;
}

.preview-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
}

.preview-variant {
  font-size: 14px;
  color: var(--muted-foreground);
  margin-left: 8px;
}

.update-form {
  margin-bottom: 24px;
}

.form-hint {
  font-size: 12px;
  color: var(--muted-foreground);
  margin-top: 6px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}

/* Bulk List */
.bulk-list {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 24px;
  padding: 8px;
}

.bulk-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: var(--muted);
  border: 1px solid var(--border);
  border-radius: 12px;
  margin-bottom: 12px;
  transition: all 0.2s ease;
}

.bulk-item:hover {
  border-color: oklch(0.65 0.2 200);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.bulk-item-name {
  font-weight: 500;
  color: var(--foreground);
  flex: 1;
}

.bulk-input {
  width: 120px;
}

/* Responsive */
@media (max-width: 768px) {
  .inventory-page {
    padding: 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .header-content {
    flex-direction: column;
  }

  .action-section {
    width: 100%;
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}
</style>
