import api from '@/modules/shared/config/http.config'

// Import and re-export all interfaces
export type { Theme, StoreTheme, CreateThemeDto, UpdateStoreThemeDto } from '../interfaces'

import type { Theme, StoreTheme, CreateThemeDto, UpdateStoreThemeDto } from '../interfaces'

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
