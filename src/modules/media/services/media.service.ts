import api from '@/modules/shared/config/http.config'

// Import and re-export all interfaces
export type { MediaFile, MediaFolder, MediaQueryParams } from '../interfaces'

import type { MediaFile, MediaFolder, MediaQueryParams } from '../interfaces'
import type { IResponseDto } from '@/modules/shared/interfaces/common/IResponseDto.interface'

export const mediaService = {
  async getFiles(params?: MediaQueryParams) {
    const response = await api.get<IResponseDto<MediaFile[]>>('/media/files', { params })
    return response.data
  },

  async getFolders(storeId: number, parentId?: number) {
    const response = await api.get<IResponseDto<MediaFolder[]>>('/media/folders', { params: { storeId, parentId } })
    return response.data
  },

  async uploadFile(formData: FormData) {
    const response = await api.post<IResponseDto<MediaFile>>('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async createFolder(storeId: number, name: string, parentId?: number) {
    const response = await api.post<IResponseDto<MediaFolder>>('/media/folders', { storeId, name, parentId })
    return response.data
  },

  async deleteFile(id: number) {
    await api.delete(`/media/${id}`)
  },

  async deleteFolder(id: number) {
    await api.delete(`/media/folders/${id}`)
  },

  async bulkDelete(data: { file_ids?: number[]; folder_ids?: number[] }) {
    await api.post<IResponseDto<void>>('/media/bulk/delete', {
      fileIds: data.file_ids,
      folderIds: data.folder_ids,
    })
  },

  async bulkMove(data: {
    file_ids?: number[]
    folder_ids?: number[]
    target_folder_id?: number | null
  }) {
    await api.post<IResponseDto<void>>('/media/bulk/move', {
      fileIds: data.file_ids,
      folderIds: data.folder_ids,
      targetFolderId: data.target_folder_id,
    })
  },

  async updateFile(
    id: number,
    data: { file_name?: string; alt?: string; title?: string; folder_id?: number | null },
  ) {
    const response = await api.patch<IResponseDto<MediaFile>>(`/media/${id}`, data)
    return response.data
  },

  async updateFolder(id: number, data: { name: string }) {
    const response = await api.patch<IResponseDto<MediaFolder>>(`/media/folders/${id}`, data)
    return response.data
  },
}
