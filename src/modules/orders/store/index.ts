import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ordersApi, type Order, type OrderQuery, type UpdateOrderStatusDto } from '@/modules/orders/api/orders'
import { message } from 'ant-design-vue'

export const useOrdersStore = defineStore('orders', () => {
  // State
  const orders = ref<Order[]>([])
  const currentOrder = ref<Order | null>(null)
  const total = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Filters
  const filters = ref<{
    search: string
    status?: string
    dateRange?: [string, string]
  }>({
    search: '',
    status: undefined,
    dateRange: undefined,
  })

  // Pagination
  const pagination = ref({
    current: 1,
    pageSize: 10,
  })

  // Computed
  const ordersByStatus = computed(() => {
    const grouped: Record<string, Order[]> = {}
    orders.value.forEach(order => {
      const status = order.status
      if (!grouped[status]) {
        grouped[status] = []
      }
      grouped[status].push(order)
    })
    return grouped
  })

  const totalRevenue = computed(() =>
    orders.value.reduce((sum, order) => sum + order.total, 0)
  )

  const averageOrderValue = computed(() =>
    orders.value.length > 0 ? totalRevenue.value / orders.value.length : 0
  )

  const statistics = computed(() => ({
    total: total.value,
    totalRevenue: totalRevenue.value,
    averageOrderValue: averageOrderValue.value,
    byStatus: ordersByStatus.value,
  }))

  // Actions
  async function fetchOrders() {
    loading.value = true
    error.value = null

    try {
      const query: OrderQuery = {
        page: pagination.value.current,
        limit: pagination.value.pageSize,
        search: filters.value.search || undefined,
        status: filters.value.status as any,
      }

      const response = await ordersApi.getAll(query)
      orders.value = response.data
      total.value = response.total
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch orders'
      message.error(error.value)
      console.error('Orders fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchOrderById(id: number) {
    loading.value = true
    error.value = null

    try {
      currentOrder.value = await ordersApi.getById(id)
      return currentOrder.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch order'
      message.error(error.value)
      console.error('Order fetch error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function updateOrderStatus(id: number, statusData: UpdateOrderStatusDto) {
    loading.value = true
    error.value = null

    try {
      const updatedOrder = await ordersApi.updateStatus(id, statusData)
      message.success('Order status updated successfully')

      // Update in list if present
      const index = orders.value.findIndex(o => o.id === id)
      if (index !== -1) {
        orders.value[index] = updatedOrder
      }

      // Update current order if it's the same
      if (currentOrder.value?.id === id) {
        currentOrder.value = updatedOrder
      }

      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update order status'
      message.error(error.value)
      console.error('Order status update error:', err)
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
      dateRange: undefined,
    }
    pagination.value.current = 1
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    orders,
    currentOrder,
    total,
    loading,
    error,
    filters,
    pagination,
    // Computed
    ordersByStatus,
    totalRevenue,
    averageOrderValue,
    statistics,
    // Actions
    fetchOrders,
    fetchOrderById,
    updateOrderStatus,
    setFilters,
    setPagination,
    clearFilters,
    clearError,
  }
})
