import { type RouteRecordRaw } from 'vue-router'

export const categoryRoutes: RouteRecordRaw[] = [
  {
    path: 'categories',
    name: 'categories',
    component: () => import('./pages/CategoryListView.vue'),
    meta: { title: 'Categories' },
  },
  {
    path: 'categories/create',
    name: 'categories-create',
    component: () => import('./pages/CategoryFormView.vue'),
    meta: { title: 'Create Category' },
  },
  {
    path: 'categories/:id/edit',
    name: 'categories-edit',
    component: () => import('./pages/CategoryFormView.vue'),
    meta: { title: 'Edit Category' },
  },
]
