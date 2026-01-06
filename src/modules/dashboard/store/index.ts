import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  dashboardApi,
  type DashboardResponse,
  type DashboardQuery,
} from '@/modules/dashboard/api/dashboard'

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const dashboardData = ref<DashboardResponse | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function fetchDashboard(query?: DashboardQuery) {
    loading.value = true
    error.value = null

    try {
      dashboardData.value = await dashboardApi.getFullDashboard(query)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch dashboard data'
      console.error('Dashboard fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    dashboardData,
    loading,
    error,
    // Actions
    fetchDashboard,
    clearError,
  }
})
