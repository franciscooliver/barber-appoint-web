<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import { ErrorResponse } from '@/types/auth'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const email = ref('')
const password = ref('')
const loading = ref(false)

const handleSubmit = async () => {
    loading.value = true
    
    const response = await authStore.login({
      email: email.value,
      password: password.value
    })

    if (response instanceof ErrorResponse) {
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: response.message || 'Erro ao fazer login'
      })
      loading.value = false
      return
    }

    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Login realizado com sucesso!'
    })
    
    router.push({ name: 'Home' })
    loading.value = false
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="login-form">
    <div class="field">
      <label for="email">Email</label>
      <InputText
        id="email"
        v-model="email"
        type="email"
        class="w-full"
        placeholder="seu@email.com"
        required
      />
    </div>
    
    <div class="field">
      <label for="password">Senha</label>
      <Password
        id="password"
        v-model="password"
        class="w-full"
        :feedback="false"
        toggleMask
        required
      />
    </div>

    <Button
      type="submit"
      label="Entrar"
      class="w-full"
      :loading="loading"
    />
  </form>
</template>

<style scoped>
.login-form {
  width: 100%;
  max-width: 350px;
}

.field {
  margin-bottom: 1.5rem;
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

:deep(.p-inputtext) {
  width: 100%;
}

:deep(.p-password) {
  width: 100%;
  display: block;
}

:deep(.p-password-input) {
  width: 100%;
}
</style>
