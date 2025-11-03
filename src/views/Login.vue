<template>
  <div class="login-container">
    <div class="login-background">
      <div class="login-card">
        <div class="login-header">
          <h1 class="login-title">Bem-vindo</h1>
          <p class="login-subtitle">Faça login em sua conta</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <CustomInput
            id="email"
            v-model="form.email"
            label="Email"
            type="email"
            placeholder="seu@email.com"
            :invalid="!!errors.email"
            :error-message="errors.email"
          />

          <CustomPassword
            id="password"
            v-model="form.password"
            label="Senha"
            placeholder="Sua senha"
            :invalid="!!errors.password"
            :error-message="errors.password"
          />

          <CustomButton
            type="submit"
            label="Entrar"
            icon="pi pi-sign-in"
            :loading="loading"
            variant="primary"
            size="medium"
            fullWidth
          />

          <div v-if="error" class="error-message">
            {{ error }}
          </div>
        </form>

        <div class="login-footer">
          <p class="footer-text">
            Não tem uma conta?
            <router-link to="/register" class="register-link">Cadastre-se</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import CustomInput from '../components/inputs/CustomInput.vue'
import CustomPassword from '../components/inputs/CustomPassword.vue'
import CustomButton from '../components/ui/CustomButton.vue'

const router = useRouter()
const { login } = useAuth()

const loading = ref(false)
const error = ref('')

const form = reactive({
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
})

const validateForm = () => {
  let isValid = true

  errors.email = ''
  errors.password = ''

  if (!form.email) {
    errors.email = 'Email é obrigatório'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Email inválido'
    isValid = false
  }

  if (!form.password) {
    errors.password = 'Senha é obrigatória'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) return

  loading.value = true
  error.value = ''

  try {
    await login(form.email, form.password)
    router.push('/products')
  } catch (err: unknown) {
    if (err instanceof Error) {
      error.value = err.message
    } else if (typeof err === 'string') {
      error.value = err
    } else {
      error.value = 'Mensagem de erro padrão'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-dark));
  padding: var(--spacing-4);
}

.login-background {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: var(--color-bg-primary);
  padding: var(--spacing-8);
  border-radius: var(--border-radius-xl);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: var(--spacing-8);
}

.login-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-2);
  line-height: var(--line-height-tight);
}

.login-subtitle {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.login-footer {
  text-align: center;
  margin-top: var(--spacing-8);
  padding-top: var(--spacing-6);
  border-top: 1px solid var(--color-gray-200);
}

.footer-text {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
}

.register-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  margin-left: var(--spacing-1);
}

.register-link:hover {
  text-decoration: underline;
}

.error-message {
  color: var(--color-error);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  text-align: center;
  margin-top: var(--spacing-4);
}

@media (max-width: 640px) {
  .login-card {
    padding: var(--spacing-8) var(--spacing-6);
  }

  .login-title {
    font-size: var(--font-size-2xl);
  }
}
</style>
