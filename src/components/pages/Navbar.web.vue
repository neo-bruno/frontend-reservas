<template>
  <div>
    <!-- AppBar superior -->
    <v-app-bar color="primary" dark>
      <!-- Ícono hamburguesa solo visible en móvil -->
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-sm-none" />

      <v-toolbar-title>{{ titulo }}</v-toolbar-title>


      <!-- Botones visibles solo en escritorio -->
      <div class="d-none d-sm-flex">
        <template v-if="esCliente">
          <v-btn class="me-2" text to="/cliente">Inicio</v-btn>
          <v-btn class="me-2" text to="/cliente/reservas">Mis Reservas</v-btn>
          <v-btn class="me-2" text to="/cliente/perfil">Perfil</v-btn>
          <v-btn class="me-2" text @click="logout">Cerrar sesión</v-btn>
        </template>
      </div>
    </v-app-bar>

    <!-- Drawer lateral para móvil -->
    <v-navigation-drawer v-model="drawer" temporary location="left" class="d-sm-none">
      <v-list v-if="esCliente">
        <v-list-item to="/cliente" @click="drawer = false">
          <v-list-item-title>Inicio</v-list-item-title>
        </v-list-item>
        <v-list-item to="/cliente/reservas" @click="drawer = false">
          <v-list-item-title>Mis Reservas</v-list-item-title>
        </v-list-item>
        <v-list-item to="/cliente/perfil" @click="drawer = false">
          <v-list-item-title>Perfil</v-list-item-title>
        </v-list-item>
        <v-list-item @click="cerrarSesion">
          <v-list-item-title>Cerrar sesión</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  props: {
    tipo: {
      type: String,
      default: 'publico',
    },
    titulo: {
      type: String,
      default: 'Hotel',
    },
  },
  data() {
    return {
      drawer: false,
    }
  },
  computed: {
    esCliente() {
      return !!localStorage.getItem("token");
    }
  },
  methods: {
    cerrarSesion() {
      this.drawer = false
      this.logout()
    },
    logout() {
      localStorage.clear()
      this.$router.push('/')
      // this.$router.go(0)
    },
  },
}
</script>
