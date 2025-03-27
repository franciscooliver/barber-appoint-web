import PrimeVue from 'primevue/config'
import { useToast } from 'primevue/usetoast'

interface ToastOptions {
  summary?: string
  detail: string
  life?: number
  group?: string
  closable?: boolean
}

class ToastService {
  private toast

  constructor() {
    this.toast = useToast()
  }

  success(options: ToastOptions) {
    this.toast.add({
      severity: 'success',
      summary: options.summary || 'Sucesso',
      detail: options.detail,
      life: options.life || 3000,
      group: options.group,
      closable: options.closable ?? true,
    })
  }

  error(options: ToastOptions) {
    this.toast.add({
      severity: 'error',
      summary: options.summary || 'Erro',
      detail: options.detail,
      life: options.life || 3000,
      group: options.group,
      closable: options.closable ?? true,
    })
  }

  info(options: ToastOptions) {
    this.toast.add({
      severity: 'info',
      summary: options.summary || 'Informação',
      detail: options.detail,
      life: options.life || 3000,
      group: options.group,
      closable: options.closable ?? true,
    })
  }

  warn(options: ToastOptions) {
    this.toast.add({
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
