<template>
  <div class="login-page">
    <div class="login-container">
      <h1 class="text-center mb-4">Login</h1>
      <LoginForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '@/components/Auth/LoginForm.vue'
</script>

<style scoped>
.login-page {
  min-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--surface-ground);
}

.login-container {
  background-color: var(--surface-card);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12);
  width: 100%;
  max-width: 400px;
  margin: 0 1rem;
}
</style>
