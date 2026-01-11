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

// Extended store interface with activation info
export interface StoreWithRole extends Store {
  role: string
  isActive: boolean
}

export interface MyStoresResponse {
  stores: StoreWithRole[]
  activeStoreIds: number[]
}

/**
 * Store Service - Handles all store-related operations
 */
class StoreService {
  private readonly basePath = '/stores'

  // ============ Store Activation ============

  /**
   * Get all stores user owns or is member of
   */
  async getMyStores(): Promise<MyStoresResponse> {
    const response = await api.get<MyStoresResponse>(`${this.basePath}/my-stores`)
    return response.data
  }

  /**
   * Get user's currently active stores
   */
  async getActiveStores(): Promise<Store[]> {
    const response = await api.get<Store[]>(`${this.basePath}/active`)
    return response.data
  }

  /**
   * Activate a store (add to active stores list)
   */
  async activateStore(storeId: number): Promise<number[]> {
    const response = await api.post<number[]>(`${this.basePath}/${storeId}/activate`)
    // Also update localStorage for quick access
    this.setActiveStoreId(storeId)
    return response.data
  }

  /**
   * Deactivate a store (remove from active stores list)
   */
  async deactivateStore(storeId: number): Promise<number[]> {
    const response = await api.post<number[]>(`${this.basePath}/${storeId}/deactivate`)
    return response.data
  }

  // ============ Store CRUD ============

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

  // ============ Store Members ============

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

  // ============ Local Storage Helpers ============

  /**
   * Set primary active store in localStorage
   */
  setActiveStoreId(storeId: number): void {
    localStorage.setItem('active_store_id', storeId.toString())
  }

  /**
   * Get current active store ID from localStorage
   */
  getActiveStoreId(): number | null {
    const id = localStorage.getItem('active_store_id')
    return id ? parseInt(id, 10) : null
  }

  /**
   * Get store categories
   */
  async getCategories(): Promise<{ id: number; name: string }[]> {
    const response = await api.get<{ id: number; name: string }[]>(`${this.basePath}/categories`)
    return response.data
  }
}

// Export singleton instance
export const storeService = new StoreService()

export default storeService

