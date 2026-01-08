/**
 * Categories Service
 * All API calls for category management following SOLID principles
 */
import api from '@/modules/shared/config/http.config'
import type { Category, CreateCategoryDto, UpdateCategoryDto } from '../interfaces'

// Re-export types for convenience
export type { Category, CreateCategoryDto, UpdateCategoryDto } from '../interfaces'

/**
 * Category Service - Handles all category-related API operations
 */
class CategoryService {
  private readonly basePath = '/categories'

  /**
   * Get all categories (flat list)
   */
  async getAll(): Promise<Category[]> {
    const response = await api.get<Category[]>(this.basePath)
    return response.data
  }

  /**
   * Get categories as a tree structure
   */
  async getTree(): Promise<Category[]> {
    const response = await api.get<Category[]>(`${this.basePath}/tree`)
    return response.data
  }

  /**
   * Get featured categories
   */
  async getFeatured(): Promise<Category[]> {
    const response = await api.get<Category[]>(`${this.basePath}/featured`)
    return response.data
  }

  /**
   * Get a single category by ID
   */
  async getById(id: number): Promise<Category> {
    const response = await api.get<Category>(`${this.basePath}/${id}`)
    return response.data
  }

  /**
   * Get a single category by slug
   */
  async getBySlug(slug: string): Promise<Category> {
    const response = await api.get<Category>(`${this.basePath}/slug/${slug}`)
    return response.data
  }

  /**
   * Create a new category
   */
  async create(data: CreateCategoryDto): Promise<Category> {
    const response = await api.post<Category>(this.basePath, data)
    return response.data
  }

  /**
   * Update an existing category
   */
  async update(id: number, data: UpdateCategoryDto): Promise<Category> {
    const response = await api.patch<Category>(`${this.basePath}/${id}`, data)
    return response.data
  }

  /**
   * Delete a category
   */
  async delete(id: number): Promise<void> {
    await api.delete(`${this.basePath}/${id}`)
  }
}

// Export singleton instance
export const categoryService = new CategoryService()

// Export default for backward compatibility
export default categoryService
