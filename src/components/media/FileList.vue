<script lang="ts" setup>
import {
  FileOutlined,
  FileTextFilled,
  MoreOutlined,
  DeleteOutlined,
  EditOutlined,
} from '@ant-design/icons-vue'
import { Image } from 'ant-design-vue'
import type { MediaFile } from '@/services/media.service'

const props = defineProps<{
  files: MediaFile[]
  viewMode: 'grid' | 'list'
  selectedIds: number[]
  isSelectMode: boolean
}>()

const emits = defineEmits<{
  (e: 'preview-file', file: MediaFile): void
  (e: 'delete-file', id: number): void
  (e: 'toggle-selection', id: number): void
  (e: 'select-file', file: MediaFile): void
  (e: 'rename-file', file: MediaFile): void
}>()

const isSelected = (id: number) => props.selectedIds.includes(id)

const isImage = (mimeType: string) => mimeType.startsWith('image/')

const getFileUrl = (path: string) => {
  if (path) {
    if (path.startsWith("http")) return path
    return `http://localhost:8000${path}`
  }
  return path
}

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileExtension = (filename: string) => {
  const parts = filename.split('.')
  return parts.length > 1 ? parts[parts.length - 1] : 'file'
}

const handleFileClick = (file: MediaFile) => {
  if (props.isSelectMode) {
    emits('select-file', file)
  }
}
</script>

<template>
  <div v-if="files.length > 0" class="section">
    <div class="section-header">
      <div class="section-title">
        <FileOutlined />
        <span>Files</span>
        <span class="count-badge">{{ files.length }}</span>
      </div>
    </div>

    <div :class="viewMode === 'grid' ? 'grid-view' : 'list-view'">
      <div v-for="file in files" :key="file.id"
        :class="['file-item', viewMode, { 'is-selected': isSelected(file.id) }]">
        <div class="selection-box" @click.stop>
          <a-checkbox :checked="isSelected(file.id)" @change="emits('toggle-selection', file.id)" />
        </div>

        <div v-if="viewMode === 'grid'" class="file-card">
          <div class="file-preview">
            <a-image v-if="isImage(file.mime_type)" :src="getFileUrl(file.file_path)" class="preview-image"
              :preview="!isSelectMode" @click="handleFileClick(file)" />
            <div v-else class="preview-placeholder" @click="handleFileClick(file)">
              <FileTextFilled class="placeholder-icon" />
              <span class="file-ext">{{ getFileExtension(file.original_name) }}</span>
            </div>

            <div class="file-actions" @click.stop>
              <a-dropdown trigger="click">
                <a-button type="text" shape="circle" size="small" class="action-menu-btn">
                  <MoreOutlined />
                </a-button>
                <template #overlay>
                  <a-menu class="action-menu">
                    <a-menu-item key="delete" danger @click="emits('delete-file', file.id)">
                      <DeleteOutlined /> Delete
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </div>

          <div class="file-info" @click="handleFileClick(file)">
            <div class="file-name" :title="file.original_name">{{ file.original_name }}</div>
            <div class="file-meta">{{ formatSize(file.size) }}</div>
          </div>
        </div>

        <div v-else class="file-row" @click="handleFileClick(file)">
          <div class="row-left">
            <div class="file-thumb">
              <a-image v-if="isImage(file.mime_type)" :src="getFileUrl(file.file_path)" class="thumb-image"
                :preview="isSelectMode ? false : { src: getFileUrl(file.file_path) }" />
              <FileTextFilled v-else class="thumb-icon" />
            </div>
            <div class="row-details">
              <div class="row-name">{{ file.original_name }}</div>
              <div class="row-meta">
                {{ formatSize(file?.size ?? 0) }}
              </div>
            </div>
          </div>

          <a-dropdown trigger="click" @click.stop>
            <a-button type="text" shape="circle" class="row-action">
              <MoreOutlined />
            </a-button>
            <template #overlay>
              <a-menu class="action-menu">
                <a-menu-item key="delete" danger @click="emits('delete-file', file.id)">
                  <DeleteOutlined /> Delete
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.section {
  margin-bottom: 48px;
}

.section-header {
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 600;
  color: var(--muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.count-badge {
  background: oklch(0.64 0.12 192.18);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(13, 148, 136, 0.15);
}

/* Grid View */
.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

/* File Item & Selection */
.file-item {
  position: relative;
}

.selection-box {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.file-item:hover .selection-box,
.file-item.is-selected .selection-box {
  opacity: 1;
}

.file-item.list .selection-box {
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
}

.file-item.list .file-row {
  padding-left: 40px;
}

/* File Cards */
.file-item.grid .file-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.file-item.grid .file-card:hover {
  border-color: oklch(0.64 0.12 192.18);
  box-shadow: 0 8px 16px rgba(13, 148, 136, 0.12);
  transform: translateY(-4px);
}

.file-item.is-selected.grid .file-card {
  border-color: oklch(0.64 0.12 192.18);
  background: oklch(0.95 0.02 192.18);
  box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.2);
}

.file-preview {
  position: relative;
  aspect-ratio: 1;
  background: var(--muted);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.file-item.grid .file-card:hover .preview-image {
  transform: scale(1.05);
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  height: 100%;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.file-item.grid .file-card:hover .preview-placeholder {
  transform: scale(1.05);
}

.placeholder-icon {
  font-size: 48px;
  color: oklch(0.64 0.12 192.18);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.file-item.grid .file-card:hover .placeholder-icon {
  color: oklch(0.58 0.14 192.18);
}

.file-ext {
  font-size: 11px;
  font-weight: 600;
  color: var(--muted-foreground);
  text-transform: uppercase;
  padding: 4px 8px;
  background: var(--background);
  border-radius: 6px;
}

.file-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0;
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.file-item.grid .file-card:hover .file-actions {
  opacity: 1;
}

.action-menu-btn {
  background: var(--card);
  backdrop-filter: blur(8px);
  color: var(--foreground);
  border: 1px solid var(--border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.action-menu-btn:hover {
  background: oklch(0.95 0.02 192.18);
  border-color: oklch(0.64 0.12 192.18);
  color: oklch(0.64 0.12 192.18);
}

.file-info {
  padding: 12px 16px;
  cursor: pointer;
  background: var(--card);
}

.file-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 4px;
}

.file-meta {
  font-size: 12px;
  color: var(--muted-foreground);
}

/* List View */
.list-view {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-item.list .file-row {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px 16px;
  padding-left: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.file-item.list .file-row:hover {
  border-color: oklch(0.64 0.12 192.18);
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.08);
  transform: translateX(4px);
}

.file-item.is-selected.list .file-row {
  background: oklch(0.95 0.02 192.18);
  border-color: oklch(0.64 0.12 192.18);
}

.row-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.file-thumb {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background: var(--muted);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid var(--border);
}

.thumb-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-icon {
  font-size: 20px;
  color: oklch(0.64 0.12 192.18);
}

.row-details {
  flex: 1;
  min-width: 0;
}

.row-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.row-meta {
  font-size: 12px;
  color: var(--muted-foreground);
  margin-top: 2px;
}

.row-action {
  color: var(--muted-foreground);
  flex-shrink: 0;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.row-action:hover {
  color: oklch(0.64 0.12 192.18);
  background: oklch(0.95 0.02 192.18);
}

/* Action Menu */
.action-menu {
  background: var(--popover);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .grid-view {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
  }
}
</style>
