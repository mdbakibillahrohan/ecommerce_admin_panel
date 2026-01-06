<script lang="ts" setup>
import { FolderFilled, FolderOutlined, RightOutlined } from '@ant-design/icons-vue'
import type { MediaFolder } from '@/modules/media/services/media.service'

const props = defineProps<{
  folders: MediaFolder[]
  viewMode: 'grid' | 'list'
  selectedIds: number[]
}>()

const emits = defineEmits<{
  (e: 'open-folder', id: number): void
  (e: 'toggle-selection', id: number): void
}>()

// Helper to check if selected
const isSelected = (id: number) => props.selectedIds.includes(id)
</script>

<template>
  <div v-if="folders.length > 0" class="section">
    <div class="section-header">
      <div class="section-title">
        <FolderOutlined />
        <span>Folders</span>
        <span class="count-badge">{{ folders.length }}</span>
      </div>
    </div>

    <div :class="viewMode === 'grid' ? 'grid-view' : 'list-view'">
      <div v-for="folder in folders" :key="folder.id"
        :class="['folder-item', viewMode, { 'is-selected': isSelected(folder.id) }]"
        @click.stop="emits('open-folder', folder.id)">
        <!-- Selection Checkbox (Visible on hover or selected) -->
        <div class="selection-box" @click.stop>
          <a-checkbox :checked="isSelected(folder.id)" @change="emits('toggle-selection', folder.id)" />
        </div>

        <div v-if="viewMode === 'grid'" class="folder-card">
          <div class="folder-icon-wrapper">
            <FolderFilled class="folder-icon" />
            <div class="folder-count">{{ folder.files_count || 0 }}</div>
          </div>
          <div class="folder-name">{{ folder.name }}</div>
        </div>

        <div v-else class="folder-row">
          <div class="row-left">
            <FolderFilled class="folder-icon-small" />
            <span class="row-name">{{ folder.name }}</span>
            <span class="file-count">{{ folder.files_count || 0 }} items</span>
          </div>
          <RightOutlined class="row-arrow" />
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
  background: oklch(0.95 0.01 250);
  color: var(--muted-foreground);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Grid View */
.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

/* Folder Cards */
.folder-item {
  position: relative;
}

.selection-box {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--card);
  border-radius: 6px;
  padding: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.folder-item:hover .selection-box,
.folder-item.is-selected .selection-box {
  opacity: 1;
}

/* Specific styling for list view checkbox positioning */
.folder-item.list .selection-box {
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
}

.folder-item.list .folder-row {
  padding-left: 40px;
}

/* Grid Card Styling */
.folder-item.grid .folder-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  position: relative;
  overflow: hidden;
}

.folder-item.grid .folder-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, oklch(0.65 0.2 200) 0%, oklch(0.6 0.22 180) 100%);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.folder-item.grid .folder-card:hover::before {
  transform: scaleX(1);
}

.folder-item.grid .folder-card:hover {
  background: var(--accent);
  border-color: oklch(0.65 0.2 200);
  box-shadow: 0 8px 24px rgba(13, 148, 136, 0.15);
  transform: translateY(-4px);
}

.folder-item.is-selected.grid .folder-card {
  border-color: oklch(0.65 0.2 200);
  background: oklch(0.95 0.05 200);
  box-shadow: 0 0 0 3px oklch(0.85 0.1 200 / 0.3);
}

.folder-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.folder-icon {
  font-size: 48px;
  color: oklch(0.7 0.15 80);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.folder-item.grid .folder-card:hover .folder-icon {
  color: oklch(0.75 0.18 80);
  transform: scale(1.05);
}

.folder-count {
  position: absolute;
  bottom: -4px;
  right: -4px;
  background: oklch(0.65 0.2 200);
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(13, 148, 136, 0.3);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.folder-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  text-align: center;
  word-break: break-word;
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.folder-item.grid .folder-card:hover .folder-name {
  color: oklch(0.65 0.2 200);
}

/* List View Styling */
.list-view {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.folder-item.list .folder-row {
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
  position: relative;
  overflow: hidden;
}

.folder-item.list .folder-row::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, oklch(0.65 0.2 200) 0%, oklch(0.6 0.22 180) 100%);
  transform: scaleY(0);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.folder-item.list .folder-row:hover::before {
  transform: scaleY(1);
}

.folder-item.list .folder-row:hover {
  background: var(--accent);
  border-color: oklch(0.65 0.2 200);
  box-shadow: 0 4px 12px rgba(13, 148, 136, 0.1);
  transform: translateX(4px);
}

.folder-item.is-selected.list .folder-row {
  background: oklch(0.95 0.05 200);
  border-color: oklch(0.65 0.2 200);
  box-shadow: 0 0 0 2px oklch(0.85 0.1 200 / 0.3);
}

.folder-item.is-selected.list .folder-row::before {
  transform: scaleY(1);
}

.row-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.folder-icon-small {
  font-size: 24px;
  color: oklch(0.7 0.15 80);
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.folder-item.list .folder-row:hover .folder-icon-small {
  color: oklch(0.75 0.18 80);
  transform: scale(1.1);
}

.row-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--foreground);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.folder-item.list .folder-row:hover .row-name {
  color: oklch(0.65 0.2 200);
}

.file-count {
  font-size: 12px;
  color: var(--muted-foreground);
  padding: 2px 8px;
  background: oklch(0.95 0.01 250);
  border-radius: 10px;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.folder-item.list .folder-row:hover .file-count {
  background: oklch(0.85 0.1 200 / 0.2);
  color: oklch(0.65 0.2 200);
}

.row-arrow {
  color: var(--muted-foreground);
  font-size: 12px;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.folder-item.list .folder-row:hover .row-arrow {
  color: oklch(0.65 0.2 200);
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .grid-view {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
  }
}
</style>
