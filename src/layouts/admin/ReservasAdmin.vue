<template>
  <v-sheet elevation="4">
    <v-tabs color="success" bg-color="primary" v-model="tab">
      <v-tab :value="1"><v-icon class="mx-2" icon="mdi-calendar"> </v-icon> Reservas Activas</v-tab>
      <v-tab :value="2"><v-icon class="mx-2" icon="mdi-calendar-refresh"></v-icon> Liberar Reservas</v-tab>
      <v-tab :value="3"><v-icon class="mx-2" icon="mdi-calendar-start"></v-icon>Reservas Salientes</v-tab>
      <v-tab :value="4"><v-icon class="mx-2" icon="mdi-calendar-month"></v-icon>Historial Reservas</v-tab>
    </v-tabs>

    <v-divider></v-divider>


    <v-tabs-window v-model="tab">
      <!-- ####################################################################################################### -->
      <v-tabs-window-item :value="1">
        <ReservasActivas :reservasTipoUno="reservasTipoUno" />
      </v-tabs-window-item>
      <!-- ####################################################################################################### -->

      <v-tabs-window-item :value="2">
        <LiberarReservas :reservasTipoDos="reservasTipoDos"/>
      </v-tabs-window-item>

      <v-tabs-window-item :value="3">
        <ReservasSalientes :reservasTipoTres="reservasTipoTres"/>
      </v-tabs-window-item>

      <v-tabs-window-item :value="4">
        <HistorialReservas/>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-sheet>
</template>

<script>
import { getReservationsType } from '@/services/reserva.service';
import { useUsuarioStore } from '@/stores/usuario';
import ReservasActivas from './reservas/ReservasActivas.vue';
import LiberarReservas from './reservas/LiberarReservas.vue';
import ReservasSalientes from './reservas/ReservasSalientes.vue';
import HistorialReservas from './reservas/HistorialReservas.vue';

export default {
  name: "ReservasAdmin",
  components: {
    ReservasActivas,
    LiberarReservas,
    ReservasSalientes,
    HistorialReservas
  },
  data() {
    return {
      tab: 1,
      usuario: {},
      reservasTipoUno: [],
      reservasTipoDos: [],
      reservasTipoTres: [],
    }
  },

  methods: {

    async obtenerReservas1() {
      try {
        const usuarioStore = useUsuarioStore()
        this.usuario = usuarioStore.usuario

        let res = await getReservationsType(this.usuario.id_usuario, 1)
        if (res.status == 201 && res.data.data.length > 0) {
          this.reservasTipoUno = res.data.data
        }
      } catch (error) {
        console.log(error)
      }
    },

    async obtenerReservas2() {
      try {
        const usuarioStore = useUsuarioStore()
        this.usuario = usuarioStore.usuario

        let res = await getReservationsType(this.usuario.id_usuario, 2)
        if (res.status == 201 && res.data.data.length > 0) {
          this.reservasTipoDos = res.data.data
        }
      } catch (error) {
        console.log(error)
      }
    },

    async obtenerReservas3() {
      try {
        const usuarioStore = useUsuarioStore()
        this.usuario = usuarioStore.usuario

        let res = await getReservationsType(this.usuario.id_usuario, 3)
        if (res.status == 201 && res.data.data.length > 0) {
          this.reservasTipoTres = res.data.data
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
  mounted() {
    this.obtenerReservas1()
    this.obtenerReservas2()
    this.obtenerReservas3()
  },
};
</script>

<style lang="scss" scoped></style>
