import baseService from '@/services/baseService'
import { ErrorResponse, SuccessResponse } from '@/types/auth'
import { AxiosError } from 'axios'

interface User {
  id: number
  name: string
  email: string
  isActive: boolean
  role: string
}

type Collaborator = Partial<User> & {
  phone?: string;
}

interface Address {
  id: number
  street: string
  city: string
  state: string
  zipcode: string
}

interface Service {
  id: number
  name: string
  price: string
  duration: number
  isActive: boolean
}

interface Barbershop {
  id: number
  name: string
  address: Address
}

export interface Appointment {
  id: number
  appointmentDate?: Date
  time?: string
  professionalName?: string
  status?: AppointmentStatus
  user?: User
  service?: Service
  barbershop?: Barbershop
  collaborator?: Collaborator
}

export type AppointmentStatus = 'pending' | 'scheduled' | 'confirmed' | 'completed' | 'cancelled'

export const STATUS_LABELS = {
  scheduled: 'Agendado',
  confirmed: 'Confirmado',
  completed: 'Concluído',
  cancelled: 'Cancelado',
  pending: 'Pendente', 
}

export interface AppointmentFilters {
  status?: AppointmentStatus | null
  date?: string | null
}

export const appointmentService = {
  async getClientAppointments() {
    try {
      const response = await baseService.get('/appointments') 
      return SuccessResponse.create({
        ...response.data.data,
      })
    } catch (error) {
      if (error instanceof AxiosError) {
        return ErrorResponse.create({
          message: error.response?.data.message || 'Erro desconhecido',
          statusCode: error.response?.status || 500,
        })
      }
      return ErrorResponse.create({
        message: 'Erro desconhecido',
        statusCode: 500,
      })
    }
  },

  async cancelAppointment(id: number) {
    await baseService.patch(`/appointments/${id}/cancel`)
  },
}
