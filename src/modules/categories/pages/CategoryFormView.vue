<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { categoriesApi, type CreateCategoryDto, type Category } from '@/modules/categories/api/categories'
import { SaveOutlined, ArrowLeftOutlined, InboxOutlined } from '@ant-design/icons-vue'
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
          <a-button type="text" class="back-button" @click="router.push('/categories')">
            <template #icon>
              <ArrowLeftOutlined />
            </template>
          </a-button>
          <div class="header-content">
            <h1>{{ isEdit ? 'Edit Category' : 'Create Category' }}</h1>
            <p>{{ isEdit ? 'Update category information and settings' : 'Add a new category to organize your products'
            }}</p>
          </div>
        </div>
        <div class="header-right">
          <a-space :size="12">
            <a-button size="large" class="cancel-button" @click="router.push('/categories')">Cancel</a-button>
            <a-button type="primary" size="large" class="save-button" :loading="saving" @click="handleSubmit">
              <template #icon>
                <SaveOutlined />
              </template>
              {{ isEdit ? 'Update' : 'Create' }} Category
            </a-button>
          </a-space>
        </div>
      </div>

      <!-- Form -->
      <a-row :gutter="24">
        <a-col :xs="24" :lg="16">
          <a-card :bordered="false" class="form-card">
            <template #title>
              <div class="card-title">
                <span class="title-icon">📝</span>
                <span>Category Information</span>
              </div>
            </template>
            <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
              <a-form-item label="Category Name" name="category_name">
                <a-input v-model:value="formState.category_name" placeholder="Enter category name" size="large"
                  @blur="generateSlug" />
              </a-form-item>

              <a-form-item label="Slug" name="slug">
                <a-input v-model:value="formState.slug" placeholder="category-slug" addon-before="/" size="large" />
              </a-form-item>

              <a-form-item label="Description" name="description">
                <a-textarea v-model:value="formState.description"
                  placeholder="Provide a detailed description for this category" :rows="4" size="large" />
              </a-form-item>

              <a-form-item label="Parent Category" name="parent_id">
                <a-select v-model:value="formState.parent_id" placeholder="Select parent category (optional)"
                  allow-clear size="large" style="width: 100%">
                  <a-select-option v-for="cat in availableParents" :key="cat.id" :value="cat.id">
                    {{ cat.category_name }}
                  </a-select-option>
                </a-select>
              </a-form-item>

              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="Sort Order" name="sort_order">
                    <a-input-number v-model:value="formState.sort_order" :min="0" size="large" style="width: 100%"
                      placeholder="0" />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="Featured Category">
                    <div class="switch-container">
                      <a-switch v-model:checked="formState.is_featured" checked-children="Yes" un-checked-children="No"
                        size="default" />
                      <span class="switch-label">{{ formState.is_featured ? 'Featured' : 'Not Featured' }}</span>
                    </div>
                  </a-form-item>
                </a-col>
              </a-row>

              <a-form-item label="Internal Remarks" name="remarks">
                <a-textarea v-model:value="formState.remarks" placeholder="Add internal notes or reminders (optional)"
                  :rows="2" size="large" />
              </a-form-item>
            </a-form>
          </a-card>
        </a-col>

        <a-col :xs="24" :lg="8">
          <a-card :bordered="false" class="form-card image-card">
            <template #title>
              <div class="card-title">
                <span class="title-icon">🖼️</span>
                <span>Category Image</span>
              </div>
            </template>
            <a-upload-dragger name="file" :multiple="false" action="#" :show-upload-list="false" class="image-uploader">
              <p class="upload-icon">
                <InboxOutlined />
              </p>
              <p class="upload-text">Click or drag image to upload</p>
              <p class="upload-hint">Recommended size: 800x800px</p>
            </a-upload-dragger>
            <div class="upload-info">
              <p>Supported formats: JPG, PNG, WebP</p>
              <p>Maximum file size: 5MB</p>
            </div>
          </a-card>

          <a-card :bordered="false" class="form-card quick-info">
            <template #title>
              <div class="card-title">
                <span class="title-icon">💡</span>
                <span>Quick Tips</span>
              </div>
            </template>
            <div class="tips-list">
              <div class="tip-item">
                <div class="tip-bullet"></div>
                <div class="tip-content">
                  <strong>Category Name:</strong> Choose a clear, descriptive name
                </div>
              </div>
              <div class="tip-item">
                <div class="tip-bullet"></div>
                <div class="tip-content">
                  <strong>Slug:</strong> Auto-generated URL-friendly identifier
                </div>
              </div>
              <div class="tip-item">
                <div class="tip-bullet"></div>
                <div class="tip-content">
                  <strong>Parent Category:</strong> Create hierarchical structure
                </div>
              </div>
              <div class="tip-item">
                <div class="tip-bullet"></div>
                <div class="tip-content">
                  <strong>Featured:</strong> Highlight on homepage
                </div>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<style scoped>
