<template>
  <div id="app">
    <Toast />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  min-height: 100vh;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #2d3748;
}

/* Focus consistente */
#app .p-inputtext:focus,
#app .p-password:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Correção autofill (necessário no Chrome) */
#app .p-inputtext:-webkit-autofill,
#app .p-password .p-inputtext:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px white inset;
  box-shadow: 0 0 0px 1000px white inset;
  -webkit-text-fill-color: #1f2937;
}

.p-dialog .p-dialog-header .p-dialog-title {
  font-family: var(--font-family-primary) !important;
  font-size: var(--font-size-xl) !important;
  font-weight: var(--font-weight-bold) !important;
  color: var(--color-text-primary) !important;
  margin-left: 0.5rem;
}
</style>
