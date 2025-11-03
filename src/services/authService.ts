import { api } from './api'
import type { LoginRequest, AuthResponse, RegisterRequest } from '../types/auth'

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    console.log('🔐 Tentando login:', credentials.email)

    // Buscar usuário no array de login
    const response = await api.get('/login')
    const users = response.data

    console.log('📋 Usuários encontrados:', users)

    const user = users.find(
      (u: any) => u.email === credentials.email && u.password === credentials.password,
    )

    if (!user) {
      console.log('❌ Usuário não encontrado ou senha incorreta')
      throw new Error('Credenciais inválidas')
    }

    console.log('✅ Login bem-sucedido:', user)
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      token: user.token,
    }
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    console.log('📝 Iniciando cadastro:', userData.email)

    // Verificar se email já existe
    const usersResponse = await api.get('/login')
    const existingUser = usersResponse.data.find((u: any) => u.email === userData.email)

    if (existingUser) {
      console.log('❌ Email já cadastrado:', userData.email)
      throw new Error('Email já cadastrado')
    }

    // Criar novo usuário
    const newUser = {
      id: Date.now(), // ID simples baseado no timestamp
      email: userData.email,
      password: userData.password,
      role: userData.role,
      token: `token-${userData.role}-${Date.now()}`,
    }

    console.log('👤 Novo usuário a ser criado:', newUser)

    try {
      // Adicionar ao array de login (usando POST para /login)
      const response = await api.post('/login', newUser)
      console.log('✅ Usuário criado com sucesso:', response.data)

      return {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        token: newUser.token,
      }
    } catch (error) {
      console.error('❌ Erro ao criar usuário:', error)
      throw new Error('Erro ao criar usuário no servidor')
    }
  },

  async logout(): Promise<void> {
    // Limpar token/local storage
    localStorage.removeItem('auth-token')
    localStorage.removeItem('user-data')
    console.log('🚪 Logout realizado')
  },
}
