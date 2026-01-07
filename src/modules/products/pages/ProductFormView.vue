<script setup lang="ts">
import { ref, onMounted, computed, watch, reactive } from 'vue'
import FormSkeleton from '@/modules/shared/components/skeletons/FormSkeleton.vue'
import { useRouter, useRoute } from 'vue-router'
import { productsApi, type CreateProductDto } from '@/modules/products/api/products'
import { categoriesApi, type Category } from '@/modules/categories/api/categories'
import {
  SaveOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
  CopyOutlined,
  CloudUploadOutlined,
  PictureOutlined,
  TagsOutlined,
  DollarOutlined,
  InboxOutlined,
  SearchOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SaveFilled,
  ThunderboltOutlined,
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { FormInstance, UploadProps } from 'ant-design-vue'

const router = useRouter()
const route = useRoute()

const isEdit = computed(() => !!route.params.id)
const productId = computed(() => route.params.id ? Number(route.params.id) : null)
const pageTitle = computed(() => isEdit.value ? 'Edit Product' : 'Create New Product')

// State
const loading = ref(false)
const saving = ref(false)
const autoSaving = ref(false)
const formRef = ref<FormInstance>()
const categories = ref<Category[]>([])
const activeTab = ref('basic')
const previewVisible = ref(false)
const lastSaved = ref<Date | null>(null)

// Images
const imageList = ref<UploadProps['fileList']>([])
const uploadedImages = ref<string[]>([])

// Variants
const variants = ref<Array<{
  id: string
  name: string
  values: string[]
}>>([])

const variantCombinations = ref<Array<{
  id: string
  combination: string
  sku: string
  price: number
  stock: number
}>>([])

// Specifications
const specifications = ref<Array<{
  id: string
  name: string
  value: string
}>>([])

const formState = reactive<CreateProductDto & { id?: number }>({
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

const additionalSettings = reactive({
  tax_rate: 0,
  tax_included: false,
  weight: 0,
  dimensions: { length: 0, width: 0, height: 0 },
  shipping_required: true,
  digital_download: false,
  download_limit: 0,
  schedule_publish: false,
  publish_date: null as Date | null,
  related_products: [] as number[],
  tags: [] as string[],
})

const rules = {
  name: [{ required: true, message: 'Product name is required' }],
  base_price: [{ required: true, message: 'Base price is required' }],
  category_id: [{ required: true, message: 'Category is required' }],
}

// Progress calculation
const formProgress = computed(() => {
  let completed = 0
  const total = 8

  if (formState.name) completed++
  if (formState.description) completed++
  if (formState.base_price > 0) completed++
  if (formState.category_id) completed++
  if (formState.sku) completed++
  if (uploadedImages.value.length > 0) completed++
  if (formState.meta_title) completed++
  if (formState.short_description) completed++

  return Math.round((completed / total) * 100)
})

onMounted(async () => {
  await fetchCategories()
  if (isEdit.value && productId.value) {
    await fetchProduct(productId.value)
  }

  // Setup auto-save
  setupAutoSave()
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
    Object.assign(formState, {
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
    })
  } catch (error) {
    message.error('Failed to fetch product')
    console.error(error)
    router.push('/products')
  } finally {
    loading.value = false
  }
}

async function handleSubmit(publishNow = false) {
  try {
    await formRef.value?.validate()
    saving.value = true

    if (publishNow) {
      formState.is_published = true
    }

    const data: CreateProductDto = {
      ...formState,
      sale_price: formState.sale_price || undefined,
    }

    if (isEdit.value && productId.value) {
      await productsApi.update(productId.value, data)
      message.success('Product updated successfully')
    } else {
      await productsApi.create(data)
      message.success('Product created successfully')
    }

    lastSaved.value = new Date()
    router.push('/products')
  } catch (err: unknown) {
    const error = err as { errorFields?: unknown[] }
    if (error.errorFields) {
      message.error('Please check the form for errors')
    } else {
      message.error('Failed to save product')
      console.error(err)
    }
  } finally {
    saving.value = false
  }
}

async function saveDraft() {
  autoSaving.value = true
  try {
    // Simulate auto-save
    await new Promise(resolve => setTimeout(resolve, 1000))
    lastSaved.value = new Date()
    message.success('Draft saved', 1)
  } catch (error) {
    console.error('Auto-save failed:', error)
  } finally {
    autoSaving.value = false
  }
}

function setupAutoSave() {
  // Auto-save every 30 seconds
  setInterval(() => {
    if (formState.name) {
      saveDraft()
    }
  }, 30000)
}

function generateSlug() {
  if (formState.name && !formState.slug) {
    formState.slug = formState.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
}

function generateSKU() {
  if (!formState.sku) {
    const prefix = 'PRD'
    const timestamp = Date.now().toString().slice(-6)
    formState.sku = `${prefix}-${timestamp}`
  }
}

// Image upload
const handleImageUpload: UploadProps['onChange'] = (info) => {
  imageList.value = info.fileList
  if (info.file.status === 'done') {
    uploadedImages.value.push((info.file.response as { url?: string })?.url || '')
    message.success(`${info.file.name} uploaded successfully`)
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} upload failed`)
  }
}

// Variants
function addVariant() {
  variants.value.push({
    id: `var-${Date.now()}`,
    name: '',
    values: []
  })
}

function removeVariant(id: string) {
  variants.value = variants.value.filter(v => v.id !== id)
  generateVariantCombinations()
}

function generateVariantCombinations() {
  // Generate all possible combinations of variants
  // This is a simplified version
  variantCombinations.value = []
}

// Specifications
function addSpecification() {
  specifications.value.push({
    id: `spec-${Date.now()}`,
    name: '',
    value: ''
  })
}

function removeSpecification(id: string) {
  specifications.value = specifications.value.filter(s => s.id !== id)
}

function duplicateProduct() {
  message.info('Product duplication feature coming soon')
}

function previewProduct() {
  previewVisible.value = true
}

watch(() => formState.name, () => {
  if (!isEdit.value) {
    generateSlug()
  }
})

// Calculate savings
const savingsAmount = computed(() => {
  if (formState.sale_price && formState.base_price > formState.sale_price) {
    return formState.base_price - formState.sale_price
  }
  return 0
})

const savingsPercentage = computed(() => {
  if (savingsAmount.value > 0) {
    return Math.round((savingsAmount.value / formState.base_price) * 100)
  }
  return 0
})
</script>

<template>
  <div class="product-form-page">
    <!-- Sticky Header -->
    <div class="product-header">
      <div class="header-content">
        <div class="header-left">
          <a-button type="text" class="back-btn" @click="router.push('/products')">
            <ArrowLeftOutlined />
          </a-button>
          <div class="header-title">
            <h1>{{ pageTitle }}</h1>
            <div class="header-meta">
              <span class="progress-indicator">
                <CheckCircleOutlined v-if="formProgress === 100" class="complete-icon" />
                <ClockCircleOutlined v-else class="pending-icon" />
                {{ formProgress }}% Complete
              </span>
              <span v-if="lastSaved" class="last-saved">
                <SaveFilled />
                Saved {{ new Date(lastSaved).toLocaleTimeString() }}
              </span>
              <span v-if="autoSaving" class="auto-saving">
                <a-spin :spinning="true" size="small" /> Auto-saving...
              </span>
            </div>
          </div>
        </div>
        <div class="header-actions">
          <a-button @click="saveDraft" :loading="autoSaving">
            <SaveOutlined />
            Save Draft
          </a-button>
          <a-button @click="previewProduct">
            <EyeOutlined />
            Preview
          </a-button>
          <a-button v-if="isEdit" @click="duplicateProduct">
            <CopyOutlined />
          </a-button>
          <a-button type="primary" :loading="saving" @click="handleSubmit(true)" class="publish-btn">
            <ThunderboltOutlined />
            {{ formState.is_published ? 'Update & Publish' : 'Publish Now' }}
          </a-button>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${formProgress}%` }"></div>
      </div>
    </div>

    <FormSkeleton v-if="loading" :field-count="8" :show-extra-section="true" />
    <template v-else>

      <div class="form-content">
        <a-row :gutter="24">
          <!-- Main Content Area -->
          <a-col :xs="24" :xl="17">
            <!-- Tabs Navigation -->
            <div class="tabs-wrapper">
              <a-tabs v-model:activeKey="activeTab" class="product-tabs">
                <a-tab-pane key="basic">
                  <template #tab>
                    <span class="tab-label">
                      <TagsOutlined />
                      Basic Info
                    </span>
                  </template>

                  <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical" class="product-form">
                    <!-- Basic Information Card -->
                    <div class="form-card">
                      <div class="card-header">
                        <h3>Product Information</h3>
                        <p>Essential details about your product</p>
                      </div>
                      <div class="card-body">
                        <a-form-item label="Product Name" name="name" class="form-item-large">
                          <a-input v-model:value="formState.name" placeholder="Enter a descriptive product name"
                            size="large" show-count :maxlength="200" />
                        </a-form-item>

                        <a-row :gutter="16">
                          <a-col :xs="24" :md="12">
                            <a-form-item label="URL Slug" name="slug">
                              <a-input v-model:value="formState.slug" placeholder="product-url-slug" addon-before="/">
                                <template #suffix>
                                  <a-button type="link" size="small" @click="generateSlug">
                                    Generate
                                  </a-button>
                                </template>
                              </a-input>
                            </a-form-item>
                          </a-col>
                          <a-col :xs="24" :md="12">
                            <a-form-item label="SKU (Stock Keeping Unit)" name="sku">
                              <a-input v-model:value="formState.sku" placeholder="PRD-123456">
                                <template #suffix>
                                  <a-button type="link" size="small" @click="generateSKU">
                                    Generate
                                  </a-button>
                                </template>
                              </a-input>
                            </a-form-item>
                          </a-col>
                        </a-row>

                        <a-form-item label="Short Description" name="short_description">
                          <a-textarea v-model:value="formState.short_description"
                            placeholder="Brief description that appears in product listings (recommended: 150-160 characters)"
                            :rows="3" show-count :maxlength="500" />
                        </a-form-item>

                        <a-form-item label="Full Description" name="description">
                          <a-textarea v-model:value="formState.description"
                            placeholder="Detailed product description with features, benefits, and specifications"
                            :rows="8" show-count />
                          <div class="form-hint">
                            Tip: Include key features, materials, care instructions, and what makes this product unique
                          </div>
                        </a-form-item>
                      </div>
                    </div>

                    <!-- Category & Type -->
                    <div class="form-card">
                      <div class="card-header">
                        <h3>Classification</h3>
                        <p>Organize your product</p>
                      </div>
                      <div class="card-body">
                        <a-row :gutter="16">
                          <a-col :xs="24" :md="12">
                            <a-form-item label="Category" name="category_id">
                              <a-select v-model:value="formState.category_id" placeholder="Select a category"
                                size="large" show-search :filter-option="(input: string, option: any) =>
                                  option.label.toLowerCase().includes(input.toLowerCase())
                                  ">
                                <a-select-option v-for="cat in categories" :key="cat.id" :value="cat.id"
                                  :label="cat.category_name">
                                  {{ cat.category_name }}
                                </a-select-option>
                              </a-select>
                            </a-form-item>
                          </a-col>
                          <a-col :xs="24" :md="12">
                            <a-form-item label="Product Type">
                              <a-select v-model:value="formState.product_type" size="large">
                                <a-select-option value="PHYSICAL">
                                  <InboxOutlined /> Physical Product
                                </a-select-option>
                                <a-select-option value="DIGITAL">
                                  <CloudUploadOutlined /> Digital Product
                                </a-select-option>
                              </a-select>
                            </a-form-item>
                          </a-col>
                        </a-row>

                        <a-form-item label="Product Tags">
                          <a-select v-model:value="additionalSettings.tags" mode="tags"
                            placeholder="Add tags (press Enter to add)" size="large" :max-tag-count="5" />
                          <div class="form-hint">
                            Tags help customers find your product. Add relevant keywords.
                          </div>
                        </a-form-item>
                      </div>
                    </div>
                  </a-form>
                </a-tab-pane>

                <a-tab-pane key="pricing">
                  <template #tab>
                    <span class="tab-label">
                      <DollarOutlined />
                      Pricing
                    </span>
                  </template>

                  <div class="form-card">
                    <div class="card-header">
                      <h3>Price Configuration</h3>
                      <p>Set your product pricing</p>
                    </div>
                    <div class="card-body">
                      <a-row :gutter="16">
                        <a-col :xs="24" :md="8">
                          <a-form-item label="Base Price" name="base_price">
                            <a-input-number v-model:value="formState.base_price" :min="0" :precision="2"
                              :style="{ width: '100%' }" size="large">
                              <template #addonBefore>৳</template>
                            </a-input-number>
                          </a-form-item>
                        </a-col>
                        <a-col :xs="24" :md="8">
                          <a-form-item label="Sale Price (Optional)" name="sale_price">
                            <a-input-number v-model:value="formState.sale_price" :min="0" :precision="2"
                              :style="{ width: '100%' }" size="large" placeholder="Leave empty for no sale">
                              <template #addonBefore>৳</template>
                            </a-input-number>
                          </a-form-item>
                        </a-col>
                        <a-col :xs="24" :md="8">
                          <a-form-item label="Tax Rate (%)" name="tax_rate">
                            <a-input-number v-model:value="additionalSettings.tax_rate" :min="0" :max="100"
                              :precision="2" :style="{ width: '100%' }" size="large">
                              <template #addonAfter>%</template>
                            </a-input-number>
                          </a-form-item>
                        </a-col>
                      </a-row>

                      <a-form-item>
                        <a-checkbox v-model:checked="additionalSettings.tax_included">
                          Price includes tax
                        </a-checkbox>
                      </a-form-item>

                      <!-- Savings Preview -->
                      <div v-if="savingsAmount > 0" class="savings-preview">
                        <div class="savings-badge">
                          <span class="savings-label">Customer Saves</span>
                          <span class="savings-amount">৳{{ savingsAmount.toFixed(2) }}</span>
                          <span class="savings-percentage">{{ savingsPercentage }}% OFF</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Variants Section -->
                  <div class="form-card">
                    <div class="card-header">
                      <h3>Product Variants</h3>
                      <p>Create different options like size, color, etc.</p>
                    </div>
                    <div class="card-body">
                      <div v-for="variant in variants" :key="variant.id" class="variant-row">
                        <a-row :gutter="16">
                          <a-col :span="8">
                            <a-input v-model:value="variant.name" placeholder="Variant name (e.g., Size)" />
                          </a-col>
                          <a-col :span="14">
                            <a-select v-model:value="variant.values" mode="tags"
                              placeholder="Values (e.g., S, M, L, XL)" :style="{ width: '100%' }" />
                          </a-col>
                          <a-col :span="2">
                            <a-button danger @click="removeVariant(variant.id)">
                              <DeleteOutlined />
                            </a-button>
                          </a-col>
                        </a-row>
                      </div>
                      <a-button type="dashed" block @click="addVariant">
                        <PlusOutlined />
                        Add Variant
                      </a-button>
                    </div>
                  </div>
                </a-tab-pane>

                <a-tab-pane key="inventory">
                  <template #tab>
                    <span class="tab-label">
                      <InboxOutlined />
                      Inventory
                    </span>
                  </template>

                  <div class="form-card">
                    <div class="card-header">
                      <h3>Stock Management</h3>
                      <p>Track and manage inventory</p>
                    </div>
                    <div class="card-body">
                      <a-form-item>
                        <a-checkbox v-model:checked="formState.track_inventory">
                          <strong>Track inventory for this product</strong>
                        </a-checkbox>
                        <div class="form-hint">
                          Enable this to track stock levels and receive low stock alerts
                        </div>
                      </a-form-item>

                      <div v-if="formState.track_inventory" class="inventory-fields">
                        <a-row :gutter="16">
                          <a-col :xs="24" :md="12">
                            <a-form-item label="Stock Quantity" name="stock_quantity">
                              <a-input-number v-model:value="formState.stock_quantity" :min="0"
                                :style="{ width: '100%' }" size="large" placeholder="Available units" />
                            </a-form-item>
                          </a-col>
                          <a-col :xs="24" :md="12">
                            <a-form-item label="Low Stock Alert Threshold" name="low_stock_threshold">
                              <a-input-number v-model:value="formState.low_stock_threshold" :min="0"
                                :style="{ width: '100%' }" size="large" placeholder="Alert when stock is low" />
                              <div class="form-hint">
                                You'll be notified when stock falls below this number
                              </div>
                            </a-form-item>
                          </a-col>
                        </a-row>

                        <!-- Stock Status Indicator -->
                        <div class="stock-status">
                          <div v-if="(formState.stock_quantity ?? 0) > (formState.low_stock_threshold ?? 0)"
                            class="status-good">
                            <CheckCircleOutlined />
                            Stock level is healthy
                          </div>
                          <div v-else-if="(formState.stock_quantity ?? 0) > 0" class="status-warning">
                            <ClockCircleOutlined />
                            Low stock alert
                          </div>
                          <div v-else class="status-danger">
                            <CloseCircleOutlined />
                            Out of stock
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Shipping Configuration -->
                  <div v-if="formState.product_type === 'PHYSICAL'" class="form-card">
                    <div class="card-header">
                      <h3>Shipping Details</h3>
                      <p>Physical product shipping information</p>
                    </div>
                    <div class="card-body">
                      <a-row :gutter="16">
                        <a-col :xs="24" :md="12">
                          <a-form-item label="Weight (kg)">
                            <a-input-number v-model:value="additionalSettings.weight" :min="0" :precision="2"
                              :style="{ width: '100%' }" placeholder="Product weight" />
                          </a-form-item>
                        </a-col>
                        <a-col :xs="24" :md="12">
                          <a-form-item>
                            <a-checkbox v-model:checked="additionalSettings.shipping_required">
                              Shipping Required
                            </a-checkbox>
                          </a-form-item>
                        </a-col>
                      </a-row>

                      <a-form-item label="Dimensions (cm)">
                        <a-row :gutter="8">
                          <a-col :span="8">
                            <a-input-number v-model:value="additionalSettings.dimensions.length" :min="0"
                              :style="{ width: '100%' }" placeholder="Length" />
                          </a-col>
                          <a-col :span="8">
                            <a-input-number v-model:value="additionalSettings.dimensions.width" :min="0"
                              :style="{ width: '100%' }" placeholder="Width" />
                          </a-col>
                          <a-col :span="8">
                            <a-input-number v-model:value="additionalSettings.dimensions.height" :min="0"
                              :style="{ width: '100%' }" placeholder="Height" />
                          </a-col>
                        </a-row>
                      </a-form-item>
                    </div>
                  </div>
                </a-tab-pane>

                <a-tab-pane key="media">
                  <template #tab>
                    <span class="tab-label">
                      <PictureOutlined />
                      Media
                    </span>
                  </template>

                  <div class="form-card">
                    <div class="card-header">
                      <h3>Product Images</h3>
                      <p>Upload high-quality images (recommended: 1200x1200px)</p>
                    </div>
                    <div class="card-body">
                      <a-upload v-model:file-list="imageList" list-type="picture-card" :multiple="true" :max-count="10"
                        action="#" @change="handleImageUpload" class="product-upload">
                        <div class="upload-trigger">
                          <PlusOutlined />
                          <div class="upload-text">Upload Image</div>
                        </div>
                      </a-upload>
                      <div class="upload-hints">
                        <p>• First image will be the featured image</p>
                        <p>• Maximum 10 images</p>
                        <p>• Supported formats: JPG, PNG, WebP</p>
                        <p>• Recommended size: 1200x1200px for best quality</p>
                      </div>
                    </div>
                  </div>
                </a-tab-pane>

                <a-tab-pane key="specifications">
                  <template #tab>
                    <span class="tab-label">
                      <SettingOutlined />
                      Specifications
                    </span>
                  </template>

                  <div class="form-card">
                    <div class="card-header">
                      <h3>Product Specifications</h3>
                      <p>Add detailed technical specifications</p>
                    </div>
                    <div class="card-body">
                      <div v-for="spec in specifications" :key="spec.id" class="spec-row">
                        <a-row :gutter="16">
                          <a-col :span="10">
                            <a-input v-model:value="spec.name" placeholder="Specification name" />
                          </a-col>
                          <a-col :span="12">
                            <a-input v-model:value="spec.value" placeholder="Value" />
                          </a-col>
                          <a-col :span="2">
                            <a-button danger @click="removeSpecification(spec.id)">
                              <DeleteOutlined />
                            </a-button>
                          </a-col>
                        </a-row>
                      </div>
                      <a-button type="dashed" block @click="addSpecification">
                        <PlusOutlined />
                        Add Specification
                      </a-button>
                    </div>
                  </div>
                </a-tab-pane>

                <a-tab-pane key="seo">
                  <template #tab>
                    <span class="tab-label">
                      <SearchOutlined />
                      SEO
                    </span>
                  </template>

                  <div class="form-card">
                    <div class="card-header">
                      <h3>Search Engine Optimization</h3>
                      <p>Improve your product's visibility in search results</p>
                    </div>
                    <div class="card-body">
                      <a-form-item label="Meta Title" name="meta_title">
                        <a-input v-model:value="formState.meta_title" placeholder="SEO-optimized title" show-count
                          :maxlength="70" size="large" />
                        <div class="form-hint">
                          Recommended: 50-60 characters. Include your main keyword.
                        </div>
                      </a-form-item>

                      <a-form-item label="Meta Description" name="meta_description">
                        <a-textarea v-model:value="formState.meta_description"
                          placeholder="Compelling description for search results" :rows="4" show-count
                          :maxlength="160" />
                        <div class="form-hint">
                          Recommended: 150-160 characters. Write a compelling summary.
                        </div>
                      </a-form-item>

                      <!-- SEO Preview -->
                      <div class="seo-preview">
                        <div class="preview-label">Search Result Preview:</div>
                        <div class="preview-box">
                          <div class="preview-title">
                            {{ formState.meta_title || formState.name || 'Your Product Title' }}
                          </div>
                          <div class="preview-url">
                            https://yourstore.com/products/{{ formState.slug || 'product-slug' }}
                          </div>
                          <div class="preview-description">
                            {{ formState.meta_description || formState.short_description }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </a-tab-pane>
              </a-tabs>
            </div>
          </a-col>

          <!-- Sidebar -->
          <a-col :xs="24" :xl="7">
            <div class="sidebar-sticky">
              <!-- Status Card -->
              <div class="sidebar-card status-card">
                <div class="card-header">
                  <h3>Publication Status</h3>
                </div>
                <div class="card-body">
                  <div class="status-row">
                    <span class="status-label">Visibility</span>
                    <a-switch v-model:checked="formState.is_published" checked-children="Published"
                      un-checked-children="Draft" size="large" />
                  </div>
                  <div class="status-row">
                    <span class="status-label">Featured Product</span>
                    <a-switch v-model:checked="formState.is_featured" checked-children="Yes" un-checked-children="No" />
                  </div>

                  <a-divider />

                  <div class="status-info">
                    <div v-if="formState.is_published" class="published-status">
                      <CheckCircleOutlined class="status-icon success" />
                      <div>
                        <div class="status-title">Published</div>
                        <div class="status-desc">Visible to customers</div>
                      </div>
                    </div>
                    <div v-else class="draft-status">
                      <ClockCircleOutlined class="status-icon warning" />
                      <div>
                        <div class="status-title">Draft</div>
                        <div class="status-desc">Not visible to customers</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Quick Summary -->
              <div class="sidebar-card summary-card">
                <div class="card-header">
                  <h3>Quick Summary</h3>
                </div>
                <div class="card-body">
                  <div class="summary-item">
                    <span class="summary-label">Price</span>
                    <span class="summary-value">৳{{ formState.base_price.toFixed(2) }}</span>
                  </div>
                  <div v-if="formState.sale_price" class="summary-item">
                    <span class="summary-label">Sale Price</span>
                    <span class="summary-value sale">৳{{ formState.sale_price.toFixed(2) }}</span>
                  </div>
                  <div v-if="formState.track_inventory" class="summary-item">
                    <span class="summary-label">Stock</span>
                    <span class="summary-value">{{ formState.stock_quantity }} units</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">SKU</span>
                    <span class="summary-value">{{ formState.sku || 'Not set' }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Type</span>
                    <span class="summary-value">{{ formState.product_type }}</span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="sidebar-card actions-card">
                <div class="card-body">
                  <a-button block size="large" @click="saveDraft" :loading="autoSaving">
                    <SaveOutlined />
                    Save as Draft
                  </a-button>
                  <a-button block size="large" type="primary" :loading="saving" @click="handleSubmit(false)"
                    class="save-btn">
                    <SaveOutlined />
                    {{ isEdit ? 'Update Product' : 'Create Product' }}
                  </a-button>
                </div>
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
    </template>


    <!-- Preview Modal -->
    <a-modal v-model:visible="previewVisible" title="Product Preview" width="800px" :footer="null">
      <div class="product-preview">
        <h2>{{ formState.name || 'Product Name' }}</h2>
        <p class="preview-price">
          <span v-if="formState.sale_price" class="sale-price">৳{{ formState.sale_price }}</span>
          <span :class="{ 'original-price': formState.sale_price }">৳{{ formState.base_price }}</span>
        </p>
        <p>{{ formState.short_description }}</p>
        <div class="preview-description">
          {{ formState.description }}
        </div>
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
.product-form-page {
  min-height: 100vh;
  background: var(--background);
  padding-bottom: 40px;
}

.product-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--background);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  gap: 16px;
  flex-wrap: wrap;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.back-btn:hover {
  background: var(--primary);
  color: white;
  transform: translateX(-4px);
}

.header-title h1 {
  font-size: 24px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0 0 4px 0;
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  color: var(--muted-foreground);
}

.progress-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

.complete-icon {
  color: oklch(0.65 0.19 164);
}

.pending-icon {
  color: oklch(0.75 0.15 85);
}

.last-saved,
.auto-saving {
  display: flex;
  align-items: center;
  gap: 6px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.publish-btn {
  background: linear-gradient(135deg, oklch(0.65 0.19 164) 0%, oklch(0.55 0.19 174) 100%) !important;
  border: none !important;
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.3);
}

.publish-btn:hover {
  box-shadow: 0 6px 20px rgba(13, 148, 136, 0.4);
  transform: translateY(-2px);
}

.progress-bar {
  height: 3px;
  background: var(--border);
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, oklch(0.65 0.19 164), oklch(0.55 0.19 174));
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

.form-content {
  padding: 24px;
  max-width: 1800px;
  margin: 0 auto;
}

.tabs-wrapper {
  background: var(--card);
  border-radius: 12px;
  border: 1px solid var(--border);
  overflow: hidden;
}

.product-tabs :deep(.ant-tabs-nav) {
  background: var(--background);
  padding: 0 24px;
  margin: 0;
}

.product-tabs :deep(.ant-tabs-tab) {
  padding: 16px 24px;
  font-weight: 500;
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.product-tabs :deep(.ant-tabs-ink-bar) {
  background: oklch(0.65 0.19 164);
  height: 3px;
}

.product-tabs :deep(.ant-tabs-content) {
  padding: 24px;
}

.form-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  margin-bottom: 24px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.form-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: oklch(0.65 0.19 164);
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(135deg, rgba(13, 148, 136, 0.05) 0%, transparent 100%);
}

.card-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 4px 0;
}

.card-header p {
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
}

.card-body {
  padding: 24px;
}

.form-item-large :deep(.ant-input) {
  font-size: 16px;
  font-weight: 500;
}

.form-hint {
  margin-top: 8px;
  font-size: 13px;
  color: var(--muted-foreground);
  display: flex;
  align-items: center;
  gap: 4px;
}

.savings-preview {
  margin-top: 24px;
  padding: 20px;
  background: linear-gradient(135deg, oklch(0.97 0.02 164) 0%, oklch(0.95 0.03 174) 100%);
  border: 2px dashed oklch(0.65 0.19 164);
  border-radius: 12px;
}

.savings-badge {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 16px;
}

.savings-label {
  font-size: 14px;
  color: var(--muted-foreground);
  font-weight: 500;
}

.savings-amount {
  font-size: 28px;
  font-weight: 700;
  color: oklch(0.65 0.19 164);
}

.savings-percentage {
  padding: 6px 12px;
  background: oklch(0.65 0.19 164);
  color: white;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
}

.variant-row,
.spec-row {
  margin-bottom: 12px;
}

.inventory-fields {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}

.stock-status {
  margin-top: 16px;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-good {
  background: oklch(0.95 0.05 164);
  color: oklch(0.45 0.19 164);
  padding: 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.status-warning {
  background: oklch(0.95 0.08 85);
  color: oklch(0.55 0.15 85);
  padding: 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.status-danger {
  background: oklch(0.95 0.08 25);
  color: oklch(0.55 0.22 25);
  padding: 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.product-upload :deep(.ant-upload-list-picture-card-container) {
  width: 150px;
  height: 150px;
}

.upload-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.upload-text {
  font-size: 13px;
  color: var(--muted-foreground);
}

.upload-hints {
  margin-top: 16px;
  padding: 16px;
  background: var(--background);
  border-radius: 8px;
  font-size: 13px;
  color: var(--muted-foreground);
}

.upload-hints p {
  margin: 4px 0;
}

.seo-preview {
  margin-top: 24px;
}

.preview-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  margin-bottom: 12px;
}

.preview-box {
  padding: 20px;
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 8px;
}

.preview-title {
  font-size: 18px;
  font-weight: 500;
  color: oklch(0.5 0.18 264);
  margin-bottom: 4px;
  cursor: pointer;
}

.preview-title:hover {
  text-decoration: underline;
}

.preview-url {
  font-size: 14px;
  color: oklch(0.45 0.19 164);
  margin-bottom: 8px;
}

.preview-description {
  font-size: 14px;
  color: var(--muted-foreground);
  line-height: 1.6;
}

.sidebar-sticky {
  position: sticky;
  top: 100px;
}

.sidebar-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  margin-bottom: 16px;
  overflow: hidden;
}

.status-card {
  border: 2px solid oklch(0.65 0.19 164);
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.status-label {
  font-weight: 500;
  color: var(--foreground);
}

.status-info {
  margin-top: 12px;
}

.published-status,
.draft-status {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
}

.published-status {
  background: oklch(0.95 0.05 164);
}

.draft-status {
  background: var(--background);
}

.status-icon {
  font-size: 24px;
}

.status-icon.success {
  color: oklch(0.65 0.19 164);
}

.status-icon.warning {
  color: oklch(0.75 0.15 85);
}

.status-title {
  font-weight: 600;
  color: var(--foreground);
}

.status-desc {
  font-size: 13px;
  color: var(--muted-foreground);
}

.summary-card {
  border: 1px solid var(--border);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-label {
  font-size: 14px;
  color: var(--muted-foreground);
}

.summary-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
}

.summary-value.sale {
  color: oklch(0.65 0.19 164);
}

.actions-card .card-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.save-btn {
  background: linear-gradient(135deg, oklch(0.65 0.19 164) 0%, oklch(0.55 0.19 174) 100%) !important;
  border: none !important;
}

.product-preview {
  padding: 20px;
}

.product-preview h2 {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 16px;
}

.preview-price {
  font-size: 28px;
  font-weight: 700;
  color: oklch(0.65 0.19 164);
  margin-bottom: 16px;
}

.sale-price {
  color: oklch(0.55 0.22 25);
  margin-right: 12px;
}

.original-price {
  font-size: 20px;
  text-decoration: line-through;
  color: var(--muted-foreground);
}

.preview-description {
  margin-top: 16px;
  line-height: 1.8;
  color: var(--foreground);
}

@media (max-width: 1200px) {
  .sidebar-sticky {
    position: static;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions button {
    flex: 1;
  }

  .form-content {
    padding: 16px;
  }
}
</style>
