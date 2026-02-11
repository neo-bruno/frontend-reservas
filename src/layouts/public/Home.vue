<template>
  <!-- Barra superior -->
  <v-app-bar app fixed color="primary" flat class="px-4">
    <v-toolbar-title class="text-terceary cursor-pointer">Hotel Familia Felipez</v-toolbar-title>

    <v-app-bar-nav-icon @click="drawer = !drawer" />
  </v-app-bar>

  <!-- Drawer lateral -->
  <v-navigation-drawer v-model="drawer" location="right" temporary width="280" class="bg-terceary">
    <v-container class="pa-4 d-flex flex-column justify-space-between fill-height">
      <div>
        <div class="text-center">
          <img height="150" class="rounded-t-xl"
            src="https://d1csarkz8obe9u.cloudfront.net/posterpreviews/vip-hotel-logo-design-template-eb72f8981df652fe0be27a9a517ae471_screen.jpg?ts=1660122446"
            cover />
        </div>
        <div class="text-center text-h6 font-weight-bold">
          FAMILIA FELIPEZ <br />
          <span class="text-caption font-weight-light">{{ nombre }}</span>
        </div>

        <v-list dense nav>
          <v-list-item v-for="item in menuItems" :key="item.title" :title="item.title"
            @click="handleClick(item)"></v-list-item>

        </v-list>
      </div>

      <div class="text-center mt-6">
        <v-divider class="mb-3"></v-divider>
        <v-icon size="20" class="me-1" color="primary">mdi-phone</v-icon>
        <div class="text-caption">INFORMACIÓN Y RESERVAS</div>
        <div class="font-weight-bold">(+591) 77409001</div>
      </div>
    </v-container>
  </v-navigation-drawer>

  <!-- Contenido -->
  <v-main class="bg-grey-lighten-5">
    <router-view />
  </v-main>
</template>

<script>
import { useUsuarioStore } from '@/stores/usuario';

export default {
  data: () => ({
    drawer: false,
    nombre: localStorage.nombre_usuario
  }),

  computed: {
    usuarioStore() {
      return useUsuarioStore();
    },

    isLogged() {
      return !!this.usuarioStore.token;
    },

    menuItems() {
      if (this.isLogged) {
        return [
          { title: 'Inicio', route: '/' },
          { title: 'Habitaciones', route: { name: 'habitaciones' } },
          { title: 'Perfil', route: { name: 'perfil-cliente' } },
          { title: 'Cerrar sesión', action: 'logout' },
        ]
      }

      return [
        { title: 'Inicio', route: '/' },
        { title: 'Habitaciones', route: { name: 'habitaciones' } },
        { title: 'Login', route: { name: 'login' } },
      ]
    }
  },

  methods: {
    handleClick(item) {
      this.drawer = false

      if (item.action === 'logout') {
        localStorage.clear()
        this.usuarioStore.logout();
        this.$router.push("/");
        this.$router.go(0)
        return
      }

      if (item.route) {
        this.$router.push(item.route)
      }
    }
  }
}
</script>


<style lang="scss" scoped>
.v-navigation-drawer {
  z-index: 2000 !important;
}
</style>
