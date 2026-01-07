import api from '@/modules/shared/config/http.config'

// Import and re-export all interfaces
export type { Review, PaginatedResponse, ReviewQuery } from '../interfaces'

import type { Review, PaginatedResponse } from '../interfaces'

export const reviewsApi = {
  getByProduct: async (
    productId: number,
    page = 1,
    limit = 10,
  ): Promise<PaginatedResponse<Review>> => {
    const response = await api.get<PaginatedResponse<Review>>(`/products/${productId}/reviews`, {
      params: { page, limit },
    })
    return response.data
  },

  approve: async (id: number): Promise<Review> => {
    const response = await api.patch<Review>(`/admin/reviews/${id}/approve`)
    return response.data
  },

  addReply: async (id: number, reply: string): Promise<Review> => {
    const response = await api.post<Review>(`/admin/reviews/${id}/reply`, { reply })
    return response.data
  },
}
