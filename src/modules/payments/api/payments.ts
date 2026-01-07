import api from '@/modules/shared/config/http.config'

// Import and re-export all interfaces
export type {
  PaymentStatus,
  PaymentMethod,
  Payment,
  PaginatedResponse,
  RefundPaymentDto,
} from '../interfaces'

import type { Payment, PaginatedResponse, RefundPaymentDto } from '../interfaces'

export const paymentsApi = {
  getAll: async (page = 1, limit = 20): Promise<PaginatedResponse<Payment>> => {
    const response = await api.get<PaginatedResponse<Payment>>('/admin/payments', {
      params: { page, limit },
    })
    return response.data
  },

  refund: async (id: number, data: RefundPaymentDto): Promise<Payment> => {
    const response = await api.post<Payment>(`/admin/payments/${id}/refund`, data)
    return response.data
  },
}
