<template>
  <a-modal v-model:open="isOpen" title="Select Media" :width="900" :footer="null" @cancel="handleCancel">
    <div class="media-select-modal">
      <!-- Header with search and view mode -->
      <div class="modal-header">
        <a-input v-model:value="searchQuery" placeholder="Search files..." allow-clear class="search-input">
          <template #prefix>
            <search-outlined />
          </template>
        </a-input>

        <a-radio-group v-model:value="viewMode" button-style="solid" size="small">
          <a-radio-button value="grid">
            <appstore-outlined />
          </a-radio-button>
          <a-radio-button value="list">
            <unordered-list-outlined />
          </a-radio-button>
        </a-radio-group>
      </div>

      <!-- Folder breadcrumb navigation -->
      <div v-if="currentFolderId" class="breadcrumb">
        <a-breadcrumb>
          <a-breadcrumb-item>
            <a @click="navigateToFolder(null)">
              <home-outlined /> All Files
            </a>
          </a-breadcrumb-item>
          <a-breadcrumb-item v-for="folder in folderPath" :key="folder.id">
            <a @click="navigateToFolder(folder.id)">{{ folder.name }}</a>
          </a-breadcrumb-item>
        </a-breadcrumb>
      </div>

      <!-- Content area -->
      <div class="content-area">
        <a-spin :spinning="loading">
          <!-- Empty state -->
          <div v-if="!loading && files.length === 0 && folders.length === 0" class="empty-state">
            <inbox-outlined class="empty-icon" />
            <p>No files found</p>
          </div>

          <!-- Grid view -->
          <div v-else-if="viewMode === 'grid'" class="grid-view">
            <!-- Folders -->
            <div v-for="folder in filteredFolders" :key="'folder-' + folder.id" class="grid-item folder-item"
              @dblclick="navigateToFolder(folder.id)">
              <div class="folder-icon">
                <folder-outlined />
              </div>
              <div class="item-name">{{ folder.name }}</div>
            </div>

            <!-- Files -->
            <div v-for="file in filteredFiles" :key="'file-' + file.id" class="grid-item file-item"
              :class="{ selected: isSelected(file.id) }" @click="toggleSelection(file)">
              <div class="file-preview">
                <img v-if="isImage(file)" :src="getFileUrl(file)" :alt="file.original_name" />
                <file-image-outlined v-else class="file-icon" />
              </div>
              <div class="item-name">{{ file.original_name }}</div>
              <check-circle-filled v-if="isSelected(file.id)" class="selected-icon" />
            </div>
          </div>

          <!-- List view -->
          <a-table v-else :columns="columns"
            :data-source="[...folders.map(f => ({ ...f, type: 'folder' })), ...files.map(f => ({ ...f, type: 'file' }))]"
            :pagination="false" :scroll="{ y: 400 }" row-key="id" size="small">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'name'">
                <div class="name-cell">
                  <folder-outlined v-if="record.type === 'folder'" class="icon" />
                  <file-image-outlined v-else class="icon" />
                  <span @dblclick="record.type === 'folder' ? navigateToFolder(record.id) : null">
                    {{ record.type === 'folder' ? record.name : record.original_name }}
                  </span>
                </div>
              </template>
              <template v-if="column.key === 'action' && record.type === 'file'">
                <a-button type="primary" size="small"
                  :disabled="!multiple && selectedFiles.length > 0 && !isSelected(record.id)"
                  @click="toggleSelection(record)">
                  {{ isSelected(record.id) ? 'Deselect' : 'Select' }}
                </a-button>
              </template>
            </template>
          </a-table>
        </a-spin>
      </div>

      <!-- Footer with selection info and actions -->
      <div class="modal-footer">
        <div class="selection-info">
          <span v-if="selectedFiles.length > 0">
            {{ selectedFiles.length }} file(s) selected
          </span>
        </div>
        <div class="footer-actions">
          <a-button @click="handleCancel">Cancel</a-button>
          <a-button type="primary" :disabled="selectedFiles.length === 0" @click="handleConfirm">
            Select {{ selectedFiles.length > 0 ? `(${selectedFiles.length})` : '' }}
          </a-button>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  SearchOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  HomeOutlined,
  FolderOutlined,
  FileImageOutlined,
  InboxOutlined,
  CheckCircleFilled
} from '@ant-design/icons-vue'
import { mediaService } from '../services/media.service'
import type { MediaFile, MediaFolder } from '../interfaces'

