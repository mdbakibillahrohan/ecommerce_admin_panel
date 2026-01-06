import { type RouteRecordRaw } from 'vue-router'

export const themeRoutes: RouteRecordRaw[] = [
  {
    path: 'themes',
    name: 'themes',
    component: () => import('./pages/ThemeGalleryView.vue'),
    meta: { title: 'Themes' },
  },
]
