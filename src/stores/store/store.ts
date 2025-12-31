import type { IStore, IStoreCategory } from '@/intefaces/store/store.interface'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/config/http.config'

export function useStoreStore() {
  return defineStore('store', () => {
    const stores = ref<IStore[]>([])
    const storeCategories = ref<IStoreCategory[]>([])
    const activeStore = ref<IStore | null>(null)

    const fetchCurrentUserStores = async () => {
      const storeListRes = await api.get<IStore[]>('/stores')
      stores.value = storeListRes.data
      return storeListRes
    }

    const fetStoreCategories = async () => {
      const storeCategoryListRes = await api.get<{
        storeCategories: IStoreCategory[]
        total: number
      }>('/store-category')
      console.log(storeCategoryListRes.data.storeCategories)
      storeCategories.value = storeCategoryListRes.data.storeCategories
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
      fetStoreCategories,
      setActiveStore,
    }
  })()
}
