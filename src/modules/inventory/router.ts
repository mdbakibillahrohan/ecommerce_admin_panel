import { type RouteRecordRaw } from 'vue-router'

export const inventoryRoutes: RouteRecordRaw[] = [
  {
    path: 'inventory',
    name: 'inventory',
    component: () => import('./pages/InventoryListView.vue'),
    meta: { title: 'Inventory' },
  },
]
