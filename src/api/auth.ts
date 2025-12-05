import api from './index'

export interface LoginRequest {
    username: string
    password: string
}

export interface LoginResponse {
    access_token: string
    user: {
        id: number
        email: string
        first_name: string
        last_name: string
    }
}

export interface RegisterRequest {
    email: string
    password: string
    first_name: string
    last_name: string
}

export const authApi = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/auth/login', data)
        return response.data
    },

    register: async (data: RegisterRequest): Promise<any> => {
        const response = await api.post('/auth/register', data)
        return response.data
    },
}
