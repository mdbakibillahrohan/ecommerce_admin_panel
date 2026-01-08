/**
 * Settings Service
 * All API calls for store settings management following SOLID principles
 */
import api from '@/modules/shared/config/http.config'
import type {
  StoreSettings,
  PaymentGateway,
  PaymentGatewayConfig,
  ShippingZone,
  ShippingRate,
  TaxZone,
  TaxRate,
} from '../interfaces'

// Re-export types for convenience
export type {
  StoreSettings,
  PaymentGateway,
  PaymentGatewayConfig,
  ShippingZone,
  ShippingRate,
  TaxZone,
  TaxRate,
} from '../interfaces'

/**
 * Settings Service - Handles all settings-related operations
 */
class SettingsService {
  private readonly basePath = '/settings'

  // ============ General Settings ============

  /**
   * Get general store settings
   */
  async getGeneralSettings(): Promise<StoreSettings> {
    const response = await api.get<StoreSettings>(`${this.basePath}/general`)
    return response.data
  }

  /**
   * Update general store settings
   */
  async updateGeneralSettings(data: Partial<StoreSettings>): Promise<StoreSettings> {
    const response = await api.patch<StoreSettings>(`${this.basePath}/general`, data)
    return response.data
  }

  // ============ Payment Settings ============

  /**
   * Get all payment gateways
   */
  async getPaymentGateways(): Promise<PaymentGateway[]> {
    const response = await api.get<PaymentGateway[]>(`${this.basePath}/payments`)
    return response.data
  }

  /**
   * Create a new payment gateway
   */
  async createPaymentGateway(data: PaymentGatewayConfig): Promise<PaymentGateway> {
    const response = await api.post<PaymentGateway>(`${this.basePath}/payments`, data)
    return response.data
  }

  /**
   * Update a payment gateway
   */
  async updatePaymentGateway(id: number, data: Partial<PaymentGatewayConfig>): Promise<PaymentGateway> {
    const response = await api.patch<PaymentGateway>(`${this.basePath}/payments/${id}`, data)
    return response.data
  }

  // ============ Shipping Settings ============

  /**
   * Get all shipping zones
   */
  async getShippingZones(): Promise<ShippingZone[]> {
    const response = await api.get<ShippingZone[]>('/shipping/zones')
    return response.data
  }

  /**
   * Create a shipping zone
   */
  async createShippingZone(data: Partial<ShippingZone>): Promise<ShippingZone> {
    const response = await api.post<ShippingZone>('/shipping/zones', data)
    return response.data
  }

  /**
   * Update a shipping zone
   */
  async updateShippingZone(id: number, data: Partial<ShippingZone>): Promise<ShippingZone> {
    const response = await api.patch<ShippingZone>(`/shipping/zones/${id}`, data)
    return response.data
  }

  /**
   * Delete a shipping zone
   */
  async deleteShippingZone(id: number): Promise<void> {
    await api.delete(`/shipping/zones/${id}`)
  }

  /**
   * Add shipping method to zone
   */
  async addShippingMethod(zoneId: number, data: Partial<ShippingRate>): Promise<ShippingRate> {
    const response = await api.post<ShippingRate>(`/shipping/zones/${zoneId}/methods`, data)
    return response.data
  }

  /**
   * Update shipping method
   */
  async updateShippingMethod(zoneId: number, methodId: number, data: Partial<ShippingRate>): Promise<ShippingRate> {
    const response = await api.patch<ShippingRate>(`/shipping/zones/${zoneId}/methods/${methodId}`, data)
    return response.data
  }

  /**
   * Delete shipping method
   */
  async deleteShippingMethod(zoneId: number, methodId: number): Promise<void> {
    await api.delete(`/shipping/zones/${zoneId}/methods/${methodId}`)
  }

  // ============ Tax Settings ============

  /**
   * Get all tax zones
   */
  async getTaxZones(): Promise<TaxZone[]> {
    const response = await api.get<TaxZone[]>('/tax/zones')
    return response.data
  }

  /**
   * Create a tax zone
   */
  async createTaxZone(data: Partial<TaxZone>): Promise<TaxZone> {
    const response = await api.post<TaxZone>('/tax/zones', data)
    return response.data
  }

  /**
   * Update a tax zone
   */
  async updateTaxZone(id: number, data: Partial<TaxZone>): Promise<TaxZone> {
    const response = await api.patch<TaxZone>(`/tax/zones/${id}`, data)
    return response.data
  }

  /**
   * Delete a tax zone
   */
  async deleteTaxZone(id: number): Promise<void> {
    await api.delete(`/tax/zones/${id}`)
  }

  /**
   * Add tax rate to zone
   */
  async addTaxRate(zoneId: number, data: Partial<TaxRate>): Promise<TaxRate> {
    const response = await api.post<TaxRate>(`/tax/zones/${zoneId}/rates`, data)
    return response.data
  }

  /**
   * Update tax rate
   */
  async updateTaxRate(zoneId: number, rateId: number, data: Partial<TaxRate>): Promise<TaxRate> {
    const response = await api.patch<TaxRate>(`/tax/zones/${zoneId}/rates/${rateId}`, data)
    return response.data
  }

  /**
   * Delete tax rate
   */
  async deleteTaxRate(zoneId: number, rateId: number): Promise<void> {
    await api.delete(`/tax/zones/${zoneId}/rates/${rateId}`)
  }

  // ============ Social Links ============

  /**
   * Get all social links
   */
  async getSocialLinks(): Promise<any[]> {
    const response = await api.get<any[]>(`${this.basePath}/social`)
    return response.data
  }

  /**
   * Add a social link
   */
  async addSocialLink(data: { platform: string; url: string }): Promise<any> {
    const response = await api.post(`${this.basePath}/social`, data)
    return response.data
  }

  /**
   * Delete a social link
   */
  async deleteSocialLink(id: number): Promise<void> {
    await api.delete(`${this.basePath}/social/${id}`)
  }

  // ============ Policies ============

  /**
   * Get store policies
   */
  async getPolicies(): Promise<any[]> {
    const response = await api.get<any[]>(`${this.basePath}/policies`)
    return response.data
  }

  /**
   * Create or update a policy
   */
  async savePolicy(data: { type: string; content: string }): Promise<any> {
    const response = await api.post(`${this.basePath}/policies`, data)
    return response.data
  }

  /**
   * Update a policy
   */
  async updatePolicy(id: number, data: Partial<{ type: string; content: string }>): Promise<any> {
    const response = await api.patch(`${this.basePath}/policies/${id}`, data)
    return response.data
  }

  // ============ Notification Settings ============

  /**
   * Get notification settings
   */
  async getNotificationSettings(): Promise<any[]> {
    const response = await api.get<any[]>(`${this.basePath}/notifications`)
    return response.data
  }

  /**
   * Create notification setting
   */
  async createNotificationSetting(data: any): Promise<any> {
    const response = await api.post(`${this.basePath}/notifications`, data)
    return response.data
  }

  /**
   * Update notification setting
   */
  async updateNotificationSetting(id: number, data: any): Promise<any> {
    const response = await api.patch(`${this.basePath}/notifications/${id}`, data)
    return response.data
  }
}

// Export singleton instance
export const settingsService = new SettingsService()

export default settingsService
