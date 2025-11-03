<template>
  <div class="register-container">
    <div class="register-background">
      <div class="register-card">
        <div class="register-header">
          <h1 class="register-title">Criar Conta</h1>
          <p class="register-subtitle">Cadastre-se para começar</p>
        </div>

        <form @submit.prevent="handleRegister" class="register-form">
          <CustomInput
            id="email"
            v-model="form.email"
            label="Email"
            type="email"
            placeholder="seu@email.com"
            :invalid="!!errors.email"
            :error-message="errors.email"
          />

          <div class="field">
            <label for="role" class="field-label">Tipo de Usuário</label>
            <select
              id="role"
              v-model="form.role"
              class="custom-select"
              :class="{ 'p-invalid': !!errors.role }"
            >
              <option value="" disabled selected>Selecione o tipo de usuário</option>
              <option value="admin">Administrador</option>
              <option value="tenant">Tenant</option>
            </select>
            <small v-if="errors.role" class="error-message">{{ errors.role }}</small>
          </div>

          <CustomPassword
            id="password"
            v-model="form.password"
            label="Senha"
            placeholder="Mínimo 6 caracteres"
            :invalid="!!errors.password"
            :error-message="errors.password"
          />

          <CustomPassword
            id="confirmPassword"
            v-model="form.confirmPassword"
            label="Confirmar Senha"
            placeholder="Confirme sua senha"
            :invalid="!!errors.confirmPassword"
            :error-message="errors.confirmPassword"
          />

          <CustomButton
            type="submit"
            label="Cadastrar"
            icon="pi pi-user-plus"
            :loading="loading"
            :disabled="!isFormValid"
            variant="primary"
            size="medium"
            fullWidth
          />

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <div v-if="form.password && !errors.password" class="password-strength">
            <div class="strength-bar" :class="passwordStrengthClass"></div>
            <small class="strength-text">{{ passwordStrengthText }}</small>
          </div>

          <div v-if="form.password && form.password.length < 6" class="password-hint">
            <small class="hint-text">⚠️ A senha deve ter pelo menos 6 caracteres</small>
          </div>
        </form>

        <div class="register-footer">
          <p class="footer-text">
            Já tem uma conta?
            <router-link to="/login" class="login-link">Faça login</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/authService'
import { useToast } from 'primevue/usetoast'
import CustomInput from '../components/inputs/CustomInput.vue'
import CustomPassword from '../components/inputs/CustomPassword.vue'
import CustomButton from '../components/ui/CustomButton.vue'

const router = useRouter()
const toast = useToast()

const loading = ref(false)
const error = ref('')

const form = reactive({
  email: '',
  role: null as 'admin' | 'tenant' | null,
  password: '',
  confirmPassword: '',
})

const errors = reactive({
  email: '',
  role: '',
  password: '',
  confirmPassword: '',
})

const isEmailValid = computed(() => {
  if (!form.email.trim()) return false
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(form.email)
})

const isPasswordValid = computed(() => {
  return form.password.length >= 6
})

const isFormValid = computed(() => {
  return (
    isEmailValid.value &&
    form.role &&
    isPasswordValid.value && // ✅ AGORA VALIDA COMPRIMENTO DA SENHA
    form.confirmPassword &&
    !errors.email &&
    !errors.role &&
    !errors.password &&
    !errors.confirmPassword &&
    form.password === form.confirmPassword
  )
})

watch(
  () => form.email,
  (newEmail) => {
    if (newEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(newEmail)) {
        errors.email = 'Digite um email válido (exemplo: usuario@email.com)'
      } else {
        errors.email = ''
      }
    } else {
      errors.email = ''
    }
  },
)

watch(
  () => form.password,
  (newPassword) => {
    if (newPassword) {
      if (newPassword.length < 6) {
        errors.password = 'A senha deve ter pelo menos 6 caracteres'
      } else {
        errors.password = ''
      }
    } else {
      errors.password = ''
    }
  },
)

const passwordStrength = computed(() => {
  if (!form.password) return 0

  let strength = 0

  // Comprimento mínimo (agora obrigatório)
  if (form.password.length >= 6) strength += 1

  // Contém letras maiúsculas e minúsculas
  if (/[a-z]/.test(form.password) && /[A-Z]/.test(form.password)) strength += 1

  // Contém números
  if (/\d/.test(form.password)) strength += 1

  // Contém caracteres especiais
  if (/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) strength += 1

  return strength
})

const passwordStrengthClass = computed(() => {
  const strength = passwordStrength.value
  if (strength === 0) return 'strength-weak'
  if (strength <= 2) return 'strength-medium'
  if (strength <= 3) return 'strength-strong'
  return 'strength-very-strong'
})

const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength === 0) return 'Senha muito fraca'
  if (strength <= 2) return 'Senha média'
  if (strength <= 3) return 'Senha forte'
  return 'Senha muito forte'
})

