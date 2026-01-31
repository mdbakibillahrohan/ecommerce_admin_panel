<script lang="ts" setup>
import { PictureOutlined } from '@ant-design/icons-vue';
import { configuration } from '@/modules/shared/config/configruation';
import type { MediaFile } from '@/modules/media/services/media.service';

defineProps<{
  logo: MediaFile | null | undefined;
  favicon: MediaFile | null | undefined;
}>();

const emit = defineEmits<{
  openMediaLibrary: [usingFor: string];
  removeLogo: [];
  removeFavicon: [];
}>();
</script>

<template>
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
                      <div v-if="!logo" class="upload-empty" @click="emit('openMediaLibrary', 'logo')">
                        <div class="upload-icon-circle">
                          <PictureOutlined />
                        </div>
                        <div class="upload-text">Click to upload logo</div>
                        <div class="upload-hint">Recommended: 200x200px, PNG or JPG</div>
                      </div>
                      <div v-else class="upload-preview">
                        <a-image :width="120" :height="120" :src="configuration.MEDIA_BASE_URL+logo?.url"
                          alt="logo" class="preview-image" />
                        <div class="preview-actions">
                          <a-button type="primary" size="small" @click="emit('openMediaLibrary', 'logo')">
                            Change
                          </a-button>
                          <a-button danger size="small" @click="emit('removeLogo')">
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
                      <div v-if="!favicon" class="upload-empty" @click="emit('openMediaLibrary', 'favicon')">
                        <div class="upload-icon-circle">
                          <PictureOutlined />
                        </div>
                        <div class="upload-text">Click to upload favicon</div>
                        <div class="upload-hint">Recommended: 32x32px, ICO or PNG</div>
                      </div>
                      <div v-else class="upload-preview">
                        <a-image :width="120" :height="120" :src="configuration.MEDIA_BASE_URL + favicon?.url"
                          alt="favicon" class="preview-image" />
                        <div class="preview-actions">
                          <a-button type="primary" size="small" @click="emit('openMediaLibrary', 'favicon')">
                            Change
                          </a-button>
                          <a-button danger size="small" @click="emit('removeFavicon')">
                            Remove
                          </a-button>
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

</style>

