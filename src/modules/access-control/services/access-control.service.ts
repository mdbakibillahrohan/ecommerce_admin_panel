/**
 * Access Control Service
 * All API calls for ABAC (Attribute-Based Access Control) management
 */
import api from '@/modules/shared/config/http.config'
import type {
  AbacPolicy,
  AbacResource,
  AbacSubjectAttribute,
  AbacAuditLog,
  EffectivePermission,
  CreatePolicyDto,
  UpdatePolicyDto,
  QueryPolicyDto,
  CreateResourceDto,
  CheckPermissionDto,
  PaginatedResponse,
} from '../interfaces'

// Re-export types
export type {
  AbacPolicy,
  AbacResource,
  AbacSubjectAttribute,
  AbacAuditLog,
  EffectivePermission,
  CreatePolicyDto,
  UpdatePolicyDto,
  QueryPolicyDto,
  CreateResourceDto,
  CheckPermissionDto,
  PaginatedResponse,
} from '../interfaces'

export { PolicyEffect } from '../interfaces/enums'

/**
 * Access Control Service - Handles all ABAC-related operations
 */
class AccessControlService {
  private readonly basePath = '/abac'

  // ============ Permission Check ============

  /**
   * Check if current user has a specific permission
   */
  async checkPermission(dto: CheckPermissionDto): Promise<boolean> {
    const response = await api.post<{ allowed: boolean }>(`${this.basePath}/check`, dto)
    return response.data.allowed
  }

  /**
   * Get current user's effective permissions
   */
  async getMyPermissions(storeId?: number): Promise<EffectivePermission[]> {
    const response = await api.get<{ permissions: EffectivePermission[] }>(
      `${this.basePath}/permissions/me`,
      { params: { store_id: storeId } }
    )
    return response.data.permissions
  }

  /**
   * Get a user's effective permissions (admin only)
   */
  async getUserPermissions(userId: number, storeId?: number): Promise<EffectivePermission[]> {
    const response = await api.get<{ permissions: EffectivePermission[] }>(
      `${this.basePath}/permissions/user/${userId}`,
      { params: { store_id: storeId } }
    )
    return response.data.permissions
  }

  // ============ Policies CRUD ============

  /**
   * Get all policies with pagination and filters
   */
  async getPolicies(query?: QueryPolicyDto): Promise<PaginatedResponse<AbacPolicy>> {
    const response = await api.get<PaginatedResponse<AbacPolicy>>(
      `${this.basePath}/policies`,
      { params: query }
    )
    return response.data
  }

  /**
   * Get a single policy by ID
   */
  async getPolicyById(id: number): Promise<AbacPolicy> {
    const response = await api.get<AbacPolicy>(`${this.basePath}/policies/${id}`)
    return response.data
  }

  /**
   * Create a new policy
   */
  async createPolicy(data: CreatePolicyDto): Promise<AbacPolicy> {
    const response = await api.post<AbacPolicy>(`${this.basePath}/policies`, data)
    return response.data
  }

  /**
   * Update an existing policy
   */
  async updatePolicy(id: number, data: UpdatePolicyDto): Promise<AbacPolicy> {
    const response = await api.patch<AbacPolicy>(`${this.basePath}/policies/${id}`, data)
    return response.data
  }

  /**
   * Delete a policy
   */
  async deletePolicy(id: number): Promise<void> {
    await api.delete(`${this.basePath}/policies/${id}`)
  }

  /**
   * Toggle policy active status
   */
  async togglePolicyStatus(id: number, isActive: boolean): Promise<AbacPolicy> {
    return this.updatePolicy(id, { is_active: isActive })
  }

  // ============ Resources ============

  /**
   * Get all available resources
   */
  async getResources(): Promise<AbacResource[]> {
    const response = await api.get<AbacResource[]>(`${this.basePath}/resources`)
    return response.data
  }

  /**
   * Get a single resource by ID
   */
  async getResourceById(id: number): Promise<AbacResource> {
    const response = await api.get<AbacResource>(`${this.basePath}/resources/${id}`)
    return response.data
  }

  /**
   * Create a new resource
   */
  async createResource(data: CreateResourceDto): Promise<AbacResource> {
    const response = await api.post<AbacResource>(`${this.basePath}/resources`, data)
    return response.data
  }

  // ============ User Attributes ============

  /**
   * Get current user's attributes
   */
  async getMyAttributes(storeId?: number): Promise<AbacSubjectAttribute[]> {
    const response = await api.get<{ attributes: AbacSubjectAttribute[] }>(
      `${this.basePath}/attributes/me`,
      { params: { store_id: storeId } }
    )
    return response.data.attributes
  }

  /**
   * Get a user's attributes (admin only)
   */
  async getUserAttributes(userId: number, storeId?: number): Promise<AbacSubjectAttribute[]> {
    const response = await api.get<{ attributes: AbacSubjectAttribute[] }>(
      `${this.basePath}/attributes/user/${userId}`,
      { params: { store_id: storeId } }
    )
    return response.data.attributes
  }

  /**
   * Set a user attribute (admin only)
   */
  async setUserAttribute(
    userId: number,
    key: string,
    value: string,
    storeId?: number
  ): Promise<AbacSubjectAttribute> {
    const response = await api.post<AbacSubjectAttribute>(
      `${this.basePath}/attributes/user/${userId}`,
      { key, value, store_id: storeId }
    )
    return response.data
  }

  /**
   * Remove a user attribute (admin only)
   */
  async removeUserAttribute(userId: number, key: string, storeId?: number): Promise<void> {
    await api.delete(`${this.basePath}/attributes/user/${userId}/${key}`, {
      params: { store_id: storeId },
    })
  }

  // ============ Audit Logs ============

  /**
   * Get audit logs with filters
   */
  async getAuditLogs(query?: {
    userId?: number
    storeId?: number
    resource?: string
    action?: string
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<AbacAuditLog>> {
    const response = await api.get<PaginatedResponse<AbacAuditLog>>(
      `${this.basePath}/audit-logs`,
      {
        params: {
          user_id: query?.userId,
          store_id: query?.storeId,
          resource: query?.resource,
          action: query?.action,
          page: query?.page,
          limit: query?.limit,
        },
      }
    )
    return response.data
  }
}

// Export singleton instance
export const accessControlService = new AccessControlService()

// Export default for backward compatibility
export default accessControlService
