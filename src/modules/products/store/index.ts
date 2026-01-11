import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { productsApi, type Product, type ProductQuery } from '@/modules/products/api/products'
import { message } from 'ant-design-vue'

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref<Product[]>([])
  const total = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Filters
  const filters = ref<{
    search: string
    categoryId?: number
    status?: 'published' | 'draft'
    priceRange?: [number, number]
  }>({
    search: '',
    categoryId: undefined,
    status: undefined,
    priceRange: undefined,
  })

  // Pagination
  const pagination = ref({
    current: 1,
    pageSize: 10,
  })

  // Computed
  const publishedProducts = computed(() =>
    products.value.filter(p => p.is_published)
  )

  const draftProducts = computed(() =>
    products.value.filter(p => !p.is_published)
  )

  const lowStockProducts = computed(() =>
    products.value.filter(p => p.stock_quantity <= p.low_stock_threshold)
  )

  const totalValue = computed(() =>
    products.value.reduce((sum, p) =>
      sum + (p.sale_price || p.base_price) * p.stock_quantity, 0
    )
  )

  const statistics = computed(() => ({
    total: total.value,
    published: publishedProducts.value.length,
    draft: draftProducts.value.length,
    lowStock: lowStockProducts.value.length,
    totalValue: totalValue.value,
  }))

  // Actions
  async function fetchProducts() {
    loading.value = true
    error.value = null

    try {
      const query: ProductQuery = {
        page: pagination.value.current,
        limit: pagination.value.pageSize,
        search: filters.value.search || undefined,
        category_id: filters.value.categoryId,
        is_published:
          filters.value.status === 'published' ? true :
          filters.value.status === 'draft' ? false :
          undefined,
      }

      const response = await productsApi.getAll(query)
      products.value = response.data
      total.value = response.total
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch products'
      message.error(error.value)
      console.error('Products fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  async function createProduct(productData: Partial<Product>) {
    loading.value = true
    error.value = null

    try {
      await productsApi.create(productData as any)
      message.success('Product created successfully')
      await fetchProducts()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create product'
      message.error(error.value)
      console.error('Product create error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function updateProduct(id: number, productData: Partial<Product>) {
    loading.value = true
    error.value = null

    try {
      await productsApi.update(id, productData as any)
      message.success('Product updated successfully')
      await fetchProducts()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update product'
      message.error(error.value)
      console.error('Product update error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function deleteProduct(id: number) {
    loading.value = true
    error.value = null

    try {
      await productsApi.delete(id)
      message.success('Product deleted successfully')
      await fetchProducts()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete product'
      message.error(error.value)
      console.error('Product delete error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function bulkDelete(ids: number[]) {
    loading.value = true
    error.value = null

    try {
      await Promise.all(ids.map(id => productsApi.delete(id)))
      message.success(`${ids.length} products deleted successfully`)
      await fetchProducts()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete products'
      message.error(error.value)
      console.error('Bulk delete error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function bulkPublish(ids: number[], publish: boolean) {
    loading.value = true
    error.value = null

    try {
      await Promise.all(ids.map(id => productsApi.update(id, { is_published: publish })))
      message.success(`${ids.length} products ${publish ? 'published' : 'unpublished'} successfully`)
      await fetchProducts()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update products'
      message.error(error.value)
      console.error('Bulk publish error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function togglePublish(product: Product) {
    return await updateProduct(product.id, { is_published: !product.is_published })
  }

  async function duplicateProduct(product: Product) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, created_at, updated_at, ...productData } = product
      const newProduct = {
        ...productData,
        description: productData.description ?? undefined,
        short_description: productData.short_description ?? undefined,
        sale_price: productData.sale_price ?? undefined,
        thumbnail_id: productData.thumbnail_id ?? undefined,
        category_id: productData.category_id ?? undefined,
        meta_title: productData.meta_title ?? undefined,
        meta_description: productData.meta_description ?? undefined,
        name: `${product.name} (Copy)`,
        sku: product.sku ? `${product.sku}-copy` : undefined,
      }

      return await createProduct(newProduct)
    } catch (err: any) {
      error.value = 'Failed to duplicate product'
      message.error(error.value)
      console.error('Duplicate error:', err)
      return false
    }
  }

  function setFilters(newFilters: Partial<typeof filters.value>) {
    filters.value = { ...filters.value, ...newFilters }
    pagination.value.current = 1 // Reset to first page when filters change
  }

  function setPagination(current: number, pageSize: number) {
    pagination.value = { current, pageSize }
  }

  function clearFilters() {
    filters.value = {
      search: '',
      categoryId: undefined,
      status: undefined,
      priceRange: undefined,
    }
    pagination.value.current = 1
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    products,
    total,
    loading,
    error,
    filters,
    pagination,
    // Computed
    publishedProducts,
    draftProducts,
    lowStockProducts,
    totalValue,
    statistics,
    // Actions
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    bulkDelete,
    bulkPublish,
    togglePublish,
    duplicateProduct,
    setFilters,
    setPagination,
    clearFilters,
    clearError,
  }
})
