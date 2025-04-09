import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:3001'

const instance = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  const token = authStore.token

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error.response?.data?.statusCode);
    
    if (error.response?.data?.statusCode === 401) {
      const authStore = useAuthStore()
      authStore.clearAuth()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default instance
