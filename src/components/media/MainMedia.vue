<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { InboxOutlined, UploadOutlined, DeleteOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { mediaService, type MediaFile, type MediaFolder } from '@/services/media.service'
import type { UploadProps } from 'ant-design-vue'
import api from '@/config/http.config'

// Sub-components
import MediaHeader from './MediaHeader.vue'
import FolderList from './FolderList.vue'
import FileList from './FileList.vue'
import UploadModal from './UploadModal.vue'
import CreateFolderModal from './CreateFolderModal.vue'

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

const emits = defineEmits([
  'file-selected',
])

// State
const loading = ref(false)
const uploading = ref(false)
const files = ref<MediaFile[]>([])
const folders = ref<MediaFolder[]>([])
const currentFolderId = ref<number | null>(null)
const searchQuery = ref('')
const viewMode = ref<'grid' | 'list'>('grid')
const folderNameTree = ref<MediaFolder[]>([])

// Modals
const uploadModalVisible = ref(false)
const folderModalVisible = ref(false)

// Selection State
const selectedFileIds = ref<number[]>([])
const selectedFolderIds = ref<number[]>([])

const hasSelection = computed(() => selectedFileIds.value.length > 0 || selectedFolderIds.value.length > 0)
const selectionCount = computed(() => selectedFileIds.value.length + selectedFolderIds.value.length)

// Fetch Data
const fetchMedia = async () => {
  loading.value = true
  // Clear selection on fetch/refresh
  selectedFileIds.value = []
  selectedFolderIds.value = []

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any = { folder_id: currentFolderId.value }
    if (searchQuery.value) params.search = searchQuery.value

    const [filesData, foldersData] = await Promise.all([
      mediaService.getFiles(params),
      mediaService.getFolders()
    ])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    folders.value = foldersData.filter((f: any) =>
      currentFolderId.value ? f.parent_id === Number(currentFolderId.value) : !f.parent_id
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
    return;
  }

  const currentFolderDetails = folders.value.find((f: MediaFolder) => f.id === currentFolderId.value)

  // Logic to build breadcrumb tree
  if (folderNameTree.value.length > 0) {
    const folderNameTreeFolderIndex = folderNameTree.value.findIndex(f => f.id === currentFolderId.value);
    if (folderNameTreeFolderIndex == -1) {
      folderNameTree.value.push(currentFolderDetails || { id: currentFolderId.value, name: "" })
      return;
    }
    const newFolderNameTree = folderNameTree.value.slice(0, folderNameTreeFolderIndex + 1);
    folderNameTree.value = newFolderNameTree;
    return;
  }

  folderNameTree.value.push(currentFolderDetails || { id: currentFolderId.value, name: "" })
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fileList.forEach((file: any) => {
      formData.append('files', file.originFileObj)
    })

    if (currentFolderId.value) {
      formData.append('folder_id', currentFolderId.value.toString())
    }

    await api.post('/media/upload/bulk', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
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
    await mediaService.createFolder(name, currentFolderId.value || undefined)
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
  const filesToReturn = files.value.filter(file => selectedFileIds.value.includes(file.id))
  emits('file-selected', { usingFor: props.usingFor, files: filesToReturn })
}

const handleBulkDelete = () => {
  Modal.confirm({
    title: `Delete ${selectionCount.value} items?`,
    content: 'Are you sure you want to delete the selected items? This action cannot be undone.',
    okText: 'Delete',
    okType: 'danger',
    async onOk() {
      try {
        const promises = []
        // Delete files
        for (const id of selectedFileIds.value) {
          promises.push(mediaService.deleteFile(id))
        }
        // Delete folders
        for (const id of selectedFolderIds.value) {
          promises.push(mediaService.deleteFolder(id))
        }

        await Promise.all(promises)
        message.success(`Deleted ${selectionCount.value} items successfully`)
        fetchMedia()
      } catch (error) {
        console.error(error)
        message.error('Failed to delete some items')
        // Refresh anyway to show what remains
        fetchMedia()
      }
    }
  })
}

// Selection Logic
const toggleFileSelection = (id: number) => {
  if (selectedFileIds.value.includes(id)) {
    selectedFileIds.value = selectedFileIds.value.filter(i => i !== id)
  } else {
    selectedFileIds.value = [...selectedFileIds.value, id] // Create new array reactivity
  }
}

const toggleFolderSelection = (id: number) => {
  if (selectedFolderIds.value.includes(id)) {
    selectedFolderIds.value = selectedFolderIds.value.filter(i => i !== id)
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
            @open-folder="handleOpenFolder" @toggle-selection="toggleFolderSelection" />

          <FileList :files="files" :viewMode="viewMode" :selectedIds="selectedFileIds" :isSelectMode="isSelectMode"
            @preview-file="() => { }" @delete-file="deleteSingleFile" @toggle-selection="toggleFileSelection"
            @select-file="handleSelectFile" />
        </div>
      </a-spin>
    </div>

    <!-- Bulk Action Bar -->
    <div v-if="hasSelection" class="bulk-action-bar">
      <div class="bulk-content">
        <span class="bulk-count">{{ selectionCount }} items selected</span>
        <div class="bulk-actions">
          <!-- Potential "Use Selected" button here if needed for multi-pick -->

          <a-button v-if="isSelectMode" type="primary" @click="handleUseSelected">
            <UploadOutlined />
            Use Selected
          </a-button>

          <a-button type="primary" danger @click="handleBulkDelete">
            <DeleteOutlined />
            Delete Selected
          </a-button>

          <a-button @click="clearSelection">
            <CloseOutlined />
            Cancel
          </a-button>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <UploadModal v-model:open="uploadModalVisible" :confirmLoading="uploading" @upload="handleUploadFiles" />

    <CreateFolderModal v-model:open="folderModalVisible" @create="handleCreateFolder" />
  </div>
</template>

<style scoped>
.media-library {
  min-height: 100vh;
  background: #f9fafb;
  color: #111827;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
  position: relative;
}

.main-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 32px 24px;
  padding-bottom: 100px;
  /* Space for bulk bar */
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 24px;
  text-align: center;
}

.empty-icon {
  font-size: 80px;
  color: #d1d5db;
  margin-bottom: 24px;
}

.empty-title {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px 0;
}

.empty-description {
  font-size: 15px;
  color: #6b7280;
  margin: 0 0 32px 0;
  max-width: 400px;
}

.empty-cta {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Bulk Action Bar */
.bulk-action-bar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  padding: 12px 24px;
  border-radius: 12px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  animation: slide-up 0.3s ease-out;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }

  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

.bulk-content {
  display: flex;
  align-items: center;
  gap: 24px;
}

.bulk-count {
  font-weight: 600;
  color: #111827;
}

.bulk-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
