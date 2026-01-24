<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storesApi, type CreateStoreDto } from '@/modules/stores/api/stores'
import { SaveOutlined, ArrowLeftOutlined, ShopOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, GlobalOutlined, DollarOutlined, AppstoreOutlined, PictureOutlined, SearchOutlined, TranslationOutlined, LinkOutlined, BgColorsOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import FormSkeleton from '@/modules/shared/components/skeletons/FormSkeleton.vue'
import type { FormInstance } from 'ant-design-vue'
import { useStoreStore } from '@/modules/stores/store/store'
import type { MediaFile } from '@/modules/media/services/media.service'
import { configuration } from '@/modules/shared/config/configruation'

const router = useRouter()
const route = useRoute()
const storeStore = useStoreStore()

const isEdit = computed(() => !!route.params.id)
const storeId = computed(() => route.params.id ? Number(route.params.id) : null)

const loading = ref(false)
const saving = ref(false)
const formRef = ref<FormInstance>()
const customDomain = ref('')

const mediaModalVisible = ref(false);
const mediaUsingFor = ref('');
const logo = ref<MediaFile | null | undefined>(null);
const favicon = ref<MediaFile | null | undefined>(null);
const bannerImage = ref<MediaFile | null | undefined>(null);

const handleUseSelected = (files: { usingFor: string, files: MediaFile[] }) => {
  console.log(files)
  if (files.usingFor === 'logo') {
    logo.value = files.files[0]
    formState.value.logo_id = files.files[0]?.id
  } else if (files.usingFor === 'favicon') {
    favicon.value = files.files[0]
    formState.value.favicon_id = files.files[0]?.id
  } else if (files.usingFor === 'banner') {
    bannerImage.value = files.files[0]
    formState.value.banner_image_id = files.files[0]?.id
    formState.value.banner_image_url = files.files[0]?.url
  }
  mediaModalVisible.value = false;
}

const formState = ref<CreateStoreDto>({
  name: '',
  slug: '',
  store_category_id: 1,
  description: '',
  tagline: '',
  email: '',
  phone: '',
  address: '',
  currency: 'BDT',
  timezone: 'Asia/Dhaka',
  logo_id: 0,
  favicon_id: 0,
  // SEO
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
  // Localization
  default_language: 'en',
  supported_languages: '',
  // Extended Branding
  primary_color: '#1890ff',
  secondary_color: '#52c41a',
  banner_image_id: null,
  banner_image_url: ''
})

const rules = {
  name: [{ required: true, message: 'Store name is required', trigger: 'blur' }],
  slug: [
    { required: true, message: 'Slug is required', trigger: 'blur' },
    { pattern: /^[a-z0-9-]+$/, message: 'Slug must be lowercase alphanumeric with hyphens', trigger: 'blur' }
  ],
  store_category_id: [{ required: true, message: 'Category is required' }],
  email: [{ type: 'email', message: 'Please enter a valid email', trigger: 'blur' }],
  meta_title: [{ max: 100, message: 'Meta title must be less than 100 characters', trigger: 'blur' }],
  meta_description: [{ max: 500, message: 'Meta description must be less than 500 characters', trigger: 'blur' }],
  meta_keywords: [{ max: 255, message: 'Meta keywords must be less than 255 characters', trigger: 'blur' }],
  default_language: [{ required: true, message: 'Default language is required' }],
}

const openMediaLibrary = (usingFor: string) => {
  mediaUsingFor.value = usingFor;
  mediaModalVisible.value = true;
}

async function fetchStore(id: number) {
  loading.value = true
  try {
    const store = await storesApi.getById(id)
    if (store.logo) {
      logo.value = { id: store.logo.id, originalName: store.logo.filename, fileName: store.logo.filename, mimeType: "", fileSize: 0, url: store.logo.url, folderId: 0, createdAt: "", updatedAt: "", alt: "", fileType: "", title: "", width: 0, height: 0, thumbnailUrl: "", storeId: 0, userId: 0 }
    }
    if (store.favicon) {
      favicon.value = { id: store.favicon.id, originalName: store.favicon.filename, fileName: store.favicon.filename, mimeType: "", fileSize: 0, url: store.favicon.url, folderId: 0, createdAt: "", updatedAt: "", alt: "", fileType: "", title: "", width: 0, height: 0, thumbnailUrl: "", storeId: 0, userId: 0 }
    }
    formState.value = {
      name: store.name,
      slug: store.slug,
      store_category_id: store.store_category_id,
      description: store.description || '',
      tagline: store.tagline || '',
      email: store.email || '',
      phone: store.phone || '',
      address: store.address || '',
      currency: store.currency || 'BDT',
      timezone: store.timezone || 'Asia/Dhaka',
      logo_id: store.logo_id || 0,
      favicon_id: store.favicon_id || 0,
      // SEO
      meta_title: store.meta_title || '',
      meta_description: store.meta_description || '',
      meta_keywords: store.meta_keywords || '',
      // Localization
      default_language: store.default_language || 'en',
      supported_languages: store.supported_languages || '',
      // Extended Branding
      primary_color: store.primary_color || '#1890ff',
      secondary_color: store.secondary_color || '#52c41a',
      banner_image_id: store.banner_image_id || null,
      banner_image_url: store.banner_image_url || ''
    }
    // Set custom domain if exists
    if (store.custom_domain) {
      customDomain.value = store.custom_domain
    }
  } catch (error) {
    message.error('Failed to fetch store details')
    console.error(error)
    router.push('/stores')
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  try {
    await formRef.value?.validate()
    saving.value = true

    if (isEdit.value && storeId.value) {
      await storesApi.update(storeId.value, formState.value)
      message.success('Store updated successfully')
    } else {
      await storesApi.create(formState.value)
      message.success('Store created successfully')
    }

    router.push('/stores')
  } catch (error: any) {
    if (error.errorFields) {
      message.error('Please check the form for errors')
    } else {
      message.error('Failed to save store')
      console.error(error)
    }
  } finally {
    saving.value = false
  }
}

function generateSlug() {
  if (!formState.value.name) return
  formState.value.slug = formState.value.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const getCategoryStore = async () => {
  await storeStore.fetStoreCategories()
}

onMounted(async () => {
  await getCategoryStore()
  if (isEdit.value && storeId.value) {
    await fetchStore(storeId.value)
  }
})
</script>

<template>
  <a-modal v-model:visible="mediaModalVisible" width="80%">
    <MainMedia @file-selected="handleUseSelected" :isSelectMode="true" :usingFor="mediaUsingFor" />
  </a-modal>

  <div class="store-form-container">
    <FormSkeleton v-if="loading" :field-count="8" />
    <template v-else>
      <!-- Professional gradient header with better visual hierarchy -->
      <div class="page-header">
        <div class="header-gradient"></div>
        <div class="header-content">
          <a-button class="back-button" type="text" @click="router.push('/stores')">
            <template #icon>
              <ArrowLeftOutlined />
            </template>
          </a-button>
          <div class="header-text">
            <div class="page-subtitle">Store Management</div>
            <h1 class="page-title">
              <ShopOutlined class="title-icon" />
              {{ isEdit ? 'Edit Store' : 'Create New Store' }}
            </h1>
            <p class="page-description">
              {{ isEdit ? 'Update your store information and branding' : 'Set up your new online store with' }}
            </p>
          </div>
        </div>
        <div class="header-actions">
          <a-space :size="12">
            <a-button size="large" @click="router.push('/stores')">
              <span>Cancel</span>
            </a-button>
            <a-button type="primary" size="large" :loading="saving" @click="handleSubmit">
              <template #icon>
                <SaveOutlined />
              </template>
              {{ isEdit ? 'Update Store' : 'Create Store' }}
            </a-button>
          </a-space>
        </div>
      </div>

      <div class="form-layout">
        <!-- Main form content with improved card design -->
        <div class="form-main">
          <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">

            <!-- Enhanced branding section with better image upload UI -->
            <a-card :bordered="false" class="form-section">
              <div class="section-header">
                <div class="section-icon-wrapper">
                  <PictureOutlined class="section-icon" />
                </div>
                <div>
                  <h2 class="section-title">Store Branding</h2>
                  <p class="section-description">Upload your logo and favicon to build brand identity</p>
                </div>
              </div>

              <a-row :gutter="[24, 24]">
                <a-col :xs="24" :sm="12">
                  <a-form-item label="Store Logo" name="logo">
                    <div class="image-upload-wrapper">
                      <div v-if="!logo" class="upload-empty" @click="openMediaLibrary('logo')">
                        <div class="upload-icon-circle">
                          <PictureOutlined />
                        </div>
                        <div class="upload-text">Click to upload logo</div>
                        <div class="upload-hint">Recommended: 200x200px, PNG or JPG</div>
                      </div>
                      <div v-else class="upload-preview">
                        <a-image :width="120" :height="120" :src="configuration.API_BASE_URL + logo?.url" alt="logo"
                          class="preview-image" />
                        <div class="preview-actions">
                          <a-button type="primary" size="small" @click="openMediaLibrary('logo')">
                            Change
                          </a-button>
                          <a-button danger size="small" @click="logo = null">
                            Remove
                          </a-button>
                        </div>
                      </div>
                    </div>
                  </a-form-item>
                </a-col>

                <a-col :xs="24" :sm="12">
                  <a-form-item label="Store Favicon" name="favicon">
                    <div class="image-upload-wrapper">
                      <div v-if="!favicon" class="upload-empty" @click="openMediaLibrary('favicon')">
                        <div class="upload-icon-circle">
                          <PictureOutlined />
                        </div>
                        <div class="upload-text">Click to upload favicon</div>
                        <div class="upload-hint">Recommended: 32x32px, ICO or PNG</div>
                      </div>
                      <div v-else class="upload-preview">
                        <a-image :width="120" :height="120" :src="configuration.API_BASE_URL + favicon?.url"
                          alt="favicon" class="preview-image" />
                        <div class="preview-actions">
                          <a-button type="primary" size="small" @click="openMediaLibrary('favicon')">
                            Change
                          </a-button>
                          <a-button danger size="small" @click="favicon = null">
                            Remove
                          </a-button>
                        </div>
                      </div>
                    </div>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>

            <!-- Enhanced basic information section -->
            <a-card :bordered="false" class="form-section">
              <div class="section-header">
                <div class="section-icon-wrapper">
                  <AppstoreOutlined class="section-icon" />
                </div>
                <div>
                  <h2 class="section-title">Basic Information</h2>
                  <p class="section-description">Provide essential details about your store</p>
                </div>
              </div>

              <a-row :gutter="[16, 0]">
                <a-col :xs="24" :lg="12">
                  <a-form-item label="Store Name" name="name">
                    <a-input v-model:value="formState.name" size="large" placeholder="Enter your store name"
                      @blur="!isEdit && generateSlug()" />
                  </a-form-item>
                </a-col>

                <a-col :xs="24" :lg="12">
                  <a-form-item label="Store Category" name="store_category_id">
                    <a-select v-model:value="formState.store_category_id" size="large" placeholder="Select a category">
                      <a-select-option v-for="storeCategory in storeStore.storeCategories" :key="storeCategory.id"
                        :value="storeCategory.id">
                        {{ storeCategory.name }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>

                <a-col :span="24">
                  <a-form-item label="Tagline" name="tagline">
                    <a-input v-model:value="formState.tagline" size="large"
                      placeholder="A short, catchy phrase that describes your store" :maxlength="100" show-count />
                  </a-form-item>
                </a-col>

                <a-col :span="24">
                  <a-form-item label="Description" name="description">
                    <a-textarea v-model:value="formState.description" :rows="4"
                      placeholder="Tell customers about your store..." show-count :maxlength="500" />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>

            <!-- Enhanced URL section with preview -->
            <a-card :bordered="false" class="form-section">
              <div class="section-header">
                <div class="section-icon-wrapper">
                  <GlobalOutlined class="section-icon" />
                </div>
                <div>
                  <h2 class="section-title">URL & Domain</h2>
                  <p class="section-description">Configure your store's web address</p>
                </div>
              </div>

              <a-row :gutter="[16, 0]">
                <a-col :xs="24" :lg="12">
                  <a-form-item label="URL Slug" name="slug">
                    <a-input v-model:value="formState.slug" size="large" placeholder="my-awesome-store" />
                    <div class="url-preview">
                      <GlobalOutlined />
                      <span>{{ formState.slug || 'your-store' }}.adaptixinnovate.com</span>
                    </div>
                  </a-form-item>
                </a-col>

                <a-col :xs="24" :lg="12">
                  <a-form-item label="Custom Domain">
                    <a-input v-model:value="customDomain" size="large" placeholder="www.yourstore.com" disabled />
                    <div class="premium-notice">
                      <span class="premium-badge">Premium Feature</span>
                      <span class="premium-text">Upgrade to use custom domain</span>
                    </div>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>

            <!-- Enhanced contact section -->
            <a-card :bordered="false" class="form-section">
              <div class="section-header">
                <div class="section-icon-wrapper">
                  <MailOutlined class="section-icon" />
                </div>
                <div>
                  <h2 class="section-title">Contact Information</h2>
                  <p class="section-description">How customers can reach you</p>
                </div>
              </div>

              <a-row :gutter="[16, 0]">
                <a-col :xs="24" :lg="8">
                  <a-form-item label="Email Address" name="email">
                    <a-input v-model:value="formState.email" size="large" type="email"
                      placeholder="contact@yourstore.com">
                      <template #prefix>
                        <MailOutlined />
                      </template>
                    </a-input>
                  </a-form-item>
                </a-col>

                <a-col :xs="24" :lg="8">
                  <a-form-item label="Phone Number" name="phone">
                    <a-input v-model:value="formState.phone" size="large" placeholder="+880 1234-567890">
                      <template #prefix>
                        <PhoneOutlined />
                      </template>
                    </a-input>
                  </a-form-item>
                </a-col>

                <a-col :xs="24" :lg="8">
                  <a-form-item label="Business Address" name="address">
                    <a-input v-model:value="formState.address" size="large" placeholder="Your business address">
                      <template #prefix>
                        <EnvironmentOutlined />
                      </template>
                    </a-input>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>

            <!-- Enhanced regional settings -->
            <a-card :bordered="false" class="form-section">
              <div class="section-header">
                <div class="section-icon-wrapper">
                  <DollarOutlined class="section-icon" />
                </div>
                <div>
                  <h2 class="section-title">Regional Settings</h2>
                  <p class="section-description">Configure currency and timezone preferences</p>
                </div>
              </div>

              <a-row :gutter="[16, 0]">
                <a-col :xs="24" :lg="12">
                  <a-form-item label="Currency" name="currency">
                    <a-select v-model:value="formState.currency" size="large">
                      <a-select-option value="BDT">🇧🇩 Bangladeshi Taka (BDT)</a-select-option>
                      <a-select-option value="USD">🇺🇸 US Dollar (USD)</a-select-option>
                      <a-select-option value="EUR">🇪🇺 Euro (EUR)</a-select-option>
                      <a-select-option value="GBP">🇬🇧 British Pound (GBP)</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>

                <a-col :xs="24" :lg="12">
                  <a-form-item label="Timezone" name="timezone">
                    <a-select v-model:value="formState.timezone" size="large" show-search>
                      <a-select-option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</a-select-option>
                      <a-select-option value="America/New_York">America/New_York (EST)</a-select-option>
                      <a-select-option value="Europe/London">Europe/London (GMT)</a-select-option>
                      <a-select-option value="Asia/Tokyo">Asia/Tokyo (JST)</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>

            <!-- SEO Settings Section -->
            <a-card :bordered="false" class="form-section">
              <div class="section-header">
                <div class="section-icon-wrapper">
                  <SearchOutlined class="section-icon" />
                </div>
                <div>
                  <h2 class="section-title">SEO Settings</h2>
                  <p class="section-description">Optimize your store for search engines</p>
                </div>
              </div>

              <a-row :gutter="[16, 0]">
                <a-col :span="24">
                  <a-form-item label="Meta Title" name="meta_title">
                    <a-input v-model:value="formState.meta_title" size="large"
                      placeholder="Store title for search engines" :maxlength="100" show-count />
                    <div class="field-hint">Recommended: 50-60 characters for optimal display in search results</div>
                  </a-form-item>
                </a-col>

                <a-col :span="24">
                  <a-form-item label="Meta Description" name="meta_description">
                    <a-textarea v-model:value="formState.meta_description" :rows="3"
                      placeholder="Brief description of your store for search engine results" :maxlength="500"
                      show-count />
                    <div class="field-hint">Recommended: 150-160 characters for optimal display</div>
                  </a-form-item>
                </a-col>

                <a-col :span="24">
                  <a-form-item label="Meta Keywords" name="meta_keywords">
                    <a-input v-model:value="formState.meta_keywords" size="large"
                      placeholder="keyword1, keyword2, keyword3" :maxlength="255" />
                    <div class="field-hint">Comma-separated keywords related to your store</div>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>

            <!-- Localization Settings Section -->
            <a-card :bordered="false" class="form-section">
              <div class="section-header">
                <div class="section-icon-wrapper">
                  <TranslationOutlined class="section-icon" />
                </div>
                <div>
                  <h2 class="section-title">Localization</h2>
                  <p class="section-description">Configure language preferences for your store</p>
                </div>
              </div>

              <a-row :gutter="[16, 0]">
                <a-col :xs="24" :lg="12">
                  <a-form-item label="Default Language" name="default_language">
                    <a-select v-model:value="formState.default_language" size="large">
                      <a-select-option value="en">🇺🇸 English</a-select-option>
                      <a-select-option value="bn">🇧🇩 Bengali</a-select-option>
                      <a-select-option value="es">🇪🇸 Spanish</a-select-option>
                      <a-select-option value="fr">🇫🇷 French</a-select-option>
                      <a-select-option value="de">🇩🇪 German</a-select-option>
                      <a-select-option value="ar">🇸🇦 Arabic</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>

                <a-col :xs="24" :lg="12">
                  <a-form-item label="Supported Languages" name="supported_languages">
                    <a-input v-model:value="formState.supported_languages" size="large" placeholder="en,bn,es" />
                    <div class="field-hint">Comma-separated language codes (e.g., en,bn,es)</div>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>

            <!-- Extended Branding Colors Section -->
            <a-card :bordered="false" class="form-section">
              <div class="section-header">
                <div class="section-icon-wrapper">
                  <BgColorsOutlined class="section-icon" />
                </div>
                <div>
                  <h2 class="section-title">Brand Colors</h2>
                  <p class="section-description">Define your store's color scheme</p>
                </div>
              </div>

              <a-row :gutter="[16, 16]">
                <a-col :xs="24" :lg="12">
                  <a-form-item label="Primary Color" name="primary_color">
                    <div class="color-picker-wrapper">
                      <input type="color" v-model="formState.primary_color" class="color-input" />
                      <a-input v-model:value="formState.primary_color" size="large" placeholder="#1890ff"
                        style="flex: 1" />
                    </div>
                  </a-form-item>
                </a-col>

                <a-col :xs="24" :lg="12">
                  <a-form-item label="Secondary Color" name="secondary_color">
                    <div class="color-picker-wrapper">
                      <input type="color" v-model="formState.secondary_color" class="color-input" />
                      <a-input v-model:value="formState.secondary_color" size="large" placeholder="#52c41a"
                        style="flex: 1" />
                    </div>
                  </a-form-item>
                </a-col>

                <a-col :span="24">
                  <a-form-item label="Banner Image" name="banner_image">
                    <div class="image-upload-wrapper">
                      <div v-if="!bannerImage" class="upload-empty" @click="openMediaLibrary('banner')">
                        <div class="upload-icon-circle">
                          <PictureOutlined />
                        </div>
                        <div class="upload-text">Click to upload banner</div>
                        <div class="upload-hint">Recommended: 1200x400px, PNG or JPG</div>
                      </div>
                      <div v-else class="upload-preview banner-preview">
                        <a-image :width="300" :height="100" :src="configuration.API_BASE_URL + bannerImage?.url"
                          alt="banner" class="preview-image" style="object-fit: cover;" />
                        <div class="preview-actions">
                          <a-button type="primary" size="small" @click="openMediaLibrary('banner')">Change</a-button>
                          <a-button danger size="small"
                            @click="bannerImage = null; formState.banner_image_id = null;">Remove</a-button>
                        </div>
                      </div>
                    </div>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>

            <!-- Domain Settings Section -->
            <a-card :bordered="false" class="form-section">
              <div class="section-header">
                <div class="section-icon-wrapper">
                  <LinkOutlined class="section-icon" />
                </div>
                <div>
                  <h2 class="section-title">Domain Settings</h2>
                  <p class="section-description">Configure your custom domain</p>
                </div>
              </div>

              <a-row :gutter="[16, 0]">
                <a-col :span="24">
                  <a-form-item label="Custom Domain">
                    <a-input v-model:value="customDomain" size="large" placeholder="www.yourstore.com"
                      :disabled="!isEdit">
                      <template #prefix>
                        <GlobalOutlined />
                      </template>
                    </a-input>
                    <div v-if="!isEdit" class="premium-notice">
                      <span class="premium-badge">Premium Feature</span>
                      <span class="premium-text">Create your store first, then configure custom domain</span>
                    </div>
                    <div v-else class="field-hint">Enter your custom domain (DNS configuration required)</div>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-card>

          </a-form>
        </div>

        <!-- New sidebar with store preview and quick summary -->
        <div class="form-sidebar">
          <a-card :bordered="false" class="sidebar-card sticky-card">
            <div class="card-header">
              <ShopOutlined class="card-icon" />
              <h3 class="card-title">Store Preview</h3>
            </div>

            <div class="store-preview">
              <div class="preview-logo">
                <img v-if="logo" :src="configuration.API_BASE_URL + logo?.url" alt="Store Logo" />
                <div v-else class="preview-logo-placeholder">
                  <ShopOutlined />
                </div>
              </div>

              <div class="preview-info">
                <h3 class="preview-name">{{ formState.name || 'Store Name' }}</h3>
                <p class="preview-tagline">{{ formState.tagline || 'Your store tagline' }}</p>
                <div class="preview-url">
                  <GlobalOutlined />
                  <span>{{ formState.slug || 'your-store' }}.adaptixinnovate.com</span>
                </div>
              </div>

              <div class="preview-details">
                <div class="detail-item">
                  <span class="detail-label">Category</span>
                  <span class="detail-value">
                    {{storeStore.storeCategories.find(c => c.id === formState.store_category_id)?.name || 'Not selected'
                    }}
                  </span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Currency</span>
                  <span class="detail-value">{{ formState.currency }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Timezone</span>
                  <span class="detail-value">{{ formState.timezone }}</span>
                </div>
              </div>
            </div>
          </a-card>

          <a-card :bordered="false" class="sidebar-card">
            <div class="card-header">
              <AppstoreOutlined class="card-icon" />
              <h3 class="card-title">Quick Tips</h3>
            </div>

            <div class="tips-list">
              <div class="tip-item">
                <div class="tip-icon">💡</div>
                <div class="tip-content">
                  <strong>Choose a memorable name</strong>
                  <span>Pick a name that's easy to remember and spell</span>
                </div>
              </div>
              <div class="tip-item">
                <div class="tip-icon">🎨</div>
                <div class="tip-content">
                  <strong>Upload quality images</strong>
                  <span>Use high-resolution logos for better branding</span>
                </div>
              </div>
              <div class="tip-item">
                <div class="tip-icon">📝</div>
                <div class="tip-content">
                  <strong>Write a compelling tagline</strong>
                  <span>Describe what makes your store unique</span>
                </div>
              </div>
            </div>
          </a-card>
        </div>
      </div>

      <!-- Mobile-only action buttons -->
      <div class="mobile-actions">
        <a-button block size="large" @click="router.push('/stores')">Cancel</a-button>
        <a-button type="primary" block size="large" :loading="saving" @click="handleSubmit">
          <template #icon>
            <SaveOutlined />
          </template>
          {{ isEdit ? 'Update' : 'Create' }}
        </a-button>
      </div>
    </template>
  </div>
</template>


<style scoped>
/* Completely redesigned with CSS variables for theme support */
.store-form-container {
  min-height: 100vh;
  background: var(--background);
  padding: 0;
}

/* Header Styles */
.page-header {
  position: relative;
  background: var(--card);
  border-bottom: 1px solid var(--border);
  margin-bottom: 24px;
  overflow: hidden;
}

.header-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg,
      oklch(0.65 0.25 192) 0%,
      oklch(0.60 0.22 200) 50%,
      oklch(0.65 0.25 192) 100%);
}

.header-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
  padding-bottom: 20px;
}

.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--muted-foreground);
  flex-shrink: 0;
  margin-top: 4px;
}

