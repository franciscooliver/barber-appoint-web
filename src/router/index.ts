import { useAuthStore } from '@/stores/auth'
import Home from '@/views/home/Home.vue'
import Login from '@/views/auth/Login.vue'
import Profile from '@/views/profile/Profile.vue'
import NotFound from '@/views/NotFound.vue'
import { createRouter, createWebHistory } from 'vue-router'
import ClientScheduling from '@/views/scheduling/ClientScheduling.vue'

// Configuração das rotas
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requiresAuth: false,
      isGuest: true, // apenas usuários não autenticados
    },
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true, // requer autenticaç
    },
  },
  {
    path: '/perfil',
    name: 'Profile',
    component: Profile,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/agendamentos',
    name: 'client-scheduling',
    component: ClientScheduling,
    meta: {
      requiresAuth: true,
      role: 'client',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guard de navegação aprimorado
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  // Rota apenas para visitantes
  if (to.meta.isGuest && isAuthenticated) {
    return next({ name: 'Home' })
  }

  // Verifica autenticação
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({
      name: 'Login',
      query: { redirect: to.fullPath },
    })
  }

  // Verifica permissões (se necessário)
  if (to.meta.permissions && isAuthenticated) {
    const hasPermission = authStore.hasPermissions(to.meta.permissions)
    if (!hasPermission) {
      return next({ name: 'Home' }) // ou página de acesso negado
    }
  }

  // Verifica roles (se necessário)
  if (to.meta.roles && isAuthenticated) {
    const hasRole = authStore.hasRole(to.meta.roles)
    if (!hasRole) {
      return next({ name: 'Home' }) // ou página de acesso negado
    }
  }

  next()
})

export default router
