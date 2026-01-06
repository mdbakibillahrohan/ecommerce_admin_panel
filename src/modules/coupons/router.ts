import { type RouteRecordRaw } from 'vue-router'

export const couponRoutes: RouteRecordRaw[] = [
  {
    path: 'coupons',
    name: 'coupons',
    component: () => import('./pages/CouponListView.vue'),
    meta: { title: 'Coupons' },
  },
  {
    path: 'coupons/create',
    name: 'coupons-create',
    component: () => import('./pages/CouponFormView.vue'),
    meta: { title: 'Create Coupon' },
  },
  {
    path: 'coupons/:id/edit',
    name: 'coupons-edit',
    component: () => import('./pages/CouponFormView.vue'),
    meta: { title: 'Edit Coupon' },
  },
]
