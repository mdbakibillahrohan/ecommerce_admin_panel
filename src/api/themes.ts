import api from './index'

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
    getAll() {
        return api.get<Theme[]>('/themes').then(res => res.data)
    },

    // Create theme (Admin)
    create(data: CreateThemeDto) {
        return api.post<Theme>('/themes', data).then(res => res.data)
    },

    // Get my store theme
    getMyStoreTheme() {
        return api.get<StoreTheme>('/themes/store-theme').then(res => res.data)
    },

    // Update my store theme
    updateMyStoreTheme(data: UpdateStoreThemeDto) {
        return api.patch<StoreTheme>('/themes/store-theme', data).then(res => res.data)
    }
}
