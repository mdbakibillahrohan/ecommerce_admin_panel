<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { productsApi, type Product, type ProductQuery } from '@/api/products'
import { categoriesApi, type Category } from '@/api/categories'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  ExportOutlined,
  PrinterOutlined,
  EyeOutlined,
  CopyOutlined,
  TagOutlined,
  ShoppingOutlined,
  InboxOutlined,
  DollarOutlined,
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import dayjs from 'dayjs'

const router = useRouter()
const dayjsInstance = dayjs // Assign dayjs to a constant to use it at the top level

// State
const loading = ref(false)
const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const viewMode = ref<'grid' | 'list'>('list')
const selectedRowKeys = ref<number[]>([])

// Filters
const searchText = ref('')
const selectedCategory = ref<number | undefined>()
const selectedStatus = ref<string | undefined>()
const priceRange = ref<[number, number] | undefined>()

// Statistics
const statistics = computed(() => {
  const published = products.value.filter(p => p.is_published).length
  const draft = products.value.filter(p => !p.is_published).length
  const lowStock = products.value.filter(p => p.stock_quantity <= p.low_stock_threshold).length
  const totalValue = products.value.reduce((sum, p) => sum + (p.sale_price || p.base_price) * p.stock_quantity, 0)

  return {
    total: total.value,
    published,
    draft,
    lowStock,
    totalValue,
  }
})

onMounted(async () => {
  await Promise.all([fetchProducts(), fetchCategories()])
})

async function fetchProducts() {
  loading.value = true
  try {
    const query: ProductQuery = {
      page: currentPage.value,
      limit: pageSize.value,
      search: searchText.value || undefined,
      category_id: selectedCategory.value,
      is_published: selectedStatus.value === 'published' ? true : selectedStatus.value === 'draft' ? false : undefined,
    }
    const response = await productsApi.getAll(query)
    products.value = response.data
    total.value = response.total
  } catch (error) {
    message.error('Failed to fetch products')
    console.error(error)
  } finally {
    loading.value = false
  }
}

async function fetchCategories() {
  try {
    categories.value = await categoriesApi.getAll()
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

function handleSearch() {
  currentPage.value = 1
  fetchProducts()
}

function handleTableChange(pagination: { current: number; pageSize: number }) {
  currentPage.value = pagination.current
  pageSize.value = pagination.pageSize
  fetchProducts()
}

function handleCreate() {
  router.push('/products/create')
}

function handleEdit(id: number) {
  router.push(`/products/${id}/edit`)
}

function handleView(id: number) {
  router.push(`/products/${id}`)
}

async function handleDelete(id: number) {
  Modal.confirm({
    title: 'Delete Product',
    content: 'Are you sure you want to delete this product? This action cannot be undone.',
    okText: 'Delete',
    okType: 'danger',
    cancelText: 'Cancel',
    async onOk() {
      try {
        await productsApi.delete(id)
        message.success('Product deleted successfully')
        fetchProducts()
      } catch (error) {
        message.error('Failed to delete product')
        console.error(error)
      }
    },
  })
}

async function handleBulkDelete() {
  if (selectedRowKeys.value.length === 0) {
    message.warning('Please select products to delete')
    return
  }

  Modal.confirm({
    title: 'Delete Products',
    content: `Are you sure you want to delete ${selectedRowKeys.value.length} products? This action cannot be undone.`,
    okText: 'Delete',
    okType: 'danger',
    cancelText: 'Cancel',
    async onOk() {
      try {
        await Promise.all(selectedRowKeys.value.map(id => productsApi.delete(id)))
        message.success(`${selectedRowKeys.value.length} products deleted successfully`)
        selectedRowKeys.value = []
        fetchProducts()
      } catch (error) {
        message.error('Failed to delete products')
        console.error(error)
      }
    },
  })
}

async function handleBulkPublish(publish: boolean) {
  if (selectedRowKeys.value.length === 0) {
    message.warning('Please select products to update')
    return
  }

  try {
    await Promise.all(selectedRowKeys.value.map(id => productsApi.update(id, { is_published: publish })))
    message.success(`${selectedRowKeys.value.length} products ${publish ? 'published' : 'unpublished'} successfully`)
    selectedRowKeys.value = []
    fetchProducts()
  } catch (error) {
    message.error('Failed to update products')
    console.error(error)
  }
}

async function handleTogglePublish(product: Product) {
  try {
    await productsApi.update(product.id, { is_published: !product.is_published })
    message.success(`Product ${product.is_published ? 'unpublished' : 'published'} successfully`)
    fetchProducts()
  } catch (error) {
    message.error('Failed to update product')
    console.error(error)
  }
}

async function handleDuplicate(product: Product) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, created_at, updated_at, ...productData } = product
    const newProduct = {
      ...productData,
      description: productData.description ?? undefined,
      short_description: productData.short_description ?? undefined,
      sale_price: productData.sale_price ?? undefined,
      thumbnail_id: productData.thumbnail_id ?? undefined,
      category_id: productData.category_id ?? undefined,
      meta_title: productData.meta_title ?? undefined,
      meta_description: productData.meta_description ?? undefined,
      name: `${product.name} (Copy)`,
      sku: product.sku ? `${product.sku}-copy` : undefined,
    }

    await productsApi.create(newProduct)
    message.success('Product duplicated successfully')
    fetchProducts()
  } catch (error) {
    message.error('Failed to duplicate product')
    console.error(error)
  }
}

