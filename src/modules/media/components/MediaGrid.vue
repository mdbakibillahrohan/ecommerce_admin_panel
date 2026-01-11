<script setup lang="ts">
interface MediaFile {
    id: number
    filename: string
    url: string
    mime_type: string
    size: number
    created_at: string
    is_folder?: boolean
}

interface Props {
    files: MediaFile[]
    selectedIds: number[]
}

interface Emits {
    (e: 'select', ids: number[]): void
    (e: 'open', file: MediaFile): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function handleSelect(id: number) {
    const newSelection = props.selectedIds.includes(id)
        ? props.selectedIds.filter((i) => i !== id)
        : [...props.selectedIds, id]
    emit('select', newSelection)
}

function handleOpen(file: MediaFile) {
    emit('open', file)
}

function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(mimeType: string, isFolder?: boolean) {
    if (isFolder) return 'folder'
    if (mimeType.startsWith('image/')) return 'file-image'
    if (mimeType.startsWith('video/')) return 'video-camera'
    if (mimeType.startsWith('audio/')) return 'audio'
    if (mimeType.includes('pdf')) return 'file-pdf'
    return 'file'
}
</script>

<template>
    <div class="media-grid">
        <div v-for="file in files" :key="file.id" class="media-item"
            :class="{ selected: selectedIds.includes(file.id) }" @click="handleSelect(file.id)"
            @dblclick="handleOpen(file)">
            <div class="media-preview">
                <img v-if="file.mime_type.startsWith('image/')" :src="file.url" :alt="file.filename" />
                <div v-else class="file-icon">
                    <component :is="`${getFileIcon(file.mime_type, file.is_folder)}-outlined`"
                        :style="{ fontSize: '48px' }" />
                </div>
            </div>

            <div class="media-info">
                <div class="media-name" :title="file.filename">{{ file.filename }}</div>
                <div v-if="!file.is_folder" class="media-size">{{ formatFileSize(file.size) }}</div>
            </div>

            <div v-if="selectedIds.includes(file.id)" class="selection-indicator">
                <check-circle-filled />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
  FolderOutlined,
  FileImageOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  FilePdfOutlined,
  FileOutlined,
  CheckCircleFilled,
} from '@ant-design/icons-vue'
</script>

<style scoped>
.media-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
}

.media-item {
    position: relative;
    border: 2px solid var(--border);
    border-radius: 12px;
    padding: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.media-item:hover {
    border-color: oklch(0.65 0.25 195);
    box-shadow: 0 4px 12px rgba(13, 148, 136, 0.1);
}

.media-item.selected {
    border-color: oklch(0.65 0.25 195);
    background: var(--accent);
}

.media-preview {
    width: 100%;
    height: 140px;
    border-radius: 8px;
    overflow: hidden;
    background: var(--muted);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
}

.media-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.file-icon {
    color: var(--muted-foreground);
}

.media-info {
    text-align: center;
}

.media-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--foreground);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 4px;
}

.media-size {
    font-size: 13px;
    color: var(--muted-foreground);
}

.selection-indicator {
    position: absolute;
    top: 8px;
    right: 8px;
    color: oklch(0.65 0.25 195);
    font-size: 24px;
}
</style>
