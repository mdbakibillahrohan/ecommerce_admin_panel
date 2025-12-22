import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosError } from 'axios'
// import { useAuthStore } from '@/stores/auth'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

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
    // const activeStore = localStorage.getItem('activeStore') || '{}'

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // if (activeStore && config.headers) {
    //   try {
    //     const store = JSON.parse(activeStore)
    //     if (store && store.id) {
    //       config.headers['x-store-id'] = store.id
    //     }
    //   } catch (e) {
    //     console.error('Failed to parse active store', e)
    //   }
    // }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

// Response interceptor - handle errors
// api.interceptors.response.use(
//     (response) => response,
//     (error: AxiosError) => {
//         if (error.response?.status === 401) {
//             // Clear token and redirect to login
//             const authStore = useAuthStore()
//             authStore.logout()
//         }
//         return Promise.reject(error)
//     }
// )

export default api
export { API_BASE_URL }
