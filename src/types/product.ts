export interface Product {
  id: number | string
  name: string
  price: number
  image: string
  description: string
  status: 'activated' | 'disabled'
  role?: 'admin' | 'tenant'
}

export interface CreateProductRequest {
  name: string
  price: number
  image: string
  description: string
  status: 'activated' | 'disabled'
}

export interface UpdateProductRequest extends CreateProductRequest {}