.back-button:hover {
  background: oklch(0.65 0.25 192 / 0.1);
  color: oklch(0.65 0.25 192);
  transform: translateX(-2px);
}

.header-text {
  flex: 1;
}

.page-subtitle {
  font-size: 13px;
  font-weight: 500;
  color: var(--muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-icon {
  font-size: 28px;
  color: oklch(0.65 0.25 192);
}

.page-description {
  font-size: 14px;
  color: var(--muted-foreground);
  margin: 0;
  line-height: 1.5;
}

.header-actions {
  padding: 0 24px 20px;
}

/* Form Layout */
.form-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  padding: 0 24px 80px;
  max-width: 1400px;
  margin: 0 auto;
}

.form-main {
  min-width: 0;
}

.form-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Form Section Styles */
.form-section {
  margin-bottom: 20px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--card);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-section:hover {
  box-shadow: 0 4px 16px oklch(0 0 0 / 0.06);
  border-color: oklch(0.65 0.25 192 / 0.3);
}

.section-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
}

.section-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg,
      oklch(0.65 0.25 192 / 0.1) 0%,
      oklch(0.60 0.22 200 / 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.section-icon {
  font-size: 22px;
  color: oklch(0.65 0.25 192);
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0 0 4px 0;
}

.section-description {
  font-size: 13px;
  color: var(--muted-foreground);
  margin: 0;
  line-height: 1.4;
}

/* Image Upload Styles */
.image-upload-wrapper {
  width: 100%;
}

.upload-empty {
  width: 100%;
  height: 200px;
  border: 2px dashed var(--border);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--background);
}

