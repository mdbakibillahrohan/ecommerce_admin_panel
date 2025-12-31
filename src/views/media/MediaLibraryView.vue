<template>
  <div class="media-library">
    <!-- Top Navigation Bar -->
    <div class="top-nav">
      <div class="nav-content">
        <div class="nav-left">
          <h1 class="nav-title">Media Library</h1>
          <a-breadcrumb class="nav-breadcrumb">
            <a-breadcrumb-item>
              <a href="#" @click.prevent="currentFolderId = null" class="breadcrumb-link">
                <HomeOutlined />
                <span>All Files</span>
              </a>
            </a-breadcrumb-item>
            <a-breadcrumb-item v-if="currentFolderId">
              <span class="breadcrumb-current">{{ getCurrentFolderName() }}</span>
            </a-breadcrumb-item>
          </a-breadcrumb>
        </div>

        <div class="nav-right">
          <a-input v-model:value="searchQuery" placeholder="Search files..." class="search-input"
            @pressEnter="fetchMedia" allow-clear>
            <template #prefix>
              <SearchOutlined />
            </template>
          </a-input>

          <div class="view-toggle">
            <a-button :type="viewMode === 'grid' ? 'primary' : 'text'" @click="viewMode = 'grid'" class="view-btn">
              <AppstoreOutlined />
            </a-button>
            <a-button :type="viewMode === 'list' ? 'primary' : 'text'" @click="viewMode = 'list'" class="view-btn">
              <UnorderedListOutlined />
            </a-button>
          </div>

          <a-button @click="showFolderModal" class="action-btn">
            <FolderAddOutlined />
            New Folder
          </a-button>
          <a-button type="primary" @click="showUploadModal" class="action-btn">
            <UploadOutlined />
            Upload
          </a-button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <a-spin :spinning="loading" size="large">
        <!-- Empty State -->
        <div v-if="!loading && folders.length === 0 && files.length === 0" class="empty-state">
          <div class="empty-icon">
            <InboxOutlined />
          </div>
          <h3 class="empty-title">No files yet</h3>
          <p class="empty-description">Start by uploading files or creating folders to organize your media</p>
          <a-button type="primary" size="large" @click="showUploadModal" class="empty-cta">
            <UploadOutlined />
            Upload Your First File
          </a-button>
        </div>

        <div v-else>
          <!-- Folders Section -->
          <div v-if="folders.length > 0" class="section">
            <div class="section-header">
              <div class="section-title">
                <FolderOutlined />
                <span>Folders</span>
                <span class="count-badge">{{ folders.length }}</span>
              </div>
            </div>

            <div :class="viewMode === 'grid' ? 'grid-view' : 'list-view'">
              <div v-for="folder in folders" :key="folder.id" :class="['folder-item', viewMode]"
                @click="openFolder(folder.id)">
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

          <!-- Files Section -->
          <div v-if="files.length > 0" class="section">
            <div class="section-header">
              <div class="section-title">
                <FileOutlined />
                <span>Files</span>
                <span class="count-badge">{{ files.length }}</span>
              </div>
            </div>

            <div :class="viewMode === 'grid' ? 'grid-view' : 'list-view'">
              <div v-for="file in files" :key="file.id" :class="['file-item', viewMode]">
                <div v-if="viewMode === 'grid'" class="file-card">
                  <div class="file-preview">
                    <a-image v-if="isImage(file.mime_type)" :src="getFileUrl(file.file_path)" class="preview-image"
                      :preview="{ src: getFileUrl(file.file_path) }" />
                    <div v-else class="preview-placeholder">
                      <FileTextFilled class="placeholder-icon" />
                      <span class="file-ext">{{ getFileExtension(file.original_name).toUpperCase() }}</span>
                    </div>

                    <div class="file-actions">
                      <a-dropdown trigger="click">
                        <a-button type="text" shape="circle" size="small" class="action-menu-btn">
                          <MoreOutlined />
                        </a-button>
                        <template #overlay>
                          <a-menu class="action-menu">
                            <a-menu-item key="delete" danger @click="handleDeleteFile(file.id)">
                              <DeleteOutlined /> Delete
                            </a-menu-item>
                          </a-menu>
                        </template>
                      </a-dropdown>
                    </div>
                  </div>

                  <div class="file-info">
                    <div class="file-name" :title="file.original_name">{{ file.original_name }}</div>
                    <div class="file-meta">{{ formatSize(file.size) }}</div>
                  </div>
                </div>

                <div v-else class="file-row">
                  <div class="row-left">
                    <div class="file-thumb">
                      <a-image v-if="isImage(file.mime_type)" :src="getFileUrl(file.url)" class="thumb-image"
                        :preview="{ src: getFileUrl(file.url) }" />
                      <FileTextFilled v-else class="thumb-icon" />
                    </div>
                    <div class="row-details">
                      <div class="row-name">{{ file.original_name }}</div>
                      <div class="row-meta">
                        {{ formatSize(file.size) }} • {{ getFileExtension(file.original_name).toUpperCase() }}
                      </div>
                    </div>
                  </div>

                  <a-dropdown trigger="click">
                    <a-button type="text" shape="circle" class="row-action">
                      <MoreOutlined />
                    </a-button>
                    <template #overlay>
                      <a-menu class="action-menu">
                        <a-menu-item key="delete" danger @click="handleDeleteFile(file.id)">
                          <DeleteOutlined /> Delete
                        </a-menu-item>
                      </a-menu>
                    </template>
                  </a-dropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-spin>
    </div>

    <!-- Upload Modal -->
    <a-modal v-model:open="uploadModalVisible" title="Upload Files" @ok="handleUpload" :confirmLoading="uploading"
      okText="Upload" width="600px" :class="'custom-modal'">
      <a-upload-dragger v-model:fileList="fileList" name="file" :multiple="true" :beforeUpload="beforeUpload"
        @remove="handleRemove" class="custom-uploader">
        <p class="uploader-icon">
          <CloudUploadOutlined />
        </p>
        <p class="uploader-text">Click or drag files to upload</p>
        <p class="uploader-hint">Support for multiple files • Max 10MB per file</p>
      </a-upload-dragger>
    </a-modal>

    <!-- Create Folder Modal -->
    <a-modal v-model:open="folderModalVisible" title="Create New Folder" @ok="handleCreateFolder" okText="Create"
      :class="'custom-modal'">
      <a-form layout="vertical" class="folder-form">
        <a-form-item label="Folder Name">
          <a-input v-model:value="newFolderName" placeholder="Enter folder name" size="large"
            @pressEnter="handleCreateFolder">
            <template #prefix>
              <FolderOutlined />
            </template>
          </a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { message } from 'ant-design-vue'
