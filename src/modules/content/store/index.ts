import { defineStore } from 'pinia'
import { ref } from 'vue'
import { contentApi, type Page, type Menu, type CreatePageDto, type CreateMenuDto } from '@/modules/content/api/content'
import { message } from 'ant-design-vue'

export const useContentStore = defineStore('content', () => {
  // State
  const pages = ref<Page[]>([])
  const menus = ref<Menu[]>([])
  const currentPage = ref<Page | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions - Pages
  async function fetchPages(storeId: number) {
    loading.value = true
    error.value = null

    try {
      pages.value = await contentApi.getPages(storeId)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch pages'
      message.error(error.value)
      console.error('Pages fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchPage(storeId: number, slug: string) {
    loading.value = true
    error.value = null

    try {
      currentPage.value = await contentApi.getPage(storeId, slug)
      return currentPage.value
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch page'
      message.error(error.value)
      console.error('Page fetch error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function createPage(data: CreatePageDto, storeId: number) {
    loading.value = true
    error.value = null

    try {
      await contentApi.createPage(data)
      message.success('Page created successfully')
      await fetchPages(storeId)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create page'
      message.error(error.value)
      console.error('Page create error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  // Actions - Menus
  async function fetchMenus(storeId: number) {
    loading.value = true
    error.value = null

    try {
      menus.value = await contentApi.getMenus(storeId)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch menus'
      message.error(error.value)
      console.error('Menus fetch error:', err)
    } finally {
      loading.value = false
    }
  }

  async function createMenu(data: CreateMenuDto, storeId: number) {
    loading.value = true
    error.value = null

    try {
      await contentApi.createMenu(data)
      message.success('Menu created successfully')
      await fetchMenus(storeId)
      return true
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create menu'
      message.error(error.value)
      console.error('Menu create error:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    pages,
    menus,
    currentPage,
    loading,
    error,
    // Actions
    fetchPages,
    fetchPage,
    createPage,
    fetchMenus,
    createMenu,
    clearError,
  }
})
