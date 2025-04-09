import PrimeVue from 'primevue/config'
import { useToast } from 'primevue/usetoast'
import type { ToastServiceMethods } from 'primevue/toastservice'

interface ToastOptions {
  summary?: string
  detail: string
  life?: number
  group?: string
  closable?: boolean
}

class ToastService {
  private toast: ToastServiceMethods | null = null

  init() {
    this.toast = useToast()
  }

  private ensureToast() {
    if (!this.toast) {
      console.warn('Toast service not initialized. Call init() first in your component setup.')
      return false
    }
    return true
  }

  success(options: ToastOptions) {
    if (!this.ensureToast()) return
    this.toast!.add({
      severity: 'success',
      summary: options.summary || 'Sucesso',
      detail: options.detail,
      life: options.life || 3000,
      group: options.group,
      closable: options.closable ?? true,
    })
  }

  error(options: ToastOptions) {
    if (!this.ensureToast()) return
    this.toast!.add({
      severity: 'error',
      summary: options.summary || 'Erro',
      detail: options.detail,
      life: options.life || 3000,
      group: options.group,
      closable: options.closable ?? true,
    })
  }

  info(options: ToastOptions) {
    if (!this.ensureToast()) return
    this.toast!.add({
      severity: 'info',
      summary: options.summary || 'Informação',
      detail: options.detail,
      life: options.life || 3000,
      group: options.group,
      closable: options.closable ?? true,
    })
  }

  warn(options: ToastOptions) {
    if (!this.ensureToast()) return
    this.toast!.add({
      severity: 'warn',
      summary: options.summary || 'Atenção',
      detail: options.detail,
      life: options.life || 3000,
      group: options.group,
      closable: options.closable ?? true,
    })
  }
}

export default new ToastService()
