import { App } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate'

export function setupStore(app: App) {
  const pinia = createPinia()
  pinia.use(piniaPersist)
  app.use(pinia)
}

export * from './appointment'
export * from './auth'