const validateEmail = () => {
  errors.email = ''

  if (!form.email.trim()) {
    errors.email = 'Email é obrigatório'
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.email)) {
    errors.email = 'Digite um email válido (exemplo: usuario@email.com)'
    return false
  }

  return true
}

const validateRole = () => {
  errors.role = ''

  if (!form.role) {
    errors.role = 'Selecione um tipo de usuário'
    return false
  }

  return true
}

const validatePassword = () => {
  errors.password = ''

  if (!form.password) {
    errors.password = 'Senha é obrigatória'
    return false
  }

  if (form.password.length < 6) {
    errors.password = 'A senha deve ter pelo menos 6 caracteres'
    return false
  }

  return true
}

const validateConfirmPassword = () => {
  errors.confirmPassword = ''

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Confirme sua senha'
    return false
  }

  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'As senhas não coincidem'
    return false
  }

  return true
}

// Validação completa do formulário
const validateForm = () => {
  let isValid = true

  // Reset errors
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = ''
  })

  if (!validateEmail()) isValid = false
  if (!validateRole()) isValid = false
  if (!validatePassword()) isValid = false
  if (!validateConfirmPassword()) isValid = false

  return isValid
}

const handleRegister = async () => {
  console.log('🚀 Iniciando cadastro...')

  if (!validateForm()) {
    toast.add({
      severity: 'warn',
      summary: 'Formulário incompleto',
      detail: 'Preencha todos os campos corretamente',
      life: 3000,
    })

    return
  }

  loading.value = true
  error.value = ''

  try {
    console.log('📤 Fazendo cadastro real...')

    await authService.register({
      email: form.email,
      password: form.password,
      role: form.role!,
    })

    toast.add({
      severity: 'success',
      summary: 'Cadastro realizado!',
      detail: 'Conta criada com sucesso. Faça login para continuar.',
      life: 5000,
    })

    // Redirecionar para login
    router.push('/login')
  } catch (err: unknown) {
    if (err instanceof Error) {
      error.value = err.message
    } else if (typeof err === 'string') {
      error.value = err
    } else {
      error.value = 'Erro ao cadastrar. Tente novamente.'
    }

    toast.add({
      severity: 'error',
      summary: 'Erro no cadastro',
      detail: error.value,
      life: 5000,
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-secondary), var(--color-secondary-dark));
  padding: var(--spacing-4);
}

.register-background {
  width: 100%;
  max-width: 380px;
}

.register-card {
  background: var(--color-bg-primary);
  padding: var(--spacing-6);
  border-radius: var(--border-radius-lg);
  box-shadow:
    0 15px 20px -5px rgba(0, 0, 0, 0.1),
    0 8px 8px -5px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(10px);
}

.register-header {
  text-align: center;
  margin-bottom: var(--spacing-6);
}

.register-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-1);
  line-height: var(--line-height-tight);
}

.register-subtitle {
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.field {
  display: flex;
  flex-direction: column;
}

.field-label {
  display: block;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-2);
}

.custom-select {
  border-radius: var(--border-radius);
  border: 1px solid var(--color-border);
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  padding: var(--spacing-3) var(--spacing-4);
  width: 100%;
  font-size: var(--font-size-sm);
  min-height: 2.75rem;
  line-height: var(--line-height-normal);
  transition: var(--transition);
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'><path fill='%236b7280' d='m0 0 2 2 2-2z'/></svg>");
  background-repeat: no-repeat;
  background-position: right var(--spacing-3) center;
  background-size: 0.5rem;
}

.custom-select:hover {
  border-color: var(--color-primary);
  background: var(--color-bg-primary);
}

.custom-select:focus {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-focus);
  outline: none;
}

.custom-select.p-invalid {
  border-color: var(--color-error);
  box-shadow: var(--shadow-focus-error);
}

.error-message {
  color: var(--color-error);
  font-size: var(--font-size-xs);
  margin-top: var(--spacing-1);
}

.password-strength {
  margin-top: var(--spacing-2);
}

.strength-bar {
  height: 4px;
  border-radius: 2px;
  margin-bottom: var(--spacing-1);
  transition: var(--transition);
}

.strength-weak {
  background: var(--color-error);
  width: 25%;
}

.strength-medium {
  background: var(--color-warning);
  width: 50%;
}

.strength-strong {
  background: var(--color-success);
  width: 75%;
}

.strength-very-strong {
  background: var(--color-success);
  filter: brightness(0.8);
  width: 100%;
}

.strength-text {
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
  display: block;
  text-align: center;
}

.password-hint {
  margin-top: var(--spacing-2);
}

.hint-text {
  color: var(--color-warning);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.register-footer {
  text-align: center;
  margin-top: var(--spacing-6);
  padding-top: var(--spacing-4);
  border-top: 1px solid var(--color-gray-200);
}

.footer-text {
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
}

.login-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  margin-left: var(--spacing-1);
}

.login-link:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .register-card {
    padding: var(--spacing-5);
  }

  .register-title {
    font-size: var(--font-size-xl);
  }
}
</style>
