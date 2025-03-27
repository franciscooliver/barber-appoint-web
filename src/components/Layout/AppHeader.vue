<template>
  <div>
    <Menubar class="custom-menubar">
      <template #start>
        <PrimeButton
          icon="pi pi-bars"
          @click="toggleMobileMenu"
          class="mobile-menu-button p-button-text p-button-rounded"
        />
        <div class="logo-wrapper" @click="$router.push('/')">
          <img
            src="https://placehold.co/120x40/2196F3/FFFFFF/png?text=LOGO"
            alt="Logo"
            class="logo-image"
          />
        </div>
      </template>

      <template #end>
        <div class="logo-container">
          <Menubar :model="rightItems" class="menubar-right desktop-menu" />
          <CustomMenu ref="menu" :model="menuItems" :popup="true" />
          <Avatar
            image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
            shape="circle"
            class="cursor-pointer"
            @click="toggleMenu"
          />
        </div>
      </template>
    </Menubar>

    <!-- Menu móvel -->
    <Drawer
      v-model:visible="mobileMenuVisible"
      position="left"
      class="mobile-sidebar"
      :modal="false"
      :showCloseIcon="false"
    >
      <template #header>
        <h3>Menu</h3>
      </template>
      <PrimeMenu :model="[...leftItems, ...rightItems]" />
    </Drawer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Menubar from 'primevue/menubar'
import Avatar from 'primevue/avatar'
import CustomMenu from 'primevue/menu'
import Drawer from 'primevue/drawer'
import Menu from 'primevue/menu'
import PrimeButton from 'primevue/button'

export default defineComponent({
  components: {
    Menubar,
    CustomMenu,
    Avatar,
    Drawer,
    PrimeMenu: Menu,
    PrimeButton: PrimeButton,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const menu = ref()
    const mobileMenuVisible = ref(false)
    const authStore = useAuthStore()

    const isActiveRoute = (path: string) => {
      return route.path === path
    }

    const logout = async () => {
      await authStore.logout()
      router.push('/login')
    }

    const leftItems = ref([])

    const rightItems = computed(() => [
      {
        label: 'Agendamentos',
        icon: 'pi pi-calendar',
        command: () => {
          router.push({ name: 'client-scheduling' })
          mobileMenuVisible.value = false
        },
        class: isActiveRoute('/agendamentos') ? 'active-item' : '',
      },
      {
        label: 'Clientes',
        icon: 'pi pi-users',
        command: () => {
          router.push('/clientes')
          mobileMenuVisible.value = false
        },
        class: isActiveRoute('/clientes') ? 'active-item' : '',
      },
    ])

    const avatarUnauthetivatedItems = computed(() => [
      {
        label: 'Entrar',
        icon: 'pi pi-sign-in',
        command: () => {
          router.push('/login')
          menu.value.hide()
        },
        class: isActiveRoute('/login') ? 'active-menu-item' : '',
      },
      {
        label: 'Cadastrar',
        icon: 'pi pi-user-plus',
        command: () => {
          router.push('/cadastro')
          menu.value.hide()
        },
        class: isActiveRoute('/cadastro') ? 'active-menu-item' : '',
      },
    ])

    const avatarAuthetivatedItems = computed(() => [
      {
        label: 'Meu Perfil',
        icon: 'pi pi-user',
        command: () => {
          router.push('/perfil')
          menu.value.hide()
        },
        class: isActiveRoute('/perfil') ? 'active-menu-item' : '',
      },
      {
        label: 'Configurações',
        icon: 'pi pi-cog',
        command: () => {
          router.push('/configuracoes')
          menu.value.hide()
        },
        class: isActiveRoute('/configuracoes') ? 'active-menu-item' : '',
      },
      { separator: true },
      { 
        label: 'Sair', 
        icon: 'pi pi-sign-out', 
        command: () => {
          logout()
          menu.value.hide()
        }
      },
    ])

    const menuItems = computed(() => {
      return authStore.isAuthenticated 
        ? avatarAuthetivatedItems.value 
        : avatarUnauthetivatedItems.value
    })

    const toggleMenu = (event: Event) => {
      menu.value.toggle(event)
    }

    const toggleMobileMenu = () => {
      mobileMenuVisible.value = !mobileMenuVisible.value
    }

    return {
      authStore,
      leftItems,
      rightItems,
      menuItems,
      menu,
      toggleMenu,
      mobileMenuVisible,
      toggleMobileMenu,
    }
  },
})
</script>

<style scoped>
.custom-menubar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  background-color: var(--primary-color);
  color: var(--text-color);
}

.mobile-menu-button {
  display: none;
  color: var(--text-color) !important;
}

/* Responsividade */
@media screen and (max-width: 768px) {
  .mobile-menu-button {
    display: block;
  }

  .desktop-menu {
    display: none !important;
  }

  .logo-container {
    margin-left: auto;
  }
}

@media screen and (min-width: 769px) {
  .mobile-menu-button {
    display: none;
  }

  .desktop-menu {
    display: flex !important;
  }
}

/* Estilo para o Drawer móvel */
:deep(.mobile-sidebar) {
  .p-drawer-header {
    padding: 1rem;
    background-color: var(--primary-color);
    color: white;
    border-bottom: 1px solid var(--surface-border);
  }

  .p-drawer-content {
    padding: 0;
    background-color: var(--surface-ground);
  }

  .p-menu {
    width: 100%;
    border: none;
    border-radius: 0;
    background: transparent;

    .p-menuitem {
      .p-menuitem-link {
        padding: 1rem;

        &:hover {
          background-color: var(--surface-hover);
        }

        .p-menuitem-icon {
          color: var(--primary-color);
        }

        .p-menuitem-text {
          color: var(--text-color);
        }
      }
    }
  }
}

/* Container da logo e dos itens à esquerda */
.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Logo personalizada */
.logo {
  height: 40px;
}

/* Itens à esquerda */
.menubar-left {
  flex: 1;
}

/* Itens à direita */
.menubar-right {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cursor-pointer {
  cursor: pointer;
}

:deep(.p-menu),
:deep(.p-menubar) {
  border: 0;

  .p-menubar-item.p-focus > .p-menubar-item-content {
    background-color: transparent !important;
  }

  .p-menubar-item.p-focus .p-menubar-item-content .p-menubar-item-icon {
    color: var(--icon-color) !important;
  }

  .p-menuitem-link,
  .p-menubar-item-content {
    transition: opacity 0.2s ease;

    &:hover {
      background-color: transparent !important;
      opacity: 0.8;

      .p-menuitem-icon,
      .p-menubar-item-icon {
        color: var(--text-color) !important;
      }
    }

    &:focus {
      box-shadow: none !important;
      background-color: transparent !important;
    }
  }

  /* Novo estilo para item ativo */
  .active-item {
    font-weight: bold;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: var(white);
    }

    .p-menuitem-icon,
    .p-menuitem-text {
      color: var(--text-color) !important;
    }
  }
}

:deep(.p-menu) {
  .p-menuitem {
    .p-menuitem-link {
      transition: background-color 0.2s;

      &:hover {
        background-color: var(--primary-100) !important;
      }
    }
  }

  /* Ajustando o seletor para funcionar corretamente */
  .p-menuitem-link.active-menu-item {
    background-color: var(--primary-50) !important;

    .p-menuitem-icon,
    .p-menuitem-text {
      color: var(--primary-700) !important;
      font-weight: 600;
    }
  }
}

.logo-wrapper {
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0 1rem;
}

.logo-image {
  height: 40px;
  object-fit: contain;
}
</style>
