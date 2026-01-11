import { defineStore } from 'pinia'
import { ref } from 'vue'
import { promotionService, type Promotion, type CreatePromotionDto, type UpdatePromotionDto } from '@/modules/promotions/services/promotion.service'
import { message } from 'ant-design-vue'

export const usePromotionsStore = defineStore('promotions', () => {
  // State
  const promotions = ref<Promotion[]>([])
  const currentPromotion = ref<Promotion | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function fetchPromotions() {
    loading.value = true
    error.value = null

    try {
      const response = await promotionService.getPromotions()
      promotions.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch promotions'
      message.error(error.value)
      console.error('Promotions fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchPromotionById(id: number) {
    loading.value = true
    error.value = null

    try {
      currentPromotion.value = await promotionService.getPromotion(id)
      return currentPromotion.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch promotion'
      message.error(error.value)
      console.error('Promotion fetch error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function createPromotion(data: CreatePromotionDto) {
    loading.value = true
    error.value = null

    try {
      await promotionService.createPromotion(data)
      message.success('Promotion created successfully')
      await fetchPromotions()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create promotion'
      message.error(error.value)
      console.error('Promotion create error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function updatePromotion(id: number, data: UpdatePromotionDto) {
    loading.value = true
    error.value = null

    try {
      await promotionService.updatePromotion(id, data)
      message.success('Promotion updated successfully')
      await fetchPromotions()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update promotion'
      message.error(error.value)
      console.error('Promotion update error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function deletePromotion(id: number) {
    loading.value = true
    error.value = null

    try {
      await promotionService.deletePromotion(id)
      message.success('Promotion deleted successfully')
      await fetchPromotions()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete promotion'
      message.error(error.value)
      console.error('Promotion delete error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    promotions,
    currentPromotion,
    loading,
    error,
    // Actions
    fetchPromotions,
    fetchPromotionById,
    createPromotion,
    updatePromotion,
    deletePromotion,
    clearError,
  }
})
