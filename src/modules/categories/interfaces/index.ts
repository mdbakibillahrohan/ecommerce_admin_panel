/* eslint-disable @typescript-eslint/no-empty-object-type */

/**
 * Category Module Interfaces
 * All category-related type definitions
 */

export interface Category {
  id: number
  category_name: string
  slug: string
  description: string | null
  parent_id: number | null
  image_id: number | null
  sort_order: number
  is_featured: boolean
  remarks: string | null
  created_at: string
  updated_at: string
  children?: Category[]
  parent?: Category
  image?: { id: number; url: string }
  products?: Product[]
}

// Product interface simplified for category relations
interface Product {
  id: number
  name: string
}

export interface CreateCategoryDto {
  category_name: string
  slug?: string
  description?: string
  parent_id?: number
  image_id?: number
  sort_order?: number
  is_featured?: boolean
  remarks?: string
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}
