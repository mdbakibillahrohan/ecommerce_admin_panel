<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { categoriesApi, type Category } from '@/api/categories'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
  FolderOpenOutlined,
} from '@ant-design/icons-vue'
import { message, Modal } from 'ant-design-vue'

const router = useRouter()

// State
const loading = ref(false)
const categories = ref<Category[]>([])
const expandedKeys = ref<number[]>([])

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
  <div class="category-list">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-left">
        <h1>Categories</h1>
        <p>Organize your product categories</p>
      </div>
      <div class="header-right">
        <a-button type="primary" @click="handleCreate">
          <template #icon><PlusOutlined /></template>
          Add Category
        </a-button>
      </div>
    </div>

    <!-- Categories Table -->
    <a-card :bordered="false" class="table-card">
      <a-table
        :columns="columns"
        :data-source="flattenCategories(categories)"
        :loading="loading"
        :pagination="false"
        row-key="id"
        :scroll="{ x: 900 }"
      >
        <template #bodyCell="{ column, record }">
          <!-- Category Name with Tree -->
          <template v-if="column.key === 'category'">
            <div class="category-cell" :style="{ paddingLeft: `${record.level * 32}px` }">
              <span 
                v-if="hasChildren(record)"
                class="expand-icon"
                @click="toggleExpand(record.id)"
              >
                <FolderOpenOutlined v-if="expandedKeys.includes(record.id)" />
                <FolderOutlined v-else />
              </span>
              <span v-else class="expand-icon placeholder">
                <FolderOutlined style="opacity: 0.4" />
              </span>
              
              <a-avatar 
                v-if="record.image?.url"
                :src="record.image.url" 
                :size="36" 
                shape="square"
              />
              <a-avatar 
                v-else
                :size="36" 
                shape="square"
                :style="{ 
                  background: `hsl(${(record.id * 137) % 360}, 65%, 55%)`,
                  color: '#fff',
                  fontWeight: 600
                }"
              >
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
            <a-tag>{{ record.products?.length || 0 }}</a-tag>
          </template>

          <!-- Featured -->
          <template v-if="column.key === 'featured'">
            <a-tag v-if="record.is_featured" color="gold">Featured</a-tag>
            <span v-else class="text-muted">-</span>
          </template>

          <!-- Actions -->
          <template v-if="column.key === 'actions'">
            <a-space>
              <a-tooltip title="Add Subcategory">
                <a-button type="text" size="small" @click="handleAddChild(record.id)">
                  <template #icon><PlusOutlined /></template>
                </a-button>
              </a-tooltip>
              <a-tooltip title="Edit">
                <a-button type="text" size="small" @click="handleEdit(record.id)">
                  <template #icon><EditOutlined /></template>
                </a-button>
              </a-tooltip>
              <a-tooltip title="Delete">
                <a-button type="text" size="small" danger @click="handleDelete(record)">
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
.category-list {
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

.category-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.expand-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #667eea;
  font-size: 16px;
  flex-shrink: 0;
}

.expand-icon.placeholder {
  cursor: default;
}

.category-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.category-name {
  font-weight: 500;
  color: #262626;
}

.category-desc {
  font-size: 12px;
  color: #8c8c8c;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.text-muted {
  color: #bfbfbf;
}
</style>