.upload-empty:hover {
  border-color: oklch(0.65 0.25 192);
  background: oklch(0.65 0.25 192 / 0.05);
}

.upload-empty:hover .upload-icon-circle {
  background: oklch(0.65 0.25 192);
  color: white;
  transform: scale(1.1);
}

.upload-icon-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--muted);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: var(--muted-foreground);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.upload-text {
  font-size: 15px;
  font-weight: 600;
  color: var(--foreground);
}

.upload-hint {
  font-size: 12px;
  color: var(--muted-foreground);
}

.upload-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--background);
}

.preview-image {
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid var(--border);
}

.preview-actions {
  display: flex;
  gap: 8px;
}

/* URL Preview */
.url-preview {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 10px 14px;
  background: oklch(0.65 0.25 192 / 0.08);
  border-radius: 8px;
  font-size: 13px;
  color: oklch(0.65 0.25 192);
  font-weight: 500;
}

.premium-notice {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 10px 14px;
  background: linear-gradient(135deg, oklch(0.60 0.18 285 / 0.1), oklch(0.55 0.20 310 / 0.1));
  border-radius: 8px;
}

.premium-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  background: linear-gradient(135deg, oklch(0.60 0.18 285), oklch(0.55 0.20 310));
  color: white;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.premium-text {
  font-size: 12px;
  color: var(--muted-foreground);
}

