<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storesApi, type CreateStoreDto } from '@/modules/stores/api/stores'
import { SaveOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import FormSkeleton from '@/modules/shared/components/skeletons/FormSkeleton.vue'
import type { FormInstance } from 'ant-design-vue'
import { useStoreStore } from '@/modules/stores/store/store'
import type { MediaFile } from '@/modules/media/services/media.service'

// Form Components
import StoreFormHeader from '../components/form/StoreFormHeader.vue'
import StoreBrandingSection from '../components/form/StoreBrandingSection.vue'
import StoreBasicInfoSection from '../components/form/StoreBasicInfoSection.vue'
import StoreUrlSection from '../components/form/StoreUrlSection.vue'
import StoreContactSection from '../components/form/StoreContactSection.vue'
import StoreRegionalSection from '../components/form/StoreRegionalSection.vue'
import StoreSeoSection from '../components/form/StoreSeoSection.vue'
import StoreLocalizationSection from '../components/form/StoreLocalizationSection.vue'
import StoreBrandColorsSection from '../components/form/StoreBrandColorsSection.vue'
import StoreDomainSection from '../components/form/StoreDomainSection.vue'

// Sidebar Components
import StorePreviewCard from '../components/form/StorePreviewCard.vue'
import StoreQuickTipsCard from '../components/form/StoreQuickTipsCard.vue'

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

const handleRemoveBanner = () => {
  bannerImage.value = null;
  formState.value.banner_image_id = null;
}

const handleRemoveLogo = () => {
  logo.value = null;
  formState.value.logo_id = 0;
}

const handleRemoveFavicon = () => {
  favicon.value = null;
  formState.value.favicon_id = 0;
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
  await storeStore.getStoreCategories()

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

      <StoreFormHeader :isEdit="isEdit" :saving="saving" @submit="handleSubmit" />

      <div class="form-layout">
        <!-- Main form content with improved card design -->
        <div class="form-main">
          <a-form ref="formRef" :model="formState" :rules="rules" layout="vertical">

            <StoreBrandingSection
              :logo="logo"
              :favicon="favicon"
              @openMediaLibrary="openMediaLibrary"
              @removeLogo="handleRemoveLogo"
              @removeFavicon="handleRemoveFavicon"
            />

            <StoreBasicInfoSection
              v-model:formState="formState"
              :storeCategories="storeStore.storeCategories"
              :isEdit="isEdit"
              @generateSlug="generateSlug"
            />

            <StoreUrlSection
              v-model:formState="formState"
              :customDomain="customDomain"
            />

            <StoreContactSection v-model:formState="formState" />

            <StoreRegionalSection v-model:formState="formState" />

            <StoreSeoSection v-model:formState="formState" />

            <StoreLocalizationSection v-model:formState="formState" />

            <StoreBrandColorsSection
              v-model:formState="formState"
              :bannerImage="bannerImage"
              @openMediaLibrary="openMediaLibrary"
              @removeBanner="handleRemoveBanner"
            />

            <StoreDomainSection
              v-model:customDomain="customDomain"
              :isEdit="isEdit"
            />

          </a-form>
        </div>

        <!-- New sidebar with store preview and quick summary -->
        <div class="form-sidebar">
          <StorePreviewCard
            :logo="logo"
            :formState="formState"
            :storeCategories="storeStore.storeCategories"
          />
          <StoreQuickTipsCard />
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

/* Form Layout */
.form-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  padding: 0;
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

  .form-layout {
    padding: 0 16px 100px;
    gap: 16px;
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
</style>
