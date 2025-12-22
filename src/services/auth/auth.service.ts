import type { LoginResponse } from '@/api/auth'
import api from '@/config/http.config'
import type { LoginCredentials } from '@/stores/auth'

export const loginService = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  return await api.post<LoginResponse>('/auth/login', credentials).then((response) => response.data)
}
