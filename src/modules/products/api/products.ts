import api from '@/modules/shared/config/http.config'

// Import and re-export all interfaces for backward compatibility
export type {
  Product,
  ProductVariant,
  ProductImage,
  Category,
  File,
  CreateProductDto,
  UpdateProductDto,
  ProductQuery,
  PaginatedResponse,
  CreateVariantDto,
  UpdateVariantDto,
  AddProductImageDto,
} from '../interfaces'

import type {
  Product,
  ProductVariant,
  ProductImage,
  CreateProductDto,
  UpdateProductDto,
  ProductQuery,
  PaginatedResponse,
  CreateVariantDto,
  UpdateVariantDto,
  AddProductImageDto,
} from '../interfaces'

export const productsApi = {
  // Product CRUD
  getAll: async (query?: ProductQuery): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<PaginatedResponse<Product>>('/products', { params: query })
    return response.data
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`)
    return response.data
  },

  getBySlug: async (slug: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/slug/${slug}`)
    return response.data
  },

  create: async (data: CreateProductDto): Promise<Product> => {
    const response = await api.post<Product>('/products', data)
    return response.data
  },

  update: async (id: number, data: UpdateProductDto): Promise<Product> => {
    const response = await api.patch<Product>(`/products/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`)
  },

  getFeatured: async (limit?: number): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products/featured', { params: { limit } })
    return response.data
  },

  getRelated: async (id: number, limit?: number): Promise<Product[]> => {
    const response = await api.get<Product[]>(`/products/${id}/related`, { params: { limit } })
    return response.data
  },

  // Variants
  getVariants: async (productId: number): Promise<ProductVariant[]> => {
    const response = await api.get<ProductVariant[]>(`/products/${productId}/variants`)
    return response.data
  },

  addVariant: async (productId: number, data: CreateVariantDto): Promise<ProductVariant> => {
    const response = await api.post<ProductVariant>(`/products/${productId}/variants`, data)
    return response.data
  },

  updateVariant: async (
    productId: number,
    variantId: number,
    data: UpdateVariantDto,
  ): Promise<ProductVariant> => {
    const response = await api.patch<ProductVariant>(
      `/products/${productId}/variants/${variantId}`,
      data,
    )
    return response.data
  },

  deleteVariant: async (productId: number, variantId: number): Promise<void> => {
    await api.delete(`/products/${productId}/variants/${variantId}`)
  },

  // Images
  getImages: async (productId: number): Promise<ProductImage[]> => {
    const response = await api.get<ProductImage[]>(`/products/${productId}/images`)
    return response.data
  },

  addImage: async (productId: number, data: AddProductImageDto): Promise<ProductImage> => {
    const response = await api.post<ProductImage>(`/products/${productId}/images`, data)
    return response.data
  },

  addMultipleImages: async (
    productId: number,
    images: AddProductImageDto[],
  ): Promise<ProductImage[]> => {
    const response = await api.post<ProductImage[]>(`/products/${productId}/images/bulk`, {
      images,
    })
    return response.data
  },

  deleteImage: async (productId: number, imageId: number): Promise<void> => {
    await api.delete(`/products/${productId}/images/${imageId}`)
  },
}
