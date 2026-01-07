/**
 * Settings Module Interfaces
 * All settings-related type definitions
 */

export interface StoreSettings {
  store_name: string
  contact_email: string
  currency: string
  timezone: string
  logo_url?: string
}

export interface PaymentGateway {
  id: number
  provider: string // STRIPE, PAYPAL, RAZORPAY
  is_enabled: boolean
  config: PaymentGatewayConfig
}

export interface PaymentGatewayConfig {
  api_key?: string
  secret_key?: string
  webhook_secret?: string
  mode?: 'test' | 'live'
  [key: string]: unknown
}

export interface PaymentProvider {
  id: string
  name: string
  logo?: string
  is_enabled: boolean
  credentials?: Record<string, string>
}

export interface ShippingZone {
  id: number
  name: string
  countries: string[]
  rates: ShippingRate[]
}

export interface ShippingRate {
  id: number
  name: string
  type: string // FLAT, WEIGHT, PRICE
  amount: number
  min_value?: number
  max_value?: number
}

export interface TaxRate {
  id: number
  name: string
  country: string
  state?: string
  rate: number
  is_compound: boolean
}

export interface GlobalSettings {
  tax_enabled?: boolean
  tax_inclusive?: boolean
  default_tax_rate?: number
  [key: string]: unknown
}

export interface CheckoutSettings {
  guest_checkout_enabled?: boolean
  require_phone?: boolean
  require_company?: boolean
  terms_and_conditions?: string
  privacy_policy?: string
  [key: string]: unknown
}

export interface NotificationTemplate {
  id: number
  type: string
  subject: string
  body: string
  is_enabled: boolean
}
