/**
 * Dashboard Service
 * All API calls for dashboard data following SOLID principles
 */
import api from '@/modules/shared/config/http.config'

// Dashboard Types
export interface OverviewStats {
  totalUsers: number
  totalOrders: number
  totalProducts: number
  totalRevenue: number
  pendingOrders: number
  todayOrders: number
  todayRevenue: number
  newUsersThisWeek: number
  activeCategories: number
  activeCoupons: number
}

export interface OrderStats {
  pending: number
  confirmed: number
  processing: number
  shipped: number
  delivered: number
  cancelled: number
  refunded: number
  totalOrders: number
}

export interface SalesDataPoint {
  date: string
  orders: number
  revenue: number
}

export interface SalesComparison {
  previousPeriodRevenue: number
  growthPercentage: number
  previousPeriodOrders: number
  orderGrowthPercentage: number
}

export interface SalesStats {
  period: string
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  data: SalesDataPoint[]
  comparison: SalesComparison
}

export interface ProductStats {
  totalProducts: number
  publishedProducts: number
  featuredProducts: number
  outOfStockProducts: number
  lowStockProducts: number
  physicalProducts: number
  digitalProducts: number
  totalVariants: number
}

export interface PaymentStats {
  completedPayments: number
  pendingPayments: number
  failedPayments: number
  refundedAmount: number
  completedCount: number
  pendingCount: number
  failedCount: number
  refundedCount: number
}

export interface RecentOrder {
  id: number
  orderNumber: string
  customerName: string
  status: string
  total: number
  currency: string
  itemCount: number
  createdAt: string
}

export interface TopProduct {
  id: number
  name: string
  slug: string
  unitsSold: number
  revenue: number
  orderCount: number
  averageRating: number
}

export interface LowStockAlert {
  productId: number
  productName: string
  sku: string | null
  variantId: number | null
  variantName: string | null
  currentStock: number
  threshold: number
  status: 'out_of_stock' | 'critical' | 'low'
}

export interface RecentActivity {
  type: 'order' | 'user' | 'product' | 'review' | 'payment'
  description: string
  entityId: number
  timestamp: string
  metadata?: Record<string, unknown>
}

export interface ReviewStats {
  totalReviews: number
  approvedReviews: number
  pendingReviews: number
  averageRating: number
  ratingBreakdown: Record<number, number>
}

export interface DashboardResponse {
  overview: OverviewStats
  orders: OrderStats
  sales: SalesStats
  products: ProductStats
  payments: PaymentStats
  reviews: ReviewStats
  recentOrders: RecentOrder[]
  topProducts: TopProduct[]
  lowStockAlerts: LowStockAlert[]
  recentActivity: RecentActivity[]
}

export type DashboardPeriod = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom'

export interface DashboardQuery {
  period?: DashboardPeriod
  startDate?: string
  endDate?: string
}

/**
 * Dashboard Service - Handles all dashboard-related operations
 */
class DashboardService {
  private readonly basePath = '/admin/dashboard'

  /**
   * Get full dashboard data
   */
  async getFullDashboard(query?: DashboardQuery): Promise<DashboardResponse> {
    const response = await api.get<DashboardResponse>(this.basePath, { params: query })
    return response.data
  }

  /**
   * Get overview statistics
   */
  async getOverviewStats(): Promise<OverviewStats> {
    const response = await api.get<OverviewStats>(`${this.basePath}/overview`)
    return response.data
  }

  /**
   * Get order statistics
   */
  async getOrderStats(): Promise<OrderStats> {
    const response = await api.get<OrderStats>(`${this.basePath}/orders`)
    return response.data
  }

  /**
   * Get sales statistics
   */
  async getSalesStats(query?: DashboardQuery): Promise<SalesStats> {
    const response = await api.get<SalesStats>(`${this.basePath}/sales`, { params: query })
    return response.data
  }

  /**
   * Get product statistics
   */
  async getProductStats(): Promise<ProductStats> {
    const response = await api.get<ProductStats>(`${this.basePath}/products`)
    return response.data
  }

  /**
   * Get payment statistics
   */
  async getPaymentStats(): Promise<PaymentStats> {
    const response = await api.get<PaymentStats>(`${this.basePath}/payments`)
    return response.data
  }

  /**
   * Get review statistics
   */
  async getReviewStats(): Promise<ReviewStats> {
    const response = await api.get<ReviewStats>(`${this.basePath}/reviews`)
    return response.data
  }

  /**
   * Get recent orders
   */
  async getRecentOrders(limit = 10): Promise<RecentOrder[]> {
    const response = await api.get<RecentOrder[]>(`${this.basePath}/recent-orders`, {
      params: { limit },
    })
    return response.data
  }

  /**
   * Get top-selling products
   */
  async getTopProducts(limit = 10): Promise<TopProduct[]> {
    const response = await api.get<TopProduct[]>(`${this.basePath}/top-products`, {
      params: { limit },
    })
    return response.data
  }

  /**
   * Get low stock alerts
   */
  async getLowStockAlerts(): Promise<LowStockAlert[]> {
    const response = await api.get<LowStockAlert[]>(`${this.basePath}/low-stock`)
    return response.data
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(limit = 20): Promise<RecentActivity[]> {
    const response = await api.get<RecentActivity[]>(`${this.basePath}/activity`, {
      params: { limit },
    })
    return response.data
  }
}

// Export singleton instance
export const dashboardService = new DashboardService()

// Export default for backward compatibility
export default dashboardService
