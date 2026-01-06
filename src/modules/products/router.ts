import { type RouteRecordRaw } from 'vue-router'

export const productRoutes: RouteRecordRaw[] = [
  {
    path: 'products',
    name: 'products',
    component: () => import('./pages/ProductListView.vue'),
    meta: { title: 'Products' },
  },
  {
    path: 'products/create',
    name: 'products-create',
    component: () => import('./pages/ProductFormView.vue'),
    meta: { title: 'Create Product' },
  },
  {
    path: 'products/:id/edit',
    name: 'products-edit',
    component: () => import('./pages/ProductFormView.vue'),
    meta: { title: 'Edit Product' },
  },
]
