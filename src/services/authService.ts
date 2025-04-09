import baseService from '@/services/baseService'
import { AxiosError } from 'axios'
import { SuccessResponse, ErrorResponse } from '@/types/auth'

interface Credentials {
  email: string
  password: string
}

export const authService = {
  async login(credentials: Credentials): Promise<SuccessResponse | ErrorResponse> {
    try {
      const response = await baseService.post('/auth/login', credentials)
      return SuccessResponse.create({
        message: response.data.message,
        access_token: response.data.data.access_token,
        user: response.data.data,
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

  async logout(): Promise<SuccessResponse | ErrorResponse> {
    try {
      const response = await baseService.post('/auth/logout')
      return SuccessResponse.create({
        message: response.data.message,
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
}
