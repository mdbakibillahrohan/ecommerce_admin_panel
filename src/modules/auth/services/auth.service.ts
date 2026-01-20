/**
 * Auth Service
 * All API calls for authentication following SOLID principles
 */
import api from '@/modules/shared/config/http.config'

// Types
export interface LoginRequest {
  usernameOrEmail: string
  password: string
}

export interface LoginResponse {
  access_token: string
  user: {
    id: number
    email: string
    first_name: string
    last_name: string
    type: string
  }
}

export interface RegisterRequest {
  email: string
  password: string
  first_name: string
  last_name: string
  phone?: string
}

export interface RegisterResponse {
  id: number
  email: string
  first_name: string
  last_name: string
}

export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  phone: string | null
  gender: string | null
  type: string
  is_verified: boolean
  active_store_id: number | null
}

/**
 * Auth Service - Handles all authentication operations
 */
class AuthService {
  private readonly basePath = '/auth'

  /**
   * Login user with username (email) and password
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(`${this.basePath}/login`, credentials)
    return response.data
  }

  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>(`${this.basePath}/register`, data)
    return response.data
  }

  /**
   * Get current authenticated user profile
   */
  async getProfile(): Promise<User> {
    const response = await api.get<User>('/users/me')
    return response.data
  }

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.patch<User>('/users/me', data)
    return response.data
  }

  /**
   * Change user password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post('/users/me/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    })
  }

  /**
   * Logout current user
   */
  logout(): void {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('active_store_id')
    localStorage.removeItem('user')
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('admin_token')
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem('admin_token')
  }

  /**
   * Store authentication data
   */
  storeAuth(token: string, user: LoginResponse['user']): void {
    localStorage.setItem('admin_token', token)
    localStorage.setItem('user', JSON.stringify(user))
  }
}

// Export singleton instance
export const authService = new AuthService()

// Legacy export for backward compatibility
export const loginService = async (credentials: LoginRequest): Promise<LoginResponse> => {
  return authService.login(credentials)
}

export default authService
