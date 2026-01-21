import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosError } from 'axios'

// API Base URL with version prefix
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api/v1'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add auth token and active store id
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('admin_token')

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const refreshToken = document.cookie
        .split(';')
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith('refresh_token='))
        ?.split('=')[1]

      if (refreshToken) {
        try {
          const response = await api.post('/auth/refresh', { refreshToken })
          const { accessToken, refreshToken: newRefreshToken } = response.data
          localStorage.setItem('admin_token', accessToken)
          document.cookie = `refresh_token=${newRefreshToken}; path=/`

          if (error.config) {
            return api(error.config)
          }
        } catch (refreshError) {
          console.error('Refresh token failed:', refreshError)
          // Clear token and redirect to login on unauthorized
          localStorage.removeItem('admin_token')
          document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
          window.location.href = '/#/login'
        }
      }
      return Promise.reject(error)
    }
    return Promise.reject(error)
  },
)

export default api
export { API_BASE_URL }