function handleExport(format: 'csv' | 'pdf') {
  message.info(`Exporting ${format.toUpperCase()}...`)
  // Implement export logic
}

function handlePrint() {
  window.print()
}

function clearFilters() {
  searchText.value = ''
  selectedCategory.value = undefined
  selectedStatus.value = undefined
  priceRange.value = undefined
  handleSearch()
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
  }).format(value)
}

const columns = [
  {
    title: 'Product',
    key: 'product',
    width: 300,
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    width: 150,
  },
  {
    title: 'Price',
    key: 'price',
    width: 150,
    align: 'right' as const,
  },
  {
    title: 'Stock',
    dataIndex: 'stock_quantity',
    key: 'stock',
    width: 100,
    align: 'center' as const,
  },
  {
    title: 'Status',
    key: 'status',
    width: 120,
    align: 'center' as const,
  },
  {
    title: 'Created',
    dataIndex: 'created_at',
    key: 'created_at',
    width: 120,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 180,
    align: 'center' as const,
    fixed: 'right' as const,
  },
]

const pagination = computed(() => ({
  current: currentPage.value,
  pageSize: pageSize.value,
  total: total.value,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `Total ${total} products`,
}))

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: number[]) => {
    selectedRowKeys.value = keys
  },
}))
</script>

<template>
  <div class="product-list-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">Products</h1>
          <p class="page-subtitle">Manage your product catalog and inventory</p>
        </div>
        <div class="header-right">
          <a-button type="primary" size="large" @click="handleCreate">
            <template #icon>
              <PlusOutlined />
            </template>
            Add Product
          </a-button>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="statistics-grid">
      <div class="stat-card">
        <div class="stat-icon"
          style="background: linear-gradient(135deg, oklch(0.7 0.15 195) 0%, oklch(0.65 0.18 210) 100%);">
          <ShoppingOutlined />
        </div>
        <div class="stat-content">
          <div class="stat-label">Total Products</div>
          <div class="stat-value">{{ statistics.total }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon"
          style="background: linear-gradient(135deg, oklch(0.75 0.17 145) 0%, oklch(0.7 0.15 160) 100%);">
          <TagOutlined />
        </div>
        <div class="stat-content">
          <div class="stat-label">Published</div>
          <div class="stat-value">{{ statistics.published }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon"
          style="background: linear-gradient(135deg, oklch(0.75 0.15 60) 0%, oklch(0.7 0.17 45) 100%);">
          <InboxOutlined />
        </div>
        <div class="stat-content">
          <div class="stat-label">Low Stock</div>
          <div class="stat-value">{{ statistics.lowStock }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon"
          style="background: linear-gradient(135deg, oklch(0.7 0.19 330) 0%, oklch(0.65 0.2 345) 100%);">
          <DollarOutlined />
        </div>
        <div class="stat-content">
          <div class="stat-label">Inventory Value</div>
          <div class="stat-value">{{ formatCurrency(statistics.totalValue) }}</div>
        </div>
      </div>
    </div>

    <!-- Filters & Actions Card -->
    <div class="filter-card">
      <div class="filter-section">
        <div class="filter-row">
          <div class="filter-input">
            <a-input-search v-model:value="searchText" placeholder="Search products by name, SKU..." size="large"
              allow-clear @search="handleSearch" @pressEnter="handleSearch">
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input-search>
          </div>

          <div class="filter-select">
            <a-select v-model:value="selectedCategory" placeholder="All Categories" size="large" allow-clear
              @change="handleSearch">
              <a-select-option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.category_name }}
              </a-select-option>
            </a-select>
          </div>

          <div class="filter-select">
            <a-select v-model:value="selectedStatus" placeholder="All Status" size="large" allow-clear
              @change="handleSearch">
              <a-select-option value="published">Published</a-select-option>
              <a-select-option value="draft">Draft</a-select-option>
            </a-select>
          </div>

          <a-button size="large" @click="clearFilters">Clear</a-button>
        </div>
      </div>

      <div class="actions-bar">
        <div class="bulk-actions" v-if="selectedRowKeys.length > 0">
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

    <!-- Products Table -->
    <div class="table-card" v-if="viewMode === 'list'">
      <a-table :columns="columns" :data-source="products" :loading="loading" :pagination="pagination"
        :row-selection="rowSelection" row-key="id" :scroll="{ x: 1200 }" @change="handleTableChange">
        <template #bodyCell="{ column, record }">
          <!-- Product -->
          <template v-if="column.key === 'product'">
            <div class="product-cell">
              <a-avatar :src="record.thumbnail?.url" :size="56" shape="square" class="product-avatar">
                {{ record.name.charAt(0) }}
              </a-avatar>
              <div class="product-info">
                <div class="product-name">{{ record.name }}</div>
                <div class="product-meta">
                  <span v-if="record.sku" class="sku">SKU: {{ record.sku }}</span>
                  <a-tag v-if="record.is_featured" color="gold" size="small">Featured</a-tag>
                  <a-tag v-if="record.product_type === 'DIGITAL'" color="purple" size="small">Digital</a-tag>
                </div>
              </div>
            </div>
          </template>

          <!-- Category -->
          <template v-if="column.key === 'category'">
            <span v-if="record.category" class="category-name">{{ record.category.category_name }}</span>
            <span v-else class="text-muted">Uncategorized</span>
          </template>

          <!-- Price -->
          <template v-if="column.key === 'price'">
            <div class="price-cell">
              <span v-if="record.sale_price" class="sale-price">
                {{ formatCurrency(record.sale_price) }}
              </span>
              <span :class="{ 'original-price': record.sale_price, 'base-price': !record.sale_price }">
                {{ formatCurrency(record.base_price) }}
              </span>
            </div>
          </template>

          <!-- Stock -->
          <template v-if="column.key === 'stock'">
            <a-tag
              :color="record.stock_quantity <= 0 ? 'red' : record.stock_quantity <= record.low_stock_threshold ? 'orange' : 'green'"
              class="stock-tag">
              {{ record.stock_quantity }}
            </a-tag>
          </template>

          <!-- Status -->
          <template v-if="column.key === 'status'">
            <a-switch :checked="record.is_published" checked-children="Published" un-checked-children="Draft"
              @change="() => handleTogglePublish(record)" />
          </template>

          <!-- Created At -->
          <template v-if="column.key === 'created_at'">
            <span class="date-text">{{ dayjsInstance(record.created_at).format('MMM D, YYYY') }}</span>
          </template>

          <!-- Actions -->
          <template v-if="column.key === 'actions'">
            <a-space :size="4">
              <a-tooltip title="View">
                <a-button type="text" size="small" @click="handleView(record.id)">
                  <template #icon>
                    <EyeOutlined />
                  </template>
                </a-button>
              </a-tooltip>
              <a-tooltip title="Edit">
                <a-button type="text" size="small" @click="handleEdit(record.id)">
                  <template #icon>
                    <EditOutlined />
                  </template>
                </a-button>
              </a-tooltip>
              <a-tooltip title="Duplicate">
                <a-button type="text" size="small" @click="handleDuplicate(record)">
                  <template #icon>
                    <CopyOutlined />
                  </template>
                </a-button>
              </a-tooltip>
              <a-tooltip title="Delete">
                <a-button type="text" size="small" danger @click="handleDelete(record.id)">
                  <template #icon>
                    <DeleteOutlined />
                  </template>
                </a-button>
              </a-tooltip>
            </a-space>
          </template>
        </template>
      </a-table>
    </div>

    <!-- Products Grid -->
    <div class="products-grid" v-else>
      <div class="grid-container">
        <div v-for="product in products" :key="product.id" class="product-card">
          <div class="product-image-container">
            <img v-if="product.thumbnail?.url" :src="product.thumbnail.url" :alt="product.name" class="product-image" />
            <div v-else class="product-image-placeholder">
              <ShoppingOutlined />
            </div>
            <div class="product-badges">
              <a-tag v-if="product.is_featured" color="gold">Featured</a-tag>
              <a-tag v-if="!product.is_published" color="default">Draft</a-tag>
            </div>
            <div class="product-hover-actions">
              <a-button type="primary" size="small" @click="handleView(product.id)">
                <EyeOutlined /> View
              </a-button>
              <a-button size="small" @click="handleEdit(product.id)">
                <EditOutlined /> Edit
              </a-button>
            </div>
          </div>
          <div class="product-card-content">
            <div class="product-card-header">
              <h3 class="product-card-title">{{ product.name }}</h3>
              <a-dropdown>
                <a-button type="text" size="small">⋯</a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="handleEdit(product.id)">
                      <EditOutlined /> Edit
                    </a-menu-item>
                    <a-menu-item @click="handleDuplicate(product)">
                      <CopyOutlined /> Duplicate
                    </a-menu-item>
                    <a-menu-divider />
                    <a-menu-item danger @click="handleDelete(product.id)">
                      <DeleteOutlined /> Delete
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
            <p class="product-category">{{ product.category?.category_name || 'Uncategorized' }}</p>
            <div class="product-card-footer">
              <div class="product-price">
                <span v-if="product.sale_price" class="sale-price">{{ formatCurrency(product.sale_price) }}</span>
                <span :class="{ 'original-price': product.sale_price, 'base-price': !product.sale_price }">
                  {{ formatCurrency(product.base_price) }}
                </span>
              </div>
              <a-tag
                :color="product.stock_quantity <= 0 ? 'red' : product.stock_quantity <= product.low_stock_threshold ? 'orange' : 'green'">
                Stock: {{ product.stock_quantity }}
              </a-tag>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-pagination">
        <a-pagination v-model:current="currentPage" v-model:page-size="pageSize" :total="total" show-size-changer
          show-quick-jumper :show-total="(total: number) => `Total ${total} products`" @change="handleSearch" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-list-page {
  background: var(--background);
  min-height: 100vh;
}

.page-header {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  flex-wrap: wrap;
}

.header-left {
  flex: 1;
  min-width: 0;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 15px;
  color: var(--muted-foreground);
  margin: 0;
}

.header-right {
  display: flex;
  gap: 12px;
}

/* Statistics Grid */
.statistics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: oklch(0.7 0.15 195);
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
  min-width: 0;
}

