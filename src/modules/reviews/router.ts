import { type RouteRecordRaw } from 'vue-router'

export const reviewRoutes: RouteRecordRaw[] = [
  {
    path: 'reviews',
    name: 'reviews',
    component: () => import('./pages/ReviewListView.vue'),
    meta: { title: 'Reviews' },
  },
]
