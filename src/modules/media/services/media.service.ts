import api from '@/modules/shared/config/http.config'

// Import and re-export all interfaces
export type { MediaFile, MediaFolder, MediaQueryParams } from '../interfaces'

import type { MediaFile, MediaFolder, MediaQueryParams } from '../interfaces'

export const mediaService = {
  async getFiles(params?: MediaQueryParams) {
    const response = await api.get('/media', { params })
    return response.data
  },

  async getFolders() {
    const response = await api.get('/media/folders/all')
    return response.data
  },

  async uploadFile(formData: FormData) {
    const response = await api.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async createFolder(name: string, parentId?: number) {
    const response = await api.post('/media/folders', { name, parent_id: parentId })
    return response.data
  },

  async deleteFile(id: number) {
    await api.delete(`/media/${id}`)
  },

  async deleteFolder(id: number) {
    await api.delete(`/media/folders/${id}`)
  },
}
