/**
 * Media Module Interfaces
 */

export interface MediaFile {
  id: number
  storeId: number
  userId: number
  folderId: number | null
  fileName: string
  originalName: string
  fileType: string // e.g. "image", "video", "document"
  mimeType: string // e.g. "image/png"
  fileSize: number // in bytes
  url: string
  thumbnailUrl: string | null
  width: number | null
  height: number | null
  alt: string | null
  title: string | null
  createdAt: string // ISO date string
  updatedAt: string | null
}

export interface MediaFolder {
  id: number
  name: string
  parent_id?: number
  files_count?: number
}

export interface MediaQueryParams {
  page?: number // default: 1
  pageSize?: number // default: 20
  storeId?: number
  userId?: number
  folderId?: number
  fileType?: string
  search?: string
}
