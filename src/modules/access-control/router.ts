import { type RouteRecordRaw } from 'vue-router'

export const accessControlRoutes: RouteRecordRaw[] = [
  {
    path: 'settings/access-control/policies',
    name: 'settings-access-control-policies',
    component: () => import('./pages/PolicyListView.vue'),
    meta: { title: 'Access Control Policies' },
  },
  {
    path: 'settings/access-control/policies/create',
    name: 'settings-access-control-policies-create',
    component: () => import('./pages/PolicyFormView.vue'),
    meta: { title: 'Create Policy' },
  },
  {
    path: 'settings/access-control/policies/:id/edit',
    name: 'settings-access-control-policies-edit',
    component: () => import('./pages/PolicyFormView.vue'),
    meta: { title: 'Edit Policy' },
  },
]
