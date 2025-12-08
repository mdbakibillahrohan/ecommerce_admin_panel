import api from './index'

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
    getAll() {
        return api.get<Store[]>('/stores').then(res => res.data)
    },

    // Get single store
    getById(id: number) {
        return api.get<Store>(`/stores/${id}`).then(res => res.data)
    },

    // Create new store
    create(data: CreateStoreDto) {
        return api.post<Store>('/stores', data).then(res => res.data)
    },

    // Update store
    update(id: number, data: UpdateStoreDto) {
        return api.patch<Store>(`/stores/${id}`, data).then(res => res.data)
    },

    // Add member to store
    addMember(storeId: number, data: AddStoreMemberDto) {
        return api.post<StoreMember>(`/stores/${storeId}/members`, data).then(res => res.data)
    },

    // Remove member from store
    removeMember(storeId: number, memberId: number) {
        return api.delete(`/stores/${storeId}/members/${memberId}`).then(res => res.data)
    }
}