.category-form {
  min-height: 100%;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 32px;
  padding: 24px;
  background: linear-gradient(135deg, oklch(0.7 0.15 195) 0%, oklch(0.65 0.15 200) 100%);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.15);
}

.header-left {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.back-button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  height: 40px;
  width: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateX(-4px);
}

.header-content h1 {
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content p {
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-size: 15px;
}

.header-right {
  display: flex;
  align-items: center;
}

.cancel-button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  height: 44px;
  padding: 0 24px;
  border-radius: 10px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cancel-button:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.save-button {
  height: 44px;
  padding: 0 28px;
  border-radius: 10px;
  font-weight: 600;
  background: white;
  color: oklch(0.65 0.15 195);
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.save-button:hover {
  background: white;
  color: oklch(0.65 0.15 195);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.form-card {
  margin-bottom: 24px;
  border-radius: 16px;
  overflow: hidden;
  background: var(--card);
  border: 1px solid var(--border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
}

.title-icon {
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-uploader {
  border: 2px dashed var(--border);
  border-radius: 12px;
  background: var(--background);
  transition: all 0.3s ease;
}

.image-uploader:hover {
  border-color: oklch(0.65 0.15 195);
  background: oklch(0.65 0.15 195 / 0.05);
}

.upload-icon {
  font-size: 48px;
  color: oklch(0.65 0.15 195);
  margin-bottom: 8px;
}

.upload-text {
  font-size: 16px;
  font-weight: 500;
  color: var(--foreground);
  margin: 8px 0 4px 0;
}

.upload-hint {
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
}

.upload-info {
  margin-top: 16px;
  padding: 16px;
  background: oklch(0.65 0.15 195 / 0.05);
  border-radius: 10px;
  border-left: 3px solid oklch(0.65 0.15 195);
}

.upload-info p {
  font-size: 13px;
  color: var(--muted-foreground);
  margin: 4px 0;
}

.switch-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.switch-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
}

.quick-info {
  background: linear-gradient(135deg, oklch(0.65 0.15 195 / 0.05) 0%, oklch(0.7 0.15 200 / 0.05) 100%);
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tip-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.tip-bullet {
  width: 8px;
  height: 8px;
  background: oklch(0.65 0.15 195);
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.tip-content {
  font-size: 14px;
  line-height: 1.6;
  color: var(--foreground);
}

.tip-content strong {
  color: oklch(0.65 0.15 195);
  font-weight: 600;
}

@media (max-width: 768px) {
  .category-form {
    padding: 16px;
  }

  .page-header {
    padding: 20px;
  }

  .header-content h1 {
    font-size: 22px;
  }

  .header-content p {
    font-size: 14px;
  }

  .header-right {
    width: 100%;
  }

  .header-right :deep(.ant-space) {
    width: 100%;
    display: flex;
  }

  .header-right :deep(.ant-space-item) {
    flex: 1;
  }

  .cancel-button,
  .save-button {
    width: 100%;
  }
}
</style>
