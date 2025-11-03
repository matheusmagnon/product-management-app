import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '../types/auth'
import { authService } from '../services/authService'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth-token'))

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  const init = () => {
    // Recuperar dados do localStorage se existirem
    const savedUser = localStorage.getItem('user-data')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password })
    user.value = response
    token.value = response.token

    localStorage.setItem('auth-token', response.token)
    localStorage.setItem('user-data', JSON.stringify(response))

    return response
  }

  const register = async (email: string, password: string, role: 'admin' | 'tenant') => {
    const response = await authService.register({ email, password, role })
    return response
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth-token')
    localStorage.removeItem('user-data')
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    init,
    login,
    register,
    logout,
  }
})
