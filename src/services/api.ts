import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const api = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 10000,
})

api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const user = authStore.user

    if (user?.role && config.url?.startsWith('/products')) {
      config.url = `/${user.role}${config.url}`
      console.log(`Request URL com prefixo: ${config.url}`)
    }

    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export { api }
