<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Modal } from 'ant-design-vue'
import {
  PlusOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  ExportOutlined,
  PrinterOutlined,
  ShoppingOutlined,
  TagOutlined,
  InboxOutlined,
  DollarOutlined,
} from '@ant-design/icons-vue'
import { useProductsStore } from '@/modules/products/store'
import { useCategoriesStore } from '@/modules/categories/store'
import CommonPageHeader from '@/modules/shared/components/ui/CommonPageHeader.vue'
import CommonStatsGrid from '@/modules/shared/components/ui/CommonStatsGrid.vue'
import ProductFilters from '@/modules/products/components/ProductFilters.vue'
import ProductTable from '@/modules/products/components/ProductTable.vue'
import ProductGrid from '@/modules/products/components/ProductGrid.vue'

const router = useRouter()
const productsStore = useProductsStore()
const categoriesStore = useCategoriesStore()

// Local state
const viewMode = ref<'grid' | 'list'>('list')
const selectedRowKeys = ref<number[]>([])

// Computed
const statsData = computed(() => [
  {
    label: 'Total Products',
    value: productsStore.statistics.total,
    icon: ShoppingOutlined,
    iconStyle: { background: 'linear-gradient(135deg, oklch(0.7 0.15 210) 0%, oklch(0.65 0.18 220) 100%)' }
  },
  {
    label: 'Published',
    value: productsStore.statistics.published,
    icon: TagOutlined,
    iconStyle: { background: 'linear-gradient(135deg, oklch(0.75 0.15 140) 0%, oklch(0.7 0.18 150) 100%)' }
  },
  {
    label: 'Low Stock',
    value: productsStore.statistics.lowStock,
    icon: InboxOutlined,
    iconStyle: { background: 'linear-gradient(135deg, oklch(0.75 0.15 60) 0%, oklch(0.7 0.17 45) 100%)' },
    type: 'warning'
  },
  {
    label: 'Inventory Value',
    value: formatCurrency(productsStore.statistics.totalValue),
    icon: DollarOutlined,
    iconStyle: { background: 'linear-gradient(135deg, oklch(0.7 0.19 330) 0%, oklch(0.65 0.2 345) 100%)' }
  }
])

const pagination = computed(() => ({
  current: productsStore.pagination.current,
  pageSize: productsStore.pagination.pageSize,
  total: productsStore.total,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `Total ${total} products`,
}))

// Lifecycle
onMounted(async () => {
  await Promise.all([
    productsStore.fetchProducts(),
    categoriesStore.fetchCategories()
  ])
})

// Methods
function handleSearch() {
  productsStore.fetchProducts()
}

function handleTableChange(paginationData: { current: number; pageSize: number }) {
  productsStore.setPagination(paginationData.current, paginationData.pageSize)
  productsStore.fetchProducts()
}

function handleCreate() {
  router.push('/products/create')
}

function handleView(id: number) {
  router.push(`/products/${id}`)
}

function handleEdit(id: number) {
  router.push(`/products/${id}/edit`)
}

function handleDelete(id: number) {
  Modal.confirm({
    title: 'Delete Product',
    content: 'Are you sure you want to delete this product? This action cannot be undone.',
    okText: 'Delete',
    okType: 'danger',
    cancelText: 'Cancel',
    async onOk() {
      await productsStore.deleteProduct(id)
    },
  })
}

function handleBulkDelete() {
  if (selectedRowKeys.value.length === 0) return

  Modal.confirm({
    title: 'Delete Products',
    content: `Are you sure you want to delete ${selectedRowKeys.value.length} products? This action cannot be undone.`,
    okText: 'Delete',
    okType: 'danger',
    cancelText: 'Cancel',
    async onOk() {
      const success = await productsStore.bulkDelete(selectedRowKeys.value)
      if (success) {
        selectedRowKeys.value = []
      }
    },
  })
}

async function handleBulkPublish(publish: boolean) {
  if (selectedRowKeys.value.length === 0) return

  const success = await productsStore.bulkPublish(selectedRowKeys.value, publish)
  if (success) {
    selectedRowKeys.value = []
  }
}

function handleDuplicate(product: any) {
  productsStore.duplicateProduct(product)
}

