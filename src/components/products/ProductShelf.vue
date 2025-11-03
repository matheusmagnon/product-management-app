<template>
  <div class="product-shelf">
    <div class="shelf-header">
      <h3>Organização de Produtos</h3>
      <p class="shelf-subtitle">Arraste os produtos entre as áreas para alterar o status</p>
    </div>

    <div class="shelf-container">
      <div
        class="shelf-area activated-area"
        @drop="handleDrop($event, 'activated')"
        @dragover="handleDragOver"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
      >
        <div class="area-header">
          <i class="pi pi-check-circle area-icon activated"></i>
          <h4>Produtos Ativados</h4>
          <span class="product-count">{{ activatedProducts.length }}</span>
        </div>
        <div class="products-grid">
          <div
            v-for="product in activatedProducts"
            :key="product.id"
            class="product-card"
            draggable="true"
            @dragstart="handleDragStart($event, product)"
            @contextmenu="handleContextMenu($event, product)"
            :class="{ dragging: draggedProduct?.id === product.id }"
          >
            <div class="product-image">
              <i class="pi pi-image" v-if="!product.image"></i>
              <img v-else :src="product.image" :alt="product.name" />
            </div>
            <div class="product-info">
              <h5 class="product-name">{{ product.name }}</h5>
              <p class="product-price">{{ formatPrice(product.price) }}</p>
              <p class="product-description">{{ product.description }}</p>
            </div>
            <div class="product-badge activated">Ativado</div>
          </div>
        </div>
      </div>

      <div
        class="shelf-area disabled-area"
        @drop="handleDrop($event, 'disabled')"
        @dragover="handleDragOver"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
      >
        <div class="area-header">
          <i class="pi pi-times-circle area-icon disabled"></i>
          <h4>Produtos Desativados</h4>
          <span class="product-count">{{ disabledProducts.length }}</span>
        </div>
        <div class="products-grid">
          <div
            v-for="product in disabledProducts"
            :key="product.id"
            class="product-card"
            draggable="true"
            @dragstart="handleDragStart($event, product)"
            @contextmenu="handleContextMenu($event, product)"
            :class="{ dragging: draggedProduct?.id === product.id }"
          >
            <div class="product-image">
              <i class="pi pi-image" v-if="!product.image"></i>
              <img v-else :src="product.image" :alt="product.name" />
            </div>
            <div class="product-info">
              <h5 class="product-name">{{ product.name }}</h5>
              <p class="product-price">{{ formatPrice(product.price) }}</p>
              <p class="product-description">{{ product.description }}</p>
            </div>
            <div class="product-badge disabled">Desativado</div>
          </div>
        </div>
      </div>
    </div>

    <ContextMenu ref="contextMenu" :model="contextMenuItems" @hide="contextMenuProduct = null" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import ContextMenu from 'primevue/contextmenu'
import type { Product } from '../../types/product'

interface Props {
  products: Product[]
  loading: boolean
  isAdmin: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  edit: [product: Product]
  delete: [product: Product]
  'status-change': [productId: number | string, newStatus: 'activated' | 'disabled']
}>()

const draggedProduct = ref<Product | null>(null)
const contextMenu = ref()
const contextMenuProduct = ref<Product | null>(null)

const activatedProducts = computed(() => props.products.filter((p) => p.status === 'activated'))

const disabledProducts = computed(() => props.products.filter((p) => p.status === 'disabled'))

const contextMenuItems = computed(() => [
  {
    label: 'Editar',
    icon: 'pi pi-pencil',
    command: () => {
      if (contextMenuProduct.value) {
        emit('edit', contextMenuProduct.value)
      }
    },
  },
  {
    label: 'Excluir',
    icon: 'pi pi-trash',
    visible: props.isAdmin,
    command: () => {
      if (contextMenuProduct.value) {
        emit('delete', contextMenuProduct.value)
      }
    },
  },
])

const handleDragStart = (event: DragEvent, product: Product) => {
  if (!props.isAdmin) {
    event.preventDefault()
    return
  }

  draggedProduct.value = product
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', product.id.toString())
  }
}

