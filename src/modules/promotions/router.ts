import { type RouteRecordRaw } from 'vue-router'

export const promotionRoutes: RouteRecordRaw[] = [
  {
    path: 'promotions',
    name: 'promotions',
    component: () => import('./pages/PromotionListView.vue'),
    meta: { title: 'Promotions' },
  },
  {
    path: 'promotions/create',
    name: 'promotions-create',
    component: () => import('./pages/PromotionFormView.vue'),
    meta: { title: 'Create Promotion' },
  },
  {
    path: 'promotions/:id/edit',
    name: 'promotions-edit',
    component: () => import('./pages/PromotionFormView.vue'),
    meta: { title: 'Edit Promotion' },
  },
]
