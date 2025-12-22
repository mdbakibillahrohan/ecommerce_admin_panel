/* eslint-disable @typescript-eslint/no-explicit-any */
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
      loading.value = true
      error.value = null
      try {
        const response = await api.get<IUser>('/user/info')
        // console.log('Fetched logged in user:', response.data)
        currentUserInfo.value = response.data

        return response.data
      } catch (err: any) {
        error.value = err.response?.data?.message || 'Failed to fetch user data.'
        return null
      } finally {
        loading.value = false
      }
    }
    return {
      currentUserInfo,
      loading,
      error,
      fetchLoggedInUser,
    }
  })()
}
