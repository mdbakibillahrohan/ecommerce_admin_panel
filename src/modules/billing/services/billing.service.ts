/**
 * Billing Service
 * All API calls for billing and subscription management following SOLID principles
 */
import api from '@/modules/shared/config/http.config'
import type { Plan, CreatePlanDto, StoreSubscription, SubscribeStoreDto } from '../interfaces'

// Re-export types for convenience
export type { Plan, CreatePlanDto, StoreSubscription, SubscribeStoreDto } from '../interfaces'

/**
 * Billing Service - Handles subscription and billing operations
 */
class BillingService {
  private readonly basePath = '/billing'

  /**
   * Get all available subscription plans
   */
  async getPlans(): Promise<Plan[]> {
    const response = await api.get<Plan[]>(`${this.basePath}/plans`)
    return response.data
  }

  /**
   * Create a new subscription plan (Admin only)
   */
  async createPlan(data: CreatePlanDto): Promise<Plan> {
    const response = await api.post<Plan>(`${this.basePath}/plans`, data)
    return response.data
  }

  /**
   * Update a subscription plan (Admin only)
   */
  async updatePlan(id: number, data: Partial<CreatePlanDto>): Promise<Plan> {
    const response = await api.patch<Plan>(`${this.basePath}/plans/${id}`, data)
    return response.data
  }

  /**
   * Delete a subscription plan (Admin only)
   */
  async deletePlan(id: number): Promise<void> {
    await api.delete(`${this.basePath}/plans/${id}`)
  }

  /**
   * Subscribe a store to a plan
   */
  async subscribe(data: SubscribeStoreDto): Promise<StoreSubscription> {
    const response = await api.post<StoreSubscription>(`${this.basePath}/subscribe`, data)
    return response.data
  }

  /**
   * Get store's current subscription
   */
  async getSubscription(storeId: number): Promise<StoreSubscription> {
    const response = await api.get<StoreSubscription>(
      `${this.basePath}/store/${storeId}/subscription`
    )
    return response.data
  }

  /**
   * Cancel a store's subscription
   */
  async cancelSubscription(storeId: number): Promise<void> {
    await api.post(`${this.basePath}/store/${storeId}/cancel`)
  }

  /**
   * Get billing history for a store
   */
  async getBillingHistory(storeId: number): Promise<any[]> {
    const response = await api.get<any[]>(`${this.basePath}/store/${storeId}/history`)
    return response.data
  }
}

// Export singleton instance
export const billingService = new BillingService()

// Export default for backward compatibility
export default billingService
