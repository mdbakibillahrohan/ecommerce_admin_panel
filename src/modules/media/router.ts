import { type RouteRecordRaw } from 'vue-router'

export const mediaRoutes: RouteRecordRaw[] = [
  {
    path: 'media',
    name: 'media',
    component: () => import('./pages/MediaLibraryView.vue'),
    meta: { title: 'Media Library' },
  },
]
