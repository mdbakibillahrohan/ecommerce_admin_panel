import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { inventoryApi, type Inventory, type UpdateInventoryDto } from '@/modules/inventory/api/inventory'
import { message } from 'ant-design-vue'

export const useInventoryStore = defineStore('inventory', () => {
  // State
  const inventory = ref<Inventory[]>([])
  const lowStockItems = ref<Inventory[]>([])
  const total = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Pagination
  const pagination = ref({
    current: 1,
    pageSize: 20,
  })

  // Computed
  const statistics = computed(() => ({
    total: total.value,
    lowStock: lowStockItems.value.length,
  }))

  // Actions
  async function fetchInventory() {
    loading.value = true
    error.value = null

    try {
      const response = await inventoryApi.getAll(pagination.value.current, pagination.value.pageSize)
      inventory.value = response.data
      total.value = response.total
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch inventory'
      message.error(error.value)
      console.error('Inventory fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchLowStock() {
    loading.value = true
    error.value = null

    try {
      lowStockItems.value = await inventoryApi.getLowStock()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch low stock items'
      message.error(error.value)
      console.error('Low stock fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  async function updateInventory(id: number, data: UpdateInventoryDto) {
    loading.value = true
    error.value = null

    try {
      await inventoryApi.update(id, data)
      message.success('Inventory updated successfully')
      await fetchInventory()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update inventory'
      message.error(error.value)
      console.error('Inventory update error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  function setPagination(current: number, pageSize: number) {
    pagination.value = { current, pageSize }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    inventory,
    lowStockItems,
    total,
    loading,
    error,
    pagination,
    // Computed
    statistics,
    // Actions
    fetchInventory,
    fetchLowStock,
    updateInventory,
    setPagination,
    clearError,
  }
})
