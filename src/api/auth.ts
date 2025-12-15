// Auth API types
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

// Auth API methods
const authApiMethods = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    // Mock implementation - replace with actual API call when backend is ready
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          access_token: "mock-token-" + Date.now(),
          user: {
            id: 1,
            email: data.username,
            first_name: "Admin",
            last_name: "User",
          },
        })
      }, 500)
    })
  },

  register: async (data: RegisterRequest): Promise<any> => {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 500)
    })
  },
}

// Named export
export const authApi = authApiMethods
