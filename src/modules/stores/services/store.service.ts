/**
 * Store Service
 * All API calls for store management following SOLID principles
 */
import api from '@/modules/shared/config/http.config'
import type {
  Store,
  CreateStoreDto,
  UpdateStoreDto,
  StoreMember,
  AddStoreMemberDto,
} from '../interfaces'

// Re-export types for convenience
export type {
  Store,
  CreateStoreDto,
  UpdateStoreDto,
  StoreMember,
  AddStoreMemberDto,
} from '../interfaces'

/**
 * Store Service - Handles all store-related operations
 */
class StoreService {
  private readonly basePath = '/stores'

  /**
   * Get all stores for current user
   */
  async getAll(): Promise<Store[]> {
    const response = await api.get<Store[]>(this.basePath)
    return response.data
  }

  /**
   * Get a single store by ID
   */
  async getById(id: number): Promise<Store> {
    const response = await api.get<Store>(`${this.basePath}/${id}`)
    return response.data
  }

  /**
   * Create a new store
   */
  async create(data: CreateStoreDto): Promise<Store> {
    const response = await api.post<Store>(this.basePath, data)
    return response.data
  }

  /**
   * Update an existing store
   */
  async update(id: number, data: UpdateStoreDto): Promise<Store> {
    const response = await api.patch<Store>(`${this.basePath}/${id}`, data)
    return response.data
  }

  /**
   * Delete a store
   */
  async delete(id: number): Promise<void> {
    await api.delete(`${this.basePath}/${id}`)
  }

  /**
   * Get store members
   */
  async getMembers(storeId: number): Promise<StoreMember[]> {
    const response = await api.get<StoreMember[]>(`${this.basePath}/${storeId}/members`)
    return response.data
  }

  /**
   * Add a member to a store
   */
  async addMember(storeId: number, data: AddStoreMemberDto): Promise<StoreMember> {
    const response = await api.post<StoreMember>(`${this.basePath}/${storeId}/members`, data)
    return response.data
  }

  /**
   * Remove a member from a store
   */
  async removeMember(storeId: number, memberId: number): Promise<void> {
    await api.delete(`${this.basePath}/${storeId}/members/${memberId}`)
  }

  /**
   * Update store member role
   */
  async updateMemberRole(storeId: number, memberId: number, roleId: number): Promise<StoreMember> {
    const response = await api.patch<StoreMember>(
      `${this.basePath}/${storeId}/members/${memberId}`,
      { role_id: roleId }
    )
    return response.data
  }

  /**
   * Set active store for current user
   */
  async setActive(storeId: number): Promise<void> {
    localStorage.setItem('active_store_id', storeId.toString())
  }

  /**
   * Get current active store ID
   */
  getActiveStoreId(): number | null {
    const id = localStorage.getItem('active_store_id')
    return id ? parseInt(id, 10) : null
  }
}

// Export singleton instance
export const storeService = new StoreService()

export default storeService
