/* eslint-disable @typescript-eslint/no-empty-object-type */
import api from '@/config/http.config'

export type DiscountType = 'PERCENTAGE' | 'FIXED'

export interface Coupon {
  id: number
  code: string
  description: string | null
  discount_type: DiscountType
  discount_value: number
  min_order_amount: number | null
  max_discount_amount: number | null
  usage_limit: number | null
  used_count: number
  is_active: boolean
  starts_at: string | null
  expires_at: string | null
  created_at: string
  updated_at: string
}

export interface CreateCouponDto {
  code: string
  description?: string
  discount_type: DiscountType
  discount_value: number
  min_order_amount?: number
  max_discount_amount?: number
  usage_limit?: number
  is_active?: boolean
  starts_at?: string
  expires_at?: string
}

export interface UpdateCouponDto extends Partial<CreateCouponDto> {}

export interface ValidateCouponResponse {
  valid: boolean
  coupon?: Coupon
  message?: string
}

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
