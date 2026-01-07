import api from '@/modules/shared/config/http.config'

// Import and re-export all interfaces
export type {
  Inventory,
  UpdateInventoryDto,
  BulkUpdateItem,
  PaginatedResponse,
} from '../interfaces'

import type {
  Inventory,
  UpdateInventoryDto,
  BulkUpdateItem,
  PaginatedResponse,
} from '../interfaces'

export const inventoryApi = {
  getAll: async (page = 1, limit = 20): Promise<PaginatedResponse<Inventory>> => {
    const response = await api.get<PaginatedResponse<Inventory>>('/admin/inventory', {
      params: { page, limit },
    })
    return response.data
  },

  getLowStock: async (): Promise<Inventory[]> => {
    const response = await api.get<Inventory[]>('/admin/inventory/low-stock')
    return response.data
  },

  update: async (id: number, data: UpdateInventoryDto): Promise<Inventory> => {
    const response = await api.patch<Inventory>(`/admin/inventory/${id}`, data)
    return response.data
  },

  bulkUpdate: async (items: BulkUpdateItem[]): Promise<{ updated: number }> => {
    const response = await api.post<{ updated: number }>('/admin/inventory/bulk-update', { items })
    return response.data
  },
}
