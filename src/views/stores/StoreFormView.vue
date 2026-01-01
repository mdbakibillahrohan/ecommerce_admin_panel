<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storesApi, type CreateStoreDto } from '@/api/stores'
import { SaveOutlined, ArrowLeftOutlined, ShopOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, GlobalOutlined, DollarOutlined, AppstoreOutlined, PictureOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'
import { useStoreStore } from '@/stores/store/store'
import { configuration } from '@/config/configruation'

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

const apiBase = configuration.API_BASE_URL;
const apiUpload = apiBase + '/media/upload';

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
  logo: '',
  favicon: ''
})

const rules = {
  name: [{ required: true, message: 'Store name is required', trigger: 'blur' }],
  slug: [
    { required: true, message: 'Slug is required', trigger: 'blur' },
    { pattern: /^[a-z0-9-]+$/, message: 'Slug must be lowercase alphanumeric with hyphens', trigger: 'blur' }
  ],
  store_category_id: [{ required: true, message: 'Category is required' }],
  email: [{ type: 'email', message: 'Please enter a valid email', trigger: 'blur' }],
}

const handleLogoUpload = (info: any) => {
  if (info.file.status === 'done') {
    formState.value.logo = info.file.response.url
    message.success('Logo uploaded successfully')
  } else if (info.file.status === 'error') {
    message.error('Failed to upload logo')
  }
}

const openMediaLibrary = () => {
  mediaModalVisible.value = true;
}

const handleFaviconUpload = (info: any) => {
  if (info.file.status === 'done') {
    formState.value.favicon = info.file.response.url
    message.success('Favicon uploaded successfully')
  } else if (info.file.status === 'error') {
    message.error('Failed to upload favicon')
  }
}

const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('You can only upload image files!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('Image must be smaller than 2MB!')
  }
  return isImage && isLt2M
}

