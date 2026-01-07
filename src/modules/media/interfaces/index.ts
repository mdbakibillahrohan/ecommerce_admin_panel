/**
 * Media Module Interfaces
 */

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
  files_count?: number
}

export interface MediaQueryParams {
  folder_id?: number
  search?: string
  mime_type?: string
  [key: string]: unknown
}
