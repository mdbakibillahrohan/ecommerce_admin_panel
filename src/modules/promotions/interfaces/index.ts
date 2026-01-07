/**
 * Promotions Module Interfaces
 */

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

export interface CreatePromotionDto {
  name: string
  code: string
  type: string
  discount_type: string
  discount_value: number
  start_date: string
  end_date: string
  is_active?: boolean
  usage_limit?: number
}

export interface UpdatePromotionDto extends Partial<CreatePromotionDto> {}

export interface PromotionQueryParams {
  page?: number
  limit?: number
  search?: string
  is_active?: boolean
  [key: string]: unknown
}
