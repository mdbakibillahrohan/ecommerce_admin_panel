import { type RouteRecordRaw } from 'vue-router'

export const contentRoutes: RouteRecordRaw[] = [
  {
    path: 'content/pages',
    name: 'content-pages',
    component: () => import('./pages/PageListView.vue'),
    meta: { title: 'Pages' },
  },
  {
    path: 'content/pages/create',
    name: 'content-pages-create',
    component: () => import('./pages/PageFormView.vue'),
    meta: { title: 'Create Page' },
  },
  {
    path: 'content/pages/:id/edit',
    name: 'content-pages-edit',
    component: () => import('./pages/PageFormView.vue'),
    meta: { title: 'Edit Page' },
  },
  {
    path: 'content/sliders',
    name: 'content-sliders',
    component: () => import('./pages/SliderListView.vue'),
    meta: { title: 'Sliders' },
  },
]
