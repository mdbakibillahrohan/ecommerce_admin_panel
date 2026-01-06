import { type RouteRecordRaw } from 'vue-router'

export const dashboardRoutes: RouteRecordRaw[] = [
  {
    path: 'dashboard',
    name: 'dashboard',
    component: () => import('./pages/DashboardView.vue'),
    meta: { title: 'Dashboard' },
  },
]
