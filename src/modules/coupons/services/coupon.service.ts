/**
 * Coupons Service
 * All API calls for coupon management following SOLID principles
 */
import api from '@/modules/shared/config/http.config'
import type {
  Coupon,
  CreateCouponDto,
  UpdateCouponDto,
  ValidateCouponResponse,
} from '../interfaces'

// Re-export types for convenience
export type {
  DiscountType,
  Coupon,
  CreateCouponDto,
  UpdateCouponDto,
  ValidateCouponResponse,
} from '../interfaces'

/**
 * Coupon Service - Handles all coupon-related API operations
 */
class CouponService {
  private readonly basePath = '/admin/coupons'

  /**
   * Get all coupons
   */
  async getAll(): Promise<Coupon[]> {
    const response = await api.get<Coupon[]>(this.basePath)
    return response.data
  }

  /**
   * Get a single coupon by ID
   */
  async getById(id: number): Promise<Coupon> {
    const response = await api.get<Coupon>(`${this.basePath}/${id}`)
    return response.data
  }

  /**
   * Create a new coupon
   */
  async create(data: CreateCouponDto): Promise<Coupon> {
    const response = await api.post<Coupon>(this.basePath, data)
    return response.data
  }

  /**
   * Update an existing coupon
   */
  async update(id: number, data: UpdateCouponDto): Promise<Coupon> {
    const response = await api.patch<Coupon>(`${this.basePath}/${id}`, data)
    return response.data
  }

  /**
   * Delete a coupon
   */
  async delete(id: number): Promise<void> {
    await api.delete(`${this.basePath}/${id}`)
  }

  /**
   * Validate a coupon code
   */
  async validate(code: string): Promise<ValidateCouponResponse> {
    const response = await api.post<ValidateCouponResponse>('/coupons/validate', { code })
    return response.data
  }

  /**
   * Toggle coupon active status
   */
  async toggleStatus(id: number, isActive: boolean): Promise<Coupon> {
    const response = await api.patch<Coupon>(`${this.basePath}/${id}`, { is_active: isActive })
    return response.data
  }
}

// Export singleton instance
export const couponService = new CouponService()

// Export default for backward compatibility
export default couponService
