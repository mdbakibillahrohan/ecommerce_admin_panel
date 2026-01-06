import { type RouteRecordRaw } from 'vue-router'

export const customerRoutes: RouteRecordRaw[] = [
  {
    path: 'customers',
    name: 'customers',
    component: () => import('./pages/CustomerListView.vue'),
    meta: { title: 'Customers' },
  },
  {
    path: 'customers/:id',
    name: 'customers-detail',
    component: () => import('./pages/CustomerDetailView.vue'),
    meta: { title: 'Customer Details' },
  },
]
