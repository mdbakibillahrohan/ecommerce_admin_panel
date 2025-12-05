import api from './index'

export interface Category {
    id: number
    category_name: string
    slug: string
    description: string | null
    parent_id: number | null
    image_id: number | null
    sort_order: number
    is_featured: boolean
    remarks: string | null
    created_at: string
    updated_at: string
    children?: Category[]
    parent?: Category
    image?: { id: number; url: string }
}

export interface CreateCategoryDto {
    category_name: string
    slug?: string
    description?: string
    parent_id?: number
    image_id?: number
    sort_order?: number
    is_featured?: boolean
    remarks?: string
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> { }

export const categoriesApi = {
    getAll: async (): Promise<Category[]> => {
        const response = await api.get<Category[]>('/categories')
        return response.data
    },

    getTree: async (): Promise<Category[]> => {
        const response = await api.get<Category[]>('/categories/tree')
        return response.data
    },

    getFeatured: async (): Promise<Category[]> => {
        const response = await api.get<Category[]>('/categories/featured')
        return response.data
    },

    getById: async (id: number): Promise<Category> => {
        const response = await api.get<Category>(`/categories/${id}`)
        return response.data
    },

    getBySlug: async (slug: string): Promise<Category> => {
        const response = await api.get<Category>(`/categories/slug/${slug}`)
        return response.data
    },

    create: async (data: CreateCategoryDto): Promise<Category> => {
        const response = await api.post<Category>('/categories', data)
        return response.data
    },

    update: async (id: number, data: UpdateCategoryDto): Promise<Category> => {
        const response = await api.patch<Category>(`/categories/${id}`, data)
        return response.data
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/categories/${id}`)
    },
}
