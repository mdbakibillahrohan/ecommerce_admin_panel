import api from '@/modules/shared/config/http.config'

// Import and re-export all interfaces
export type {
  OrderStatus,
  OrderItem,
  Order,
  Address,
  Payment,
  OrderQuery,
  PaginatedResponse,
  UpdateOrderStatusDto,
  UpdateTrackingDto,
  OrderStatsResponse,
} from '../interfaces'

import type {
  Order,
  OrderQuery,
  OrderStatsResponse,
  PaginatedResponse,
  UpdateOrderStatusDto,
  UpdateTrackingDto,
} from '../interfaces'

export const ordersApi = {
  // Admin endpoints
  getAll: async (query?: OrderQuery): Promise<PaginatedResponse<Order>> => {
    const response = await api.get<PaginatedResponse<Order>>('/admin/orders', { params: query })
    return response.data
  },

  getById: async (id: number): Promise<Order> => {
    const response = await api.get<Order>(`/admin/orders/${id}`)
    return response.data
  },

  getStats: async (): Promise<OrderStatsResponse> => {
    const response = await api.get<OrderStatsResponse>('/admin/orders/stats')
    return response.data
  },

  updateStatus: async (id: number, data: UpdateOrderStatusDto): Promise<Order> => {
    const response = await api.patch<Order>(`/admin/orders/${id}/status`, data)
    return response.data
  },

  updateTracking: async (id: number, data: UpdateTrackingDto): Promise<Order> => {
    const response = await api.patch<Order>(`/admin/orders/${id}/tracking`, data)
    return response.data
  },
}
