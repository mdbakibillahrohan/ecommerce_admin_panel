<script setup lang="ts">
import { ref } from 'vue'
import {
  DeleteOutlined,
  CloudUploadOutlined,
  StarOutlined,
  StarFilled,
  PlayCircleOutlined,
  PictureOutlined,
} from '@ant-design/icons-vue'
import MainMedia from '@/modules/media/components/MainMedia.vue'
import type { MediaFile } from '@/modules/media/interfaces'
import type { VariantMedia } from '@/modules/products/interfaces'

const media = defineModel<VariantMedia[]>('media', { default: () => [] })

const mediaModalOpen = ref(false)

function openMediaModal() {
  mediaModalOpen.value = true
}

function handleFileSelected(payload: { usingFor: string; files: MediaFile[] }) {
  for (const file of payload.files) {
    addMediaFromFile(file)
  }
  mediaModalOpen.value = false
}

function addMediaFromFile(file: MediaFile) {
  // Prevent duplicates
  if (media.value.some(m => m.mediaFileId === file.id)) return

  const isVideo = file.mimeType.startsWith('video/')
  const newMedia: VariantMedia = {
    id: `vm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    mediaFileId: file.id,
    url: file.url,
    name: file.originalName,
    type: isVideo ? 'video' : 'image',
    isPrimary: media.value.length === 0,
  }
  media.value = [...media.value, newMedia]
}

function removeMedia(id: string) {
  const removed = media.value.find(m => m.id === id)
  const wasPrimary = removed?.isPrimary ?? false
  media.value = media.value.filter(m => m.id !== id)
  // If removed item was primary, set first remaining as primary
  if (wasPrimary && media.value.length > 0) {
    media.value = media.value.map((m, i) => ({ ...m, isPrimary: i === 0 }))
  }
}

function setPrimary(id: string) {
  media.value = media.value.map(m => ({
    ...m,
    isPrimary: m.id === id,
  }))
}
</script>

<template>
  <div class="variant-media-manager">
    <div class="media-label">
      <PictureOutlined />
      <span>Media</span>
      <a-tag color="blue" size="small">{{ media.length }}</a-tag>
    </div>

    <!-- Media Thumbnails -->
    <div class="media-grid" v-if="media.length > 0">
      <div v-for="item in media" :key="item.id" class="media-thumb" :class="{ primary: item.isPrimary }">
        <div class="thumb-preview">
          <img v-if="item.type === 'image'" :src="item.url" :alt="item.name" />
          <div v-else class="video-thumb">
            <PlayCircleOutlined />
          </div>
        </div>
        <div class="thumb-overlay">
          <a-tooltip :title="item.isPrimary ? 'Primary' : 'Set as Primary'">
            <button class="thumb-action" @click="setPrimary(item.id)">
              <StarFilled v-if="item.isPrimary" class="star-active" />
              <StarOutlined v-else />
            </button>
          </a-tooltip>
          <a-tooltip title="Remove">
            <button class="thumb-action danger" @click="removeMedia(item.id)">
              <DeleteOutlined />
            </button>
          </a-tooltip>
        </div>
        <div v-if="item.isPrimary" class="primary-badge">Primary</div>
      </div>
    </div>

    <!-- Actions -->
    <div class="media-actions">
      <a-button size="small" @click="openMediaModal">
        <CloudUploadOutlined />
        Add Media
      </a-button>
    </div>

    <!-- MainMedia Modal -->
    <a-modal v-model:open="mediaModalOpen" title="Select Media" :width="1000" :footer="null" destroy-on-close>
      <MainMedia :is-select-mode="true" :multiple="true" using-for="variant-media"
        @file-selected="handleFileSelected" />
    </a-modal>
  </div>
</template>

<style scoped>
.variant-media-manager {
  margin-top: 12px;
}

.media-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--muted-foreground);
  margin-bottom: 8px;
}

.media-grid {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.media-thumb {
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid var(--border);
  cursor: pointer;
  transition: all 0.2s ease;
}

.media-thumb:hover {
  border-color: oklch(0.65 0.19 164);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.media-thumb.primary {
  border-color: oklch(0.7 0.18 85);
  box-shadow: 0 0 0 2px oklch(0.7 0.18 85 / 0.2);
}

.thumb-preview {
  width: 100%;
  height: 100%;
}

.thumb-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-thumb {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, oklch(0.3 0.02 260), oklch(0.2 0.02 260));
  color: white;
  font-size: 24px;
}

.thumb-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.media-thumb:hover .thumb-overlay {
  opacity: 1;
}

.thumb-action {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.9);
  color: var(--foreground);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  transition: all 0.2s;
}

.thumb-action:hover {
  background: white;
  transform: scale(1.1);
}

.thumb-action.danger:hover {
  background: oklch(0.55 0.22 25);
  color: white;
}

.star-active {
  color: oklch(0.7 0.18 85);
}

.primary-badge {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: oklch(0.7 0.18 85);
  color: white;
  font-size: 9px;
  font-weight: 600;
  text-align: center;
  padding: 1px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.media-actions {
  display: flex;
  gap: 6px;
}
</style>
