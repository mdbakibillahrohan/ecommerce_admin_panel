import api from '@/modules/shared/config/http.config'

// Import and re-export all interfaces
export type {
  StoreSettings,
  PaymentGateway,
  PaymentGatewayConfig,
  ShippingZone,
  ShippingRate,
  TaxRate,
} from '../interfaces'

import type { StoreSettings, PaymentGatewayConfig } from '../interfaces'

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

  async updatePaymentGateway(id: number, data: PaymentGatewayConfig) {
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
  },
}
