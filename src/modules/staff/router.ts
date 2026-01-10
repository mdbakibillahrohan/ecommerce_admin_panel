import { type RouteRecordRaw } from 'vue-router'

export const staffRoutes: RouteRecordRaw[] = [
  {
    path: 'team',
    name: 'team',
    component: () => import('./pages/StaffListView.vue'),
    meta: { title: 'Team/Staff' },
  },
  {
    path: 'staff/roles',
    name: 'roles',
    component: () => import('./pages/RoleListView.vue'),
    meta: { title: 'Role Management' },
  },
  {
    path: 'staff/roles/new',
    name: 'role-create',
    component: () => import('./pages/RoleFormView.vue'),
    meta: { title: 'Create Role' },
  },
  {
    path: 'staff/roles/:id',
    name: 'role-edit',
    component: () => import('./pages/RoleFormView.vue'),
    meta: { title: 'Edit Role' },
  },
]