interface Props {
  open: boolean
  multiple?: boolean
  accept?: string // 'image/*', 'video/*', etc.
}

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'select', files: MediaFile[]): void
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  accept: undefined
})

const emit = defineEmits<Emits>()

// State
const loading = ref(false)
const searchQuery = ref('')
const viewMode = ref<'grid' | 'list'>('grid')
const currentFolderId = ref<number | null>(null)
const folderPath = ref<MediaFolder[]>([])
const files = ref<MediaFile[]>([])
const folders = ref<MediaFolder[]>([])
const selectedFiles = ref<MediaFile[]>([])

// Computed
const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value)
})

const filteredFolders = computed(() => {
  if (!searchQuery.value) return folders.value
  return folders.value.filter(f =>
    f.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const filteredFiles = computed(() => {
  let result = files.value

  // Filter by search
  if (searchQuery.value) {
    result = result.filter(f =>
      f.original_name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // Filter by accept type
  if (props.accept) {
    const acceptType = props.accept.split('/')[0] // e.g., 'image' from 'image/*'
    result = result.filter(f => f.mime_type.startsWith(acceptType || ""))
  }

  return result
})

// Table columns for list view
const columns = [
  { title: 'Name', key: 'name', dataIndex: 'name' },
  { title: 'Type', key: 'type', dataIndex: 'type', width: 80 },
  { title: 'Action', key: 'action', width: 100, align: 'center' as const }
]

// Methods
async function fetchMedia() {
  loading.value = true
  try {
    const [filesResponse, foldersResponse] = await Promise.all([
      mediaService.getFiles({ folder_id: currentFolderId.value || 0 }),
      mediaService.getFolders()
    ])

    files.value = filesResponse.data || []
    // Filter folders to show only children of current folder
    folders.value = foldersResponse.filter(
      (f: MediaFolder) => f.parent_id === currentFolderId.value
    )
  } catch (error) {
    console.error('Failed to fetch media:', error)
  } finally {
    loading.value = false
  }
}

function navigateToFolder(folderId: number | null) {
  currentFolderId.value = folderId
  // Update breadcrumb path
  if (folderId === null) {
    folderPath.value = []
  } else {
    const folder = folders.value.find(f => f.id === folderId)
    if (folder) {
      folderPath.value.push(folder)
    }
  }
  fetchMedia()
}

function isImage(file: MediaFile): boolean {
  return file.mime_type.startsWith('image/')
}

function getFileUrl(file: MediaFile): string {
  return file.file_path || ''
}

function isSelected(fileId: number): boolean {
  return selectedFiles.value.some(f => f.id === fileId)
}

function toggleSelection(file: MediaFile) {
  const index = selectedFiles.value.findIndex(f => f.id === file.id)

  if (index > -1) {
    selectedFiles.value.splice(index, 1)
  } else {
    if (props.multiple) {
      selectedFiles.value.push(file)
    } else {
      selectedFiles.value = [file]
    }
  }
}

function handleCancel() {
  selectedFiles.value = []
  emit('update:open', false)
}

function handleConfirm() {
  emit('select', selectedFiles.value)
  selectedFiles.value = []
  emit('update:open', false)
}

// Watch for modal open
watch(() => props.open, (newValue) => {
  if (newValue) {
    fetchMedia()
  }
})
</script>

<style scoped>
.media-select-modal {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-header {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-input {
  flex: 1;
}

.breadcrumb {
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
}

.content-area {
  min-height: 400px;
  max-height: 500px;
  overflow-y: auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--muted-foreground);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

/* Grid View */
.grid-view {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  padding: 16px 0;
}

.grid-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border: 2px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.grid-item:hover {
  border-color: var(--primary);
  background: var(--muted);
}

.grid-item.selected {
  border-color: var(--primary);
  background: oklch(0.65 0.2 190 / 0.1);
}

.folder-item {
  cursor: pointer;
}

.folder-icon {
  font-size: 48px;
  color: var(--primary);
  margin-bottom: 8px;
}

.file-preview {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  overflow: hidden;
  border-radius: 4px;
}

.file-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.file-icon {
  font-size: 48px;
  color: var(--muted-foreground);
}

.item-name {
  font-size: 12px;
  text-align: center;
  word-break: break-word;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.selected-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 20px;
  color: var(--primary);
}

/* List View */
.name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.name-cell .icon {
  font-size: 16px;
}

/* Footer */
.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.selection-info {
  color: var(--muted-foreground);
  font-size: 14px;
}

.footer-actions {
  display: flex;
  gap: 8px;
}
</style>
