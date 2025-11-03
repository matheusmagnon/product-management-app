<template>
  <div class="product-table-container">
    <DataTable
      :value="products"
      :loading="loading"
      class="custom-datatable"
      :paginator="true"
      :rows="10"
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      :rowsPerPageOptions="[5, 10, 20]"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} produtos"
      responsiveLayout="scroll"
    >
      <Column field="name" header="Nome" :sortable="true"></Column>
      <Column field="description" header="Descrição" :sortable="true"></Column>
      <Column field="price" header="Preço" :sortable="true">
        <template #body="slotProps">
          {{ formatPrice(slotProps.data.price) }}
        </template>
      </Column>
      <Column field="status" header="Status" :sortable="true">
        <template #body="slotProps">
          <Tag
            :value="slotProps.data.status === 'activated' ? 'Ativo' : 'Inativo'"
            :class="[
              'status-badge',
              slotProps.data.status === 'activated' ? 'status-active' : 'status-inactive',
            ]"
          />
        </template>
      </Column>
      <Column v-if="isAdmin" header="Ações" :exportable="false" style="min-width: 8rem">
        <template #body="slotProps">
          <div class="actions-buttons">
            <CustomButton
              icon="pi pi-pencil"
              @click="$emit('edit', slotProps.data)"
              variant="outlined"
              size="small"
            />
            <CustomButton
              icon="pi pi-trash"
              @click="$emit('delete', slotProps.data)"
              variant="danger"
              size="small"
            />
            <CustomButton
              :icon="slotProps.data.status === 'activated' ? 'pi pi-eye-slash' : 'pi pi-eye'"
              @click="$emit('toggle-status', slotProps.data)"
              variant="secondary"
              size="small"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import CustomButton from '../ui/CustomButton.vue'
import type { Product } from '../../types/product'

defineProps<{
  products: Product[]
  loading: boolean
  isAdmin: boolean
}>()

defineEmits<{
  edit: [product: Product]
  delete: [product: Product]
  'toggle-status': [product: Product]
}>()

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}
</script>

<style scoped>
.product-table-container {
  background: var(--color-bg-primary);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

:deep(.custom-datatable) {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-family: var(--font-family-primary);
}

:deep(.custom-datatable .p-datatable-header) {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  border: none;
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-4) var(--spacing-6);
}

:deep(.custom-datatable .p-datatable-thead > tr > th) {
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  border: none;
  border-bottom: 1px solid var(--color-border);
  padding: var(--spacing-4) var(--spacing-6);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  font-size: var(--font-size-xs);
  letter-spacing: 0.5px;
}

:deep(.custom-datatable .p-datatable-tbody > tr > td) {
  border: none;
  border-bottom: 1px solid var(--color-gray-100);
  padding: var(--spacing-4) var(--spacing-6);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  transition: var(--transition);
}

:deep(.custom-datatable .p-datatable-tbody > tr:hover > td) {
  background: var(--color-gray-50);
  color: var(--color-text-primary);
}

:deep(.custom-datatable .p-paginator) {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  border: none;
  border-top: 1px solid var(--color-border);
  padding: var(--spacing-4) var(--spacing-6);
}

:deep(.custom-datatable .p-paginator .p-paginator-page.p-highlight) {
  background: var(--color-primary);
  color: white;
  border-radius: var(--border-radius);
}

:deep(.custom-datatable .p-paginator .p-paginator-page:not(.p-highlight):hover) {
  background: var(--color-gray-200);
  color: var(--color-text-primary);
}

.status-badge {
  font-weight: var(--font-weight-semibold);
  border: none;
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--font-size-xs);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-active {
  background: var(--color-success);
  color: white;
}

.status-inactive {
  background: var(--color-gray-500);
  color: white;
}

.actions-buttons {
  display: flex;
  gap: var(--spacing-2);
  justify-content: flex-start;
  align-items: center;
}
</style>
