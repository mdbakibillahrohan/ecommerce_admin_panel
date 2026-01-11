import { defineStore } from 'pinia'
import { ref } from 'vue'
import { couponsApi, type Coupon, type CreateCouponDto, type UpdateCouponDto } from '@/modules/coupons/api/coupons'
import { message } from 'ant-design-vue'

export const useCouponsStore = defineStore('coupons', () => {
  // State
  const coupons = ref<Coupon[]>([])
  const currentCoupon = ref<Coupon | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function fetchCoupons() {
    loading.value = true
    error.value = null

    try {
      coupons.value = await couponsApi.getAll()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch coupons'
      message.error(error.value)
      console.error('Coupons fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchCouponById(id: number) {
    loading.value = true
    error.value = null

    try {
      currentCoupon.value = await couponsApi.getById(id)
      return currentCoupon.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch coupon'
      message.error(error.value)
      console.error('Coupon fetch error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function createCoupon(data: CreateCouponDto) {
    loading.value = true
    error.value = null

    try {
      await couponsApi.create(data)
      message.success('Coupon created successfully')
      await fetchCoupons()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create coupon'
      message.error(error.value)
      console.error('Coupon create error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function updateCoupon(id: number, data: UpdateCouponDto) {
    loading.value = true
    error.value = null

    try {
      await couponsApi.update(id, data)
      message.success('Coupon updated successfully')
      await fetchCoupons()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update coupon'
      message.error(error.value)
      console.error('Coupon update error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function deleteCoupon(id: number) {
    loading.value = true
    error.value = null

    try {
      await couponsApi.delete(id)
      message.success('Coupon deleted successfully')
      await fetchCoupons()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete coupon'
      message.error(error.value)
      console.error('Coupon delete error:', err)
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
    coupons,
    currentCoupon,
    loading,
    error,
    // Actions
    fetchCoupons,
    fetchCouponById,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    clearError,
  }
})
