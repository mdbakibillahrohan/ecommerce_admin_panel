import api from './index'

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
    status: 'aryl' | 'active' | 'cancelled' | 'expired'
    starts_at: string
    ends_at: string
    auto_renew: boolean
}

export interface SubscribeStoreDto {
    store_id: number
    plan_id: number
    billing_cycle: 'monthly' | 'yearly'
}

export const billingApi = {
    // Get all plans
    getPlans() {
        return api.get<Plan[]>('/billing/plans').then(res => res.data)
    },

    // Create plan (Admin only)
    createPlan(data: CreatePlanDto) {
        return api.post<Plan>('/billing/plans', data).then(res => res.data)
    },

    // Subscribe store to plan
    subscribe(data: SubscribeStoreDto) {
        return api.post<StoreSubscription>('/billing/subscribe', data).then(res => res.data)
    },

    // Get store subscription
    getSubscription(storeId: number) {
        return api.get<StoreSubscription>(`/billing/store/${storeId}/subscription`).then(res => res.data)
    }
}
