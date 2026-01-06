import api from '@/config/http.config'

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

export const customerService = {
  async getCustomers(params?: CustomerQueryParams) {
    const response = await api.get('/customers', { params })
    return response.data
  },

  async getCustomer(id: number) {
    const response = await api.get(`/customers/${id}`)
    return response.data
  },

  async updateCustomer(id: number, data: Partial<Customer>) {
    const response = await api.patch(`/customers/${id}`, data)
    return response.data
  },

  async getCustomerGroups() {
    const response = await api.get('/customers/groups')
    return response.data
  },

  async addNote(customerId: number, content: string) {
    const response = await api.post(`/customers/${customerId}/notes`, { content })
    return response.data
  },
}
