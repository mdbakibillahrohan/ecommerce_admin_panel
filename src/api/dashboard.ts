/* eslint-disable @typescript-eslint/no-unused-vars */
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

// Direct export of the API object
export const dashboardApi = {
  getFullDashboard: async (_query?: DashboardQuery): Promise<DashboardResponse> =>
    ({}) as DashboardResponse,
  getOverviewStats: async (): Promise<OverviewStats> => ({}) as OverviewStats,
  getOrderStats: async (): Promise<OrderStats> => ({}) as OrderStats,
  getSalesStats: async (_query?: DashboardQuery): Promise<SalesStats> => ({}) as SalesStats,
  getProductStats: async (): Promise<ProductStats> => ({}) as ProductStats,
  getPaymentStats: async (): Promise<PaymentStats> => ({}) as PaymentStats,
  getReviewStats: async (): Promise<ReviewStats> => ({}) as ReviewStats,
  getRecentOrders: async (_limit?: number): Promise<RecentOrder[]> => [],
  getTopProducts: async (_limit?: number): Promise<TopProduct[]> => [],
  getLowStockAlerts: async (): Promise<LowStockAlert[]> => [],
  getRecentActivity: async (_limit?: number): Promise<RecentActivity[]> => [],
}
