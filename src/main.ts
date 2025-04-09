import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

/* import components */
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'

import '@/assets/styles/main.scss'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

const app = createApp(App)
const pinia = createPinia()

// Install Pinia before other plugins
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// Configure PrimeVue
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.use(router)
app.use(ToastService)
app.use(ConfirmationService)

app.mount('#app')
