import { defineStore } from 'pinia'
import { AuthService } from '@/services/authService'
import { Credentials, ErrorResponse, SuccessResponse, User } from '@/types/auth'
import type { PersistenceOptions } from 'pinia-plugin-persistedstate'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null as User | null,
  }),
  actions: {
    login: async function (credentials: Credentials): Promise<SuccessResponse | ErrorResponse> {
      const response = await AuthService.login(credentials)

      if (response instanceof SuccessResponse && response.user) { 
        this.user = response.user
        this.setToken(this.user.access_token)
      }    
      return response
    },
    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
    },
    logout: async function() {
      const response = await AuthService.logout();
      if(response instanceof ErrorResponse) {
        return;
      }
      
      this.clear();
    },
    clear: function() {
      this.token = null
      this.user = null
      localStorage.removeItem('token');
    }
  },
  getters: {
    getUser: (state) => state.user,
    isAuthenticated(): boolean {
      return !!this.getUser && !!this.token
    },
  },
  persist: {
    enabled: true,
    strategies: [{ storage: localStorage, paths: ['user', 'token'] }],
  } as PersistenceOptions,
})
