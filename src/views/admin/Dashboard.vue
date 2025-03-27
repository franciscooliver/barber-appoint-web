<template>
  <div class="admin-dashboard">
    <h1>Painel Administrativo</h1>
    <div class="dashboard-grid">
      <div class="dashboard-card">
        <h3>Funcionários</h3>
        <button @click="navigateToEmployees">Gerenciar</button>
      </div>
      <div class="dashboard-card">
        <h3>Serviços</h3>
        <button @click="navigateToServices">Gerenciar</button>
      </div>
      <div class="dashboard-card">
        <h3>Relatórios</h3>
        <button @click="navigateToReports">Ver</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const navigateToEmployees = () => {
  // Implementar navegação
}

const navigateToServices = () => {
  // Implementar navegação
}

const navigateToReports = () => {
  // Implementar navegação
}
</script>

<style scoped>
.admin-dashboard {
  padding: 2rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}

.dashboard-card {
  padding: 1.5rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  text-align: center;
}

button {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
