import api from '@/modules/shared/config/http.config'

// Import and re-export all interfaces
export type { StaffMember, InviteStaffDto, UpdateStaffRoleDto } from '../interfaces'

import type { StaffMember } from '../interfaces'

export const staffService = {
  async getStaffMembers() {
    const response = await api.get('/staff')
    return response.data
  },

  async inviteStaff(email: string, role: string) {
    const response = await api.post('/staff/invite', { email, role })
    return response.data
  },

  async updateStaffRole(memberId: number, role: string) {
    const response = await api.patch(`/staff/${memberId}/role`, { role })
    return response.data
  },

  async removeStaff(memberId: number) {
    await api.delete(`/staff/${memberId}`)
  },

  async getRoles() {
    // If we have dynamic roles API
    // For now we can return static or fetch if backend has it
    return ['ADMIN', 'MEMBER', 'SUPPORT']
  },
}
