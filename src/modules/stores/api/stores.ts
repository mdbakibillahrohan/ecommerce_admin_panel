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

export const storesApi = {
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

  async getMemberListOfStore(storeId: number) {
    const res = await api.get(`/stores/${storeId}/members`)
    return res.data
  },
}
