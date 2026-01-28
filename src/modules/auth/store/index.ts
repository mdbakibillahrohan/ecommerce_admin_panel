/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/modules/shared/config/http.config'
import type { IResponseDto } from '@/modules/shared/interfaces/common/IResponseDto.interface'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
}

export interface LoginCredentials {
  usernameOrEmail: string
  password: string
}

export function useAuthStore() {
  return defineStore('auth', () => {
    const token = ref<string | null>(localStorage.getItem('admin_token'))
    const user = ref<User | null>(JSON.parse(localStorage.getItem('admin_user') || 'null'))
    const activeStore = ref<any | null>(JSON.parse(localStorage.getItem('activeStore') || 'null'))
    const loading = ref(false)
    const error = ref<string | null>(null)

    const isAuthenticated = computed(() => !!token.value)
    const fullName = computed(() =>
      user.value ? `${user.value.first_name} ${user.value.last_name}` : '',
    )

    async function login(credentials: LoginCredentials) {
      loading.value = true
      error.value = null

      try {
        const response = await api.post<IResponseDto<any>>('/auth/login', credentials)
        localStorage.setItem('admin_token', response.data.data.accessToken)
        document.cookie = `refresh_token=${response.data.data.refreshToken}; path=/`
        token.value = response.data.data.accessToken
        return true
      } catch (err: any) {
        error.value = err.response?.data?.message || 'Login failed. Please try again.'
        return false
      } finally {
        loading.value = false
      }
    }

    function setActiveStore(store: any) {
      activeStore.value = store
      localStorage.setItem('activeStore', JSON.stringify(store))
    }

    function logout() {
      token.value = null
      user.value = null
      activeStore.value = null
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      localStorage.removeItem('activeStore')
    }

    function clearError() {
      error.value = null
    }

    return {
      token,
      user,
      activeStore,
      loading,
      error,
      isAuthenticated,
      fullName,
      login,
      setActiveStore,
      logout,
      clearError,
    }
  })()
}
