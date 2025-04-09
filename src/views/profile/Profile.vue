<template>
  <div class="profile">
    <Card>
      <!-- <template #title>
        <div class="flex align-items-center gap-2">
          <i class="pi pi-user text-xl"></i>
          <span>Meu Perfil</span>
        </div>
      </template> -->
      
      <template #content>
        <div class="grid">
          <div class="col-12 mx-auto md:col-4 mb-4 flex align-items-center justify-content-center">
            <div class="avatar-container">
              <Avatar
                :image="user?.avatar || 'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png'"
                size="xlarge"
                class="w-full mb-6"
                shape="circle"
              />
            </div>
          </div>
          
          <div class="col-12 md:col-8">
            <div class="grid">
              <div class="col-12 md:col-6 field">
                <label class="font-bold block mb-2">Nome</label>
                <InputText :modelValue="user?.name" disabled class="w-full" />
              </div>

              <div class="col-12 md:col-6 field">
                <label class="font-bold block mb-2">Email</label>
                <InputText :modelValue="user?.email" disabled class="w-full" />
              </div>

              <div class="col-12 md:col-6 field">
                <label class="font-bold block mb-2">Tipo de Conta</label>
                <Chip :label="user?.role" class="capitalize" />
              </div>

              <!-- Seção de Endereço -->
              <div class="col-12">
                <Divider align="left">
                  <span class="p-tag">Endereço</span>
                </Divider>
              </div>

              <div class="col-12 md:col-6 field">
                <label class="font-bold block mb-2">CEP</label>
                <InputText :modelValue="user?.address?.zipcode" disabled class="w-full" />
              </div>

              <div class="col-12 md:col-6 field">
                <label class="font-bold block mb-2">Cidade/UF</label>
                <InputText :modelValue="user?.address?.city + ' - ' + user?.address?.state" disabled class="w-full" />
              </div>

              <div class="col-12 md:col-6 field">
                <label class="font-bold block mb-2">Rua</label>
                <InputText :modelValue="user?.address?.street + ' - ' + user?.address?.number" disabled class="w-full" />
              </div>

              <div class="col-12 md:col-6 field">
                <label class="font-bold block mb-2">Bairro</label>
                <InputText :modelValue="user?.address?.neighborhood" disabled class="w-full" />
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-content-end">
          <Button 
            label="Editar Perfil" 
            icon="pi pi-pencil" 
            @click="showEditDialog"
            class="p-button-primary"
          />
        </div>
      </template>
    </Card>

    <EditAddressDialog
      v-model="dialogVisible"
      :initial-data="user?.address"
      @save="saveAddress"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Card from 'primevue/card'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Chip from 'primevue/chip'
import Divider from 'primevue/divider'
import EditAddressDialog from './components/EditAddressDialog.vue'
import type { AddressForm } from '@/types/profile'
import type { Address } from '@/types/auth'

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const dialogVisible = ref(false)
const loading = ref(false)

const showEditDialog = () => {
  dialogVisible.value = true
}

const saveAddress = async (formData: AddressForm) => {
  try {
    loading.value = true
    const addressData: Address = {
      id: user.value?.address?.id ?? null,
      ...formData
    }
    authStore.updateUserLocal({ address: addressData })
    dialogVisible.value = false
  } catch (error) {
    console.error('Erro ao salvar endereço:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.profile {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

:deep(.p-card) {
  border-radius: var(--border-radius);
  box-shadow: var(--card-shadow);
}

:deep(.p-inputtext:disabled) {
  background-color: var(--surface-100);
  opacity: 0.8;
}

.capitalize {
  text-transform: capitalize;
}

.avatar-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.avatar-container .p-avatar) {
  width: 30%;
  height: 30%;
}

:deep(.p-dialog-content) {
  padding: 2rem;
}

.p-fluid .p-inputtext {
  width: 100%;
}
</style>