.stat-label {
  font-size: 14px;
  color: var(--muted-foreground);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--foreground);
  line-height: 1.2;
}

/* Filter Card */
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

.filter-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 12px;
  align-items: center;
}

.filter-input {
  width: 100%;
}

.filter-select {
  width: 100%;
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

/* Table Card */
.table-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
}

.table-card :deep(.ant-table-wrapper) {
  border-radius: 12px;
}

.table-card :deep(.ant-table) {
  background: var(--card);
}

.table-card :deep(.ant-table-thead > tr > th) {
  background: var(--muted);
  color: var(--foreground);
  font-weight: 600;
  border-bottom: 1px solid var(--border);
}

.table-card :deep(.ant-table-tbody > tr) {
  transition: all 0.2s;
}

.table-card :deep(.ant-table-tbody > tr:hover) {
  background: var(--accent);
}

.table-card :deep(.ant-table-tbody > tr > td) {
  border-bottom: 1px solid var(--border);
}

/* Product Cell */
.product-cell {
  display: flex;
  align-items: center;
  gap: 16px;
}

.product-avatar {
  background: linear-gradient(135deg, oklch(0.7 0.15 195) 0%, oklch(0.65 0.18 210) 100%);
  flex-shrink: 0;
  border-radius: 8px;
  font-size: 20px;
  font-weight: 600;
}

