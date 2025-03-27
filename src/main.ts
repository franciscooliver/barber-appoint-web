import { createApp } from 'vue'
import App from './App.vue'
import { setupStore } from '@/stores'
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

// Configura o Pinia
setupStore(app)

// Configura PrimeVue
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.use(router)
app.use(ToastService, {
    life: 5000,
    position: 'top-right'
})
app.use(ConfirmationService)

app.mount('#app')
