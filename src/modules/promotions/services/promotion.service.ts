import api from '@/modules/shared/config/http.config'

// Import and re-export all interfaces
export type {
  Promotion,
  CreatePromotionDto,
  UpdatePromotionDto,
  PromotionQueryParams,
} from '../interfaces'

import type {
  Promotion,
  CreatePromotionDto,
  UpdatePromotionDto,
  PromotionQueryParams,
} from '../interfaces'

export const promotionService = {
  async getPromotions(params?: PromotionQueryParams) {
    const response = await api.get('/promotions', { params })
    return response.data
  },

  async getPromotion(id: number) {
    const response = await api.get(`/promotions/${id}`)
    return response.data
  },

  async createPromotion(data: CreatePromotionDto) {
    const response = await api.post('/promotions', data)
    return response.data
  },

  async updatePromotion(id: number, data: UpdatePromotionDto) {
    const response = await api.patch(`/promotions/${id}`, data)
    return response.data
  },

  async deletePromotion(id: number) {
    await api.delete(`/promotions/${id}`)
  },
}
