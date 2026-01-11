import api from '@/modules/shared/config/http.config'

// Import and re-export all interfaces
export type {
  Store,
  CreateStoreDto,
  UpdateStoreDto,
  StoreMember,
  AddStoreMemberDto,
} from '../interfaces'

import type {
  Store,
  CreateStoreDto,
  UpdateStoreDto,
  StoreMember,
  AddStoreMemberDto,
} from '../interfaces'

export interface StoreCategory {
  id: number
  name: string
  description?: string
  is_active: boolean
}

export interface MyStoresResponse {
  stores: (Store & { role: string; isActive: boolean })[]
  activeStoreIds: number[]
}

export const storesApi = {
  // ============ Store Activation ============

  // Get all stores user owns or is member of
  async getMyStores() {
    const res = await api.get<MyStoresResponse>('/stores/my-stores')
    return res.data
  },

  // Get user's currently active stores
  async getActiveStores() {
    const res = await api.get<Store[]>('/stores/active')
    return res.data
  },

  // Get all store categories
  async getCategories() {
    const res = await api.get<StoreCategory[]>('/stores/categories')
    return res.data
  },

  // Activate a store
  async activateStore(storeId: number) {
    const res = await api.post<number[]>(`/stores/${storeId}/activate`)
    return res.data
  },

  // Deactivate a store
  async deactivateStore(storeId: number) {
    const res = await api.post<number[]>(`/stores/${storeId}/deactivate`)
    return res.data
  },

  // ============ Store CRUD ============

  // Get all stores for current user
  async getAll() {
    const res = await api.get<Store[]>('/stores')
    return res.data
  },

  // Get single store
  async getById(id: number) {
    const res = await api.get<Store>(`/stores/${id}`)
    return res.data
  },

  // Create new store
  async create(data: CreateStoreDto) {
    const res = await api.post<Store>('/stores', data)
    return res.data
  },

  // Update store
  async update(id: number, data: UpdateStoreDto) {
    const res = await api.patch<Store>(`/stores/${id}`, data)
    return res.data
  },

  // ============ Store Members ============

  // Get members of a store
  async getMemberListOfStore(storeId: number) {
    const res = await api.get<StoreMember[]>(`/stores/${storeId}/members`)
    return res.data
  },

  // Add member to store
  async addMember(storeId: number, data: AddStoreMemberDto) {
    const res = await api.post<StoreMember>(`/stores/${storeId}/members`, data)
    return res.data
  },

  // Remove member from store
  async removeMember(storeId: number, memberId: number) {
    const res = await api.delete(`/stores/${storeId}/members/${memberId}`)
    return res.data
  },
}
