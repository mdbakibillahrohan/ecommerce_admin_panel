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
    const activeStoreId = localStorage.getItem('active_store_id')

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add store ID header for multi-tenant operations
    if (activeStoreId && config.headers) {
      config.headers['X-Store-Id'] = activeStoreId
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
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login on unauthorized
      localStorage.removeItem('admin_token')
      localStorage.removeItem('active_store_id')
      window.location.href = '/#/login'
    }
    return Promise.reject(error)
  },
)

export default api
export { API_BASE_URL }
