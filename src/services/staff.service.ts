import api from '@/config/http.config'

export interface StaffMember {
  id: number
  email?: string
  user?: {
    id: number
    first_name: string
    last_name: string
    email: string
  }
  role: string // OWNER, ADMIN, MEMBER
  status: string // ACTIVE, INVITED, PENDING
  invited_at?: string
  joined_at?: string
  created_at?: string
}

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
