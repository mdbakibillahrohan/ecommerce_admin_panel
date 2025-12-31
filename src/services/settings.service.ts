/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/config/http.config"

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
    config: any
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

export const settingsService = {
  // General
  async getGeneralSettings() {
    const response = await api.get('/settings/general')
    return response.data
  },

  async updateGeneralSettings(data: StoreSettings) {
    const response = await api.put('/settings/general', data)
    return response.data
  },

  // Payment
  async getPaymentGateways() {
    const response = await api.get('/settings/payments')
    return response.data
  },

  async updatePaymentGateway(id: number, data: any) {
    const response = await api.patch(`/settings/payments/${id}`, data)
    return response.data
  },

  // Shipping (Assuming endpoints exists or using placeholder for now)
  async getShippingZones() {
      // Mock or real endpoint
      return []
  },

  // Tax
  async getTaxRates() {
      return []
  }
}
