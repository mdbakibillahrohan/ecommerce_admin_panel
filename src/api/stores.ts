/* eslint-disable @typescript-eslint/no-explicit-any */

import api from '@/config/http.config'

export interface Store {
  id: number
  name: string
  slug: string
  description?: string
  store_category_id: number
  store_category?: any
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'INACTIVE'
  email?: string
  phone?: string
  address?: string
  currency?: string
  timezone?: string
  owner_id: number
  logo: string
  favicon: string
  custom_domain?: string
  tagline?: string
  created_at: string
  updated_at: string
}

export interface CreateStoreDto {
  name: string
  slug: string
  store_category_id: number
  description?: string
  email?: string
  phone?: string
  address?: string
  currency?: string
  timezone?: string
  custom_domain?: string
  logo_id: number | undefined | null
  favicon_id: number | undefined | null
  tagline?: string
}

export interface UpdateStoreDto extends Partial<CreateStoreDto> {
  status?: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'INACTIVE'
}

export interface StoreMember {
  id: number
  user_id: number
  store_id: number
  role: string
  user: {
    id: number
    first_name: string
    last_name: string
    email: string
    avatar?: string
  }
}

export interface AddStoreMemberDto {
  email: string
  role: string
}

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
