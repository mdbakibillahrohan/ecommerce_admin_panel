/**
 * Staff & Roles Service
 * API service for staff management, roles, and permissions
 */
import api from '@/modules/shared/config/http.config'

// ============ Interfaces ============

export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  phone_number?: string
}

export interface StaffRole {
  id: number
  store_id: number
  name: string
  description: string | null
  permissions: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface StaffMember {
  id: number
  store_id: number
  user_id: number
  role: string
  custom_role_id: number | null
  permissions: string[] | null
  status: 'ACTIVE' | 'INVITED' | 'PENDING' | 'SUSPENDED'
  email?: string // Direct email field for invitations
  created_at?: string
  invited_at: string | null
  joined_at: string
  user?: User
  customRole?: StaffRole | null
  effectivePermissions?: string[]
  hasFullAccess?: boolean
  permissionSource?: 'custom' | 'role' | 'template'
}

export interface RoleTemplate {
  key: string
  name: string
  slug: string
  description: string
  permissions: string[]
  isSystem: boolean
  permissionCount: number
}

export interface PermissionInfo {
  key: string
  label: string
  description: string
}

export interface PermissionGroup {
  key: string
  label: string
  description: string
  icon?: string
  permissions: PermissionInfo[]
}

export interface PermissionsResponse {
  groups: PermissionGroup[]
  allPermissions: string[]
  totalCount: number
}

export interface RolesResponse {
  customRoles: StaffRole[]
  templates: (RoleTemplate & { id: null; isTemplate: true; templateKey: string })[]
}

export interface RoleWithDetails extends StaffRole {
  groupedPermissions: {
    key: string
    label: string
    description: string
    icon?: string
    permissions: PermissionInfo[]
  }[]
  totalPermissions: number
}

export interface EffectivePermissions {
  permissions: string[]
  role: string | null
  customRole: { id: number; name: string } | null
  isOwner: boolean
  hasFullAccess: boolean
}

export interface InviteStaffDto {
  email: string
  role: string
  custom_role_id?: number
  permissions?: string[]
}

export interface CreateRoleDto {
  name: string
  description?: string
  permissions: string[]
}

export interface UpdateRoleDto {
  name?: string
  description?: string
  permissions?: string[]
  is_active?: boolean
}

// ============ Staff Service ============

class StaffService {
  private readonly basePath = '/staff'

  // ============ Permissions ============

  async getPermissions(): Promise<PermissionsResponse> {
    const response = await api.get<PermissionsResponse>(`${this.basePath}/permissions`)
    return response.data
  }

  async getRoleTemplates(): Promise<RoleTemplate[]> {
    const response = await api.get<RoleTemplate[]>(`${this.basePath}/permissions/templates`)
    return response.data
  }

  async checkPermission(permission: string): Promise<{ permission: string; allowed: boolean }> {
    const response = await api.get<{ permission: string; allowed: boolean }>(
      `${this.basePath}/permissions/check`,
      { params: { permission } }
    )
    return response.data
  }

  async getMyPermissions(): Promise<EffectivePermissions> {
    const response = await api.get<EffectivePermissions>(`${this.basePath}/permissions/me`)
    return response.data
  }

  // ============ Staff Members ============

  async getStaffMembers(): Promise<StaffMember[]> {
    const response = await api.get<StaffMember[]>(this.basePath)
    return response.data
  }

  async getStaffMember(id: number): Promise<StaffMember> {
    const response = await api.get<StaffMember>(`${this.basePath}/${id}`)
    return response.data
  }

  async inviteStaff(dto: InviteStaffDto): Promise<{ message: string; member?: StaffMember; invitation?: any }> {
    const response = await api.post(`${this.basePath}/invite`, dto)
    return response.data
  }

  async resendInvitation(memberId: number): Promise<{ message: string; email: string }> {
    const response = await api.post(`${this.basePath}/invitation/resend/${memberId}`)
    return response.data
  }

  async updateStaff(memberId: number, data: Partial<StaffMember>): Promise<StaffMember> {
    const response = await api.patch<StaffMember>(`${this.basePath}/${memberId}`, data)
    return response.data
  }

  async assignRole(staffId: number, roleId: number): Promise<StaffMember> {
    const response = await api.post<StaffMember>(`${this.basePath}/${staffId}/assign-role`, { role_id: roleId })
    return response.data
  }

  async setCustomPermissions(staffId: number, permissions: string[]): Promise<StaffMember> {
    const response = await api.post<StaffMember>(`${this.basePath}/${staffId}/permissions`, { permissions })
    return response.data
  }

  async removeStaff(memberId: number): Promise<void> {
    await api.delete(`${this.basePath}/${memberId}`)
  }

  // ============ Roles ============

  async getRoles(): Promise<RolesResponse> {
    const response = await api.get<RolesResponse>(`${this.basePath}/roles`)
    return response.data
  }

  async getRole(id: number): Promise<RoleWithDetails> {
    const response = await api.get<RoleWithDetails>(`${this.basePath}/roles/${id}`)
    return response.data
  }

  async createRole(dto: CreateRoleDto): Promise<StaffRole> {
    const response = await api.post<StaffRole>(`${this.basePath}/roles`, dto)
    return response.data
  }

  async createRoleFromTemplate(
    templateKey: string,
    name: string,
    description?: string
  ): Promise<StaffRole> {
    const response = await api.post<StaffRole>(`${this.basePath}/roles/from-template`, {
      templateKey,
      name,
      description,
    })
    return response.data
  }

  async updateRole(id: number, dto: UpdateRoleDto): Promise<StaffRole> {
    const response = await api.patch<StaffRole>(`${this.basePath}/roles/${id}`, dto)
    return response.data
  }

  async deleteRole(id: number): Promise<void> {
    await api.delete(`${this.basePath}/roles/${id}`)
  }
}

// Export singleton instance
export const staffService = new StaffService()
export default staffService
