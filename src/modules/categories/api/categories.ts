import api from '@/modules/shared/config/http.config'

// Import and re-export all interfaces for backward compatibility
export type { Category, CreateCategoryDto, UpdateCategoryDto } from '../interfaces'

import type { Category, CreateCategoryDto, UpdateCategoryDto } from '../interfaces'

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