import {
  HomeOutlined,
  FolderFilled,
  FolderOutlined,
  FolderAddOutlined,
  FileTextFilled,
  FileOutlined,
  CloudUploadOutlined,
  UploadOutlined,
  SearchOutlined,
  MoreOutlined,
  DeleteOutlined,
  InboxOutlined,
  RightOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons-vue'
import { mediaService, type MediaFile, type MediaFolder } from '@/services/media.service'
import type { UploadProps } from 'ant-design-vue'
import api from '@/config/http.config'

const loading = ref(false)
const uploading = ref(false)
const files = ref<MediaFile[]>([])
const folders = ref<MediaFolder[]>([])
const currentFolderId = ref<number | null>(null)
const searchQuery = ref('')
const uploadModalVisible = ref(false)
const folderModalVisible = ref(false)
const fileList = ref<UploadProps['fileList']>([])
const newFolderName = ref('')
const viewMode = ref<'grid' | 'list'>('grid')

// Fetch Data
const fetchMedia = async () => {
  loading.value = true
  try {
    const params: any = { folder_id: currentFolderId.value }
    if (searchQuery.value) params.search = searchQuery.value

    const [filesData, foldersData] = await Promise.all([
      mediaService.getFiles(params),
      mediaService.getFolders()
    ])

    folders.value = foldersData.filter((f: any) =>
      currentFolderId.value ? f.parent_id === currentFolderId.value : !f.parent_id
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
})

// Lifecycle
onMounted(() => {
  fetchMedia()
})

// File Helpers
const isImage = (mimeType: string) => mimeType.startsWith('image/')

const getFileUrl = (path: string) => {
  if (path) {
    if (path.startsWith("http")) return path
    const correctedPath = `http://localhost:8000${path}`
    console.log(correctedPath);

    return correctedPath
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

// Actions
const openFolder = (id: number) => {
  currentFolderId.value = id
}

const showUploadModal = () => {
  fileList.value = []
  uploadModalVisible.value = true
}

const showFolderModal = () => {
  newFolderName.value = ''
  folderModalVisible.value = true
}

const beforeUpload: UploadProps['beforeUpload'] = file => {
  fileList.value = [...(fileList.value || []), file]
  return false
}

const handleRemove: UploadProps['onRemove'] = file => {
  const index = (fileList.value || []).indexOf(file)
  const newFileList = fileList.value!.slice()
  newFileList.splice(index, 1)
  fileList.value = newFileList
}

const handleUpload = async () => {
  if (!fileList.value || fileList.value.length === 0) {
    message.warning('Please select files to upload')
    return
  }

  uploading.value = true
  try {
    const formData = new FormData()

    fileList.value.forEach((file: any) => {
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

const handleCreateFolder = async () => {
  if (!newFolderName.value.trim()) {
    message.warning('Please enter a folder name')
    return
  }

  try {
    await mediaService.createFolder(newFolderName.value, currentFolderId.value || undefined)
    message.success('Folder created successfully')
    folderModalVisible.value = false
    fetchMedia()
  } catch (error) {
    message.error('Failed to create folder')
  }
}

const handleDeleteFile = async (id: number) => {
  try {
    await mediaService.deleteFile(id)
    message.success('File deleted successfully')
    fetchMedia()
  } catch (error) {
    message.error('Failed to delete file')
  }
}

const getCurrentFolderName = () => {
  if (!currentFolderId.value) return ''
  const folder = folders.value.find(f => f.id === currentFolderId.value)
  return folder ? folder.name : 'Unknown Folder'
}
</script>

<style scoped>
/* Complete redesign with light theme and fixed positioning */
.media-library {
  min-height: 100vh;
  background: #f9fafb;
  color: #111827;
  font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif;
}

/* Top Navigation */
.top-nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.nav-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
  min-width: 0;
}

.nav-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  white-space: nowrap;
}

.nav-breadcrumb {
  display: flex;
  align-items: center;
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: #3b82f6;
}

.breadcrumb-current {
  color: #111827;
  font-weight: 500;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-input {
  width: 240px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.search-input :deep(input) {
  background: transparent;
  color: #111827;
}

.search-input :deep(input::placeholder) {
  color: #9ca3af;
}

.search-input :deep(.ant-input-prefix) {
  color: #9ca3af;
}

.view-toggle {
  display: flex;
  gap: 4px;
  background: #f9fafb;
  border-radius: 8px;
  padding: 4px;
  border: 1px solid #e5e7eb;
}

.view-btn {
  border: none;
  background: transparent;
  color: #6b7280;
}

.view-btn:deep(.ant-btn-primary) {
  background: #3b82f6;
  color: #ffffff;
}

.action-btn {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  color: #374151;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.action-btn:deep(.ant-btn-primary) {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #ffffff;
}

.action-btn:deep(.ant-btn-primary):hover {
  background: #2563eb;
  border-color: #2563eb;
}

/* Main Content */
.main-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 32px 24px;
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

/* Sections */
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

/* File Cards */
.file-item.grid .file-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s;
}

.file-item.grid .file-card:hover {
  background: #f9fafb;
  border-color: #3b82f6;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.file-preview {
  position: relative;
  aspect-ratio: 1;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.placeholder-icon {
  font-size: 48px;
  color: #3b82f6;
}

.file-ext {
  font-size: 11px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
}

.file-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.file-item.grid .file-card:hover .file-actions {
  opacity: 1;
}

.action-menu-btn {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  color: #374151;
  border: 1px solid #e5e7eb;
}

.action-menu-btn:hover {
  background: #ffffff;
  border-color: #d1d5db;
}

.file-info {
  padding: 12px 16px;
}

.file-name {
  font-size: 13px;
  font-weight: 500;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 4px;
}

.file-meta {
  font-size: 12px;
  color: #9ca3af;
}

/* List View */
.list-view {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.folder-item.list .folder-row,
.file-item.list .file-row {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s;
  cursor: pointer;
}

.folder-item.list .folder-row:hover,
.file-item.list .file-row:hover {
  background: #f9fafb;
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

.file-thumb {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.thumb-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-icon {
  font-size: 20px;
  color: #3b82f6;
}

.row-details {
  flex: 1;
  min-width: 0;
}

.row-name {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.row-meta {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 2px;
}

.row-arrow {
  color: #9ca3af;
  font-size: 12px;
  flex-shrink: 0;
}

.row-action {
  color: #6b7280;
  flex-shrink: 0;
}

/* Modals */
.custom-modal :deep(.ant-modal-content) {
  background: #ffffff;
  border-radius: 12px;
}

.custom-modal :deep(.ant-modal-header) {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  border-radius: 12px 12px 0 0;
}

.custom-modal :deep(.ant-modal-title) {
  color: #111827;
  font-weight: 600;
}

.custom-modal :deep(.ant-modal-body) {
  padding: 24px;
}

/* Upload Dragger */
.custom-uploader :deep(.ant-upload-drag) {
  background: #f9fafb;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  transition: all 0.3s;
}

.custom-uploader :deep(.ant-upload-drag:hover) {
  border-color: #3b82f6;
  background: #eff6ff;
}

.uploader-icon {
  font-size: 64px;
  color: #3b82f6;
  margin-bottom: 16px;
}

.uploader-text {
  font-size: 16px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 8px;
}

.uploader-hint {
  font-size: 13px;
  color: #6b7280;
}

/* Folder Form */
.folder-form :deep(.ant-form-item-label > label) {
  color: #374151;
  font-weight: 500;
}

.folder-form :deep(.ant-input) {
  border-radius: 8px;
  border-color: #e5e7eb;
}

.folder-form :deep(.ant-input:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

/* Action Menu */
.action-menu {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.action-menu :deep(.ant-dropdown-menu-item) {
  color: #374151;
}

.action-menu :deep(.ant-dropdown-menu-item:hover) {
  background: #f9fafb;
}

.action-menu :deep(.ant-dropdown-menu-item-danger) {
  color: #ef4444;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-content {
    flex-wrap: wrap;
  }

  .nav-left {
    flex: 1 1 100%;
  }

  .nav-right {
    flex: 1 1 100%;
    justify-content: space-between;
  }

  .search-input {
    flex: 1;
  }

  .grid-view {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
  }
}
</style>
