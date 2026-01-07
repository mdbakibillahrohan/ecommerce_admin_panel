import api from '@/modules/shared/config/http.config'

// Import and re-export all interfaces
export type { Plan, CreatePlanDto, StoreSubscription, SubscribeStoreDto } from '../interfaces'

import type { Plan, CreatePlanDto, StoreSubscription, SubscribeStoreDto } from '../interfaces'

export const billingApi = {
  // Get all plans
  getPlans() {
    return api.get<Plan[]>('/billing/plans').then((res) => res.data)
  },

  // Create plan (Admin only)
  createPlan(data: CreatePlanDto) {
    return api.post<Plan>('/billing/plans', data).then((res) => res.data)
  },

  // Subscribe store to plan
  subscribe(data: SubscribeStoreDto) {
    return api.post<StoreSubscription>('/billing/subscribe', data).then((res) => res.data)
  },

  // Get store subscription
  getSubscription(storeId: number) {
    return api
      .get<StoreSubscription>(`/billing/store/${storeId}/subscription`)
      .then((res) => res.data)
  },
}
