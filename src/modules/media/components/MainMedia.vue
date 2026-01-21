<script lang="ts" setup>
import { ref, onMounted, watch, computed, h } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { InboxOutlined, UploadOutlined, DeleteOutlined, CloseOutlined } from '@ant-design/icons-vue'
import {
  mediaService,
  type MediaFile,
  type MediaFolder,
  type MediaQueryParams,
} from '@/modules/media/services/media.service'
import type { UploadProps } from 'ant-design-vue'
import api from '@/modules/shared/config/http.config'

// Sub-components
import MediaHeader from './MediaHeader.vue'
import FolderList from './FolderList.vue'
import FileList from './FileList.vue'
import UploadModal from './UploadModal.vue'
import CreateFolderModal from './CreateFolderModal.vue'
import { useStoreStore } from '@/modules/stores/store/store'

const props = defineProps({
  isSelectMode: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  usingFor: {
    type: String,
    default: '',
  },
})

const emits = defineEmits(['file-selected'])

// State
const loading = ref(false)
const uploading = ref(false)
const files = ref<MediaFile[]>([])
const folders = ref<MediaFolder[]>([])
const currentFolderId = ref<number | null>(null)
const searchQuery = ref('')
const viewMode = ref<'grid' | 'list'>('grid')
const folderNameTree = ref<MediaFolder[]>([])

const storeStore = useStoreStore()

// Modals
const uploadModalVisible = ref(false)
const folderModalVisible = ref(false)

// Selection State
const selectedFileIds = ref<number[]>([])
const selectedFolderIds = ref<number[]>([])
const moveModalVisible = ref(false)
const targetFolderId = ref<number | null>(null)

const hasSelection = computed(
  () => selectedFileIds.value.length > 0 || selectedFolderIds.value.length > 0,
)
const selectionCount = computed(() => selectedFileIds.value.length + selectedFolderIds.value.length)

// Fetch Data
const fetchMedia = async () => {
  loading.value = true
  // Clear selection on fetch/refresh
  selectedFileIds.value = []
  selectedFolderIds.value = []

  try {
    const params: MediaQueryParams = {
      folderId: currentFolderId.value || undefined,
      search: searchQuery.value,
      storeId: storeStore.activeStore?.id || 1,
    }

    const [filesData, foldersData] = await Promise.all([
      mediaService.getFiles(params),
      mediaService.getFolders(storeStore.activeStore?.id || 1, currentFolderId.value || undefined),
    ])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    folders.value = foldersData.filter((f: any) =>
      currentFolderId.value ? f.parentId === Number(currentFolderId.value) : !f.parentId,
    )

    files.value = filesData.data
  } catch (error) {
    console.error(error)
    message.error('Failed to load media')
  } finally {
    loading.value = false
  }
}

// Watchers
watch(currentFolderId, () => {
  fetchMedia()

  if (!currentFolderId.value) {
    folderNameTree.value = []
    return
  }

  const currentFolderDetails = folders.value.find(
    (f: MediaFolder) => f.id === currentFolderId.value,
  )

  // Logic to build breadcrumb tree
  if (folderNameTree.value.length > 0) {
    const folderNameTreeFolderIndex = folderNameTree.value.findIndex(
      (f) => f.id === currentFolderId.value,
    )
    if (folderNameTreeFolderIndex == -1) {
      folderNameTree.value.push(currentFolderDetails || { id: currentFolderId.value, name: '' })
      return
    }
    const newFolderNameTree = folderNameTree.value.slice(0, folderNameTreeFolderIndex + 1)
    folderNameTree.value = newFolderNameTree
    return
  }

  folderNameTree.value.push(currentFolderDetails || { id: currentFolderId.value, name: '' })
})

// Navigation
const handleNavigate = (id: number | null) => {
  currentFolderId.value = id
}

const handleOpenFolder = (id: number) => {
  currentFolderId.value = id
}

// Upload & Create Logic
const handleUploadFiles = async (fileList: UploadProps['fileList']) => {
  if (!fileList || fileList.length === 0) {
    message.warning('Please select files to upload')
    return
  }

  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('storeId', storeStore?.activeStore?.id.toString() || '1')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fileList.forEach((file: any) => {
      formData.append('files', file.originFileObj)
    })

    if (currentFolderId.value) {
      formData.append('folderId', currentFolderId.value.toString())
    }

    await api.post('/media/upload/multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    message.success('Files uploaded successfully')
    uploadModalVisible.value = false
    fetchMedia()
  } catch (error) {
    console.error(error)
    message.error('Upload failed')
  } finally {
    uploading.value = false
  }
}

const handleCreateFolder = async (name: string) => {
  try {
    if (!storeStore.activeStore) {
      message.error('No store found')
      return
    }
    await mediaService.createFolder(
      storeStore.activeStore?.id,
      name,
      currentFolderId.value || undefined,
    )
    message.success('Folder created successfully')
    folderModalVisible.value = false
    fetchMedia()
  } catch (error) {
    console.error(error)
    message.error('Failed to create folder')
  }
}

