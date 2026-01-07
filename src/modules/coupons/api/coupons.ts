import api from '@/modules/shared/config/http.config'

// Import and re-export all interfaces
export type {
  DiscountType,
  Coupon,
  CreateCouponDto,
  UpdateCouponDto,
  ValidateCouponResponse,
} from '../interfaces'

import type {
  Coupon,
  CreateCouponDto,
  UpdateCouponDto,
  ValidateCouponResponse,
} from '../interfaces'

export const couponsApi = {
  getAll: async (): Promise<Coupon[]> => {
    const response = await api.get<Coupon[]>('/admin/coupons')
    return response.data
  },

  getById: async (id: number): Promise<Coupon> => {
    const response = await api.get<Coupon>(`/admin/coupons/${id}`)
    return response.data
  },

  create: async (data: CreateCouponDto): Promise<Coupon> => {
    const response = await api.post<Coupon>('/admin/coupons', data)
    return response.data
  },

  update: async (id: number, data: UpdateCouponDto): Promise<Coupon> => {
    const response = await api.patch<Coupon>(`/admin/coupons/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/coupons/${id}`)
  },

  validate: async (code: string): Promise<ValidateCouponResponse> => {
    const response = await api.post<ValidateCouponResponse>('/coupons/validate', { code })
    return response.data
  },
}
