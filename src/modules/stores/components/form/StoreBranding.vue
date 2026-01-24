<script setup lang="ts">
import { PictureOutlined } from '@ant-design/icons-vue'
import { configuration } from '@/modules/shared/config/configruation'
import type { MediaFile } from '@/modules/media/services/media.service'

defineProps<{
  logo: MediaFile | null | undefined
  favicon: MediaFile | null | undefined
}>()

const emit = defineEmits<{
  (e: 'openMediaLibrary', usingFor: string): void
  (e: 'removeLogo'): void
  (e: 'removeFavicon'): void
}>()
</script>

<template>
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
            <div v-if="!logo" class="upload-empty" @click="emit('openMediaLibrary', 'logo')">
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
                <a-button type="primary" size="small" @click="emit('openMediaLibrary', 'logo')">
                  Change
                </a-button>
                <a-button danger size="small" @click="emit('removeLogo')"> Remove </a-button>
              </div>
            </div>
          </div>
        </a-form-item>
      </a-col>

      <a-col :xs="24" :sm="12">
        <a-form-item label="Store Favicon" name="favicon">
          <div class="image-upload-wrapper">
            <div v-if="!favicon" class="upload-empty" @click="emit('openMediaLibrary', 'favicon')">
              <div class="upload-icon-circle">
                <PictureOutlined />
              </div>
              <div class="upload-text">Click to upload favicon</div>
              <div class="upload-hint">Recommended: 32x32px, ICO or PNG</div>
            </div>
            <div v-else class="upload-preview">
              <a-image :width="120" :height="120" :src="configuration.API_BASE_URL + favicon?.url" alt="favicon"
                class="preview-image" />
              <div class="preview-actions">
                <a-button type="primary" size="small" @click="emit('openMediaLibrary', 'favicon')">
                  Change
                </a-button>
                <a-button danger size="small" @click="emit('removeFavicon')"> Remove </a-button>
              </div>
            </div>
          </div>
        </a-form-item>
      </a-col>
    </a-row>
  </a-card>
</template>
