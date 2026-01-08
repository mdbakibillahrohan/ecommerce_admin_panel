/**
 * Inventory Service
 * All API calls for inventory management following SOLID principles
 */
import api from '@/modules/shared/config/http.config'
import type {
  Inventory,
  UpdateInventoryDto,
  BulkUpdateItem,
  PaginatedResponse,
} from '../interfaces'

// Re-export types for convenience
export type {
  Inventory,
  UpdateInventoryDto,
  BulkUpdateItem,
  PaginatedResponse,
} from '../interfaces'

/**
 * Inventory Service - Handles all inventory-related operations
 */
class InventoryService {
  private readonly basePath = '/admin/inventory'

  /**
   * Get all inventory items with pagination
   */
  async getAll(page = 1, limit = 20): Promise<PaginatedResponse<Inventory>> {
    const response = await api.get<PaginatedResponse<Inventory>>(this.basePath, {
      params: { page, limit },
    })
    return response.data
  }

  /**
   * Get low stock inventory items
   */
  async getLowStock(): Promise<Inventory[]> {
    const response = await api.get<Inventory[]>(`${this.basePath}/low-stock`)
    return response.data
  }

  /**
   * Get out of stock inventory items
   */
  async getOutOfStock(): Promise<Inventory[]> {
    const response = await api.get<Inventory[]>(`${this.basePath}/out-of-stock`)
    return response.data
  }

  /**
   * Update inventory for a specific item
   */
  async update(id: number, data: UpdateInventoryDto): Promise<Inventory> {
    const response = await api.patch<Inventory>(`${this.basePath}/${id}`, data)
    return response.data
  }

  /**
   * Bulk update inventory items
   */
  async bulkUpdate(items: BulkUpdateItem[]): Promise<{ updated: number }> {
    const response = await api.post<{ updated: number }>(`${this.basePath}/bulk-update`, { items })
    return response.data
  }

  /**
   * Adjust inventory quantity (add or subtract)
   */
  async adjustQuantity(
    id: number,
    adjustment: number,
    reason?: string
  ): Promise<Inventory> {
    const response = await api.post<Inventory>(`${this.basePath}/${id}/adjust`, {
      adjustment,
      reason,
    })
    return response.data
  }

  /**
   * Get inventory history for a product
   */
  async getHistory(productId: number): Promise<any[]> {
    const response = await api.get<any[]>(`${this.basePath}/product/${productId}/history`)
    return response.data
  }
}

// Export singleton instance
export const inventoryService = new InventoryService()

// Export default for backward compatibility
export default inventoryService
