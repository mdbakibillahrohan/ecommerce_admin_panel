/* eslint-disable @typescript-eslint/no-explicit-any */
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  mediaService,
  type MediaFile,
  type MediaFolder,
} from '@/modules/media/services/media.service'
import { message } from 'ant-design-vue'
import { useStoreStore } from '@/modules/stores/store/store'

export const useMediaStore = defineStore('media', () => {
  // State
  const files = ref<MediaFile[]>([])
  const folders = ref<MediaFolder[]>([])
  const selectedFiles = ref<number[]>([])
  const currentFolder = ref<number | null>(null)
  const loading = ref(false)
  const uploading = ref(false)
  const error = ref<string | null>(null)

  const storeStore = useStoreStore()

  // Actions
  async function fetchFiles(folderId?: number) {
    loading.value = true
    error.value = null

    try {
      const response = await mediaService.getFiles({ folderId: folderId })
      files.value = response.data
      currentFolder.value = folderId || null
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch media files'
      message.error(error.value)
      console.error('Media fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchFolders() {
    loading.value = true
    error.value = null

    try {
      folders.value = await mediaService.getFolders(storeStore.activeStore?.id || 0)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch folders'
      message.error(error.value)
      console.error('Folders fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  async function uploadFile(formData: FormData) {
    uploading.value = true
    error.value = null

    try {
      await mediaService.uploadFile(formData)
      message.success('File uploaded successfully')
      await fetchFiles(currentFolder.value || undefined)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to upload file'
      message.error(error.value)
      console.error('Upload error:', err)
      return false
    } finally {
      uploading.value = false
    }
  }

  async function createFolder(name: string, parentId?: number) {
    loading.value = true
    error.value = null

    try {
      await mediaService.createFolder(storeStore.activeStore?.id || 0, name, parentId)
      message.success('Folder created successfully')
      await fetchFolders()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create folder'
      message.error(error.value)
      console.error('Create folder error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function deleteFile(id: number) {
    loading.value = true
    error.value = null

    try {
      await mediaService.deleteFile(id)
      message.success('File deleted successfully')
      await fetchFiles(currentFolder.value || undefined)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete file'
      message.error(error.value)
      console.error('Delete file error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function deleteFolder(id: number) {
    loading.value = true
    error.value = null

    try {
      await mediaService.deleteFolder(id)
      message.success('Folder deleted successfully')
      await fetchFolders()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete folder'
      message.error(error.value)
      console.error('Delete folder error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  function setSelectedFiles(fileIds: number[]) {
    selectedFiles.value = fileIds
  }

  function clearSelection() {
    selectedFiles.value = []
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    files,
    folders,
    selectedFiles,
    currentFolder,
    loading,
    uploading,
    error,
    // Actions
    fetchFiles,
    fetchFolders,
    uploadFile,
    createFolder,
    deleteFile,
    deleteFolder,
    setSelectedFiles,
    clearSelection,
    clearError,
  }
})
