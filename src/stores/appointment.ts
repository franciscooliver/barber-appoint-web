import { defineStore } from 'pinia'
import { appointmentService, Appointment, AppointmentStatus } from '@/services/appointmentService'
import { ErrorResponse, SuccessResponse } from '@/types/auth'
import { useAuthStore } from "@/stores/auth";

export const useAppointmentStore = defineStore('appointment', {
  state: () => ({
    appointments: [] as Appointment[],
  }),

  actions: {
    async fetchClientAppointments(): Promise<SuccessResponse|ErrorResponse> {
      try {
        const response = await appointmentService.getClientAppointments()
        console.log(response);
        
        if(response instanceof ErrorResponse) {
          useAuthStore().logout()
          return response;
        }

        if (response instanceof SuccessResponse) {
          this.appointments = Array.from(response.data as any)
        }

        return response
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error)
        throw error
      }
    },

    async cancelAppointment(id: number) {
      try {
        await appointmentService.cancelAppointment(id)
      } catch (error) {
        console.error('Erro ao cancelar agendamento:', error)
        throw error
      }
    },

    async updateAppointmentStatus(id: number, status: AppointmentStatus) {
      try {
        //const response = await appointmentService.patch(`/appointments/${id}/status`, { status })
        return {}
      } catch (error) {
        throw error
      }
    },
  },
})
