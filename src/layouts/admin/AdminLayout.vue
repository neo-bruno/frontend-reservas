<template>
  <v-app>
    <!-- Drawer lateral -->
    <v-navigation-drawer app v-model="drawer" color="white" :width="250">
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-img :width="300" aspect-ratio="16/9" cover src="@/assets/logo.jpg"></v-img>
            <div class="text-h5 text-center font-weight-light">Hotel Familia Felipez</div>
          </v-col>
        </v-row>
      </v-container>
      <v-list density="compact">

        <!-- Dashboard -->
        <v-list-item :to="'/admin'" link>
          <v-list-item-title> <v-icon class="mr-2">mdi-view-dashboard</v-icon> Dashboard</v-list-item-title>
        </v-list-item>

        <!-- Reservas -->
        <v-list-item :to="'/admin/reservas'" link>
          <v-list-item-title> <v-icon class="mr-2">mdi-calendar-check</v-icon> Reservas</v-list-item-title>
        </v-list-item>

        <!-- Pagina -->
        <v-list-group>

          <template #activator="{ props }">
            <v-list-item v-bind="props">
              <v-list-item-title> <v-icon class="mr-2">mdi-web</v-icon> Pagina</v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item :to="'/admin/principal'" link>
            <v-list-item-title><v-icon class="mr-2">mdi-page-layout-header</v-icon> Principal</v-list-item-title>
          </v-list-item>

          <v-list-item :to="'/admin/nosotros'" link>
            <v-list-item-title><v-icon class="mr-2">mdi-page-layout-body</v-icon> Nosotros</v-list-item-title>
          </v-list-item>

          <v-list-item :to="'/admin/serviciosweb'" link>
            <v-list-item-title><v-icon class="mr-2">mdi-page-layout-header-footer</v-icon> Servicios</v-list-item-title>
          </v-list-item>

          <v-list-item :to="'/admin/caracteristicas'" link>
            <v-list-item-title> <v-icon class="mr-2">mdi-view-list</v-icon> Caracteristicas</v-list-item-title>
          </v-list-item>

          <v-list-item :to="'/admin/testimonios'" link>
            <v-list-item-title> <v-icon class="mr-2">mdi-account-box-multiple</v-icon> Testimonios</v-list-item-title>
          </v-list-item>

          <v-list-item :to="'/admin/piePagina'" link>
            <v-list-item-title> <v-icon class="mr-2">mdi-page-layout-footer</v-icon> Pie Pagina</v-list-item-title>
          </v-list-item>

        </v-list-group>
        <!-- <v-list-item :to="'/admin/paginaweb'" link>
          <v-list-item-title> <v-icon class="mr-2">mdi-web</v-icon> Pagina</v-list-item-title>
        </v-list-item> -->

        <!-- Servicios -->
        <v-list-item :to="'/admin/servicios'" link>
          <v-list-item-title> <v-icon class="mr-2">mdi-room-service</v-icon> Servicios</v-list-item-title>
        </v-list-item>

        <!-- ============================= -->
        <!--      GRUPO HABITACIONES      -->
        <!-- ============================= -->
        <v-list-group>

          <template #activator="{ props }">
            <v-list-item v-bind="props">
              <v-list-item-title> <v-icon class="mr-2">mdi-bed</v-icon> Habitación</v-list-item-title>
            </v-list-item>
          </template>

          <v-list-item :to="'/admin/nivel-habitacion'" link>
            <v-list-item-title><v-icon class="mr-2">mdi-floor-plan</v-icon> Niveles</v-list-item-title>
          </v-list-item>

          <v-list-item :to="'/admin/tipo-habitacion'" link>
            <v-list-item-title><v-icon class="mr-2">mdi-tag</v-icon> Categorías</v-list-item-title>
          </v-list-item>

          <v-list-item :to="'/admin/cama-habitacion'" link>
            <v-list-item-title><v-icon class="mr-2">mdi-bed-king</v-icon> Camas</v-list-item-title>
          </v-list-item>

          <v-list-item :to="'/admin/habitaciones'" link>
            <v-list-item-title> <v-icon class="mr-2">mdi-door</v-icon> Habitaciones</v-list-item-title>
          </v-list-item>

        </v-list-group>
        <!-- ============================= -->

        <!-- Negocio -->
        <v-list-item :to="'/admin/negocios'" link>
          <v-list-item-title> <v-icon class="mr-2">mdi-home-city</v-icon> Hotel</v-list-item-title>
        </v-list-item>

      </v-list>
    </v-navigation-drawer>

    <!-- Barra superior -->
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>Admin Panel</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Contenido principal -->
    <v-main class="bg-grey-lighten-5 bg-secondary">
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { useUsuarioStore } from '@/stores/usuario';

export default {
  name: "AdminLayout",
  data: () => ({
    drawer: true,
  }),
  computed: {
    usuarioStore() {
      return useUsuarioStore();
    },
  },
  methods: {
    logout() {
      this.usuarioStore.logout();
      localStorage.clear()
      this.$router.push({ name: 'pagina' });
      // this.$router.go(0)
    },
  },
};
</script>

<style scoped>
.v-application .v-main {
  min-height: 100vh;
}
</style>
