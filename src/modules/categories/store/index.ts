import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { categoriesApi, type Category } from '@/modules/categories/api/categories'
import { message } from 'ant-design-vue'

export const useCategoriesStore = defineStore('categories', () => {
  // State
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const flatCategories = computed(() => categories.value)

  const categoryTree = computed(() => {
    const buildTree = (parentId: number | null = null): Category[] => {
      return categories.value
        .filter(cat => cat.parent_id === parentId)
        .map(cat => ({
          ...cat,
          children: buildTree(cat.id),
        }))
    }
    return buildTree(null)
  })

  const categoryMap = computed(() => {
    const map = new Map<number, Category>()
    categories.value.forEach(cat => map.set(cat.id, cat))
    return map
  })

  // Actions
  async function fetchCategories() {
    loading.value = true
    error.value = null

    try {
      categories.value = await categoriesApi.getAll()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch categories'
      message.error(error.value)
      console.error('Categories fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  async function createCategory(categoryData: Partial<Category>) {
    loading.value = true
    error.value = null

    try {
      await categoriesApi.create(categoryData as any)
      message.success('Category created successfully')
      await fetchCategories()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create category'
      message.error(error.value)
      console.error('Category create error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function updateCategory(id: number, categoryData: Partial<Category>) {
    loading.value = true
    error.value = null

    try {
      await categoriesApi.update(id, categoryData as any)
      message.success('Category updated successfully')
      await fetchCategories()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update category'
      message.error(error.value)
      console.error('Category update error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  async function deleteCategory(id: number) {
    loading.value = true
    error.value = null

    try {
      await categoriesApi.delete(id)
      message.success('Category deleted successfully')
      await fetchCategories()
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete category'
      message.error(error.value)
      console.error('Category delete error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  function getCategoryById(id: number): Category | undefined {
    return categoryMap.value.get(id)
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    categories,
    loading,
    error,
    // Computed
    flatCategories,
    categoryTree,
    categoryMap,
    // Actions
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    clearError,
  }
})
