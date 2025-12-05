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
  FilterOutlined,
  EyeOutlined,
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'
import dayjs from 'dayjs'

const router = useRouter()

// State
const loading = ref(false)
const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// Filters
const searchText = ref('')
const selectedCategory = ref<number | undefined>()
const selectedStatus = ref<string | undefined>()

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

function handleTableChange(pagination: any) {
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
    width: 150,
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
</script>

<template>
  <div class="product-list">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-left">
        <h1>Products</h1>
        <p>Manage your product catalog</p>
      </div>
      <div class="header-right">
        <a-button type="primary" @click="handleCreate">
          <template #icon><PlusOutlined /></template>
          Add Product
        </a-button>
      </div>
    </div>

    <!-- Filters Card -->
    <a-card :bordered="false" class="filter-card">
      <a-row :gutter="16" align="middle">
        <a-col :xs="24" :sm="12" :md="8" :lg="6">
          <a-input-search
            v-model:value="searchText"
            placeholder="Search products..."
            allow-clear
            @search="handleSearch"
            @pressEnter="handleSearch"
          >
            <template #prefix><SearchOutlined /></template>
          </a-input-search>
        </a-col>
        <a-col :xs="24" :sm="12" :md="8" :lg="5">
          <a-select
            v-model:value="selectedCategory"
            placeholder="All Categories"
            allow-clear
            style="width: 100%"
            @change="handleSearch"
          >
            <a-select-option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.category_name }}
            </a-select-option>
          </a-select>
        </a-col>
        <a-col :xs="24" :sm="12" :md="8" :lg="4">
          <a-select
            v-model:value="selectedStatus"
            placeholder="All Status"
            allow-clear
            style="width: 100%"
            @change="handleSearch"
          >
            <a-select-option value="published">Published</a-select-option>
            <a-select-option value="draft">Draft</a-select-option>
          </a-select>
        </a-col>
        <a-col>
          <a-button @click="() => { searchText = ''; selectedCategory = undefined; selectedStatus = undefined; handleSearch(); }">
            Clear Filters
          </a-button>
        </a-col>
      </a-row>
    </a-card>

    <!-- Products Table -->
    <a-card :bordered="false" class="table-card">
      <a-table
        :columns="columns"
        :data-source="products"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        :scroll="{ x: 1100 }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <!-- Product -->
          <template v-if="column.key === 'product'">
            <div class="product-cell">
              <a-avatar 
                :src="record.thumbnail?.url" 
                :size="48" 
                shape="square"
                class="product-avatar"
              >
                {{ record.name.charAt(0) }}
              </a-avatar>
              <div class="product-info">
                <div class="product-name">{{ record.name }}</div>
                <div class="product-meta">
                  <span v-if="record.sku">SKU: {{ record.sku }}</span>
                  <a-tag v-if="record.is_featured" color="gold" size="small">Featured</a-tag>
                  <a-tag v-if="record.product_type === 'DIGITAL'" color="purple" size="small">Digital</a-tag>
                </div>
              </div>
            </div>
          </template>

          <!-- Category -->
          <template v-if="column.key === 'category'">
            <span v-if="record.category">{{ record.category.category_name }}</span>
            <span v-else class="text-muted">Uncategorized</span>
          </template>

          <!-- Price -->
          <template v-if="column.key === 'price'">
            <div class="price-cell">
              <span v-if="record.sale_price" class="sale-price">
                {{ formatCurrency(record.sale_price) }}
              </span>
              <span :class="{ 'original-price': record.sale_price }">
                {{ formatCurrency(record.base_price) }}
              </span>
            </div>
          </template>

          <!-- Stock -->
          <template v-if="column.key === 'stock'">
            <a-tag 
              :color="record.stock_quantity <= 0 ? 'red' : record.stock_quantity <= record.low_stock_threshold ? 'orange' : 'green'"
            >
              {{ record.stock_quantity }}
            </a-tag>
          </template>

          <!-- Status -->
          <template v-if="column.key === 'status'">
            <a-switch
              :checked="record.is_published"
              checked-children="Published"
              un-checked-children="Draft"
              @change="() => handleTogglePublish(record)"
            />
          </template>

          <!-- Created At -->
          <template v-if="column.key === 'created_at'">
            {{ dayjs(record.created_at).format('MMM D, YYYY') }}
          </template>

          <!-- Actions -->
          <template v-if="column.key === 'actions'">
            <a-space>
              <a-tooltip title="Edit">
                <a-button type="text" size="small" @click="handleEdit(record.id)">
                  <template #icon><EditOutlined /></template>
                </a-button>
              </a-tooltip>
              <a-tooltip title="Delete">
                <a-button type="text" size="small" danger @click="handleDelete(record.id)">
                  <template #icon><DeleteOutlined /></template>
                </a-button>
              </a-tooltip>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<style scoped>
.product-list {
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

.filter-card {
  margin-bottom: 24px;
}

.table-card :deep(.ant-card-body) {
  padding: 0;
}

.table-card :deep(.ant-table-wrapper) {
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
  min-width: 0;
}

.product-name {
  font-weight: 500;
  color: #262626;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  font-size: 12px;
  color: #8c8c8c;
}

.price-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.sale-price {
  font-weight: 600;
  color: #52c41a;
}

.original-price {
  font-weight: 500;
}

.original-price.sale-price ~ .original-price,
span.original-price:not(:only-child) {
  text-decoration: line-through;
  color: #8c8c8c;
  font-size: 12px;
}

.text-muted {
  color: #8c8c8c;
}
</style>
