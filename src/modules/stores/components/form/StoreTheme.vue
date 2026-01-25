<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { BgColorsOutlined, PictureOutlined } from '@ant-design/icons-vue'
import { configuration } from '@/modules/shared/config/configruation'
import type { CreateStoreDto } from '@/modules/stores/api/stores'
import type { MediaFile } from '@/modules/media/services/media.service'

const props = defineProps<{
  formState: CreateStoreDto
  bannerImage: MediaFile | null | undefined
}>()

const emit = defineEmits<{
  (e: 'update:formState', value: CreateStoreDto): void
  (e: 'openMediaLibrary', usingFor: string): void
  (e: 'removeBanner'): void
}>()
</script>

<template>
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
            <input type="color" class="color-input" />
            <a-input size="large" placeholder="#1890ff" style="flex: 1" />
          </div>
        </a-form-item>
      </a-col>

      <a-col :xs="24" :lg="12">
        <a-form-item label="Secondary Color" name="secondary_color">
          <div class="color-picker-wrapper">
            <input type="color" class="color-input" />
            <a-input size="large" placeholder="#52c41a" style="flex: 1" />
          </div>
        </a-form-item>
      </a-col>

      <a-col :span="24">
        <a-form-item label="Banner Image" name="banner_image">
          <div class="image-upload-wrapper">
            <div v-if="!bannerImage" class="upload-empty" @click="emit('openMediaLibrary', 'banner')">
              <div class="upload-icon-circle">
                <PictureOutlined />
              </div>
              <div class="upload-text">Click to upload banner</div>
              <div class="upload-hint">Recommended: 1200x400px, PNG or JPG</div>
            </div>
            <div v-else class="upload-preview banner-preview">
              <a-image :width="300" :height="100" :src="configuration.API_BASE_URL + bannerImage?.url" alt="banner"
                class="preview-image" style="object-fit: cover" />
              <div class="preview-actions">
                <a-button type="primary" size="small" @click="emit('openMediaLibrary', 'banner')">Change</a-button>
                <a-button danger size="small" @click="emit('removeBanner')">Remove</a-button>
              </div>
            </div>
          </div>
        </a-form-item>
      </a-col>
    </a-row>
  </a-card>
</template>
