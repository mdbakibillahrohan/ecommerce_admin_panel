import { type RouteRecordRaw } from 'vue-router'

export const paymentRoutes: RouteRecordRaw[] = [
  {
    path: 'payments',
    name: 'payments',
    component: () => import('./pages/PaymentListView.vue'),
    meta: { title: 'Payments' },
  },
]
