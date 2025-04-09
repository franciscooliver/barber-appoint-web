<template>
  <Toast position="top-right" />
</template>

<script setup lang="ts">
import Toast from 'primevue/toast'
import { onMounted } from 'vue'
import ToastService from '@/services/ToastService'

onMounted(() => {
  ToastService.init()
})
</script>
