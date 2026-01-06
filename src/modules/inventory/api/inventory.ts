import api from '@/modules/shared/config/http.config'

export interface Inventory {
  id: number
  product_id: number
  variant_id: number | null
  quantity: number
  reserved_quantity: number
  low_stock_threshold: number
  created_at: string
  updated_at: string
  product?: {
    id: number
    name: string
    slug: string
    sku: string | null
    thumbnail?: { url: string }
    price?: number
  }
  variant?: {
    id: number
    name: string
    sku: string | null
  }
}

export interface UpdateInventoryDto {
  quantity?: number
  reserved_quantity?: number
  low_stock_threshold?: number
}

export interface BulkUpdateItem {
  id: number
  quantity: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

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