/* Sidebar Styles */
.sidebar-card {
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--card);
}

.sticky-card {
  position: sticky;
  top: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.card-icon {
  font-size: 18px;
  color: oklch(0.65 0.25 192);
}

.card-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0;
}

/* Store Preview */
.store-preview {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preview-logo {
  width: 100%;
  height: 140px;
  border-radius: 10px;
  background: linear-gradient(135deg,
      oklch(0.65 0.25 192 / 0.1) 0%,
      oklch(0.60 0.22 200 / 0.1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid var(--border);
}

.preview-logo img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.preview-logo-placeholder {
  font-size: 48px;
  color: var(--muted-foreground);
}

.preview-info {
  text-align: center;
}

.preview-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--foreground);
  margin: 0 0 6px 0;
}

.preview-tagline {
  font-size: 13px;
  color: var(--muted-foreground);
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.preview-url {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: oklch(0.65 0.25 192 / 0.1);
  border-radius: 6px;
  font-size: 12px;
  color: oklch(0.65 0.25 192);
  font-weight: 500;
}

.preview-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 13px;
  color: var(--muted-foreground);
  font-weight: 500;
}

.detail-value {
  font-size: 13px;
  color: var(--foreground);
  font-weight: 600;
}

/* Tips List */
.tips-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tip-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: var(--muted);
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tip-item:hover {
  background: oklch(0.65 0.25 192 / 0.08);
  transform: translateX(4px);
}

.tip-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.tip-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tip-content strong {
  font-size: 13px;
  font-weight: 600;
  color: var(--foreground);
}

.tip-content span {
  font-size: 12px;
  color: var(--muted-foreground);
  line-height: 1.4;
}

/* Mobile Actions */
.mobile-actions {
  display: none;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .form-layout {
    grid-template-columns: 1fr;
  }

  .form-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .store-form-container {
    padding: 0;
  }

  .page-header {
    margin-bottom: 16px;
  }

  .header-content {
    padding: 16px;
    padding-bottom: 12px;
  }

  .page-title {
    font-size: 22px;
  }

  .title-icon {
    font-size: 22px;
  }

  .page-description {
    font-size: 13px;
  }

  .header-actions {
    display: none;
  }

  .form-layout {
    padding: 0 16px 100px;
    gap: 16px;
  }

  .form-section {
    margin-bottom: 16px;
  }

  .section-header {
    gap: 12px;
  }

  .section-icon-wrapper {
    width: 40px;
    height: 40px;
  }

  .section-icon {
    font-size: 18px;
  }

  .section-title {
    font-size: 16px;
  }

  .mobile-actions {
    display: flex;
    gap: 12px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px;
    background: var(--card);
    border-top: 1px solid var(--border);
    box-shadow: 0 -4px 16px oklch(0 0 0 / 0.08);
    z-index: 100;
  }
}

/* Ant Design Overrides */
:deep(.ant-card-body) {
  padding: 24px;
}

:deep(.ant-input),
:deep(.ant-select-selector),
:deep(.ant-input-textarea) {
  border-radius: 8px;
  border-color: var(--border);
  background: var(--background);
  color: var(--foreground);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.ant-input:hover),
:deep(.ant-select-selector:hover) {
  border-color: oklch(0.65 0.25 192 / 0.5);
}

:deep(.ant-input:focus),
:deep(.ant-select-focused .ant-select-selector) {
  border-color: oklch(0.65 0.25 192);
  box-shadow: 0 0 0 3px oklch(0.65 0.25 192 / 0.1);
}

:deep(.ant-form-item-label > label) {
  font-weight: 600;
  color: var(--foreground);
  font-size: 14px;
}

:deep(.ant-btn) {
  border-radius: 8px;
  font-weight: 600;
  height: auto;
  padding: 8px 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.ant-btn-lg) {
  padding: 12px 24px;
  font-size: 15px;
}

:deep(.ant-btn-primary) {
  background: linear-gradient(135deg, oklch(0.65 0.25 192), oklch(0.60 0.22 200));
  border: none;
  box-shadow: 0 4px 12px oklch(0.65 0.25 192 / 0.3);
}

:deep(.ant-btn-primary:hover) {
  background: linear-gradient(135deg, oklch(0.68 0.25 192), oklch(0.63 0.22 200));
  box-shadow: 0 6px 16px oklch(0.65 0.25 192 / 0.4);
  transform: translateY(-1px);
}

:deep(.ant-form-item) {
  margin-bottom: 20px;
}

:deep(.ant-spin-container) {
  min-height: 100vh;
}

/* Color Picker Styles */
.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.color-input {
  width: 48px;
  height: 48px;
  padding: 0;
  border: 2px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.color-input:hover {
  border-color: oklch(0.65 0.25 192);
  transform: scale(1.05);
}

/* Field Hint Styles */
.field-hint {
  margin-top: 6px;
  font-size: 12px;
  color: var(--muted-foreground);
  font-style: italic;
}

/* Banner Preview */
.banner-preview {
  flex-direction: row;
  justify-content: flex-start;
  gap: 20px;
}
</style>
