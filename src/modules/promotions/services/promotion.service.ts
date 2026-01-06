/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/modules/shared/config/http.config'

export interface Promotion {
  id: number
  name: string
  code: string
  type: string
  discount_type: string
  discount_value: number
  start_date: string
  end_date: string
  is_active: boolean
  usage_limit?: number
  used_count: number
}

export const promotionService = {
  async getPromotions(params?: any) {
    const response = await api.get('/promotions', { params })
    return response.data
  },

  async getPromotion(id: number) {
    const response = await api.get(`/promotions/${id}`)
    return response.data
  },

  async createPromotion(data: any) {
    const response = await api.post('/promotions', data)
    return response.data
  },

  async updatePromotion(id: number, data: any) {
    const response = await api.patch(`/promotions/${id}`, data)
    return response.data
  },

  async deletePromotion(id: number) {
    await api.delete(`/promotions/${id}`)
  },
}