// Deletion Logic
const deleteSingleFile = async (id: number) => {
  try {
    await mediaService.deleteFile(id)
    message.success('File deleted successfully')
    fetchMedia()
  } catch (error) {
    console.error(error)
    message.error('Failed to delete file')
  }
}

const handleUseSelected = () => {
  const filesToReturn = files.value.filter((file) => selectedFileIds.value.includes(file.id))
  emits('file-selected', { usingFor: props.usingFor, files: filesToReturn })
}

const handleBulkDelete = () => {
  if (selectionCount.value === 0) return

  Modal.confirm({
    title: `Delete ${selectionCount.value} items?`,
    content: 'Are you sure you want to delete the selected items? This action cannot be undone.',
    okText: 'Delete',
    okType: 'danger',
    async onOk() {
      try {
        await mediaService.bulkDelete({
          file_ids: selectedFileIds.value,
          folder_ids: selectedFolderIds.value,
        })
        message.success(`Deleted ${selectionCount.value} items successfully`)
        clearSelection()
        fetchMedia()
      } catch (error) {
        console.error(error)
        message.error('Failed to delete some items')
        fetchMedia()
      }
    },
  })
}

const handleBulkMove = async () => {
  if (selectionCount.value === 0) return
  moveModalVisible.value = true
}

const executeBulkMove = async () => {
  try {
    await mediaService.bulkMove({
      file_ids: selectedFileIds.value,
      folder_ids: selectedFolderIds.value,
      target_folder_id: targetFolderId.value,
    })
    message.success(`Moved ${selectionCount.value} items successfully`)
    moveModalVisible.value = false
    clearSelection()
    fetchMedia()
  } catch (error) {
    console.error(error)
    message.error('Failed to move items')
  }
}

const tempRenameValue = ref('')

const handleRenameItem = async (type: 'file' | 'folder', item: MediaFile | MediaFolder) => {
  const currentName =
    type === 'file' ? (item as MediaFile).originalName : (item as MediaFolder).name

  tempRenameValue.value = currentName

  Modal.confirm({
    title: `Rename ${type}`,
    content: () =>
      h('div', [
        h('p', `Enter new name for "${currentName}":`),
        h('input', {
          class: 'ant-input',
          value: tempRenameValue.value,
          onInput: (e: Event) => {
            const target = e.target as HTMLInputElement
            tempRenameValue.value = target.value
          },
        }),
      ]),
    async onOk() {
      if (!tempRenameValue.value) return

      try {
        if (type === 'file') {
          await mediaService.updateFile(item.id, { file_name: tempRenameValue.value })
        } else {
          await mediaService.updateFolder(item.id, { name: tempRenameValue.value })
        }
        message.success('Renamed successfully')
        fetchMedia()
      } catch (error) {
        console.error(error)
        message.error('Failed to rename')
      }
    },
  })
}

// Selection Logic
const toggleFileSelection = (id: number) => {
  if (selectedFileIds.value.includes(id)) {
    selectedFileIds.value = selectedFileIds.value.filter((i) => i !== id)
  } else {
    selectedFileIds.value = [...selectedFileIds.value, id]
  }
}

const toggleFolderSelection = (id: number) => {
  if (selectedFolderIds.value.includes(id)) {
    selectedFolderIds.value = selectedFolderIds.value.filter((i) => i !== id)
  } else {
    selectedFolderIds.value = [...selectedFolderIds.value, id]
  }
}

const clearSelection = () => {
  selectedFileIds.value = []
  selectedFolderIds.value = []
}

// Single Select (for props.isSelectMode)
const handleSelectFile = (file: MediaFile) => {
  if (props.isSelectMode) {
    emits('file-selected', { usingFor: props.usingFor, files: [file] })
  }
}

onMounted(() => {
  fetchMedia()
})
</script>

