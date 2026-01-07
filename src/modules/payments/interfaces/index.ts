/**
 * Payments Module Interfaces
 */

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
export type PaymentMethod = 'CARD' | 'BANK_TRANSFER' | 'MOBILE_BANKING' | 'COD'

export interface Payment {
  id: number
  order_id: number
  amount: number
  currency: string
  status: PaymentStatus
  payment_method: PaymentMethod
  transaction_id: string | null
  gateway_response: Record<string, unknown> | null
  refund_amount: number | null
  refund_reason: string | null
  refunded_at: string | null
  created_at: string
  updated_at: string
  order?: {
    id: number
    order_number: string
    user?: {
      id: number
      email: string
      first_name: string
      last_name: string
    }
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface RefundPaymentDto {
  amount?: number
  reason?: string
}