function handleTogglePublish(product: any) {
  productsStore.togglePublish(product)
}

function handleExport(format: 'csv' | 'pdf') {
  // Implement export logic
  console.log(`Exporting ${format}...`)
}

function handlePrint() {
  window.print()
}

function clearFilters() {
  productsStore.clearFilters()
  productsStore.fetchProducts()
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
  }).format(value)
}
</script>

<template>
  <div class="product-list-page">
    <CommonPageHeader title="Products" subtitle="Manage your product catalog and inventory">
      <template #actions>
        <a-button type="primary" size="large" @click="handleCreate">
          <template #icon>
            <PlusOutlined />
          </template>
          Add Product
        </a-button>
      </template>
    </CommonPageHeader>

    <CommonStatsGrid :stats="statsData" :loading="productsStore.loading" />

    <!-- Filters & Actions Card -->
    <div class="filter-card">
      <div class="filter-section">
        <ProductFilters v-model:search-text="productsStore.filters.search"
          v-model:selected-category="productsStore.filters.categoryId"
          v-model:selected-status="productsStore.filters.status" :categories="categoriesStore.categories"
          :loading="productsStore.loading" @search="handleSearch" @clear="clearFilters" />
      </div>

      <div class="actions-bar">
        <div v-if="selectedRowKeys.length > 0" class="bulk-actions">
          <span class="selected-count">{{ selectedRowKeys.length }} selected</span>
          <a-button @click="handleBulkPublish(true)">Publish</a-button>
          <a-button @click="handleBulkPublish(false)">Unpublish</a-button>
          <a-button danger @click="handleBulkDelete">Delete</a-button>
        </div>

        <div class="view-actions">
          <a-dropdown>
            <a-button>
              <template #icon>
                <ExportOutlined />
              </template>
              Export
            </a-button>
            <template #overlay>
              <a-menu @click="({ key }: { key: string }) => handleExport(key as 'csv' | 'pdf')">
                <a-menu-item key="csv">Export as CSV</a-menu-item>
                <a-menu-item key="pdf">Export as PDF</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>

          <a-button @click="handlePrint">
            <template #icon>
              <PrinterOutlined />
            </template>
            Print
          </a-button>

          <a-button-group>
            <a-button :type="viewMode === 'list' ? 'primary' : 'default'" @click="viewMode = 'list'">
              <template #icon>
                <UnorderedListOutlined />
              </template>
            </a-button>
            <a-button :type="viewMode === 'grid' ? 'primary' : 'default'" @click="viewMode = 'grid'">
              <template #icon>
                <AppstoreOutlined />
              </template>
            </a-button>
          </a-button-group>
        </div>
      </div>
    </div>

    <!-- Products Content -->
    <template v-if="viewMode === 'list'">
      <div class="table-container">
        <ProductTable :products="productsStore.products" :loading="productsStore.loading"
          v-model:selected-row-keys="selectedRowKeys" :pagination="pagination" @change="handleTableChange"
          @view="handleView" @edit="handleEdit" @duplicate="handleDuplicate" @delete="handleDelete"
          @toggle-publish="handleTogglePublish" />
      </div>
    </template>

    <!-- Products Grid -->
    <template v-else>
      <div class="grid-container">
        <ProductGrid :products="productsStore.products" :loading="productsStore.loading" @view="handleView"
          @edit="handleEdit" @duplicate="handleDuplicate" @delete="handleDelete" />
      </div>

      <div class="grid-pagination">
        <a-pagination v-model:current="productsStore.pagination.current"
          v-model:page-size="productsStore.pagination.pageSize" :total="productsStore.total" show-size-changer
          show-quick-jumper :show-total="(total: number) => `Total ${total} products`" @change="handleSearch" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.product-list-page {
  background: var(--background);
  min-height: 100vh;
}

.filter-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.filter-section {
  margin-bottom: 16px;
}

.actions-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
  flex-wrap: wrap;
}

.bulk-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.selected-count {
  font-weight: 600;
  color: oklch(0.7 0.15 195);
  padding: 0 8px;
}

.view-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.table-container {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

.grid-container {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.grid-pagination {
  display: flex;
  justify-content: center;
  padding: 24px 0;
}
</style>
