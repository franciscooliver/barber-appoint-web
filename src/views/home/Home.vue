<template>
  <div class="home">
    <h1>Bem-vindo ao Sistema de Agendamentos</h1>
    <div class="quick-actions" v-if="userRole">
      <div v-if="userRole === 'client'">
        <router-link to="/agendamentos" class="action-button">
          Fazer Agendamento
        </router-link>
      </div>
      <div v-if="userRole === 'employee'">
        <router-link to="/agenda" class="action-button">
          Ver Agenda
        </router-link>
      </div>
      <div v-if="userRole === 'admin'">
        <router-link to="/admin" class="action-button">
          Painel Administrativo
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const userRole = authStore.userRole
</script>

<style scoped>
.home {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.quick-actions {
  margin-top: 2rem;
}

.action-button {
  display: inline-block;
  padding: 1rem 2rem;
  background-color: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin: 0.5rem 0;
}

.action-button:hover {
  background-color: #45a049;
}
</style>
