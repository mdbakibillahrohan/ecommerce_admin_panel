/* eslint-disable @typescript-eslint/no-explicit-any */

import api from '@/config/http.config'

export interface Theme {
  id: number
  name: string
  slug: string
  description?: string
  thumbnail_id?: number
  thumbnail?: { url: string }
  preview_url?: string
  is_premium: boolean
  price: number
  version: string
  author: string
  default_colors?: Record<string, string>
  default_fonts?: Record<string, string>
  layout_config?: Record<string, any>
}

export interface StoreTheme {
  id: number
  store_id: number
  theme_id: number
  theme: Theme
  config: Record<string, any>
  is_active: boolean
}

export interface CreateThemeDto {
  name: string
  slug: string
  description?: string
  thumbnail_id?: number
  preview_url?: string
  is_premium?: boolean
  price?: number
  version?: string
  author?: string
  default_colors?: Record<string, string>
  default_fonts?: Record<string, string>
  layout_config?: Record<string, any>
}

export interface UpdateStoreThemeDto {
  theme_id?: number
  config?: Record<string, any>
  is_active?: boolean
}

export const themesApi = {
  // Get all themes
  async getAll() {
    const res = await api.get<Theme[]>('/themes')
    return res.data
  },

  // Create theme (Admin)
  async create(data: CreateThemeDto) {
    return await api.post<Theme>('/themes', data).then((res) => res.data)
  },

  // Get my store theme
  async getMyStoreTheme() {
    return await api.get<StoreTheme>('/themes/store-theme').then((res) => res.data)
  },

  // Update my store theme
  async updateMyStoreTheme(data: UpdateStoreThemeDto) {
    return await api.patch<StoreTheme>('/themes/store-theme', data).then((res) => res.data)
  },
}
