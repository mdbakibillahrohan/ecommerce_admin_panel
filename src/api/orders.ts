import api from '@/config/http.config'

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED'

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  variant_id: number | null
  product_name: string
  variant_name: string | null
  quantity: number
  unit_price: number
  total_price: number
  product?: {
    id: number
    name: string
    slug: string
    thumbnail?: { url: string }
  }
}

export interface Order {
  id: number
  user_id: number
  order_number: string
  status: OrderStatus
  subtotal: number
  discount_amount: number
  shipping_cost: number
  tax_amount: number
  total: number
  currency: string
  shipping_address_id: number | null
  billing_address_id: number | null
  coupon_id: number | null
  notes: string | null
  admin_notes: string | null
  shipped_at: string | null
  delivered_at: string | null
  tracking_number: string | null
  shipping_carrier: string | null
  created_at: string
  updated_at: string
  user?: {
    id: number
    email: string
    first_name: string
    last_name: string
  }
  items?: OrderItem[]
  shipping_address?: Address
  billing_address?: Address
  payment?: Payment
}

export interface Address {
  id: number
  full_name: string
  phone: string
  address_line1: string
  address_line2: string | null
  city: string
  state: string
  postal_code: string
  country: string
}

export interface Payment {
  id: number
  order_id: number
  amount: number
  currency: string
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
  payment_method: string
  transaction_id: string | null
  created_at: string
}

export interface OrderQuery {
  page?: number
  limit?: number
  status?: OrderStatus
  search?: string
  start_date?: string
  end_date?: string
  sort_by?: string
  sort_order?: 'ASC' | 'DESC'
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface UpdateOrderStatusDto {
  status: OrderStatus
  admin_notes?: string
}

export interface UpdateTrackingDto {
  tracking_number: string
  shipping_carrier?: string
}

export interface OrderStatsResponse {
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  cancelledOrders: number
  totalRevenue: number
}

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
