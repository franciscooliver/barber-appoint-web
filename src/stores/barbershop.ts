import { defineStore } from 'pinia'
import type { BarbershopSettings } from '@/types/barbershop'
import { barbershopService } from '@/services/barbershopService'
import { SuccessResponse } from '@/types/auth';

export const useBarbershopStore = defineStore('barbershop', {
  state: () => ({
    settings: {} as BarbershopSettings
  }),

  actions: {
    async updateSettings(settings: Partial<BarbershopSettings>) {
      console.log('updateSettings', settings);
      
      try {
        if (settings.workingDays) {
          settings.workingDays = settings.workingDays.map(day => Number(day))
        }
        this.settings = { ...this.settings, ...settings }
        const response = await barbershopService.updateSettings(this.settings)
        return response
      } catch (error) {
        throw error
      }
    },

    async fetchSettings() {
      const response = await barbershopService.getSettings()
      if (response instanceof SuccessResponse) {
        const data = response.data as BarbershopSettings
        if (data.workingDays) {
          data.workingDays = data.workingDays.map(day => Number(day))
        }
        this.settings = data
      }
    }
  }
})
