import { defineStore } from 'pinia'
import { ref } from 'vue'
import { settingsService, type StoreSettings, type PaymentGateway, type ShippingZone, type TaxZone } from '@/modules/settings/services/settings.service'
import { message } from 'ant-design-vue'

export const useSettingsStore = defineStore('settings', () => {
  // State
  const generalSettings = ref<StoreSettings | null>(null)
  const paymentGateways = ref<PaymentGateway[]>([])
  const shippingZones = ref<ShippingZone[]>([])
  const taxZones = ref<TaxZone[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const error = ref<string | null>(null)

  // Actions - General Settings
  async function fetchGeneralSettings() {
    loading.value = true
    error.value = null

    try {
      generalSettings.value = await settingsService.getGeneralSettings()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch general settings'
      message.error(error.value)
      console.error('General settings fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  async function updateGeneralSettings(data: Partial<StoreSettings>) {
    saving.value = true
    error.value = null

    try {
      generalSettings.value = await settingsService.updateGeneralSettings(data)
      message.success('Settings saved successfully')
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update settings'
      message.error(error.value)
      console.error('General settings update error:', err)
      return false
    } finally {
      saving.value = false
    }
  }

  // Actions - Payment Settings
  async function fetchPaymentGateways() {
    loading.value = true
    error.value = null

    try {
      paymentGateways.value = await settingsService.getPaymentGateways()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch payment gateways'
      message.error(error.value)
      console.error('Payment gateways fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  async function updatePaymentGateway(id: number, data: any) {
    saving.value = true
    error.value = null

    try {
      await settingsService.updatePaymentGateway(id, data)
      message.success('Payment gateway updated successfully')
      await fetchPaymentGateways()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update payment gateway'
      message.error(error.value)
      console.error('Payment gateway update error:', err)
      return false
    } finally {
      saving.value = false
    }
  }

  // Actions - Shipping Settings
  async function fetchShippingZones() {
    loading.value = true
    error.value = null

    try {
      shippingZones.value = await settingsService.getShippingZones()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch shipping zones'
      message.error(error.value)
      console.error('Shipping zones fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  async function createShippingZone(data: Partial<ShippingZone>) {
    saving.value = true
    error.value = null

    try {
      await settingsService.createShippingZone(data)
      message.success('Shipping zone created successfully')
      await fetchShippingZones()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create shipping zone'
      message.error(error.value)
      console.error('Shipping zone create error:', err)
      return false
    } finally {
      saving.value = false
    }
  }

  async function updateShippingZone(id: number, data: Partial<ShippingZone>) {
    saving.value = true
    error.value = null

    try {
      await settingsService.updateShippingZone(id, data)
      message.success('Shipping zone updated successfully')
      await fetchShippingZones()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update shipping zone'
      message.error(error.value)
      console.error('Shipping zone update error:', err)
      return false
    } finally {
      saving.value = false
    }
  }

  async function deleteShippingZone(id: number) {
    saving.value = true
    error.value = null

    try {
      await settingsService.deleteShippingZone(id)
      message.success('Shipping zone deleted successfully')
      await fetchShippingZones()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete shipping zone'
      message.error(error.value)
      console.error('Shipping zone delete error:', err)
      return false
    } finally {
      saving.value = false
    }
  }

  // Actions - Tax Settings
  async function fetchTaxZones() {
    loading.value = true
    error.value = null

    try {
      taxZones.value = await settingsService.getTaxZones()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch tax zones'
      message.error(error.value)
      console.error('Tax zones fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  async function createTaxZone(data: Partial<TaxZone>) {
    saving.value = true
    error.value = null

    try {
      await settingsService.createTaxZone(data)
      message.success('Tax zone created successfully')
      await fetchTaxZones()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create tax zone'
      message.error(error.value)
      console.error('Tax zone create error:', err)
      return false
    } finally {
      saving.value = false
    }
  }

  async function updateTaxZone(id: number, data: Partial<TaxZone>) {
    saving.value = true
    error.value = null

    try {
      await settingsService.updateTaxZone(id, data)
      message.success('Tax zone updated successfully')
      await fetchTaxZones()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update tax zone'
      message.error(error.value)
      console.error('Tax zone update error:', err)
      return false
    } finally {
      saving.value = false
    }
  }

  async function deleteTaxZone(id: number) {
    saving.value = true
    error.value = null

    try {
      await settingsService.deleteTaxZone(id)
      message.success('Tax zone deleted successfully')
      await fetchTaxZones()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete tax zone'
      message.error(error.value)
      console.error('Tax zone delete error:', err)
      return false
    } finally {
      saving.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    generalSettings,
    paymentGateways,
    shippingZones,
    taxZones,
    loading,
    saving,
    error,
    // Actions
    fetchGeneralSettings,
    updateGeneralSettings,
    fetchPaymentGateways,
    updatePaymentGateway,
    fetchShippingZones,
    createShippingZone,
    updateShippingZone,
    deleteShippingZone,
    fetchTaxZones,
    createTaxZone,
    updateTaxZone,
    deleteTaxZone,
    clearError,
  }
})
