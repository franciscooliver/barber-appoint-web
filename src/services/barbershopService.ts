import baseService  from '@/services/baseService'
import type { BarbershopSettings } from '@/types/barbershop'
import ToastService from './ToastService'
import { ErrorResponse, SuccessResponse } from '@/types/auth'
import { AxiosError } from 'axios'

export const barbershopService = {
  async updateSettings(settings: BarbershopSettings) {
    try {
      const response = await baseService.put(`/settings`, settings)
      return SuccessResponse.create({
        message: response?.data?.data.message,
        data: response?.data?.data,
      })
    } catch (error: any) {
      ToastService.error({ detail: error.response?.message || 'Erro ao atualizar configurações' })
    }
  },

  async getSettings(): Promise<SuccessResponse | ErrorResponse> {
    try {
      const response = await baseService.get('/settings')
      return SuccessResponse.create({
        message: response.data.message,
        data: response.data.data,
      })
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data.message || 'Erro desconhecido'
        ToastService.error({ detail: errorMessage })
        return ErrorResponse.create({
          message: errorMessage,
          statusCode: error.response?.status || 500,
        })
      }
      return ErrorResponse.create({
        message: 'Erro desconhecido',
        statusCode: 500,
      })
    }

  }
}
