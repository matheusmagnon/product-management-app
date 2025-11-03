<template>
  <Tag :value="label" :class="['role-badge', roleClass, variantClass]" />
</template>

<script setup lang="ts">
import Tag from 'primevue/tag'
import { computed } from 'vue'

interface Props {
  isAdmin: boolean
  variant?: 'gradient' | 'solid'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'gradient',
})

const label = computed(() => (props.isAdmin ? 'Administrador' : 'Tenant'))

const roleClass = computed(() => (props.isAdmin ? 'role-badge--admin' : 'role-badge--tenant'))

const variantClass = computed(() => `role-badge--${props.variant}`)
</script>

<style scoped>
.role-badge {
  border: none;
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: white;
  font-family: var(--font-family-primary);
  transition: var(--transition);
}

/* Variantes de gradiente */
.role-badge--gradient.role-badge--admin {
  background: linear-gradient(135deg, var(--color-error), var(--color-error-dark));
}

.role-badge--gradient.role-badge--tenant {
  background: linear-gradient(135deg, var(--color-success), var(--color-success));
  filter: brightness(0.9);
}

/* Variantes sólidas */
.role-badge--solid.role-badge--admin {
  background: var(--color-error);
}

.role-badge--solid.role-badge--tenant {
  background: var(--color-primary);
}

/* Efeitos de hover para melhor UX */
.role-badge:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

/* Estados de foco para acessibilidade */
.role-badge:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

/* Responsividade para telas menores */
@media (max-width: 768px) {
  .role-badge {
    padding: var(--spacing-1) var(--spacing-3);
    font-size: var(--font-size-xs);
    letter-spacing: 0.25px;
  }
}
</style>
