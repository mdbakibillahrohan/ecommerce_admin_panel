/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/config/http.config"

export interface Customer {
  id: number
  first_name: string
  last_name: string
  email: string
  phone?: string
  total_spent: number
  orders_count: number
  groups?: CustomerGroup[]
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

export const customerService = {
  async getCustomers(params?: any) {
    const response = await api.get('/customers', { params })
    return response.data
  },

  async getCustomer(id: number) {
    const response = await api.get(`/customers/${id}`)
    return response.data
  },

  async updateCustomer(id: number, data: any) {
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
  }
}
