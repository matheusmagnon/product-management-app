<template>
  <div class="products-page">
    <div class="products-container">
      <div class="header-card">
        <div class="header-content">
          <div class="header-info">
            <h1 class="page-title">Gerenciamento de Produtos</h1>
            <div class="user-info">
              <span class="user-email">
                Logado como: <strong>{{ user?.email }}</strong>
              </span>
              <RoleBadge :is-admin="isAdmin" variant="gradient" />
            </div>
          </div>
          <div class="header-actions">
            <CustomButton
              label="Novo Produto"
              icon="pi pi-plus"
              @click="showProductForm()"
              variant="primary"
              size="medium"
            />
            <CustomButton
              label="Sair"
              icon="pi pi-sign-out"
              @click="handleLogout"
              variant="outlined"
              size="small"
            />
          </div>
        </div>
      </div>

      <div v-if="loading" class="loading-container">
        <ProgressSpinner />
        <p class="loading-text">Carregando produtos...</p>
      </div>

      <div v-else class="content-area">
        <Card class="tabs-card">
          <template #content>
            <Tabs value="table">
              <TabList>
                <Tab value="table">Tabela</Tab>
                <Tab value="shelf">Prateleira</Tab>
              </TabList>
              <TabPanels>
                <TabPanel value="table">
                  <ProductTable
                    :products="products"
                    :loading="loading"
                    :is-admin="isAdmin"
                    @edit="handleEdit"
                    @delete="handleDelete"
                    @toggle-status="handleToggleStatus"
                  />
                </TabPanel>
                <TabPanel value="shelf">
                  <ProductShelf
                    :products="products"
                    :loading="loading"
                    :is-admin="isAdmin"
                    @edit="handleEdit"
                    @delete="handleDelete"
                    @status-change="handleStatusChange"
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </template>
        </Card>
      </div>

      <Dialog
        v-model:visible="showForm"
        :header="editingProduct ? 'Editar Produto' : 'Novo Produto'"
        :modal="true"
        :style="{ width: '500px' }"
        class="product-dialog"
      >
        <ProductForm
          :product="editingProduct"
          :is-admin="isAdmin"
          @submit="handleFormSubmit"
          @cancel="handleFormCancel"
        />
      </Dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'

import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'
import Card from 'primevue/card'

import ProductTable from '../components/products/ProductTable.vue'
import ProductShelf from '../components/products/ProductShelf.vue'
import ProductForm from '../components/products/ProductForm.vue'
import CustomButton from '../components/ui/CustomButton.vue'
import RoleBadge from '../components/ui/RoleBadge.vue'

import { useAuth } from '../composables/useAuth'
import { useProducts } from '../composables/useProducts'
import type { Product } from '../types/product'

const router = useRouter()

const { user, isAdmin, logout } = useAuth()
const {
  products,
  loading,
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
} = useProducts()

const showForm = ref(false)
const editingProduct = ref<Product | null>(null)

onMounted(async () => {
  console.log('Products.vue mounted - fetching products')
  await fetchProducts()
})

const showProductForm = (product: Product | null = null) => {
  editingProduct.value = product
  showForm.value = true
}

const handleFormSubmit = async (productData: Omit<Product, 'id'>) => {
  try {
    if (editingProduct.value) {
      await updateProduct(editingProduct.value.id, productData)
    } else {
      await createProduct(productData)
    }
    showForm.value = false
    editingProduct.value = null
    await fetchProducts()
  } catch (error) {
    console.error('Erro ao salvar produto:', error)
  }
}

const handleFormCancel = () => {
  showForm.value = false
  editingProduct.value = null
}

const handleEdit = (product: Product) => {
  showProductForm(product)
}

const handleDelete = async (product: Product) => {
  if (confirm(`Tem certeza que deseja excluir o produto "${product.name}"?`)) {
    try {
      await deleteProduct(product.id)
      await fetchProducts()
    } catch (error) {
      console.error('Erro ao excluir produto:', error)
    }
  }
}

const handleStatusChange = async (
  productId: number | string,
  newStatus: 'activated' | 'disabled',
) => {
  try {
    await toggleProductStatus(productId, newStatus)
    await fetchProducts()
  } catch (error) {
    console.error('Erro ao alterar status:', error)
  }
}

const handleToggleStatus = async (product: Product) => {
  const newStatus = product.status === 'activated' ? 'disabled' : 'activated'
  handleStatusChange(product.id, newStatus)
}

const handleLogout = () => {
  logout()
  router.push('/login')
}
</script>

<style scoped>
.products-page {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-dark));
  padding: var(--spacing-4);
  font-family: var(--font-family-primary);
}

.products-container {
  max-width: 1200px;
  margin: 0 auto;
}

.header-card {
  background: var(--color-bg-primary);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-6);
  margin-bottom: var(--spacing-6);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--spacing-4);
}

.header-info {
  flex: 1;
}

.page-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-2);
  line-height: var(--line-height-tight);
  font-family: var(--font-family-primary);
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  flex-wrap: wrap;
}

.user-email {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
}

.header-actions {
  display: flex;
  gap: var(--spacing-2);
  flex-shrink: 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  gap: var(--spacing-4);
  background: var(--color-bg-primary);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.loading-text {
  color: var(--color-text-muted);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
}

.content-area {
  background: transparent;
}

.tabs-card {
  border-radius: var(--border-radius-lg);
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  background: var(--color-bg-primary);
  overflow: hidden;
}

/* Estilos para as Tabs (novo sistema) */
.p-tabs .p-tablist {
  background: var(--color-bg-secondary);
  border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
  padding: var(--spacing-4);
  gap: var(--spacing-2);
  display: flex;
  justify-content: center;
}

.p-tabs .p-tablist .p-tab {
  padding: var(--spacing-4) var(--spacing-6);
  border: none;
  background: transparent;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  border-radius: var(--border-radius);
  transition: var(--transition);
  min-width: 120px;
  text-align: center;
  color: var(--color-text-secondary);
}

.p-tabs .p-tablist .p-tab:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  transform: translateY(-1px);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.p-tabs .p-tablist .p-tab[aria-selected='true'] {
  background: var(--color-primary);
  color: white;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.p-tabs .p-tabpanels {
  background: var(--color-bg-primary);
  padding: var(--spacing-6);
  border-radius: 0 0 var(--border-radius-lg) var(--border-radius-lg);
}

.product-dialog {
  border-radius: var(--border-radius-lg);
}

/* Responsividade */
@media (max-width: 768px) {
  .products-page {
    padding: var(--spacing-2);
  }

  .header-content {
    flex-direction: column;
    gap: var(--spacing-4);
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
  }

  .page-title {
    font-size: var(--font-size-2xl);
  }
}
</style>
