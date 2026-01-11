import { defineStore } from 'pinia'
import { ref } from 'vue'
import { accessControlService, type AbacPolicy, type CreatePolicyDto, type UpdatePolicyDto } from '@/modules/access-control/services/access-control.service'
import { message } from 'ant-design-vue'

export const useAccessControlStore = defineStore('accessControl', () => {
  // State
  const policies = ref<AbacPolicy[]>([])
  const total = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  async function fetchPolicies() {
    loading.value = true
    error.value = null

    try {
      const response = await accessControlService.getPolicies()
      policies.value = response.data
      total.value = response.meta.total
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch policies'
      message.error(error.value)
      console.error('Policies fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  async function createPolicy(data: CreatePolicyDto) {
    loading.value = true
    error.value = null

    try {
      await accessControlService.createPolicy(data)
      message.success('Policy created successfully')
      await fetchPolicies()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create policy'
      message.error(error.value)
      console.error('Policy create error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function updatePolicy(id: number, data: UpdatePolicyDto) {
    loading.value = true
    error.value = null

    try {
      await accessControlService.updatePolicy(id, data)
      message.success('Policy updated successfully')
      await fetchPolicies()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update policy'
      message.error(error.value)
      console.error('Policy update error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function deletePolicy(id: number) {
    loading.value = true
    error.value = null

    try {
      await accessControlService.deletePolicy(id)
      message.success('Policy deleted successfully')
      await fetchPolicies()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete policy'
      message.error(error.value)
      console.error('Policy delete error:', err)
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
    policies,
    total,
    loading,
    error,
    // Actions
    fetchPolicies,
    createPolicy,
    updatePolicy,
    deletePolicy,
    clearError,
  }
})
