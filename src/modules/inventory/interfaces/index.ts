/**
 * Inventory Module Interfaces
 */

export interface Inventory {
  id: number
  product_id: number
  variant_id: number | null
  quantity: number
  reserved_quantity: number
  low_stock_threshold: number
  created_at: string
  updated_at: string
  product?: {
    id: number
    name: string
    slug: string
    sku: string | null
    thumbnail?: { url: string }
    price?: number
  }
  variant?: {
    id: number
    name: string
    sku: string | null
  }
}

export interface UpdateInventoryDto {
  quantity?: number
  reserved_quantity?: number
  low_stock_threshold?: number
}

export interface BulkUpdateItem {
  id: number
  quantity: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
