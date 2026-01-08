/**
 * Orders Service
 * All API calls for order management following SOLID principles
 */
import api from '@/modules/shared/config/http.config'
import type {
  Order,
  OrderQuery,
  OrderStatsResponse,
  PaginatedResponse,
  UpdateOrderStatusDto,
  UpdateTrackingDto,
} from '../interfaces'

// Re-export types for convenience
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

/**
 * Order Service - Handles all order-related API operations
 */
class OrderService {
  private readonly basePath = '/admin/orders'

  /**
   * Get all orders with pagination and filters
   */
  async getAll(query?: OrderQuery): Promise<PaginatedResponse<Order>> {
    const response = await api.get<PaginatedResponse<Order>>(this.basePath, { params: query })
    return response.data
  }

  /**
   * Get a single order by ID
   */
  async getById(id: number): Promise<Order> {
    const response = await api.get<Order>(`${this.basePath}/${id}`)
    return response.data
  }

  /**
   * Get order statistics
   */
  async getStats(): Promise<OrderStatsResponse> {
    const response = await api.get<OrderStatsResponse>(`${this.basePath}/stats`)
    return response.data
  }

  /**
   * Update order status
   */
  async updateStatus(id: number, data: UpdateOrderStatusDto): Promise<Order> {
    const response = await api.patch<Order>(`${this.basePath}/${id}/status`, data)
    return response.data
  }

  /**
   * Update order tracking information
   */
  async updateTracking(id: number, data: UpdateTrackingDto): Promise<Order> {
    const response = await api.patch<Order>(`${this.basePath}/${id}/tracking`, data)
    return response.data
  }

  /**
   * Cancel an order
   */
  async cancel(id: number, reason?: string): Promise<Order> {
    const response = await api.patch<Order>(`${this.basePath}/${id}/cancel`, { reason })
    return response.data
  }

  /**
   * Refund an order
   */
  async refund(id: number, amount?: number, reason?: string): Promise<Order> {
    const response = await api.post<Order>(`${this.basePath}/${id}/refund`, { amount, reason })
    return response.data
  }
}

// Export singleton instance
export const orderService = new OrderService()

// Export default for backward compatibility
export default orderService
