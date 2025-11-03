<template>
  <div class="field">
    <label v-if="label" :for="id" class="field-label">{{ label }}</label>
    <InputText
      :id="id"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      class="w-full custom-input-component"
      :class="{ 'p-invalid': invalid }"
      @update:modelValue="updateValue"
    />
    <small v-if="errorMessage" class="error-message">{{ errorMessage }}</small>
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext'

interface Props {
  id?: string
  label?: string
  modelValue: string
  type?: string
  placeholder?: string
  invalid?: boolean
  errorMessage?: string
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  invalid: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const updateValue = (value: string | undefined) => {
  emit('update:modelValue', value ?? '')
}
</script>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
}

.field-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
}

.custom-input-component {
  border-radius: var(--border-radius);
  border: 2px solid var(--color-border);
  background: var(--color-bg-primary);
  padding: 1rem 1.25rem;
  font-size: 1rem;
  min-height: var(--input-height);
  line-height: 1.5;
  transition: var(--transition);
  width: 100%;
  color: var(--color-text-primary);
  box-sizing: border-box;
}

.custom-input-component:hover {
  border-color: var(--color-border-hover);
}

.custom-input-component:focus {
  border-color: var(--color-border-focus);
  box-shadow: var(--shadow-focus);
  outline: none;
}

.custom-input-component.p-invalid {
  border-color: var(--color-border-error);
  background-color: var(--color-bg-error);
}

.custom-input-component.p-invalid:hover {
  border-color: var(--color-error-dark);
}

.custom-input-component.p-invalid:focus {
  border-color: var(--color-error-dark);
  box-shadow: var(--shadow-focus-error);
}

.custom-input-component:disabled {
  background-color: var(--color-bg-secondary);
  border-color: var(--color-border);
  color: var(--color-text-muted);
  cursor: not-allowed;
}

.error-message {
  color: var(--color-error);
  font-size: 0.75rem;
  margin-top: 0.25rem;
  font-weight: 500;
}

.custom-input-component::placeholder {
  color: var(--color-text-placeholder);
  opacity: 1;
}
</style>