async function fetchStore(id: number) {
  loading.value = true
  try {
    const store = await storesApi.getById(id)
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
      logo: store.logo,
      favicon: store.favicon
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
  <a-modal v-model:visible="mediaModalVisible" title="Media Library" width="80%">
    <MainMedia :isSelectMode="true" />
  </a-modal>
  <div class="store-form-container">
    <a-spin :spinning="loading" size="large">
      <div class="page-header">
        <div class="header-content">
          <a-button class="back-button" type="text" @click="router.push('/stores')">
            <template #icon>
              <ArrowLeftOutlined />
            </template>
          </a-button>
          <div class="header-text">
            <h1 class="page-title">
              <ShopOutlined class="title-icon" />
              {{ isEdit ? 'Edit Store' : 'Create New Store' }}
            </h1>
          </div>
        </div>
        <div class="header-actions">
          <a-space :size="8">
            <a-button @click="router.push('/stores')">Cancel</a-button>
            <a-button type="primary" :loading="saving" @click="handleSubmit">
              <template #icon>
                <SaveOutlined />
              </template>
              {{ isEdit ? 'Update' : 'Create' }}
            </a-button>
          </a-space>
        </div>
      </div>

      <div class="form-content">
        <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">
          <a-card :bordered="false" class="form-section">
            <div class="section-header">
              <PictureOutlined class="section-icon" />
              <h2 class="section-title">Branding</h2>
            </div>

            <a-row :gutter="[16, 0]">
              <a-col :xs="24" :sm="12">
                <a-form-item label="Logo" name="logo">
                  <a-button type="primary" @click="openMediaLibrary()">Select Logo</a-button>
                  <div class="upload-hint">Recommended: 200x200px</div>
                </a-form-item>
              </a-col>

              <a-col :xs="24" :sm="12">
                <a-form-item label="Favicon" name="favicon">
                  <a-upload list-type="picture-card" :show-upload-list="false" action="/api/upload"
                    :before-upload="beforeUpload" @change="handleFaviconUpload">
                    <div v-if="formState.favicon" class="upload-preview">
                      <img :src="formState.favicon" alt="favicon" />
                    </div>
                    <div v-else class="upload-placeholder">
                      <PictureOutlined class="upload-icon" />
                      <div class="upload-text">Upload Favicon</div>
                    </div>
                  </a-upload>
                  <div class="upload-hint">Recommended: 32x32px</div>
                </a-form-item>
              </a-col>
            </a-row>
          </a-card>

          <a-card :bordered="false" class="form-section">
            <div class="section-header">
              <AppstoreOutlined class="section-icon" />
              <h2 class="section-title">Basic Information</h2>
            </div>

            <a-row :gutter="[16, 0]">
              <a-col :xs="24" :lg="12">
                <a-form-item label="Store Name" name="name">
                  <a-input v-model:value="formState.name" placeholder="Enter your store name"
                    @blur="!isEdit && generateSlug()" />
                </a-form-item>
              </a-col>

              <a-col :xs="24" :lg="12">
                <a-form-item label="Store Category" name="store_category_id">
                  <a-select v-model:value="formState.store_category_id" placeholder="Select a category">
                    <a-select-option v-for="storeCategory in storeStore.storeCategories" :key="storeCategory.id"
                      :value="storeCategory.id">
                      {{ storeCategory.name }}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :span="24">
                <a-form-item label="Tagline" name="tagline">
                  <a-input v-model:value="formState.tagline"
                    placeholder="A short, catchy phrase that describes your store" :maxlength="100" show-count />
                </a-form-item>
              </a-col>

              <a-col :span="24">
                <a-form-item label="Description" name="description">
                  <a-textarea v-model:value="formState.description" :rows="3"
                    placeholder="Tell customers about your store..." show-count :maxlength="500" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-card>

          <a-card :bordered="false" class="form-section">
            <div class="section-header">
              <GlobalOutlined class="section-icon" />
              <h2 class="section-title">URL & Domain</h2>
            </div>

            <a-row :gutter="[16, 0]">
              <a-col :xs="24" :lg="12">
                <a-form-item label="URL Slug" name="slug">
                  <template #extra>
                    <span class="field-hint">{{ formState.slug || 'your-store' }}.adaptixinnovate.com</span>
                  </template>
                  <a-input v-model:value="formState.slug" placeholder="my-awesome-store" />
                </a-form-item>
              </a-col>

              <a-col :xs="24" :lg="12">
                <a-form-item label="Custom Domain">
                  <template #extra>
                    <span class="field-hint">
                      <span class="premium-badge">Premium</span>
                    </span>
                  </template>
                  <a-input v-model:value="customDomain" placeholder="www.yourstore.com" disabled />
                </a-form-item>
              </a-col>
            </a-row>
          </a-card>

          <a-card :bordered="false" class="form-section">
            <div class="section-header">
              <MailOutlined class="section-icon" />
              <h2 class="section-title">Contact Information</h2>
            </div>

            <a-row :gutter="[16, 0]">
              <a-col :xs="24" :lg="8">
                <a-form-item label="Email" name="email">
                  <a-input v-model:value="formState.email" type="email" placeholder="contact@yourstore.com">
                    <template #prefix>
                      <MailOutlined />
                    </template>
                  </a-input>
                </a-form-item>
              </a-col>

              <a-col :xs="24" :lg="8">
                <a-form-item label="Phone" name="phone">
                  <a-input v-model:value="formState.phone" placeholder="+880 1234-567890">
                    <template #prefix>
                      <PhoneOutlined />
                    </template>
                  </a-input>
                </a-form-item>
              </a-col>

              <a-col :xs="24" :lg="8">
                <a-form-item label="Address" name="address">
                  <a-input v-model:value="formState.address" placeholder="Your business address">
                    <template #prefix>
                      <EnvironmentOutlined />
                    </template>
                  </a-input>
                </a-form-item>
              </a-col>
            </a-row>
          </a-card>

          <a-card :bordered="false" class="form-section">
            <div class="section-header">
              <DollarOutlined class="section-icon" />
              <h2 class="section-title">Regional Settings</h2>
            </div>

            <a-row :gutter="[16, 0]">
              <a-col :xs="24" :lg="12">
                <a-form-item label="Currency" name="currency">
                  <a-select v-model:value="formState.currency">
                    <a-select-option value="BDT">Bangladeshi Taka (BDT)</a-select-option>
                    <a-select-option value="USD">US Dollar (USD)</a-select-option>
                    <a-select-option value="EUR">Euro (EUR)</a-select-option>
                    <a-select-option value="GBP">British Pound (GBP)</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <a-col :xs="24" :lg="12">
                <a-form-item label="Timezone" name="timezone">
                  <a-select v-model:value="formState.timezone" show-search>
                    <a-select-option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</a-select-option>
                    <a-select-option value="America/New_York">America/New_York (EST)</a-select-option>
                    <a-select-option value="Europe/London">Europe/London (GMT)</a-select-option>
                    <a-select-option value="Asia/Tokyo">Asia/Tokyo (JST)</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-card>

        </a-form>

        <div class="mobile-actions">
          <a-button block @click="router.push('/stores')">Cancel</a-button>
          <a-button type="primary" block :loading="saving" @click="handleSubmit">
            <template #icon>
              <SaveOutlined />
            </template>
            {{ isEdit ? 'Update' : 'Create' }}
          </a-button>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<style scoped>
.store-form-container {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px 20px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.back-button:hover {
  background: #f0f5ff;
  color: #1890ff;
}

.header-text {
  flex: 1;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.title-icon {
  font-size: 20px;
  color: #1890ff;
}

.header-actions {
  display: flex;
  align-items: center;
}

.form-content {
  max-width: 1200px;
  margin: 0 auto;
}

.form-section {
  margin-bottom: 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s ease;
}

.form-section:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.section-icon {
  font-size: 18px;
  color: #1890ff;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0;
}

.field-hint {
  color: #8c8c8c;
  font-size: 12px;
  display: inline-block;
  margin-top: 2px;
}

.premium-badge {
  display: inline-block;
  padding: 1px 6px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.upload-preview {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #8c8c8c;
}

.upload-icon {
  font-size: 28px;
}

.upload-text {
  font-size: 12px;
  font-weight: 500;
}

.upload-hint {
  font-size: 11px;
  color: #8c8c8c;
  margin-top: 4px;
}

.mobile-actions {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: white;
  border-top: 1px solid #f0f0f0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
  gap: 10px;
  z-index: 100;
}

@media (max-width: 768px) {
  .store-form-container {
    padding: 12px;
  }

  .page-header {
    padding: 12px;
    margin-bottom: 12px;
  }

  .header-content {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .back-button {
    align-self: flex-start;
  }

  .page-title {
    font-size: 18px;
  }

  .title-icon {
    font-size: 18px;
  }

  .header-actions {
    display: none;
  }

  .mobile-actions {
    display: flex;
  }

  .form-section {
    border-radius: 10px;
    margin-bottom: 12px;
  }

  .section-title {
    font-size: 15px;
  }

  .form-content {
    padding-bottom: 70px;
  }
}

:deep(.ant-input),
:deep(.ant-select-selector),
:deep(.ant-input-textarea) {
  border-radius: 8px;
}

:deep(.ant-input:focus),
:deep(.ant-select-focused .ant-select-selector) {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

:deep(.ant-form-item-label > label) {
  font-weight: 600;
  color: #374151;
  font-size: 13px;
}

:deep(.ant-card-body) {
  padding: 20px;
}

:deep(.ant-btn) {
  border-radius: 8px;
  font-weight: 500;
  height: 36px;
  padding: 0 16px;
}

:deep(.ant-btn-primary) {
  background: #1890ff;
  border: none;
  box-shadow: 0 2px 6px rgba(24, 144, 255, 0.25);
}

:deep(.ant-btn-primary:hover) {
  background: #40a9ff;
  box-shadow: 0 3px 8px rgba(24, 144, 255, 0.35);
}

:deep(.ant-form-item) {
  margin-bottom: 16px;
}

:deep(.ant-upload.ant-upload-select-picture-card) {
  width: 120px;
  height: 120px;
  border-radius: 8px;
  border: 2px dashed #d9d9d9;
  transition: all 0.2s ease;
}

:deep(.ant-upload.ant-upload-select-picture-card:hover) {
  border-color: #1890ff;
}

:deep(.ant-spin-container) {
  min-height: 100vh;
}
</style>
