/* eslint-disable @typescript-eslint/no-empty-object-type */

/**
 * Coupons Module Interfaces
 */

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
