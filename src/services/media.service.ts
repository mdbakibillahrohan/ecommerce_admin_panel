/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/config/http.config'

export interface MediaFile {
  id: number
  original_name: string
  filename: string
  mime_type: string
  size: number
  file_path: string
  folder_id?: number
  created_at: string
}

export interface MediaFolder {
  id: number
  name: string
  parent_id?: number
}

export const mediaService = {
  async getFiles(params?: any) {
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
