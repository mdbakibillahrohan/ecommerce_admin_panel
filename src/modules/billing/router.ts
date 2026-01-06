import { type RouteRecordRaw } from 'vue-router'

export const billingRoutes: RouteRecordRaw[] = [
  {
    path: 'billing/subscription',
    name: 'billing-subscription',
    component: () => import('./pages/SubscriptionView.vue'),
    meta: { title: 'Subscription' },
  },
]
