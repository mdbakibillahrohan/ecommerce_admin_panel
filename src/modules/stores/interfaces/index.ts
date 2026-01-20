/**
 * Stores Module Interfaces
 */

export interface Store {
  id: number
  name: string
  slug: string
  description?: string
  store_category_id: number
  store_category?: StoreCategory
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'INACTIVE'
  email?: string
  phone?: string
  address?: string
  city?: string
  country?: string
  currency?: string
  timezone?: string
  owner_id: number
  logo_id?: number
  logo?: StoreLogo
  custom_domain?: string
  tagline?: string
  created_at: string
  updated_at: string
  is_active: boolean

  // SEO Fields
  meta_title?: string
  meta_description?: string
  meta_keywords?: string

  // Localization
  default_language: string
  supported_languages?: string

  // Extended Branding
  favicon_id?: number
  favicon?: StoreFavicon
  favicon_url?: string
  primary_color?: string
  secondary_color?: string
  banner_image_id?: number
  banner_image_url?: string

  // Domain Settings
  domain_status: 'PENDING' | 'VERIFIED' | 'FAILED'
  ssl_enabled: boolean
}

export interface StoreCategory {
  id: number
  name: string
  slug: string
}

export interface StoreLogo {
  id: number
  url: string
  filename: string
}

export interface StoreFavicon {
  id: number
  url: string
  filename: string
}

export interface CreateStoreDto {
  name: string
  slug: string
  store_category_id: number
  description?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  country?: string
  currency?: string
  timezone?: string
  custom_domain?: string
  logo_id?: number | null
  tagline?: string

  // SEO
  meta_title?: string
  meta_description?: string
  meta_keywords?: string

  // Localization
  default_language?: string
  supported_languages?: string

  // Extended Branding
  favicon_id?: number | null
  favicon_url?: string
  primary_color?: string
  secondary_color?: string
  banner_image_id?: number | null
  banner_image_url?: string
}

export interface UpdateStoreDto extends Partial<CreateStoreDto> {
  status?: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'INACTIVE'
  is_active?: boolean
}

export interface StoreMember {
  id: number
  user_id: number
  store_id: number
  role: string
  user: {
    id: number
    first_name: string
    last_name: string
    email: string
    avatar?: string
  }
}

export interface AddStoreMemberDto {
  email: string
  role: string
}
