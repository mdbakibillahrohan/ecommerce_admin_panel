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
  currency?: string
  timezone?: string
  owner_id: number
  logo_id: number
  favicon_id: number
  logo: StoreLogo
  favicon: StoreFavicon
  custom_domain?: string
  tagline?: string
  created_at: string
  updated_at: string
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
  currency?: string
  timezone?: string
  custom_domain?: string
  logo_id: number | undefined | null
  favicon_id: number | undefined | null
  tagline?: string
}

export interface UpdateStoreDto extends Partial<CreateStoreDto> {
  status?: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'INACTIVE'
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
