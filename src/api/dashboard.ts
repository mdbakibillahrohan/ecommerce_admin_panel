import api from './index'

// Dashboard DTOs matching backend
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

export const dashboardApi = {
    getFullDashboard: async (query?: DashboardQuery): Promise<DashboardResponse> => {
        const response = await api.get<DashboardResponse>('/admin/dashboard', { params: query })
        return response.data
    },

    getOverviewStats: async (): Promise<OverviewStats> => {
        const response = await api.get<OverviewStats>('/admin/dashboard/overview')
        return response.data
    },

    getOrderStats: async (): Promise<OrderStats> => {
        const response = await api.get<OrderStats>('/admin/dashboard/orders')
        return response.data
    },

    getSalesStats: async (query?: DashboardQuery): Promise<SalesStats> => {
        const response = await api.get<SalesStats>('/admin/dashboard/sales', { params: query })
        return response.data
    },

    getProductStats: async (): Promise<ProductStats> => {
        const response = await api.get<ProductStats>('/admin/dashboard/products')
        return response.data
    },

    getPaymentStats: async (): Promise<PaymentStats> => {
        const response = await api.get<PaymentStats>('/admin/dashboard/payments')
        return response.data
    },

    getReviewStats: async (): Promise<ReviewStats> => {
        const response = await api.get<ReviewStats>('/admin/dashboard/reviews')
        return response.data
    },

    getRecentOrders: async (limit = 10): Promise<RecentOrder[]> => {
        const response = await api.get<RecentOrder[]>('/admin/dashboard/recent-orders', { params: { limit } })
        return response.data
    },

    getTopProducts: async (limit = 10): Promise<TopProduct[]> => {
        const response = await api.get<TopProduct[]>('/admin/dashboard/top-products', { params: { limit } })
        return response.data
    },

    getLowStockAlerts: async (): Promise<LowStockAlert[]> => {
        const response = await api.get<LowStockAlert[]>('/admin/dashboard/low-stock')
        return response.data
    },

    getRecentActivity: async (limit = 20): Promise<RecentActivity[]> => {
        const response = await api.get<RecentActivity[]>('/admin/dashboard/activity', { params: { limit } })
        return response.data
    },
}
