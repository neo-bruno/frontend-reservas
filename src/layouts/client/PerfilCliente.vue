<template>
  <v-container class="py-8">

    <h2 class="text-h5 mb-6 font-weight-bold">
      Bienvenido, {{ user?.nombre_usuario }}
    </h2>

    <v-row dense>
      <v-col v-for="op in opciones" :key="op.label" cols="6" sm="4" md="3">
        <v-card class="pa-4 d-flex flex-column align-center justify-center text-center rounded-lg" elevation="6"
          @click="goTo(op.to)" style="cursor: pointer;">
          <v-icon size="40" class="mb-2">
            {{ op.icon }}
          </v-icon>

          <span class="text-subtitle-2 font-weight-medium">
            {{ op.label }}
          </span>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import { useUsuarioStore } from '@/stores/usuario'

export default {
  name: "ClientePerfil",

  data() {
    return {
      usuarioStore: useUsuarioStore(),
      opciones: [
        {
          label: "Mis Reservas",
          icon: "mdi-calendar-check-outline",
          to: "/cliente/reservas",
        },
        {
          label: "Mi Historial",
          icon: "mdi-history",
          to: "/cliente/historial",
        },
        {
          label: "Mi Perfil",
          icon: "mdi-account-circle-outline",
          to: "/cliente/datos",
        },
      ],
    };
  },

  computed: {
    user() {
      return this.usuarioStore.usuario
    },
  },

  methods: {
    goTo(ruta) {
      this.$router.push(ruta);
    },
    logout() {
      this.usuarioStore.logout()

      localStorage.removeItem('token')
      localStorage.removeItem('rol')

      // this.$router.replace('/')
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.v-card:hover {
  transform: scale(1.05);
  transition: 0.15s ease-in-out;
}
</style>
