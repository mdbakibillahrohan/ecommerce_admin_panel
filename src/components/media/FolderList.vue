<script lang="ts" setup>
import { FolderFilled, FolderOutlined, RightOutlined } from '@ant-design/icons-vue'
import type { MediaFolder } from '@/services/media.service'

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
                    </div>
                    <div class="folder-name">{{ folder.name }}</div>
                </div>

                <div v-else class="folder-row">
                    <div class="row-left">
                        <FolderFilled class="folder-icon-small" />
                        <span class="row-name">{{ folder.name }}</span>
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
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.count-badge {
    background: #f3f4f6;
    color: #6b7280;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
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
    transition: opacity 0.2s;
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
    /* Space for checkbox */
}

/* Grid Card Styling */
.folder-item.grid .folder-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 24px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
}

.folder-item.grid .folder-card:hover {
    background: #f9fafb;
    border-color: #3b82f6;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

.folder-item.is-selected.grid .folder-card {
    border-color: #3b82f6;
    background: #eff6ff;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.folder-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
}

.folder-icon {
    font-size: 48px;
    color: #f59e0b;
}

.folder-name {
    font-size: 14px;
    font-weight: 500;
    color: #111827;
    text-align: center;
    word-break: break-word;
}

/* List View Styling */
.list-view {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.folder-item.list .folder-row {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 12px 16px;
    padding-left: 40px;
    /* Space for checkbox */
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.2s;
    cursor: pointer;
}

.folder-item.list .folder-row:hover {
    background: #f9fafb;
    border-color: #3b82f6;
}

.folder-item.is-selected.list .folder-row {
    background: #eff6ff;
    border-color: #3b82f6;
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
    color: #f59e0b;
    flex-shrink: 0;
}

.row-name {
    font-size: 14px;
    font-weight: 500;
    color: #111827;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.row-arrow {
    color: #9ca3af;
    font-size: 12px;
    flex-shrink: 0;
}

@media (max-width: 768px) {
    .grid-view {
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: 12px;
    }
}
</style>
