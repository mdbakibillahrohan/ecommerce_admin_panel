import api from '@/modules/shared/config/http.config'

export interface Review {
  id: number
  product_id: number
  user_id: number
  rating: number
  title: string | null
  comment: string | null
  is_approved: boolean
  admin_reply: string | null
  created_at: string
  updated_at: string
  product?: {
    id: number
    name: string
    slug: string
    thumbnail?: { url: string }
  }
  user?: {
    id: number
    email: string
    first_name: string
    last_name: string
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ReviewQuery {
  page?: number
  limit?: number
  product_id?: number
  is_approved?: boolean
  rating?: number
}

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
