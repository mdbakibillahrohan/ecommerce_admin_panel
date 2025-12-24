import api from '@/config/http.config'
import type { IUser } from '@/intefaces/users/user.interfaces'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export function useUserStore() {
  return defineStore('user', () => {
    const currentUserInfo = ref<IUser | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchLoggedInUser() {
      const response = await api.get<IUser>('/user/info')
      // console.log('Fetched logged in user:', response.data)
      currentUserInfo.value = response.data

      return response.data
    }
    return {
      currentUserInfo,
      loading,
      error,
      fetchLoggedInUser,
    }
  })()
}
