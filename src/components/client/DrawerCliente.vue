<template>
  <v-navigation-drawer
    v-model="drawer"
    location="right"
    temporary
    width="300"
  >
    <v-container class="pt-6">

      <v-row justify="center">
        <v-avatar size="80">
          <img :src="auth.user?.foto || 'https://i.pravatar.cc/300'" />
        </v-avatar>
      </v-row>

      <h3 class="text-center mt-3">{{ auth.user?.nombre }}</h3>

      <v-divider class="my-4"></v-divider>

      <v-list density="comfortable">
        <v-list-item to="/cliente/reservas" prepend-icon="mdi-calendar-check">
          <v-list-item-title>Mis Reservas</v-list-item-title>
        </v-list-item>

        <v-list-item to="/cliente/pagos" prepend-icon="mdi-credit-card-outline">
          <v-list-item-title>Métodos de pago</v-list-item-title>
        </v-list-item>

        <v-list-item to="/cliente/soporte" prepend-icon="mdi-lifebuoy">
          <v-list-item-title>Soporte</v-list-item-title>
        </v-list-item>

        <v-divider class="my-4"></v-divider>

        <v-list-item @click="cerrarSesion" prepend-icon="mdi-logout">
          <v-list-item-title class="text-red">Cerrar sesión</v-list-item-title>
        </v-list-item>
      </v-list>

    </v-container>
  </v-navigation-drawer>
</template>

<script>
import { useAuthStore } from "@/stores/auth"

export default {
  name: "DrawerCliente",
  props: ["open"],
  setup() {
    const auth = useAuthStore()
    return { auth }
  },
  data() {
    return {
      drawer: false,
    }
  },
  watch: {
    open(val) {
      this.drawer = val
    },
    drawer(val) {
      this.$emit('update:open', val)
    }
  },
  methods: {
    cerrarSesion() {
      const auth = useAuthStore()
      auth.logout()
      this.drawer = false
      this.$router.push("/login")
    }
  }
}
</script>
