<script setup lang="ts">
import { ref } from 'vue'

const title = ref('Agendamentos')
</script>

<template>
  <div class="agendamentos">
    <h1>{{ title }}</h1>
    <div class="card">
      <p>Lista de agendamentos será exibida aqui</p>
    </div>
  </div>
</template>

<style scoped>
.agendamentos {
  padding: 1rem;
}

.card {
  background: var(--surface-card);
  padding: 1.5rem;
  border-radius: 10px;
  margin-top: 1rem;
}
</style>
