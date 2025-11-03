<template>
  <form @submit.prevent="handleSubmit" class="product-form">
    <div class="form-grid">
      <div class="field">
        <label for="name" class="field-label">Nome do Produto *</label>
        <CustomInput
          id="name"
          v-model="form.name"
          placeholder="Digite o nome do produto"
          :invalid="!!errors.name"
          :error-message="errors.name"
        />
      </div>

      <div class="field">
        <label for="price" class="field-label">Preço *</label>
        <div class="price-input-wrapper">
          <InputNumber
            id="price"
            v-model="form.price"
            mode="currency"
            currency="BRL"
            locale="pt-BR"
            class="custom-input-number"
            :class="{ 'p-invalid': errors.price }"
          />
        </div>
        <small v-if="errors.price" class="error-message">{{ errors.price }}</small>
      </div>

      <div class="field">
        <label for="image" class="field-label">URL da Imagem</label>
        <CustomInput id="image" v-model="form.image" placeholder="https://exemplo.com/imagem.jpg" />
      </div>

      <div class="field" v-if="isAdmin">
        <label for="status" class="field-label">Status</label>
        <Dropdown
          id="status"
          v-model="form.status"
          :options="statusOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Selecione o status"
          class="custom-dropdown"
        />
      </div>

      <div class="field col-span-2">
        <label for="description" class="field-label">Descrição</label>
        <Textarea
          id="description"
          v-model="form.description"
          placeholder="Digite a descrição do produto"
          :rows="3"
          class="custom-textarea"
        />
      </div>
    </div>

    <div class="form-actions">
      <CustomButton
        type="button"
        label="Cancelar"
        icon="pi pi-times"
        variant="secondary"
        @click="$emit('cancel')"
      />
      <CustomButton
        type="submit"
        :label="product ? 'Atualizar' : 'Criar'"
        icon="pi pi-check"
        :loading="loading"
        variant="primary"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'

import CustomInput from '../inputs/CustomInput.vue'
import CustomButton from '../ui/CustomButton.vue'

import type { Product } from '../../types/product'

const props = defineProps<{
  product: Product | null
  isAdmin: boolean
}>()

const emit = defineEmits<{
  submit: [
    productData: {
      name: string
      price: number
      image: string
      description: string
      status: 'activated' | 'disabled'
    },
  ]
  cancel: []
}>()

const loading = ref(false)

const form = reactive({
  name: '',
  price: 0,
  image: '',
  description: '',
  status: 'activated' as 'activated' | 'disabled',
})

const errors = reactive({
  name: '',
  price: '',
})

const statusOptions = [
  { label: 'Ativo', value: 'activated' },
  { label: 'Inativo', value: 'disabled' },
]

onMounted(() => {
  if (props.product) {
    form.name = props.product.name
    form.price = props.product.price
    form.image = props.product.image
    form.description = props.product.description
    form.status = props.product.status
  }
})

const validateForm = () => {
  let isValid = true

  errors.name = ''
  errors.price = ''

  if (!form.name.trim()) {
    errors.name = 'Nome do produto é obrigatório'
    isValid = false
  }

  if (!form.price || form.price <= 0) {
    errors.price = 'Preço deve ser maior que zero'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true

  try {
    const productData = {
      name: form.name.trim(),
      price: form.price,
      image: form.image.trim(),
      description: form.description.trim(),
      status: form.status,
    }

    emit('submit', productData)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.product-form {
  display: flex;
  flex-direction: column;
  margin: var(--spacing-2);
  font-family: var(--font-family-primary);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-2);
}

.field {
  display: flex;
  flex-direction: column;
}

.field-label {
  display: block;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-2);
  font-family: var(--font-family-primary);
  line-height: var(--line-height-normal);
}

.col-span-2 {
  grid-column: span 2;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-2);
}

.error-message {
  color: var(--color-error);
  font-size: var(--font-size-xs);
  margin-top: var(--spacing-1);
  font-weight: var(--font-weight-medium);
  font-family: var(--font-family-primary);
  line-height: var(--line-height-normal);
}

.price-input-wrapper {
  width: 100%;
}

:deep(.custom-input-number .p-inputnumber-input) {
  border-radius: var(--border-radius);
  border: 2px solid var(--color-border);
  background: var(--color-bg-primary);
  padding: 1rem 1.25rem;
  font-size: var(--font-size-base);
  min-height: var(--input-height);
  line-height: var(--line-height-normal);
  transition: var(--transition);
  width: 100%;
  color: var(--color-text-primary);
  box-sizing: border-box;
  font-family: var(--font-family-primary);
}

:deep(.custom-input-number .p-inputnumber-input:hover) {
  border-color: var(--color-border-hover);
}

:deep(.custom-input-number .p-inputnumber-input:focus) {
  border-color: var(--color-border-focus);
  box-shadow: var(--shadow-focus);
  outline: none;
}

:deep(.custom-input-number.p-invalid .p-inputnumber-input) {
  border-color: var(--color-border-error);
  background-color: var(--color-bg-error);
}

:deep(.custom-dropdown .p-dropdown) {
  border-radius: var(--border-radius);
  border: 2px solid var(--color-border);
  background: var(--color-bg-primary);
  min-height: var(--input-height);
  transition: var(--transition);
  width: 100%;
}

:deep(.custom-dropdown .p-dropdown:hover) {
  border-color: var(--color-border-hover);
}

:deep(.custom-dropdown .p-dropdown:not(.p-disabled).p-focus) {
  border-color: var(--color-border-focus);
  box-shadow: var(--shadow-focus);
  outline: none;
}

:deep(.custom-dropdown .p-dropdown .p-dropdown-label) {
  padding: 1rem 1.25rem;
  font-size: var(--font-size-base);
  font-family: var(--font-family-primary);
  color: var(--color-text-primary);
  line-height: var(--line-height-normal);
}

:deep(.custom-dropdown .p-dropdown-panel) {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

:deep(.custom-dropdown .p-dropdown-item) {
  padding: 0.75rem 1rem;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  font-family: var(--font-family-primary);
  line-height: var(--line-height-normal);
}

:deep(.custom-dropdown .p-dropdown-item.p-highlight) {
  background: var(--color-primary);
  color: white;
}

:deep(.custom-dropdown .p-dropdown-item:not(.p-highlight):not(.p-disabled):hover) {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

:deep(.custom-textarea) {
  border-radius: var(--border-radius);
  border: 2px solid var(--color-border);
  background: var(--color-bg-primary);
  padding: 1rem 1.25rem;
  font-size: var(--font-size-base);
  font-family: var(--font-family-primary);
  line-height: var(--line-height-normal);
  transition: var(--transition);
  width: 100%;
  color: var(--color-text-primary);
  box-sizing: border-box;
  resize: vertical;
}

:deep(.custom-textarea:hover) {
  border-color: var(--color-border-hover);
}

:deep(.custom-textarea:focus) {
  border-color: var(--color-border-focus);
  box-shadow: var(--shadow-focus);
  outline: none;
}

:deep(.custom-textarea::placeholder) {
  color: var(--color-text-placeholder);
  opacity: 1;
}

:deep(.p-invalid) {
  border-color: var(--color-border-error) !important;
}

:deep(.p-error) {
  color: var(--color-error);
  font-size: var(--font-size-xs);
  margin-top: var(--spacing-1);
  font-weight: var(--font-weight-medium);
  font-family: var(--font-family-primary);
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .col-span-2 {
    grid-column: span 1;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
