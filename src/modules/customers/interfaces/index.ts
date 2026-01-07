/**
 * Customers Module Interfaces
 */

export interface Customer {
  id: number
  first_name: string
  last_name: string
  email: string
  phone?: string
  avatar?: string
  status?: 'active' | 'inactive'
  address?: string
  total_spent: number
  orders_count: number
  groups?: CustomerGroup[]
  last_order_date?: string
  created_at: string
}

export interface CustomerGroup {
  id: number
  name: string
  description?: string
}

export interface CustomerNote {
  id: number
  content: string
  created_at: string
  created_by_user?: {
    first_name: string
    last_name: string
  }
}

export interface CustomerQueryParams {
  page?: number
  limit?: number
  search?: string
  group?: string
  status?: string
  [key: string]: unknown
}
