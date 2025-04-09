import type { AddressForm } from '@/types/profile'
import baseService from '@/services/baseService'
import ToastService from '@/services/ToastService'
import { AxiosError } from 'axios'
import { SuccessResponse } from '@/types/auth'

export const addressService = {
  async updateAddress(address: AddressForm) {
    try {
      const { id } = address
      delete address?.id
      const response = await baseService.put(`/addresses/${id}`, address)
      return SuccessResponse.create({
        message: response?.data?.data.message,
        data: response?.data?.data,
      })
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data.message || 'Erro desconhecido'
        ToastService.error({ detail: errorMessage })
      }
      console.error('Error updating address:', error)
      throw error
    }
  }
}