<template>
  <div class="media-library">
    <MediaHeader v-model:searchQuery="searchQuery" v-model:viewMode="viewMode" :folderNameTree="folderNameTree"
      :currentFolderId="currentFolderId" @navigate="handleNavigate" @create-folder="folderModalVisible = true"
      @upload="uploadModalVisible = true" @refresh="fetchMedia" />

    <!-- Main Content -->
    <div class="main-content">
      <a-spin :spinning="loading" size="large">
        <div v-if="!loading && folders.length === 0 && files.length === 0" class="empty-state">
          <div class="empty-icon">
            <InboxOutlined />
          </div>
          <h3 class="empty-title">No files yet</h3>
          <p class="empty-description">Start by uploading files or creating folders</p>
          <a-button type="primary" size="large" @click="uploadModalVisible = true" class="empty-cta">
            <UploadOutlined />
            Upload Your First File
          </a-button>
        </div>

        <div v-else>
          <FolderList :folders="folders" :viewMode="viewMode" :selectedIds="selectedFolderIds"
            @open-folder="handleOpenFolder" @toggle-selection="toggleFolderSelection"
            @rename="(f: MediaFolder) => handleRenameItem('folder', f)" />

          <FileList :files="files" :viewMode="viewMode" :selectedIds="selectedFileIds" :isSelectMode="isSelectMode"
            @preview-file="() => { }" @delete-file="deleteSingleFile" @toggle-selection="toggleFileSelection"
            @select-file="handleSelectFile" @rename="(f: MediaFile) => handleRenameItem('file', f)" />
        </div>
      </a-spin>
    </div>

    <!-- Bulk Action Bar -->
    <transition name="slide-up">
      <div v-if="hasSelection" class="bulk-action-bar">
        <div class="bulk-content">
          <div class="bulk-info">
            <div class="bulk-count">{{ selectionCount }}</div>
            <span class="bulk-label">items selected</span>
          </div>
          <div class="bulk-actions">
            <a-button v-if="isSelectMode" type="primary" size="large" @click="handleUseSelected"
              class="action-btn use-btn">
              <UploadOutlined />
              Use Selected
            </a-button>

            <a-button type="primary" size="large" @click="handleBulkMove" class="action-btn move-btn">
              <ExportOutlined />
              Move
            </a-button>

            <a-button type="primary" danger size="large" @click="handleBulkDelete" class="action-btn delete-btn">
              <DeleteOutlined />
              Delete
            </a-button>

            <a-button size="large" @click="clearSelection" class="action-btn cancel-btn">
              <CloseOutlined />
              Cancel
            </a-button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Modals -->
    <UploadModal v-model:open="uploadModalVisible" :confirmLoading="uploading" @upload="handleUploadFiles" />

    <CreateFolderModal v-model:open="folderModalVisible" @create="handleCreateFolder" />

    <!-- Move Modal -->
    <a-modal v-model:open="moveModalVisible" title="Move Items" @ok="executeBulkMove" okText="Move Here">
      <div class="move-modal-content">
        <p>Select destination folder:</p>
        <a-select v-model:value="targetFolderId" style="width: 100%" placeholder="Select folder">
          <a-select-option :value="null">Root</a-select-option>
          <a-select-option v-for="folder in folders" :key="folder.id" :value="folder.id">
            {{ folder.name }}
          </a-select-option>
        </a-select>
      </div>
    </a-modal>
  </div>
</template>

<style scoped>
/* Replace all hardcoded colors with CSS variables for proper theming */
.media-library {
  min-height: 100vh;
  background: var(--background);
  color: var(--foreground);
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
  position: relative;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.main-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 32px 24px;
  padding-bottom: 100px;
}

/* Empty State with teal accents */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 24px;
  text-align: center;
  animation: fade-in 0.5s ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.empty-icon {
  font-size: 80px;
  color: var(--muted-foreground);
  margin-bottom: 24px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

.empty-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--foreground);
  margin: 0 0 12px 0;
}

.empty-description {
  font-size: 15px;
  color: var(--muted-foreground);
  margin: 0 0 32px 0;
  max-width: 400px;
}

.empty-cta {
  background: var(--primary);
  border-color: var(--primary);
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 32px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.empty-cta:hover {
  background: var(--primary-hover);
  border-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

/* Enhanced Bulk Action Bar with glass morphism */
.bulk-action-bar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  background: var(--card);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border);
  padding: 16px 28px;
  border-radius: 16px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(0, 0, 0, 0.1);
  min-width: 500px;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translate(-50%, 30px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 30px);
}

.bulk-content {
  display: flex;
  align-items: center;
  gap: 24px;
  justify-content: space-between;
}

.bulk-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bulk-count {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary), var(--primary-hover));
  color: #ffffff;
  border-radius: 10px;
  font-weight: 700;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.bulk-label {
  font-weight: 600;
  color: var(--foreground);
  font-size: 15px;
}

.bulk-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-btn {
  height: 44px;
  padding: 0 24px;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
}

.use-btn {
  background: var(--primary);
  border-color: var(--primary);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.use-btn:hover {
  background: var(--primary-hover);
  border-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.delete-btn {
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);
}

.delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.cancel-btn {
  background: var(--background);
  border-color: var(--border);
  color: var(--foreground);
}

.cancel-btn:hover {
  background: var(--muted);
  border-color: var(--border);
  transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .bulk-action-bar {
    min-width: auto;
    width: calc(100% - 48px);
    padding: 12px 16px;
  }

  .bulk-content {
    flex-direction: column;
    gap: 16px;
  }

  .bulk-actions {
    width: 100%;
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }

  .main-content {
    padding: 24px 16px;
    padding-bottom: 180px;
  }
}
</style>
