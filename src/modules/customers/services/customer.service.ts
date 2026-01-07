import api from '@/modules/shared/config/http.config'

// Import and re-export all interfaces
export type { Customer, CustomerGroup, CustomerNote, CustomerQueryParams } from '../interfaces'

import type { Customer, CustomerQueryParams } from '../interfaces'

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
