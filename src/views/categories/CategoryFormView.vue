<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { categoriesApi, type CreateCategoryDto, type Category } from '@/api/categories'
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'

const router = useRouter()
const route = useRoute()

const isEdit = computed(() => !!route.params.id)
const categoryId = computed(() => route.params.id ? Number(route.params.id) : null)
const parentIdFromQuery = computed(() => route.query.parent ? Number(route.query.parent) : undefined)

// State
const loading = ref(false)
const saving = ref(false)
const formRef = ref<FormInstance>()
const categories = ref<Category[]>([])

const formState = ref<CreateCategoryDto>({
  category_name: '',
  slug: '',
  description: '',
  parent_id: undefined,
  sort_order: 0,
  is_featured: false,
  remarks: '',
})

const rules = {
  category_name: [{ required: true, message: 'Category name is required' }],
}

onMounted(async () => {
  await fetchCategories()
  
  if (isEdit.value && categoryId.value) {
    await fetchCategory(categoryId.value)
  } else if (parentIdFromQuery.value) {
    formState.value.parent_id = parentIdFromQuery.value
  }
})

async function fetchCategories() {
  try {
    categories.value = await categoriesApi.getAll()
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

async function fetchCategory(id: number) {
  loading.value = true
  try {
    const category = await categoriesApi.getById(id)
    formState.value = {
      category_name: category.category_name,
      slug: category.slug,
      description: category.description || '',
      parent_id: category.parent_id || undefined,
      sort_order: category.sort_order,
      is_featured: category.is_featured,
      remarks: category.remarks || '',
    }
  } catch (error) {
    message.error('Failed to fetch category')
    console.error(error)
    router.push('/categories')
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    saving.value = true

    if (isEdit.value && categoryId.value) {
      await categoriesApi.update(categoryId.value, formState.value)
      message.success('Category updated successfully')
    } else {
      await categoriesApi.create(formState.value)
      message.success('Category created successfully')
    }

    router.push('/categories')
  } catch (error: any) {
    if (error.errorFields) {
      message.error('Please check the form for errors')
    } else {
      message.error('Failed to save category')
      console.error(error)
    }
  } finally {
    saving.value = false
  }
}

function generateSlug() {
  if (formState.value.category_name && !formState.value.slug) {
    formState.value.slug = formState.value.category_name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
}

// Filter out current category and its children for parent select
const availableParents = computed(() => {
  if (!isEdit.value) return categories.value
  
  const excludeIds = new Set<number>()
  
  function collectDescendants(id: number) {
    excludeIds.add(id)
    const children = categories.value.filter(c => c.parent_id === id)
    children.forEach(child => collectDescendants(child.id))
  }
  
  if (categoryId.value) {
    collectDescendants(categoryId.value)
  }
  
  return categories.value.filter(c => !excludeIds.has(c.id))
})
</script>

<template>
  <div class="category-form">
    <a-spin :spinning="loading">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-left">
          <a-button type="text" @click="router.push('/categories')">
            <template #icon><ArrowLeftOutlined /></template>
          </a-button>
          <div>
            <h1>{{ isEdit ? 'Edit Category' : 'Create Category' }}</h1>
            <p>{{ isEdit ? 'Update category information' : 'Add a new category' }}</p>
          </div>
        </div>
        <div class="header-right">
          <a-space>
            <a-button @click="router.push('/categories')">Cancel</a-button>
            <a-button type="primary" :loading="saving" @click="handleSubmit">
              <template #icon><SaveOutlined /></template>
              {{ isEdit ? 'Update' : 'Create' }} Category
            </a-button>
          </a-space>
        </div>
      </div>

      <!-- Form -->
      <a-row :gutter="24">
        <a-col :xs="24" :lg="16">
          <a-card title="Category Information" :bordered="false" class="form-card">
            <a-form
              ref="formRef"
              :model="formState"
              :rules="rules"
              layout="vertical"
            >
              <a-form-item label="Category Name" name="category_name">
                <a-input
                  v-model:value="formState.category_name"
                  placeholder="Enter category name"
                  size="large"
                  @blur="generateSlug"
                />
              </a-form-item>

              <a-form-item label="Slug" name="slug">
                <a-input
                  v-model:value="formState.slug"
                  placeholder="category-slug"
                  addon-before="/"
                />
              </a-form-item>

              <a-form-item label="Description" name="description">
                <a-textarea
                  v-model:value="formState.description"
                  placeholder="Category description"
                  :rows="4"
                />
              </a-form-item>

              <a-form-item label="Parent Category" name="parent_id">
                <a-select
                  v-model:value="formState.parent_id"
                  placeholder="Select parent category (optional)"
                  allow-clear
                  style="width: 100%"
                >
                  <a-select-option v-for="cat in availableParents" :key="cat.id" :value="cat.id">
                    {{ cat.category_name }}
                  </a-select-option>
                </a-select>
              </a-form-item>

              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="Sort Order" name="sort_order">
                    <a-input-number
                      v-model:value="formState.sort_order"
                      :min="0"
                      style="width: 100%"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="Featured">
                    <a-switch
                      v-model:checked="formState.is_featured"
                      checked-children="Yes"
                      un-checked-children="No"
                    />
                  </a-form-item>
                </a-col>
              </a-row>

              <a-form-item label="Remarks" name="remarks">
                <a-textarea
                  v-model:value="formState.remarks"
                  placeholder="Internal notes (optional)"
                  :rows="2"
                />
              </a-form-item>
            </a-form>
          </a-card>
        </a-col>

        <a-col :xs="24" :lg="8">
          <a-card title="Category Image" :bordered="false" class="form-card">
            <a-upload-dragger
              name="file"
              :multiple="false"
              action="#"
              :show-upload-list="false"
            >
              <p class="ant-upload-drag-icon">
                <inbox-outlined style="font-size: 32px; color: #8c8c8c" />
              </p>
              <p class="ant-upload-text">Click or drag to upload</p>
              <p class="ant-upload-hint">Upload a category image</p>
            </a-upload-dragger>
            <p class="upload-note">
              Image upload requires a file upload API.
            </p>
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<style scoped>
.category-form {
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

.header-left {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.header-left h1 {
  font-size: 24px;
  font-weight: 700;
  color: #262626;
  margin: 0 0 4px 0;
}

.header-left p {
  color: #8c8c8c;
  margin: 0;
}

.form-card {
  margin-bottom: 24px;
}

.upload-note {
  margin-top: 12px;
  font-size: 12px;
  color: #8c8c8c;
  text-align: center;
}
</style>
