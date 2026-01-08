/**
 * Payments Service
 * All API calls for payment management following SOLID principles
 */
import api from '@/modules/shared/config/http.config'
import type { Payment, PaginatedResponse, RefundPaymentDto } from '../interfaces'

// Re-export types for convenience
export type {
  PaymentStatus,
  PaymentMethod,
  Payment,
  PaginatedResponse,
  RefundPaymentDto,
} from '../interfaces'

/**
 * Payment Service - Handles all payment-related operations
 */
class PaymentService {
  private readonly basePath = '/admin/payments'

  /**
   * Get all payments with pagination
   */
  async getAll(page = 1, limit = 20): Promise<PaginatedResponse<Payment>> {
    const response = await api.get<PaginatedResponse<Payment>>(this.basePath, {
      params: { page, limit },
    })
    return response.data
  }

  /**
   * Get a single payment by ID
   */
  async getById(id: number): Promise<Payment> {
    const response = await api.get<Payment>(`${this.basePath}/${id}`)
    return response.data
  }

  /**
   * Refund a payment
   */
  async refund(id: number, data: RefundPaymentDto): Promise<Payment> {
    const response = await api.post<Payment>(`${this.basePath}/${id}/refund`, data)
    return response.data
  }

  /**
   * Get payment statistics
   */
  async getStats(): Promise<{
    total: number
    completed: number
    pending: number
    failed: number
    refunded: number
  }> {
    const response = await api.get<any>(`${this.basePath}/stats`)
    return response.data
  }

  /**
   * Get payments by order ID
   */
  async getByOrder(orderId: number): Promise<Payment[]> {
    const response = await api.get<Payment[]>(`${this.basePath}/order/${orderId}`)
    return response.data
  }
}

// Export singleton instance
export const paymentService = new PaymentService()

// Export default for backward compatibility
export default paymentService
