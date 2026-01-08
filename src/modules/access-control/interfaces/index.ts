import { PolicyEffect } from './enums'

export { PolicyEffect } from './enums'

export interface AbacResource {
  id: number
  name: string
  description: string | null
  entity_type: string
  available_actions: string[] | null
  available_attributes: Record<string, any> | null
  created_at: string
  updated_at: string
}

export interface AbacPolicy {
  id: number
  name: string
  description: string | null
  resource_id: number | null
  resource?: AbacResource
  action: string
  effect: PolicyEffect
  priority: number
  is_active: boolean
  store_id: number | null
  conditions: Record<string, any> | null
  created_at: string
  updated_at: string
}

export interface AbacSubjectAttribute {
  id: number
  user_id: number
  attribute_key: string
  attribute_value: string
  store_id: number | null
  created_at: string
}

export interface AbacAuditLog {
  id: number
  user_id: number
  store_id: number | null
  resource_type: string
  action: string
  decision: PolicyEffect
  policy_id: number | null
  request_context: Record<string, any> | null
  created_at: string
}

export interface EffectivePermission {
  resource: string
  action: string
  effect: PolicyEffect
  source: 'policy' | 'role_template'
  policyId?: number
  roleTemplateId?: number
}

// DTOs
export interface CreatePolicyDto {
  name: string
  description?: string
  resource_id?: number
  action: string
  effect: PolicyEffect
  priority: number
  store_id?: number
  conditions?: Record<string, any>
}

export interface UpdatePolicyDto {
  name?: string
  description?: string
  resource_id?: number
  action?: string
  effect?: PolicyEffect
  priority?: number
  store_id?: number
  conditions?: Record<string, any>
  is_active?: boolean
}

export interface QueryPolicyDto {
  page?: number
  limit?: number
  search?: string
  resource_id?: number
  store_id?: number
  action?: string
  effect?: PolicyEffect
  is_active?: boolean
}

export interface CreateResourceDto {
  name: string
  description?: string
  entity_type: string
  available_actions?: string[]
  available_attributes?: Record<string, any>
}

export interface CheckPermissionDto {
  resource: string
  action: string
  store_id?: number
  context?: Record<string, any>
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
