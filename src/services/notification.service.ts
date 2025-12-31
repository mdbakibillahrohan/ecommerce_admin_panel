/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/config/http.config"

export interface NotificationTemplate {
  id: number
  event: string // ORDER_CREATED, USER_REGISTERED etc
  channel: string // EMAIL, PUSH, SMS
  subject: string
  content: string
  is_active: boolean
}

export const notificationService = {
  async getTemplates() {
    const response = await api.get('/settings/notification-templates')
    return response.data
  },

  async getTemplate(id: number) {
      // Assuming endpoint exists
      const response = await api.get(`/settings/notification-templates/${id}`)
      return response.data
  },

  async createTemplate(data: any) {
    const response = await api.post('/settings/notification-templates', data)
    return response.data
  },

  async updateTemplate(id: number, data: any) {
    const response = await api.patch(`/settings/notification-templates/${id}`, data)
    return response.data
  },

  async deleteTemplate(id: number) {
      await api.delete(`/settings/notification-templates/${id}`)
  }
}
