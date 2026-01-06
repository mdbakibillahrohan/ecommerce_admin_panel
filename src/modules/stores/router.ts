import { type RouteRecordRaw } from 'vue-router'

export const storeRoutes: RouteRecordRaw[] = [
  {
    path: 'stores',
    name: 'stores',
    component: () => import('./pages/StoreListView.vue'),
    meta: { title: 'My Stores' },
  },
  {
    path: 'stores/create',
    name: 'stores-create',
    component: () => import('./pages/StoreFormView.vue'),
    meta: { title: 'Create Store' },
  },
  {
    path: 'stores/:id/edit',
    name: 'stores-edit',
    component: () => import('./pages/StoreFormView.vue'),
    meta: { title: 'Edit Store' },
  },
]
