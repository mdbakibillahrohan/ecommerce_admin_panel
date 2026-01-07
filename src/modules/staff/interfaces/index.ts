/**
 * Staff Module Interfaces
 */

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

export interface InviteStaffDto {
  email: string
  role: string
}

export interface UpdateStaffRoleDto {
  role: string
}
