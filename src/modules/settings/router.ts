import { type RouteRecordRaw } from 'vue-router'

export const settingRoutes: RouteRecordRaw[] = [
  {
    path: 'settings/shipping',
    name: 'settings-shipping',
    component: () => import('./pages/ShippingSettingsView.vue'),
    meta: { title: 'Shipping Settings' },
  },
  {
    path: 'settings/tax',
    name: 'settings-tax',
    component: () => import('./pages/TaxSettingsView.vue'),
    meta: { title: 'Tax Settings' },
  },
  {
    path: 'settings/payments',
    name: 'settings-payments',
    component: () => import('./pages/PaymentSettingsView.vue'),
    meta: { title: 'Payment Settings' },
  },
  {
    path: 'settings/checkout',
    name: 'settings-checkout',
    component: () => import('./pages/CheckoutSettingView.vue'),
    meta: { title: 'Checkout Settings' },
  },
  {
    path: 'settings/general',
    name: 'settings-general',
    component: () => import('./pages/GeneralSettingsView.vue'),
    meta: { title: 'General Settings' },
  },
  {
    path: 'settings/notifications',
    name: 'settings-notifications',
    component: () => import('./pages/notifications/TemplateListView.vue'),
    meta: { title: 'Notification Templates' },
  },
  {
    path: 'settings/notifications/create',
    name: 'settings-notifications-create',
    component: () => import('./pages/notifications/TemplateFormView.vue'),
    meta: { title: 'Create Template' },
  },
  {
    path: 'settings/notifications/:id/edit',
    name: 'settings-notifications-edit',
    component: () => import('./pages/notifications/TemplateFormView.vue'),
    meta: { title: 'Edit Template' },
  },
]
