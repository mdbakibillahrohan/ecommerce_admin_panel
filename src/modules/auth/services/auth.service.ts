import type { LoginResponse } from '@/modules/auth/api/auth'
import api from '@/modules/shared/config/http.config'
import type { LoginCredentials } from '@/modules/auth/store'

export const loginService = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  return await api.post<LoginResponse>('/auth/login', credentials).then((response) => response.data)
}
