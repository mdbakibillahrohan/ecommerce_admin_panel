<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { categoriesApi, type Category } from '@/modules/categories/api/categories'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  AppstoreOutlined,
  StarOutlined,
  OrderedListOutlined,
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'

const router = useRouter()

// State
const loading = ref(false)
const categories = ref<Category[]>([])
const expandedKeys = ref<number[]>([])

// Computed statistics
const totalCategories = computed(() => {
  const count = (cats: Category[]): number => {
    return cats.reduce((sum, cat) => {
      return sum + 1 + (cat.children ? count(cat.children) : 0)
    }, 0)
  }
  return count(categories.value)
})

const featuredCount = computed(() => {
  const count = (cats: Category[]): number => {
    return cats.reduce((sum, cat) => {
      return sum + (cat.is_featured ? 1 : 0) + (cat.children ? count(cat.children) : 0)
    }, 0)
  }
  return count(categories.value)
})

const totalProducts = computed(() => {
  const count = (cats: Category[]): number => {
    return cats.reduce((sum, cat) => {
      return sum + (cat.products?.length || 0) + (cat.children ? count(cat.children) : 0)
    }, 0)
  }
  return count(categories.value)
})

onMounted(() => {
  fetchCategories()
})

async function fetchCategories() {
  loading.value = true
  try {
    categories.value = await categoriesApi.getTree()
    // Auto-expand first level
    expandedKeys.value = categories.value.map(c => c.id)
  } catch (error) {
    message.error('Failed to fetch categories')
    console.error(error)
  } finally {
    loading.value = false
  }
}

function handleCreate() {
  router.push('/categories/create')
}

function handleEdit(id: number) {
  router.push(`/categories/${id}/edit`)
}

function handleAddChild(parentId: number) {
  router.push(`/categories/create?parent=${parentId}`)
}

async function handleDelete(category: Category) {
  if (category.children && category.children.length > 0) {
    message.warning('Cannot delete category with subcategories. Please delete subcategories first.')
    return
  }

  Modal.confirm({
    title: 'Delete Category',
    content: `Are you sure you want to delete "${category.category_name}"? This action cannot be undone.`,
    okText: 'Delete',
    okType: 'danger',
    cancelText: 'Cancel',
    async onOk() {
      try {
        await categoriesApi.delete(category.id)
        message.success('Category deleted successfully')
        fetchCategories()
      } catch (error) {
        message.error('Failed to delete category')
        console.error(error)
      }
    },
  })
}

function flattenCategories(cats: Category[], level = 0): (Category & { level: number })[] {
  const result: (Category & { level: number })[] = []

  for (const cat of cats) {
    result.push({ ...cat, level })
    if (cat.children && cat.children.length > 0 && expandedKeys.value.includes(cat.id)) {
      result.push(...flattenCategories(cat.children, level + 1))
    }
  }

  return result
}

function toggleExpand(id: number) {
  const index = expandedKeys.value.indexOf(id)
  if (index > -1) {
    expandedKeys.value.splice(index, 1)
  } else {
    expandedKeys.value.push(id)
  }
}

function hasChildren(category: Category) {
  return category.children && category.children.length > 0
}

const columns = [
  { title: 'Category', key: 'category', width: 400 },
  { title: 'Slug', dataIndex: 'slug', key: 'slug', width: 200 },
  { title: 'Products', key: 'products', width: 100, align: 'center' as const },
  { title: 'Featured', key: 'featured', width: 100, align: 'center' as const },
  { title: 'Order', dataIndex: 'sort_order', key: 'sort_order', width: 80, align: 'center' as const },
  { title: 'Actions', key: 'actions', width: 180, align: 'center' as const, fixed: 'right' as const },
]
</script>