.product-avatar :deep(img) {
  object-fit: cover;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-weight: 600;
  font-size: 15px;
  color: var(--foreground);
  margin-bottom: 6px;
  line-height: 1.4;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.sku {
  font-size: 13px;
  color: var(--muted-foreground);
  font-family: 'Courier New', monospace;
}

.category-name {
  color: var(--foreground);
  font-weight: 500;
}

/* Price Cell */
.price-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
}

.sale-price {
  font-weight: 700;
  font-size: 16px;
  color: oklch(0.75 0.17 145);
}

.base-price {
  font-weight: 600;
  font-size: 15px;
  color: var(--foreground);
}

.original-price {
  text-decoration: line-through;
  color: var(--muted-foreground);
  font-size: 13px;
}

.stock-tag {
  font-weight: 600;
  font-size: 14px;
  padding: 4px 12px;
}

.date-text {
  color: var(--muted-foreground);
  font-size: 14px;
}

.text-muted {
  color: var(--muted-foreground);
  font-style: italic;
}

/* Grid View */
.products-grid {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.product-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: oklch(0.7 0.15 195);
}

.product-image-container {
  position: relative;
  width: 100%;
  padding-top: 100%;
  background: var(--muted);
  overflow: hidden;
}

.product-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: var(--muted-foreground);
  background: linear-gradient(135deg, var(--muted) 0%, var(--accent) 100%);
}

.product-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.product-hover-actions {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.3s;
}

.product-card:hover .product-hover-actions {
  opacity: 1;
}

.product-card-content {
  padding: 16px;
}

.product-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
}

.product-card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0;
  line-height: 1.4;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-category {
  font-size: 13px;
  color: var(--muted-foreground);
  margin: 0 0 12px 0;
}

.product-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.product-price {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.grid-pagination {
  display: flex;
  justify-content: center;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}

/* Responsive */
@media (max-width: 1024px) {
  .filter-row {
    grid-template-columns: 1fr;
  }

  .statistics-grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }
}

@media (max-width: 768px) {
  .product-list-page {
    padding: 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .header-content {
    flex-direction: column;
  }

  .header-right {
    width: 100%;
  }

  .header-right :deep(.ant-btn) {
    flex: 1;
  }

  .statistics-grid {
    grid-template-columns: 1fr;
  }

  .actions-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .bulk-actions,
  .view-actions {
    flex-wrap: wrap;
    justify-content: center;
  }

  .grid-container {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }
}
</style>
