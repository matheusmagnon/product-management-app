export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  role: 'admin' | 'tenant'
}

export interface AuthResponse {
  id: number
  email: string
  role: 'admin' | 'tenant'
  token: string
}

export interface User {
  id: number
  email: string
  role: 'admin' | 'tenant'
}
