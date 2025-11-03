<template>
  <Button
    :type="type"
    :label="label"
    :icon="icon"
    :loading="loading"
    :disabled="disabled || loading"
    :class="buttonClass"
    :size="size"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </Button>
</template>

<script setup lang="ts">
import Button from 'primevue/button'
import { computed } from 'vue'

interface Props {
  type?: 'button' | 'submit' | 'reset'
  label?: string
  icon?: string
  loading?: boolean
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outlined'
  size?: 'small' | 'medium' | 'large'
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'medium',
  fullWidth: false,
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClass = computed(() => {
  return [
    'custom-button',
    `custom-button--${props.variant}`,
    `custom-button--${props.size}`,
    {
      'custom-button--full-width': props.fullWidth,
      'custom-button--loading': props.loading,
    },
  ]
})
</script>

<style scoped>
.custom-button {
  border: none;
  border-radius: var(--border-radius);
  font-weight: var(--font-weight-semibold);
  transition: var(--transition);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  font-family: var(--font-family-primary);
}

.custom-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.custom-button:active {
  transform: translateY(0);
}

.custom-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  transform: none;
  box-shadow: none;
}

/* Variantes */
.custom-button--primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
  color: white;
}

.custom-button--primary:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-dark));
  color: white;
}

.custom-button--secondary {
  background: var(--color-gray-500);
  color: white;
}

.custom-button--secondary:hover:not(:disabled) {
  background: var(--color-gray-600);
}

.custom-button--danger {
  background: var(--color-error);
  color: white;
}

.custom-button--danger:hover:not(:disabled) {
  background: var(--color-error-dark);
}

.custom-button--success {
  background: var(--color-success);
  color: white;
}

.custom-button--success:hover:not(:disabled) {
  background: var(--color-success);
  filter: brightness(0.9);
}

.custom-button--outlined {
  background: transparent;
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
}

.custom-button--outlined:hover:not(:disabled) {
  background: var(--color-primary);
  color: white;
}

/* Tamanhos */
.custom-button--small {
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--font-size-sm);
  min-height: 2.5rem;
}

.custom-button--medium {
  padding: var(--spacing-3) var(--spacing-6);
  font-size: var(--font-size-base);
  min-height: 3rem;
}

.custom-button--large {
  padding: var(--spacing-4) var(--spacing-8);
  font-size: var(--font-size-lg);
  min-height: 3.5rem;
}

/* Largura total */
.custom-button--full-width {
  width: 100%;
}

/* Estado de loading */
.custom-button--loading {
  pointer-events: none;
}

/* Efeito de ripple */
.custom-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition:
    width 0.3s,
    height 0.3s;
}

.custom-button:active::after {
  width: 100px;
  height: 100px;
}

/* Estados de foco para acessibilidade */
.custom-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
