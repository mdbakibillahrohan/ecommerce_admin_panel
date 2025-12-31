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
        // Sales Channels
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
          path: 'inventory',
          name: 'inventory',
          component: () => import('@/views/inventory/InventoryListView.vue'),
          meta: { title: 'Inventory' },
        },

        // Promotions
        {
            path: 'promotions',
            name: 'promotions',
            component: () => import('@/views/promotions/PromotionListView.vue'),
            meta: { title: 'Promotions' },
        },
        {
            path: 'promotions/create',
            name: 'promotions-create',
            component: () => import('@/views/promotions/PromotionFormView.vue'),
            meta: { title: 'Create Promotion' },
        },
        {
            path: 'promotions/:id/edit',
            name: 'promotions-edit',
            component: () => import('@/views/promotions/PromotionFormView.vue'),
            meta: { title: 'Edit Promotion' },
        },

        // Customers & Staff
        {
            path: 'customers',
            name: 'customers',
            component: () => import('@/views/customers/CustomerListView.vue'),
            meta: { title: 'Customers' },
        },
        {
            path: 'customers/:id',
            name: 'customers-detail',
            component: () => import('@/views/customers/CustomerDetailView.vue'),
            meta: { title: 'Customer Details' },
        },
        {
            path: 'reviews',
            name: 'reviews',
            component: () => import('@/views/reviews/ReviewListView.vue'),
            meta: { title: 'Reviews' },
        },
        {
            path: 'team',
            name: 'team',
            component: () => import('@/views/staff/StaffListView.vue'),
            meta: { title: 'Team/Staff' },
        },

        // Settings & Content
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
            path: 'media',
            name: 'media',
            component: () => import('@/views/media/MediaLibraryView.vue'),
            meta: { title: 'Media Library' },
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
        {
            path: 'content/sliders',
            name: 'content-sliders',
            component: () => import('@/views/content/SliderListView.vue'),
            meta: { title: 'Sliders' },
        },
        {
          path: 'themes',
          name: 'themes',
          component: () => import('@/views/themes/ThemeGalleryView.vue'),
          meta: { title: 'Themes' },
        },

        // Billing
        {
          path: 'billing/subscription',
          name: 'billing-subscription',
          component: () => import('@/views/billing/SubscriptionView.vue'),
          meta: { title: 'Subscription' },
        },
        {
            path: 'payments', // Should be billing/payments ideally but keeping legacy
            name: 'payments',
            component: () => import('@/views/payments/PaymentListView.vue'),
            meta: { title: 'Payments' },
        },

        // Settings Routes
        {
            path: 'settings/shipping',
            name: 'settings-shipping',
            component: () => import('@/views/settings/ShippingSettingsView.vue'),
            meta: { title: 'Shipping Settings' },
        },
        {
            path: 'settings/tax',
            name: 'settings-tax',
            component: () => import('@/views/settings/TaxSettingsView.vue'),
            meta: { title: 'Tax Settings' },
        },
        {
            path: 'settings/payments',
            name: 'settings-payments',
            component: () => import('@/views/settings/PaymentSettingsView.vue'),
            meta: { title: 'Payment Settings' },
        },
        {
            path: 'settings/general',
            name: 'settings-general',
            component: () => import('@/views/settings/GeneralSettingsView.vue'),
            meta: { title: 'General Settings' },
        },
        {
            path: 'settings/notifications',
            name: 'settings-notifications',
            component: () => import('@/views/settings/notifications/TemplateListView.vue'),
            meta: { title: 'Notification Templates' },
        },
        {
            path: 'settings/notifications/create',
            name: 'settings-notifications-create',
            component: () => import('@/views/settings/notifications/TemplateFormView.vue'),
            meta: { title: 'Create Template' },
        },
        {
            path: 'settings/notifications/:id/edit',
            name: 'settings-notifications-edit',
            component: () => import('@/views/settings/notifications/TemplateFormView.vue'),
            meta: { title: 'Edit Template' },
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
