/**
 * Products Service
 * All API calls for product management following SOLID principles
 */
import api from '@/modules/shared/config/http.config'
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

// Re-export types for convenience
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

/**
 * Product Service - Handles all product-related API operations
 */
class ProductService {
  private readonly basePath = '/products'

  // ============ Product CRUD ============

  /**
   * Get all products with pagination and filters
   */
  async getAll(query?: ProductQuery): Promise<PaginatedResponse<Product>> {
    const response = await api.get<PaginatedResponse<Product>>(this.basePath, { params: query })
    return response.data
  }

  /**
   * Get a single product by ID
   */
  async getById(id: number): Promise<Product> {
    const response = await api.get<Product>(`${this.basePath}/${id}`)
    return response.data
  }

  /**
   * Get a single product by slug
   */
  async getBySlug(slug: string): Promise<Product> {
    const response = await api.get<Product>(`${this.basePath}/slug/${slug}`)
    return response.data
  }

  /**
   * Create a new product
   */
  async create(data: CreateProductDto): Promise<Product> {
    const response = await api.post<Product>(this.basePath, data)
    return response.data
  }

  /**
   * Update an existing product
   */
  async update(id: number, data: UpdateProductDto): Promise<Product> {
    const response = await api.patch<Product>(`${this.basePath}/${id}`, data)
    return response.data
  }

  /**
   * Delete a product
   */
  async delete(id: number): Promise<void> {
    await api.delete(`${this.basePath}/${id}`)
  }

  /**
   * Get featured products
   */
  async getFeatured(limit?: number): Promise<Product[]> {
    const response = await api.get<Product[]>(`${this.basePath}/featured`, { params: { limit } })
    return response.data
  }

  /**
   * Get related products
   */
  async getRelated(id: number, limit?: number): Promise<Product[]> {
    const response = await api.get<Product[]>(`${this.basePath}/${id}/related`, { params: { limit } })
    return response.data
  }

  // ============ Product Variants ============

  /**
   * Get all variants for a product
   */
  async getVariants(productId: number): Promise<ProductVariant[]> {
    const response = await api.get<ProductVariant[]>(`${this.basePath}/${productId}/variants`)
    return response.data
  }

  /**
   * Add a variant to a product
   */
  async addVariant(productId: number, data: CreateVariantDto): Promise<ProductVariant> {
    const response = await api.post<ProductVariant>(`${this.basePath}/${productId}/variants`, data)
    return response.data
  }

  /**
   * Update a product variant
   */
  async updateVariant(
    productId: number,
    variantId: number,
    data: UpdateVariantDto
  ): Promise<ProductVariant> {
    const response = await api.patch<ProductVariant>(
      `${this.basePath}/${productId}/variants/${variantId}`,
      data
    )
    return response.data
  }

  /**
   * Delete a product variant
   */
  async deleteVariant(productId: number, variantId: number): Promise<void> {
    await api.delete(`${this.basePath}/${productId}/variants/${variantId}`)
  }

  // ============ Product Images ============

  /**
   * Get all images for a product
   */
  async getImages(productId: number): Promise<ProductImage[]> {
    const response = await api.get<ProductImage[]>(`${this.basePath}/${productId}/images`)
    return response.data
  }

  /**
   * Add an image to a product
   */
  async addImage(productId: number, data: AddProductImageDto): Promise<ProductImage> {
    const response = await api.post<ProductImage>(`${this.basePath}/${productId}/images`, data)
    return response.data
  }

  /**
   * Add multiple images to a product
   */
  async addMultipleImages(productId: number, images: AddProductImageDto[]): Promise<ProductImage[]> {
    const response = await api.post<ProductImage[]>(`${this.basePath}/${productId}/images/bulk`, {
      images,
    })
    return response.data
  }

  /**
   * Delete a product image
   */
  async deleteImage(productId: number, imageId: number): Promise<void> {
    await api.delete(`${this.basePath}/${productId}/images/${imageId}`)
  }
}

// Export singleton instance
export const productService = new ProductService()

// Export default for backward compatibility
export default productService
