import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { customerService, type Customer, type CustomerQueryParams } from '@/modules/customers/services/customer.service'
import { message } from 'ant-design-vue'

export const useCustomersStore = defineStore('customers', () => {
  // State
  const customers = ref<Customer[]>([])
  const currentCustomer = ref<Customer | null>(null)
  const total = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Filters
  const filters = ref<{
    search: string
    status?: string
    groupId?: number
  }>({
    search: '',
    status: undefined,
    groupId: undefined,
  })

  // Pagination
  const pagination = ref({
    current: 1,
    pageSize: 10,
  })

  // Computed
  const activeCustomers = computed(() =>
    customers.value.filter(c => c.status === 'active')
  )

  const statistics = computed(() => ({
    total: total.value,
    active: activeCustomers.value.length,
  }))

  // Actions
  async function fetchCustomers() {
    loading.value = true
    error.value = null

    try {
      const params: CustomerQueryParams = {
        page: pagination.value.current,
        limit: pagination.value.pageSize,
        search: filters.value.search || undefined,
      }

      const response = await customerService.getCustomers(params)
      customers.value = response.data
      total.value = response.total
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch customers'
      message.error(error.value)
      console.error('Customers fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchCustomerById(id: number) {
    loading.value = true
    error.value = null

    try {
      currentCustomer.value = await customerService.getCustomer(id)
      return currentCustomer.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch customer'
      message.error(error.value)
      console.error('Customer fetch error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateCustomer(id: number, customerData: Partial<Customer>) {
    loading.value = true
    error.value = null

    try {
      const updatedCustomer = await customerService.updateCustomer(id, customerData)
      message.success('Customer updated successfully')

      // Update in list if present
      const index = customers.value.findIndex(c => c.id === id)
      if (index !== -1) {
        customers.value[index] = updatedCustomer
      }

      // Update current customer if it's the same
      if (currentCustomer.value?.id === id) {
        currentCustomer.value = updatedCustomer
      }

      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update customer'
      message.error(error.value)
      console.error('Customer update error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  function setFilters(newFilters: Partial<typeof filters.value>) {
    filters.value = { ...filters.value, ...newFilters }
    pagination.value.current = 1
  }

  function setPagination(current: number, pageSize: number) {
    pagination.value = { current, pageSize }
  }

  function clearFilters() {
    filters.value = {
      search: '',
      status: undefined,
      groupId: undefined,
    }
    pagination.value.current = 1
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    customers,
    currentCustomer,
    total,
    loading,
    error,
    filters,
    pagination,
    // Computed
    activeCustomers,
    statistics,
    // Actions
    fetchCustomers,
    fetchCustomerById,
    updateCustomer,
    setFilters,
    setPagination,
    clearFilters,
    clearError,
  }
})
