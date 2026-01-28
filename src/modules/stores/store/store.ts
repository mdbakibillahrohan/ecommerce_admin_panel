import type { BusinessCategory, IStore } from '@/modules/shared/interfaces/store/store.interface'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/modules/shared/config/http.config'
import type { PaginatedResponse } from '@/modules/products/interfaces'

export function useStoreStore() {
  return defineStore('store', () => {
    const stores = ref<IStore[]>([])
    const storeCategories = ref<BusinessCategory[]>([])
    const activeStore = ref<IStore | null>(null)

    const fetchCurrentUserStores = async () => {
      const storeListRes = await api.get<{ data: IStore[] }>('/stores')
      stores.value = storeListRes.data.data
      return storeListRes
    }

    const getStoreCategories = async () => {
      const storeCategoryListRes = await api.get<PaginatedResponse<BusinessCategory>>('/business-categories')
      storeCategories.value = storeCategoryListRes.data.data
      return storeCategoryListRes
    }

    const setActiveStore = (active: IStore) => {
      activeStore.value = active
    }

    return {
      stores,
      storeCategories,
      activeStore,
      fetchCurrentUserStores,
      getStoreCategories,
      setActiveStore,
    }
  })()
}
