/**
 * Billing Module Interfaces
 */

export interface Plan {
  id: number
  name: string
  slug: string
  description?: string
  monthly_price: number
  yearly_price: number
  currency: string
  features: string[]
  limits: Record<string, number>
  is_active: boolean
  sort_order: number
}

export interface CreatePlanDto {
  name: string
  slug: string
  description?: string
  monthly_price?: number
  yearly_price?: number
  currency?: string
  features?: string[]
  limits?: Record<string, number>
  is_active?: boolean
  sort_order?: number
}

export interface StoreSubscription {
  id: number
  store_id: number
  plan_id: number
  plan: Plan
  status: 'trial' | 'active' | 'cancelled' | 'expired'
  starts_at: string
  ends_at: string
  auto_renew: boolean
}

export interface SubscribeStoreDto {
  store_id: number
  plan_id: number
  billing_cycle: 'monthly' | 'yearly'
}
