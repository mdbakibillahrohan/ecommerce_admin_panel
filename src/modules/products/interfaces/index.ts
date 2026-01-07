/* eslint-disable @typescript-eslint/no-empty-object-type */

/**
 * Product Module Interfaces
 * All product-related type definitions consolidated here
 */

export interface Product {
  id: number
  product_type: 'PHYSICAL' | 'DIGITAL'
  name: string
  slug: string
  description: string | null
  short_description: string | null
  base_price: number
  sale_price: number | null
  currency: string
  sku: string | null
  thumbnail_id: number | null
  category_id: number | null
  is_featured: boolean
  is_published: boolean
  stock_quantity: number
  low_stock_threshold: number
  track_inventory: boolean
  average_rating: number
  review_count: number
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
  category?: Category
  thumbnail?: File
  variants?: ProductVariant[]
  images?: ProductImage[]
}

export interface ProductVariant {
  id: number
  product_id: number
  name: string
  sku: string | null
  price: number
  stock_quantity: number
  attributes: Record<string, string>
  is_active: boolean
}

export interface ProductImage {
  id: number
  product_id: number
  image_url: string
  alt_text: string | null
  sort_order: number
  is_primary: boolean
}

export interface Category {
  id: number
  category_name: string
  slug: string
  description: string | null
  parent_id: number | null
  image_id: number | null
  sort_order: number
  is_featured: boolean
  children?: Category[]
}

export interface File {
  id: number
  url: string
  filename: string
}

export interface CreateProductDto {
  product_type?: 'PHYSICAL' | 'DIGITAL'
  name: string
  slug?: string
  description?: string
  short_description?: string
  base_price: number
  sale_price?: number
  currency?: string
  sku?: string
  thumbnail_id?: number
  category_id?: number
  is_featured?: boolean
  is_published?: boolean
  stock_quantity?: number
  low_stock_threshold?: number
  track_inventory?: boolean
  meta_title?: string
  meta_description?: string
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface ProductQuery {
  page?: number
  limit?: number
  search?: string
  category_id?: number
  is_featured?: boolean
  is_published?: boolean
  min_price?: number
  max_price?: number
  sort_by?: string
  sort_order?: 'ASC' | 'DESC'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CreateVariantDto {
  name: string
  sku?: string
  price: number
  stock_quantity?: number
  attributes?: Record<string, string>
  is_active?: boolean
}

export interface UpdateVariantDto extends Partial<CreateVariantDto> {}

export interface AddProductImageDto {
  image_url: string
  alt_text?: string
  sort_order?: number
  is_primary?: boolean
}