const handleDragOver = (event: DragEvent) => {
  if (!props.isAdmin) return

  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

const handleDragEnter = (event: DragEvent) => {
  if (!props.isAdmin) return

  event.preventDefault()
  const target = event.currentTarget as HTMLElement
  target.classList.add('drag-over')
}

const handleDragLeave = (event: DragEvent) => {
  if (!props.isAdmin) return

  const target = event.currentTarget as HTMLElement
  target.classList.remove('drag-over')
}

const handleDrop = async (event: DragEvent, targetStatus: 'activated' | 'disabled') => {
  if (!props.isAdmin || !draggedProduct.value) return

  event.preventDefault()
  const target = event.currentTarget as HTMLElement
  target.classList.remove('drag-over')

  const product = draggedProduct.value

  if (product.status !== targetStatus) {
    try {
      emit('status-change', product.id, targetStatus)
    } catch (error) {
      console.error('Erro ao alterar status:', error)
    }
  }

  draggedProduct.value = null
}

const handleContextMenu = (event: MouseEvent, product: Product) => {
  event.preventDefault()
  contextMenuProduct.value = product
  contextMenu.value.show(event)
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}

onUnmounted(() => {
  draggedProduct.value = null
  contextMenuProduct.value = null
})
</script>

<style scoped>
.product-shelf {
  padding: var(--spacing-4);
}

.shelf-header {
  text-align: center;
  margin-bottom: var(--spacing-8);
}

.shelf-header h3 {
  color: var(--color-text-primary);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-2);
  line-height: var(--line-height-tight);
}

.shelf-subtitle {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
}

.shelf-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-8);
  min-height: 500px;
}

.shelf-area {
  background: var(--color-bg-primary);
  border: 2px dashed var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-6);
  transition: var(--transition);
  min-height: 400px;
}

.shelf-area.drag-over {
  border-color: var(--color-primary);
  background-color: var(--color-gray-50);
}

.activated-area.drag-over {
  border-color: var(--color-success);
  background-color: var(--color-gray-50);
}

.disabled-area.drag-over {
  border-color: var(--color-error);
  background-color: var(--color-bg-error);
}

.area-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  margin-bottom: var(--spacing-6);
  padding-bottom: var(--spacing-4);
  border-bottom: 2px solid var(--color-gray-100);
}

.area-header h4 {
  color: var(--color-text-primary);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin: 0;
  line-height: var(--line-height-tight);
}

.area-icon {
  font-size: var(--font-size-xl);
}

.area-icon.activated {
  color: var(--color-success);
}

.area-icon.disabled {
  color: var(--color-error);
}

.product-count {
  background: var(--color-text-muted);
  color: white;
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-4);
}

.product-card {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: var(--spacing-4);
  cursor: grab;
  transition: var(--transition);
  position: relative;
  min-height: 120px;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary);
}

.product-card.dragging {
  opacity: 0.5;
  cursor: grabbing;
}

.product-image {
  width: 60px;
  height: 60px;
  background: var(--color-gray-100);
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-3);
  color: var(--color-gray-400);
  font-size: var(--font-size-xl);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--border-radius);
}

.product-info {
  flex: 1;
}

.product-name {
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--spacing-1) 0;
  line-height: var(--line-height-tight);
}

.product-price {
  color: var(--color-success);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  margin: 0 0 var(--spacing-1) 0;
  line-height: var(--line-height-tight);
}

.product-description {
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  margin: 0;
  line-height: var(--line-height-normal);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-badge {
  position: absolute;
  top: var(--spacing-2);
  right: var(--spacing-2);
  padding: var(--spacing-1) var(--spacing-2);
  border-radius: var(--border-radius-lg);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
}

.product-badge.activated {
  background: var(--color-gray-100);
  color: var(--color-success);
}

.product-badge.disabled {
  background: var(--color-bg-error);
  color: var(--color-error);
}

/* Responsividade */
@media (max-width: 768px) {
  .shelf-container {
    grid-template-columns: 1fr;
    gap: var(--spacing-4);
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .product-card {
    min-height: 100px;
    padding: var(--spacing-3);
  }

  .product-image {
    width: 50px;
    height: 50px;
  }
}

/* Animações de drag and drop */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.shelf-area.drag-over {
  animation: pulse 1s infinite;
}
</style>
