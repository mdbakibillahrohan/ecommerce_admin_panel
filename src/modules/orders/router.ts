import { type RouteRecordRaw } from 'vue-router'

export const orderRoutes: RouteRecordRaw[] = [
  {
    path: 'orders',
    name: 'orders',
    component: () => import('./pages/OrderListView.vue'),
    meta: { title: 'Orders' },
  },
  {
    path: 'orders/:id',
    name: 'orders-detail',
    component: () => import('./pages/OrderDetailView.vue'),
    meta: { title: 'Order Details' },
  },
]
