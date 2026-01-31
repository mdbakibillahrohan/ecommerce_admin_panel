<script lang="ts" setup>
import { BgColorsOutlined, PictureOutlined } from '@ant-design/icons-vue';
import type { CreateStoreDto } from '@/modules/stores/api/stores';
import type { MediaFile } from '@/modules/media/services/media.service';
import { configuration } from '@/modules/shared/config/configruation';

const formState = defineModel<CreateStoreDto>('formState', { required: true });

defineProps<{
  bannerImage: MediaFile | null | undefined;
}>();

const emit = defineEmits<{
  openMediaLibrary: [usingFor: string];
  removeBanner: [];
}>();
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
            <input type="color" v-model="formState.primary_color" class="color-input" />
            <a-input
              v-model:value="formState.primary_color"
              size="large"
              placeholder="#1890ff"
              style="flex: 1"
            />
          </div>
        </a-form-item>
      </a-col>

      <a-col :xs="24" :lg="12">
        <a-form-item label="Secondary Color" name="secondary_color">
          <div class="color-picker-wrapper">
            <input type="color" v-model="formState.secondary_color" class="color-input" />
            <a-input
              v-model:value="formState.secondary_color"
              size="large"
              placeholder="#52c41a"
              style="flex: 1"
            />
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
              <a-image
                :width="300"
                :height="100"
                :src="configuration.MEDIA_BASE_URL + bannerImage?.url"
                alt="banner"
                class="preview-image"
                style="object-fit: cover;"
              />
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

<style scoped>
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

.banner-preview {
  flex-direction: row;
  justify-content: flex-start;
  gap: 20px;
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
</style>
