<template>
  <div class="scheduling-container">
    <h1>Meus Agendamentos</h1>

    <div class="scheduling-filters">
      <!-- <v-select v-model="filterStatus" :items="statusOptions" label="Status" clearable /> -->
      <!-- <v-date-picker v-model="selectedDate" label="Data" /> -->
    </div>

    <DataTable :value="appointments" :loading="loading">
      <Column field="id" header="Cód."></Column>
      <Column field="user.name" header="Nome Cliente"></Column>
      <Column header="Data Agendamento">
        <template #body="{ data }">
          {{ formatDate(data?.appointmentDate) }}
        </template>
      </Column>
      <Column header="Horário">
        <template #body="{ data }">
          {{ formatTime(data?.appointmentDate) }}
        </template>
      </Column>
      <Column field="service.name" header="Serviço">
        <template #body="{ data }">
          {{ data?.service.name ?? '' }}
        </template>
      </Column>
      <Column header="Duração">
        <template #body="{ data }">
          {{ formatDuration(data.time) }}
        </template>
      </Column>
      <Column header="Status">
        <template #body="{ data }">
          <Tag :severity="getStatusSeverity(data.status)">
            {{ STATUS_LABELS[data.status as AppointmentStatus] }}
          </Tag>
        </template>
      </Column>
      <Column header="Ações">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button
              icon="pi pi-times"
              severity="danger"
              rounded
              text
              @click="confirmCancel(data)"
              v-if="canCancel(data)"
              tooltip="Cancelar"
            />
            <Button
              icon="pi pi-sync"
              severity="info"
              rounded
              text
              @click="showStatusDialog(data)"
              tooltip="Alterar Status"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Diálogo de confirmação de cancelamento -->
    <ConfirmDialog></ConfirmDialog>

    <!-- Diálogo de alteração de status -->
    <Dialog v-model:visible="statusDialogVisible" header="Alterar Status" :modal="true">
      <div class="flex flex-column gap-2">
        <Select
          v-model="selectedStatus"
          :options="Object.keys(STATUS_LABELS)"
          :optionLabel="(item: AppointmentStatus) => STATUS_LABELS[item]"
          placeholder="Selecione o status"
          class="w-full"
        />
      </div>
      <template #footer>
        <Button label="Cancelar" @click="statusDialogVisible = false" text />
        <Button label="Confirmar" @click="updateStatus" severity="primary" />
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useAppointmentStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { Appointment, AppointmentStatus, STATUS_LABELS } from '@/services/appointmentService'
import { Column, DataTable, Tag } from 'primevue'
import { formatDate, formatTime, calculateMinutes, formatDuration } from '@/utils/dateUtils'
import { useConfirm } from "primevue/useconfirm"
import { useToast } from "primevue/usetoast"
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Select from 'primevue/select'  // Changed from Dropdown to Select
import ConfirmDialog from 'primevue/confirmdialog'

export default defineComponent({
  name: 'ClientScheduling',
  components: {
    DataTable,
    Column,
    Tag,
    Dialog,
    Button,
    Select,  // Changed from Dropdown to Select
    ConfirmDialog,
  },

  setup() {
    const appointmentStore = useAppointmentStore()
    const { appointments } = storeToRefs(appointmentStore)
    const loading = ref(false)
    const filterStatus = ref(null)
    const selectedDate = ref(new Date().toISOString().substr(0, 10))

    const headers = [
      { title: 'Cód.', key: 'id' },
      { title: 'Nome Cliente', key: 'user.name' }, // added header for Nome
      { title: 'Data Agendamento', key: 'appointmentDate' },
      { title: 'Horário', key: 'appointmentDate' },
      { title: 'Serviço', key: 'service.name' },
      { title: 'Status', key: 'status' },
      { title: 'Duração', key: 'time' },
      { title: 'Ações', key: 'actions' },
    ]

    const statusOptions = ['Agendado', 'Confirmado', 'Concluído', 'Cancelado']

    const getStatusSeverity = (status: AppointmentStatus) => {
      const severities: Record<AppointmentStatus, string> = {
        scheduled: 'success',
        confirmed: 'info',
        completed: 'primary',
        cancelled: 'danger',
        pending: 'warn'
      }
      
      return severities[status] || 'secondary'
    }

    const canCancel = (appointment: Appointment) => {
      return ['scheduled', 'confirmed'].includes(appointment.status || '')
    }

    const loadAppointments = async () => {
      loading.value = true
      try {
        await appointmentStore.fetchClientAppointments()
      } finally {
        loading.value = false
      }
    }

    const cancelAppointment = async (id: number) => {
      try {
        //await appointmentStore.cancelAppointment(id)
        await loadAppointments()
      } catch (error) {
        console.error('Erro ao cancelar agendamento:', error)
      }
    }

    const confirm = useConfirm()
    const toast = useToast()
    const statusDialogVisible = ref(false)
    const selectedStatus = ref<AppointmentStatus | undefined>(undefined)
    const selectedAppointment = ref<Appointment | null>(null)

    const confirmCancel = (appointment: Appointment) => {
      confirm.require({
        message: 'Tem certeza que deseja cancelar este agendamento?',
        header: 'Confirmar Cancelamento',
        icon: 'pi pi-exclamation-triangle',
        accept: () => cancelAppointment(appointment.id),
      })
    }

    const showStatusDialog = (appointment: Appointment) => {
      selectedAppointment.value = appointment
      selectedStatus.value = appointment.status
      statusDialogVisible.value = true
    }

    const updateStatus = async () => {
      if (!selectedAppointment.value || !selectedStatus.value) return

      try {
        await appointmentStore.updateAppointmentStatus(
          selectedAppointment.value.id,
          selectedStatus.value
        )
        toast.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Status atualizado com sucesso',
          life: 3000,
        })
        statusDialogVisible.value = false
        await loadAppointments()
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao atualizar status',
          life: 3000,
        })
      }
    }

    onMounted(loadAppointments)

    return {
      loading,
      filterStatus,
      selectedDate,
      headers,
      statusOptions,
      appointments, // agora é reativo
      getStatusSeverity,
      canCancel,
      cancelAppointment,
      confirmCancel,
      showStatusDialog,
      updateStatus,
      statusDialogVisible,
      selectedStatus,
      STATUS_LABELS,
      formatDate,
      formatTime,
      calculateMinutes,
      formatDuration,
    }
  },
})
</script>

<style scoped>
.scheduling-container {
  padding: 20px;
}

.scheduling-filters {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
</style>
