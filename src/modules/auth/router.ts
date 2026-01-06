import { type RouteRecordRaw } from 'vue-router'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('./pages/LoginView.vue'),
    meta: { requiresAuth: false },
  },
]
