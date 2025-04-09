import { defineStore } from 'pinia'
import { authService } from '@/services/authService'
import { Credentials, ErrorResponse, SuccessResponse, User } from '@/types/auth'
import type { PersistenceOptions } from 'pinia-plugin-persistedstate'
import Cookies from 'js-cookie'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: Cookies.get('token') || null as string | null,
    user: null as User | null,
  }),
  actions: {
    login: async function (credentials: Credentials): Promise<SuccessResponse | ErrorResponse> {
      const response = await authService.login(credentials)

      if (response instanceof SuccessResponse && response.user) { 
        const { user } = response
        this.setToken(user.access_token)
        delete (user as any).access_token;
        this.user = user
      }    
      return response
    },
    setToken(token: string) {
      this.token = token
      Cookies.set('token', token, { secure: true, sameSite: 'strict' })
    },
    logout: async function() {
      const response = await authService.logout();
      if(response instanceof ErrorResponse) {
        return;
      }
      
      this.clear();
    },
    clear: function() {
      this.token = null
      this.user = null
      Cookies.remove('token')
    },
    clearAuth() {
      this.token = null
      this.user = null
    },
    updateUserLocal(userData: Partial<User>) {
      if (this.user) {
        this.user = { ...this.user, ...userData }
      }
    }
  },
  getters: {
    getUser: (state) => state.user,
    isAuthenticated(): boolean {
      return !!this.token && !!this.user
    },
  },
  persist: {
    key: 'auth',
    storage: localStorage,
    paths: ['user'],
    serializer: {
      deserialize: (value) => {
        const parsed = JSON.parse(value);
        delete parsed.token;
        return parsed;
      },
      serialize: (value) => {
        const { token, ...rest } = value;
        return JSON.stringify(rest);
      }
    }
  } as PersistenceOptions,
})
