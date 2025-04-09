<template>
  <div class="p-4">
    <div v-if="isLoading" class="flex justify-content-center">
      <ProgressSpinner />
    </div>
    <div v-else>
      <div class="field mb-4">
        <label>Intervalo entre atendimentos (minutos)</label>
        <InputNumber 
          v-model="barbershopStore.settings.intervalTime" 
          :min="0" 
          :max="120"
          class="col-12 md:col-3"
        />
      </div>
      <div class="grid">
        <div v-for="(workingHour, day) in workingHours" :key="day" class="col-12 md:col-6 lg:col-4 xl:col-3 mb-3">
          <Card>
            <template #title>
              <div class="flex align-items-center justify-content-between">
                <span>{{ getDayName(String(day)) }}</span>
                <ToggleSwitch v-model="workingHour.isActive" @change="updateDay(String(day))" />
              </div>
            </template>
            <template #content>
              <div v-if="workingHour.isActive" class="flex flex-column gap-3">
                <div class="field">
                  <label>Horário Inicial</label>
                  <Calendar
                    v-model="workingHour.startTime"
                    :timeOnly="true"
                    :step="30"
                    @change="updateDay(String(day))"
                    hourFormat="24"
                  />
                </div>
                <div class="field">
                  <label>Horário Final</label>
                  <Calendar
                    v-model="workingHour.endTime"
                    :timeOnly="true"
                    :step="30"
                    @change="updateDay(String(day))"
                    hourFormat="24"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
      <div class="flex justify-content-end mt-4">
        <Button 
          label="Salvar Configurações" 
          icon="pi pi-save" 
          :loading="loading"
          @click="saveSettings"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { WorkingHour } from '@/types/barbershop';
import Card from 'primevue/card';
import ToggleSwitch from 'primevue/toggleswitch';
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import InputNumber from 'primevue/inputnumber';
import ProgressSpinner from 'primevue/progressspinner';
import { useBarbershopStore } from '@/stores/barbershop';
import { useToast } from 'primevue/usetoast';

const barbershopStore = useBarbershopStore();
const workingHours = ref<{ [key: string]: WorkingHour & { startTime: Date, endTime: Date } }>({});
const loading = ref(false);
const isLoading = ref(true);
const toast = useToast();

const dayNames = {
  '1': 'Segunda-feira',
  '2': 'Terça-feira',
  '3': 'Quarta-feira',
  '4': 'Quinta-feira',
  '5': 'Sexta-feira',
  '6': 'Sábado',
  '7': 'Domingo'
};

const getDayName = (day: string) => dayNames[day as keyof typeof dayNames] || day;

const updateDay = (day: string) => {
  const hour = workingHours.value[day];
  if (hour) {
    const updatedHours = {
      ...barbershopStore.settings.workingHours,
      [day]: {
        start: formatTime(hour.startTime),
        end: formatTime(hour.endTime),
        isActive: hour.isActive,
        intervalTime: null,
        intervals: []
      }
    };
    
    barbershopStore.settings = {
      ...barbershopStore.settings,
      workingHours: updatedHours
    };
  }
};

const formatTime = (date: Date): string => {
  return date.toTimeString().slice(0, 5);
};

const parseTime = (time: string): Date => {
  const [hours, minutes] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const saveSettings = async () => {
  try {
    loading.value = true;
    
    // Atualiza os horários antes de salvar
    Object.entries(workingHours.value).forEach(([day, hour]) => {
      if (barbershopStore.settings.workingHours[day]) {
        barbershopStore.settings.workingHours[day].start = formatTime(hour.startTime);
        barbershopStore.settings.workingHours[day].end = formatTime(hour.endTime);
      }
    });

    await barbershopStore.updateSettings(barbershopStore.settings);
    toast.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Configurações salvas com sucesso!',
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

const emit = defineEmits<{
  (e: 'update', day: string, config: WorkingHour): void
}>();

const props = defineProps<{
  initialData?: { [key: string]: WorkingHour }
}>();

onMounted(async () => {
  try {
    await barbershopStore.fetchSettings();
    
    const data =  barbershopStore.settings.workingHours;
    Object.entries(data).forEach(([day, config]) => {
      workingHours.value[day] = {
        ...config,
        startTime: parseTime(config.start),
        endTime: parseTime(config.end)
      };
    });
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.field {
  margin-bottom: 1rem;
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
</style>