<template>
  <div class="category-list-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1>Product Categories</h1>
          <p>Organize and manage your product categories hierarchy</p>
        </div>
        <div class="header-right">
          <a-button type="primary" size="large" @click="handleCreate">
            <template #icon>
              <PlusOutlined />
            </template>
            Add Category
          </a-button>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon"
          style="background: linear-gradient(135deg, oklch(0.7 0.15 200) 0%, oklch(0.6 0.18 220) 100%)">
          <AppstoreOutlined />
        </div>
        <div class="stat-content">
          <div class="stat-label">Total Categories</div>
          <div class="stat-value">{{ totalCategories }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon"
          style="background: linear-gradient(135deg, oklch(0.7 0.15 180) 0%, oklch(0.6 0.18 190) 100%)">
          <StarOutlined />
        </div>
        <div class="stat-content">
          <div class="stat-label">Featured</div>
          <div class="stat-value">{{ featuredCount }}</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon"
          style="background: linear-gradient(135deg, oklch(0.75 0.12 160) 0%, oklch(0.65 0.15 175) 100%)">
          <OrderedListOutlined />
        </div>
        <div class="stat-content">
          <div class="stat-label">Total Products</div>
          <div class="stat-value">{{ totalProducts }}</div>
        </div>
      </div>
    </div>

    <!-- Categories Table -->
    <a-card :bordered="false" class="table-card">
      <a-table :columns="columns" :data-source="flattenCategories(categories)" :loading="loading" :pagination="false"
        row-key="id" :scroll="{ x: 900 }">
        <template #bodyCell="{ column, record }">
          <!-- Category Name with Tree -->
          <template v-if="column.key === 'category'">
            <div class="category-cell" :style="{ paddingLeft: `${record.level * 32}px` }">
              <span v-if="hasChildren(record)" class="expand-icon" @click="toggleExpand(record.id)">
                <FolderOpenOutlined v-if="expandedKeys.includes(record.id)" />
                <FolderOutlined v-else />
              </span>
              <span v-else class="expand-icon placeholder">
                <FolderOutlined />
              </span>

              <a-avatar v-if="record.image?.url" :src="record.image.url" :size="40" shape="square"
                class="category-avatar" />
              <a-avatar v-else :size="40" shape="square" class="category-avatar" :style="{
                background: `hsl(${(record.id * 137) % 360}, 65%, 55%)`,
                color: '#fff',
                fontWeight: 600
              }">
                {{ record.category_name.charAt(0) }}
              </a-avatar>

              <div class="category-info">
                <span class="category-name">{{ record.category_name }}</span>
                <span v-if="record.description" class="category-desc">{{ record.description }}</span>
              </div>
            </div>
          </template>

          <!-- Products Count -->
          <template v-if="column.key === 'products'">
            <a-tag class="product-tag">{{ record.products?.length || 0 }}</a-tag>
          </template>

          <!-- Featured -->
          <template v-if="column.key === 'featured'">
            <a-tag v-if="record.is_featured" color="gold" class="featured-tag">
              <StarOutlined /> Featured
            </a-tag>
            <span v-else class="text-muted">-</span>
          </template>

          <!-- Actions -->
          <template v-if="column.key === 'actions'">
            <a-space>
              <a-tooltip title="Add Subcategory">
                <a-button type="text" size="small" class="action-btn" @click="handleAddChild(record.id)">
                  <template #icon>
                    <PlusOutlined />
                  </template>
                </a-button>
              </a-tooltip>
              <a-tooltip title="Edit">
                <a-button type="text" size="small" class="action-btn edit-btn" @click="handleEdit(record.id)">
                  <template #icon>
                    <EditOutlined />
                  </template>
                </a-button>
              </a-tooltip>
              <a-tooltip title="Delete">
                <a-button type="text" size="small" class="action-btn delete-btn" danger @click="handleDelete(record)">
                  <template #icon>
                    <DeleteOutlined />
                  </template>
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
.category-list-page {
  min-height: 100%;
}

.page-header {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
}

.header-left h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, oklch(0.65 0.19 195) 0%, oklch(0.55 0.22 210) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-left p {
  color: var(--muted-foreground);
  margin: 0;
  font-size: 15px;
}

/* Statistics Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
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
  border-color: oklch(0.65 0.19 195 / 0.3);
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-label {
  font-size: 14px;
  color: var(--muted-foreground);
  margin-bottom: 4px;
  font-weight: 500;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--foreground);
  line-height: 1;
}

/* Table Card */
.table-card {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid var(--border);
}

.table-card :deep(.ant-card-body) {
  padding: 0;
}

.table-card :deep(.ant-table) {
  background: var(--card);
}

.table-card :deep(.ant-table-thead > tr > th) {
  background: var(--muted);
  color: var(--foreground);
  font-weight: 600;
  border-bottom: 2px solid var(--border);
}

.table-card :deep(.ant-table-tbody > tr) {
  transition: all 0.2s ease;
}

.table-card :deep(.ant-table-tbody > tr:hover) {
  background: var(--accent) !important;
}

.table-card :deep(.ant-table-tbody > tr > td) {
  border-bottom: 1px solid var(--border);
}

/* Category Cell */
.category-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.expand-icon {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: oklch(0.65 0.19 195);
  font-size: 18px;
  flex-shrink: 0;
  transition: all 0.2s ease;
  border-radius: 6px;
}

.expand-icon:hover {
  background: oklch(0.65 0.19 195 / 0.1);
  transform: scale(1.1);
}

.expand-icon.placeholder {
  cursor: default;
  opacity: 0.3;
}

.expand-icon.placeholder:hover {
  background: transparent;
  transform: none;
}

.category-avatar {
  border-radius: 10px !important;
  border: 2px solid var(--border);
  transition: all 0.2s ease;
}

.category-avatar:hover {
  transform: scale(1.05);
  border-color: oklch(0.65 0.19 195);
}

.category-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 4px;
}

.category-name {
  font-weight: 600;
  color: var(--foreground);
  font-size: 15px;
}

.category-desc {
  font-size: 13px;
  color: var(--muted-foreground);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 250px;
}

.product-tag {
  font-weight: 600;
  background: oklch(0.65 0.19 195 / 0.1);
  color: oklch(0.55 0.22 210);
  border: 1px solid oklch(0.65 0.19 195 / 0.3);
  border-radius: 6px;
  padding: 4px 12px;
}

.featured-tag {
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 6px;
}

.text-muted {
  color: var(--muted-foreground);
  opacity: 0.5;
}

/* Action Buttons */
.action-btn {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
  color: var(--foreground);
}

.action-btn:hover {
  background: oklch(0.65 0.19 195 / 0.1);
  color: oklch(0.55 0.22 210);
  transform: translateY(-2px);
}

.edit-btn:hover {
  background: oklch(0.7 0.15 180 / 0.1);
  color: oklch(0.6 0.18 190);
}

.delete-btn:hover {
  background: oklch(0.65 0.22 25 / 0.1);
  color: oklch(0.55 0.25 30);
}

/* Responsive Design */
@media (max-width: 768px) {
  .category-list-page {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .header-left h1 {
    font-size: 24px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .stat-card {
    padding: 16px;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }

  .stat-value {
    font-size: 24px;
  }
}
</style>
