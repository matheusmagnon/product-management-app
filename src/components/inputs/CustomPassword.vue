<template>
  <div class="field">
    <label v-if="label" :for="id" class="field-label">{{ label }}</label>
    <Password
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      class="w-full custom-password-component"
      :class="{ 'p-invalid': invalid }"
      toggleMask
      :feedback="false"
      @update:modelValue="updateValue"
    />
    <small v-if="errorMessage" class="error-message">{{ errorMessage }}</small>
  </div>
</template>

<script setup lang="ts">
import Password from 'primevue/password'

interface Props {
  id?: string
  label?: string
  modelValue: string
  placeholder?: string
  invalid?: boolean
  errorMessage?: string
}

withDefaults(defineProps<Props>(), {
  invalid: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const updateValue = (value: string) => {
  emit('update:modelValue', value)
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

.custom-password-component {
  border-radius: var(--border-radius);
  border: 2px solid var(--color-border);
  background: var(--color-bg-primary);
  min-height: var(--input-height);
  position: relative;
  display: flex;
  align-items: center;
  padding: 0;
  transition: var(--transition);
  width: 100%;
  box-sizing: border-box;
}

.custom-password-component:hover {
  border-color: var(--color-border-hover);
  background: var(--color-bg-primary);
}

.custom-password-component:focus-within {
  border-color: var(--color-border-focus);
  box-shadow: var(--shadow-focus);
}

.custom-password-component.p-invalid {
  border-color: var(--color-border-error);
  background-color: var(--color-bg-error);
}

.custom-password-component.p-invalid:hover {
  border-color: var(--color-error-dark);
}

.custom-password-component.p-invalid:focus-within {
  border-color: var(--color-error-dark);
  box-shadow: var(--shadow-focus-error);
}

.custom-password-component:disabled {
  background-color: var(--color-bg-secondary);
  border-color: var(--color-border);
  color: var(--color-text-muted);
  cursor: not-allowed;
}

.custom-password-component:disabled :deep(.p-inputtext) {
  color: var(--color-text-muted);
}

.custom-password-component :deep(.p-inputtext) {
  border: none;
  background: transparent;
  padding: 1rem 3rem 1rem 1.25rem;
  width: 100%;
  font-size: 1rem;
  line-height: 1.5;
  flex: 1;
  height: 100%;
  color: var(--color-text-primary);
  transition: var(--transition);
}

.custom-password-component :deep(.p-inputtext:focus) {
  outline: none;
  box-shadow: none;
}

.custom-password-component :deep(.p-password-toggle) {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
}

.custom-password-component :deep(.p-password-toggle:hover) {
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
}

.custom-password-component :deep(.p-password-toggle:focus) {
  outline: 2px solid var(--color-primary);
  outline-offset: 1px;
}

.error-message {
  color: var(--color-error);
  font-size: 0.75rem;
  margin-top: 0.25rem;
  font-weight: 500;
}

.custom-password-component :deep(.p-inputtext::placeholder) {
  color: var(--color-text-placeholder);
  opacity: 1;
}

.custom-password-component :deep(.p-inputtext:-webkit-autofill) {
  -webkit-box-shadow: 0 0 0px 1000px var(--color-bg-primary) inset;
  -webkit-text-fill-color: var(--color-text-primary);
}

.custom-password-component :deep(.p-inputtext:-webkit-autofill:focus) {
  -webkit-box-shadow: 0 0 0px 1000px var(--color-bg-primary) inset;
}
</style>
