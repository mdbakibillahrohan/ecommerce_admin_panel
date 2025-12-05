import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi, type LoginRequest, type LoginResponse } from '@/api/auth'

export interface User {
    id: number
    email: string
    first_name: string
    last_name: string
}

export const useAuthStore = defineStore('auth', () => {
    // State
    const token = ref<string | null>(localStorage.getItem('admin_token'))
    const user = ref<User | null>(JSON.parse(localStorage.getItem('admin_user') || 'null'))
    const loading = ref(false)
    const error = ref<string | null>(null)

    // Getters
    const isAuthenticated = computed(() => !!token.value)
    const fullName = computed(() => user.value ? `${user.value.first_name} ${user.value.last_name}` : '')

    // Actions
    async function login(credentials: LoginRequest) {
        loading.value = true
        error.value = null

        try {
            const response: LoginResponse = await authApi.login(credentials)

            token.value = response.access_token
            user.value = response.user

            localStorage.setItem('admin_token', response.access_token)
            localStorage.setItem('admin_user', JSON.stringify(response.user))

            return true
        } catch (err: any) {
            error.value = err.response?.data?.message || 'Login failed. Please try again.'
            return false
        } finally {
            loading.value = false
        }
    }

    function logout() {
        token.value = null
        user.value = null
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
    }

    function clearError() {
        error.value = null
    }

    return {
        // State
        token,
        user,
        loading,
        error,
        // Getters
        isAuthenticated,
        fullName,
        // Actions
        login,
        logout,
        clearError,
    }
})
