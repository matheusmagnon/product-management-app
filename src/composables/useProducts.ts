import { computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { CreateProductRequest, UpdateProductRequest } from '../types/product'
import { productService } from '../services/productService'

export const useProducts = () => {
  const queryClient = useQueryClient()

  const {
    data: products,
    isLoading: loading,
    refetch: fetchProducts,
  } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll(),
    initialData: [],
  })

  const createMutation = useMutation({
    mutationFn: (product: CreateProductRequest) => productService.create(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, product }: { id: number | string; product: UpdateProductRequest }) =>
      productService.update(id, product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number | string) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number | string; status: 'activated' | 'disabled' }) =>
      productService.toggleStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const createProduct = async (product: CreateProductRequest) => {
    return createMutation.mutateAsync(product)
  }

  const updateProduct = async (id: number | string, product: UpdateProductRequest) => {
    return updateMutation.mutateAsync({ id, product })
  }

  const deleteProduct = async (id: number | string) => {
    return deleteMutation.mutateAsync(id)
  }

  const toggleProductStatus = async (id: number | string, status: 'activated' | 'disabled') => {
    return toggleStatusMutation.mutateAsync({ id, status })
  }

  const productsList = computed(() => products.value || [])
  console.log('Products from useProducts (raw):', productsList.value)

  return {
    products: products,
    loading,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
  }
}
