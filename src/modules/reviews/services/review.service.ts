/**
 * Reviews Service
 * All API calls for review management following SOLID principles
 */
import api from '@/modules/shared/config/http.config'
import type { Review, PaginatedResponse, ReviewQuery } from '../interfaces'

// Re-export types for convenience
export type { Review, PaginatedResponse, ReviewQuery } from '../interfaces'

/**
 * Review Service - Handles all review-related operations
 */
class ReviewService {
  private readonly basePath = '/admin/reviews'

  /**
   * Get all reviews with pagination and filters
   */
  async getAll(query?: ReviewQuery): Promise<PaginatedResponse<Review>> {
    const response = await api.get<PaginatedResponse<Review>>(this.basePath, { params: query })
    return response.data
  }

  /**
   * Get reviews for a specific product
   */
  async getByProduct(productId: number, page = 1, limit = 10): Promise<PaginatedResponse<Review>> {
    const response = await api.get<PaginatedResponse<Review>>(`/products/${productId}/reviews`, {
      params: { page, limit },
    })
    return response.data
  }

  /**
   * Get a single review by ID
   */
  async getById(id: number): Promise<Review> {
    const response = await api.get<Review>(`${this.basePath}/${id}`)
    return response.data
  }

  /**
   * Approve a review
   */
  async approve(id: number): Promise<Review> {
    const response = await api.patch<Review>(`${this.basePath}/${id}/approve`)
    return response.data
  }

  /**
   * Reject a review
   */
  async reject(id: number, reason?: string): Promise<Review> {
    const response = await api.patch<Review>(`${this.basePath}/${id}/reject`, { reason })
    return response.data
  }

  /**
   * Add a reply to a review
   */
  async addReply(id: number, reply: string): Promise<Review> {
    const response = await api.post<Review>(`${this.basePath}/${id}/reply`, { reply })
    return response.data
  }

  /**
   * Delete a review
   */
  async delete(id: number): Promise<void> {
    await api.delete(`${this.basePath}/${id}`)
  }

  /**
   * Get pending reviews count
   */
  async getPendingCount(): Promise<number> {
    const response = await api.get<{ count: number }>(`${this.basePath}/pending/count`)
    return response.data.count
  }
}

// Export singleton instance
export const reviewService = new ReviewService()

// Export default for backward compatibility
export default reviewService
