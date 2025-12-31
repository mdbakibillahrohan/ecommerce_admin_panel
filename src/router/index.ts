import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/dashboard',
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/dashboard/DashboardView.vue'),
          meta: { title: 'Dashboard' },
        },
        {
          path: 'products',
          name: 'products',
          component: () => import('@/views/products/ProductListView.vue'),
          meta: { title: 'Products' },
        },
        {
          path: 'products/create',
          name: 'products-create',
          component: () => import('@/views/products/ProductFormView.vue'),
          meta: { title: 'Create Product' },
        },
        {
          path: 'products/:id/edit',
          name: 'products-edit',
          component: () => import('@/views/products/ProductFormView.vue'),
          meta: { title: 'Edit Product' },
        },
        {
          path: 'categories',
          name: 'categories',
          component: () => import('@/views/categories/CategoryListView.vue'),
          meta: { title: 'Categories' },
        },
        {
          path: 'categories/create',
          name: 'categories-create',
          component: () => import('@/views/categories/CategoryFormView.vue'),
          meta: { title: 'Create Category' },
        },
        {
          path: 'categories/:id/edit',
          name: 'categories-edit',
          component: () => import('@/views/categories/CategoryFormView.vue'),
          meta: { title: 'Edit Category' },
        },
        {
          path: 'orders',
          name: 'orders',
          component: () => import('@/views/orders/OrderListView.vue'),
          meta: { title: 'Orders' },
        },
        {
          path: 'orders/:id',
          name: 'orders-detail',
          component: () => import('@/views/orders/OrderDetailView.vue'),
          meta: { title: 'Order Details' },
        },
        {
          path: 'inventory',
          name: 'inventory',
          component: () => import('@/views/inventory/InventoryListView.vue'),
          meta: { title: 'Inventory' },
        },
        {
          path: 'coupons',
          name: 'coupons',
          component: () => import('@/views/coupons/CouponListView.vue'),
          meta: { title: 'Coupons' },
        },
        {
          path: 'coupons/create',
          name: 'coupons-create',
          component: () => import('@/views/coupons/CouponFormView.vue'),
          meta: { title: 'Create Coupon' },
        },
        {
          path: 'coupons/:id/edit',
          name: 'coupons-edit',
          component: () => import('@/views/coupons/CouponFormView.vue'),
          meta: { title: 'Edit Coupon' },
        },
        {
          path: 'payments',
          name: 'payments',
          component: () => import('@/views/payments/PaymentListView.vue'),
          meta: { title: 'Payments' },
        },
        {
          path: 'reviews',
          name: 'reviews',
          component: () => import('@/views/reviews/ReviewListView.vue'),
          meta: { title: 'Reviews' },
        },
        {
          path: 'stores',
          name: 'stores',
          component: () => import('@/views/stores/StoreListView.vue'),
          meta: { title: 'My Stores' },
        },
        {
          path: 'stores/create',
          name: 'stores-create',
          component: () => import('@/views/stores/StoreFormView.vue'),
          meta: { title: 'Create Store' },
        },
        {
          path: 'stores/:id/edit',
          name: 'stores-edit',
          component: () => import('@/views/stores/StoreFormView.vue'),
          meta: { title: 'Edit Store' },
        },
        {
          path: 'content/pages',
          name: 'content-pages',
          component: () => import('@/views/content/PageListView.vue'),
          meta: { title: 'Pages' },
        },
        {
          path: 'content/pages/create',
          name: 'content-pages-create',
          component: () => import('@/views/content/PageFormView.vue'),
          meta: { title: 'Create Page' },
        },
        {
          path: 'content/pages/:id/edit',
          name: 'content-pages-edit',
          component: () => import('@/views/content/PageFormView.vue'),
          meta: { title: 'Edit Page' },
        },
        // {
        //   path: 'content/menus',
        //   name: 'content-menus',
        //   component: () => import('@/views/content/MenuListView.vue'),
        //   meta: { title: 'Menus' },
        // },
        {
          path: 'themes',
          name: 'themes',
          component: () => import('@/views/themes/ThemeGalleryView.vue'),
          meta: { title: 'Themes' },
        },
        {
          path: 'billing/subscription',
          name: 'billing-subscription',
          component: () => import('@/views/billing/SubscriptionView.vue'),
          meta: { title: 'Subscription' },
        },
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
