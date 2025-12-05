<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { productsApi, type CreateProductDto, type Product } from '@/api/products'
import { categoriesApi, type Category } from '@/api/categories'
import {
  SaveOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'

const router = useRouter()
const route = useRoute()

const isEdit = computed(() => !!route.params.id)
const productId = computed(() => route.params.id ? Number(route.params.id) : null)

// State
const loading = ref(false)
const saving = ref(false)
const formRef = ref<FormInstance>()
const categories = ref<Category[]>([])
const activeTab = ref('basic')

const formState = ref<CreateProductDto & { id?: number }>({
  name: '',
  slug: '',
  description: '',
  short_description: '',
  product_type: 'PHYSICAL',
  base_price: 0,
  sale_price: undefined,
  sku: '',
  category_id: undefined,
  is_featured: false,
  is_published: false,
  stock_quantity: 0,
  low_stock_threshold: 5,
  track_inventory: true,
  meta_title: '',
  meta_description: '',
})

const rules = {
  name: [{ required: true, message: 'Product name is required' }],
  base_price: [{ required: true, message: 'Base price is required' }],
}

onMounted(async () => {
  await fetchCategories()
  if (isEdit.value && productId.value) {
    await fetchProduct(productId.value)
  }
})

async function fetchCategories() {
  try {
    categories.value = await categoriesApi.getAll()
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

async function fetchProduct(id: number) {
  loading.value = true
  try {
    const product = await productsApi.getById(id)
    formState.value = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      short_description: product.short_description || '',
      product_type: product.product_type,
      base_price: Number(product.base_price),
      sale_price: product.sale_price ? Number(product.sale_price) : undefined,
      sku: product.sku || '',
      category_id: product.category_id || undefined,
      is_featured: product.is_featured,
      is_published: product.is_published,
      stock_quantity: product.stock_quantity,
      low_stock_threshold: product.low_stock_threshold,
      track_inventory: product.track_inventory,
      meta_title: product.meta_title || '',
      meta_description: product.meta_description || '',
    }
  } catch (error) {
    message.error('Failed to fetch product')
    console.error(error)
    router.push('/products')
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    saving.value = true

    const data: CreateProductDto = {
      ...formState.value,
      sale_price: formState.value.sale_price || undefined,
    }

    if (isEdit.value && productId.value) {
      await productsApi.update(productId.value, data)
      message.success('Product updated successfully')
    } else {
      await productsApi.create(data)
      message.success('Product created successfully')
    }

    router.push('/products')
  } catch (error: any) {
    if (error.errorFields) {
      message.error('Please check the form for errors')
    } else {
      message.error('Failed to save product')
      console.error(error)
    }
  } finally {
    saving.value = false
  }
}

function generateSlug() {
  if (formState.value.name && !formState.value.slug) {
    formState.value.slug = formState.value.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
}

watch(() => formState.value.name, () => {
  if (!isEdit.value) {
    generateSlug()
  }
})
</script>

<template>
  <div class="product-form">
    <a-spin :spinning="loading">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-left">
          <a-button type="text" @click="router.push('/products')">
            <template #icon><ArrowLeftOutlined /></template>
          </a-button>
          <div>
            <h1>{{ isEdit ? 'Edit Product' : 'Create Product' }}</h1>
            <p>{{ isEdit ? 'Update product information' : 'Add a new product to your catalog' }}</p>
          </div>
        </div>
        <div class="header-right">
          <a-space>
            <a-button @click="router.push('/products')">Cancel</a-button>
            <a-button type="primary" :loading="saving" @click="handleSubmit">
              <template #icon><SaveOutlined /></template>
              {{ isEdit ? 'Update' : 'Create' }} Product
            </a-button>
          </a-space>
        </div>
      </div>

      <!-- Form -->
      <a-form
        ref="formRef"
        :model="formState"
        :rules="rules"
        layout="vertical"
        class="form-container"
      >
        <a-row :gutter="24">
          <!-- Main Content -->
          <a-col :xs="24" :lg="16">
            <a-card title="Basic Information" :bordered="false" class="form-card">
              <a-form-item label="Product Name" name="name">
                <a-input
                  v-model:value="formState.name"
                  placeholder="Enter product name"
                  size="large"
                />
              </a-form-item>

              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="Slug" name="slug">
                    <a-input
                      v-model:value="formState.slug"
                      placeholder="product-slug"
                      addon-before="/"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="SKU" name="sku">
                    <a-input
                      v-model:value="formState.sku"
                      placeholder="Product SKU"
                    />
                  </a-form-item>
                </a-col>
              </a-row>

              <a-form-item label="Short Description" name="short_description">
                <a-textarea
                  v-model:value="formState.short_description"
                  placeholder="Brief product description"
                  :rows="2"
                  show-count
                  :maxlength="500"
                />
              </a-form-item>

              <a-form-item label="Full Description" name="description">
                <a-textarea
                  v-model:value="formState.description"
                  placeholder="Detailed product description"
                  :rows="6"
                />
              </a-form-item>
            </a-card>

            <a-card title="Pricing" :bordered="false" class="form-card">
              <a-row :gutter="16">
                <a-col :span="8">
                  <a-form-item label="Base Price" name="base_price">
                    <a-input-number
                      v-model:value="formState.base_price"
                      :min="0"
                      :precision="2"
                      style="width: 100%"
                      size="large"
                    >
                      <template #addonBefore>৳</template>
                    </a-input-number>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="Sale Price" name="sale_price">
                    <a-input-number
                      v-model:value="formState.sale_price"
                      :min="0"
                      :precision="2"
                      style="width: 100%"
                      size="large"
                      placeholder="Optional"
                    >
                      <template #addonBefore>৳</template>
                    </a-input-number>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="Product Type">
                    <a-select v-model:value="formState.product_type" size="large">
                      <a-select-option value="PHYSICAL">Physical</a-select-option>
                      <a-select-option value="DIGITAL">Digital</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>

            <a-card title="Inventory" :bordered="false" class="form-card">
              <a-form-item>
                <a-checkbox v-model:checked="formState.track_inventory">
                  Track inventory for this product
                </a-checkbox>
              </a-form-item>

              <a-row :gutter="16" v-if="formState.track_inventory">
                <a-col :span="12">
                  <a-form-item label="Stock Quantity" name="stock_quantity">
                    <a-input-number
                      v-model:value="formState.stock_quantity"
                      :min="0"
                      style="width: 100%"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="Low Stock Threshold" name="low_stock_threshold">
                    <a-input-number
                      v-model:value="formState.low_stock_threshold"
                      :min="0"
                      style="width: 100%"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>

            <a-card title="SEO" :bordered="false" class="form-card">
              <a-form-item label="Meta Title" name="meta_title">
                <a-input
                  v-model:value="formState.meta_title"
                  placeholder="SEO title"
                  show-count
                  :maxlength="70"
                />
              </a-form-item>

              <a-form-item label="Meta Description" name="meta_description">
                <a-textarea
                  v-model:value="formState.meta_description"
                  placeholder="SEO description"
                  :rows="3"
                  show-count
                  :maxlength="160"
                />
              </a-form-item>
            </a-card>
          </a-col>

          <!-- Sidebar -->
          <a-col :xs="24" :lg="8">
            <a-card title="Status" :bordered="false" class="form-card">
              <a-form-item label="Visibility">
                <a-switch
                  v-model:checked="formState.is_published"
                  checked-children="Published"
                  un-checked-children="Draft"
                />
              </a-form-item>

              <a-form-item label="Featured">
                <a-switch
                  v-model:checked="formState.is_featured"
                  checked-children="Yes"
                  un-checked-children="No"
                />
              </a-form-item>
            </a-card>

            <a-card title="Category" :bordered="false" class="form-card">
              <a-form-item name="category_id">
                <a-select
                  v-model:value="formState.category_id"
                  placeholder="Select category"
                  allow-clear
                  style="width: 100%"
                >
                  <a-select-option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.category_name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-card>

            <a-card title="Product Image" :bordered="false" class="form-card">
              <a-upload-dragger
                name="file"
                :multiple="false"
                action="#"
                :show-upload-list="false"
              >
                <p class="ant-upload-drag-icon">
                  <PlusOutlined style="font-size: 32px; color: #8c8c8c" />
                </p>
                <p class="ant-upload-text">Click or drag to upload</p>
                <p class="ant-upload-hint">Support for a single image upload</p>
              </a-upload-dragger>
              <p class="upload-note">
                Image upload requires a file upload API. Please configure this separately.
              </p>
            </a-card>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </div>
</template>

<style scoped>
.product-form {
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

.form-container {
  max-width: 100%;
}

.form-card {
  margin-bottom: 24px;
}

.form-card :deep(.ant-card-head-title) {
  font-weight: 600;
}

.upload-note {
  margin-top: 12px;
  font-size: 12px;
  color: #8c8c8c;
  text-align: center;
}
</style>
