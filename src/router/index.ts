import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/modules/auth/store'

import { authRoutes } from '@/modules/auth/router'
import { dashboardRoutes } from '@/modules/dashboard/router'
import { productRoutes } from '@/modules/products/router'
import { categoryRoutes } from '@/modules/categories/router'
import { orderRoutes } from '@/modules/orders/router'
import { couponRoutes } from '@/modules/coupons/router'
import { inventoryRoutes } from '@/modules/inventory/router'
import { promotionRoutes } from '@/modules/promotions/router'
import { customerRoutes } from '@/modules/customers/router'
import { reviewRoutes } from '@/modules/reviews/router'
import { staffRoutes } from '@/modules/staff/router'
import { storeRoutes } from '@/modules/stores/router'
import { mediaRoutes } from '@/modules/media/router'
import { contentRoutes } from '@/modules/content/router'
import { themeRoutes } from '@/modules/themes/router'
import { billingRoutes } from '@/modules/billing/router'
import { paymentRoutes } from '@/modules/payments/router'
import { settingRoutes } from '@/modules/settings/router'
import { accessControlRoutes } from '@/modules/access-control/router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    ...authRoutes,
    {
      path: '/',
      component: () => import('@/modules/shared/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/dashboard',
        },
        ...dashboardRoutes,
        ...productRoutes,
        ...categoryRoutes,
        ...orderRoutes,
        ...couponRoutes,
        ...inventoryRoutes,
        ...promotionRoutes,
        ...customerRoutes,
        ...reviewRoutes,
        ...staffRoutes,
        ...storeRoutes,
        ...mediaRoutes,
        ...contentRoutes,
        ...themeRoutes,
        ...billingRoutes,
        ...paymentRoutes,
        ...settingRoutes,
        ...accessControlRoutes,
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/dashboard',
    },
  ],
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth !== false)

  if (requiresAuth && !authStore.isAuthenticated) {
    next('login')
  } else if (to.path === 'login' && authStore.isAuthenticated) {
    next('dashboard')
  } else {
    next()
  }
})

export default router

