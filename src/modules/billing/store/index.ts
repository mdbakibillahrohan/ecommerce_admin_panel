import { defineStore } from 'pinia'
import { ref } from 'vue'
import { billingApi, type Plan, type StoreSubscription, type CreatePlanDto } from '@/modules/billing/api/billing'
import { message } from 'ant-design-vue'

export const useBillingStore = defineStore('billing', () => {
  // State
  const plans = ref<Plan[]>([])
  const subscription = ref<StoreSubscription | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function fetchPlans() {
    loading.value = true
    error.value = null

    try {
      plans.value = await billingApi.getPlans()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch plans'
      message.error(error.value)
      console.error('Plans fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchSubscription(storeId: number) {
    loading.value = true
    error.value = null

    try {
      subscription.value = await billingApi.getSubscription(storeId)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch subscription'
      message.error(error.value)
      console.error('Subscription fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  async function createPlan(data: CreatePlanDto) {
    loading.value = true
    error.value = null

    try {
      await billingApi.createPlan(data)
      message.success('Plan created successfully')
      await fetchPlans()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create plan'
      message.error(error.value)
      console.error('Plan create error:', err)
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
    plans,
    subscription,
    loading,
    error,
    // Actions
    fetchPlans,
    fetchSubscription,
    createPlan,
    clearError,
  }
})
