import { api } from './api'
import type { Product, CreateProductRequest, UpdateProductRequest } from '../types/product'

export const productService = {
  async getAll(): Promise<Product[]> {
    const response = await api.get('/products')
    console.log('API Response com prefixo dinâmico:', response.data)
    return response.data
  },

  async getById(id: number | string): Promise<Product> {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  async create(product: CreateProductRequest): Promise<Product> {
    const response = await api.post('/products', product)
    return response.data
  },

  async update(id: number | string, product: UpdateProductRequest): Promise<Product> {
    const response = await api.put(`/products/${id}`, product)
    return response.data
  },

  async delete(id: number | string): Promise<void> {
    await api.delete(`/products/${id}`)
  },

  async toggleStatus(id: number | string, status: 'activated' | 'disabled'): Promise<Product> {
    const response = await api.patch(`/products/${id}`, { status })
    return response.data
  },
}
