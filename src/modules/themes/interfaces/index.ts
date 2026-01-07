/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Themes Module Interfaces
 */

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
