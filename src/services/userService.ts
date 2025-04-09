import baseService from '@/services/baseService'
import { AxiosError } from 'axios'
import { SuccessResponse, ErrorResponse } from '@/types/auth'
import ToastService from '@/services/ToastService'

interface Credentials {
  email: string
  password: string
}

export const userService = {
  async findById(id: number): Promise<SuccessResponse | ErrorResponse> {
    try {
      const response = await baseService.get(`/users/${id}`)
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
