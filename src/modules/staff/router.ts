import { type RouteRecordRaw } from 'vue-router'

export const staffRoutes: RouteRecordRaw[] = [
  {
    path: 'team',
    name: 'team',
    component: () => import('./pages/StaffListView.vue'),
    meta: { title: 'Team/Staff' },
  },
]
