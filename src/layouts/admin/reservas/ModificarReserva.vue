<template>
  <v-sheet elevation="4">
    <v-tabs color="success" bg-color="primary" v-model="tab">
      <v-tab value="1">Modificar datos de Reserva</v-tab>
      <v-tab value="2">Cambiar Fecha de Reserva</v-tab>
    </v-tabs>

    <v-divider></v-divider>

    <v-tabs-window v-model="tab">

      <v-tabs-window-item value="1">
        <v-sheet class="pa-5">
          <CambiarDatosReserva :reserva="reserva" :items="items"/>
        </v-sheet>
      </v-tabs-window-item>

      <v-tabs-window-item value="2">
        <v-sheet class="pa-5">
          <CalendarioReservas :restriccion="restriccion" :restricciones="restricciones"
            @modificarFechasReserva="modificarReserva" />
        </v-sheet>
      </v-tabs-window-item>

    </v-tabs-window>
  </v-sheet>

  <!-- capa protectora de proceso -->
  <v-overlay :model-value="overlay" class="align-center justify-center" persistent>
    <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
  </v-overlay>
</template>

<script>
import { getRestrictions } from '@/services/restriccion.service';
import CalendarioReservas from './CalendarioReservas.vue';
import CambiarDatosReserva from './CambiarDatosReserva.vue';

import { modifyBooking } from '@/services/reserva.service';

import moment from 'moment'
import 'moment/locale/es'
moment.locale('es')

export default {

  props: {
    reserva: {
      type: Object,
      required: true
    }
  },
  components: {
    CalendarioReservas,
    CambiarDatosReserva,
  },
  data() {
    return {
      tab: '1',

      restriccion: {},
      restricciones: [],
      items: [
        // { title: 'PENDIENTE', value: 1 },
        // { title: 'EN PROCESO...', value: 2 },
        { title: 'CONFIRMADO', value: 3 },
        { title: 'CANCELADO', value: 4 }
      ],

      fecha_llegada: null,
      fecha_salida: null,
      total_estadia: 0,
      descuento_reserva: 0,
      total_reserva: 0,

      // paralizando pantalla
      overlay: false,
      errores: false,
    }
  },
  watch: {
    overlay(val) {
      val && setTimeout(() => {
        this.overlay = false
      }, 100000)
    },
  },
  methods: {
    async modificarReserva(item) {
      this.reserva.restriccion = item

      this.fecha_llegada = moment(item.fecha_inicial_restriccion).format('YYYY-MM-DD')
      this.fecha_salida = moment(item.fecha_final_restriccion).format('YYYY-MM-DD')

      const numero_noches = this.getNumberNights([this.fecha_llegada, this.fecha_salida])

      this.total_estadia = this.reserva.categoria.precio_ahora_categoria * numero_noches

      // 🔥 descuento en número (no string)
      const descuentoPorcentaje = Number(this.reserva.categoria.descuento_categoria) / 100

      if (numero_noches >= this.reserva.categoria.cant_noches_categoria) {
        this.descuento_reserva = Math.round(descuentoPorcentaje * this.total_estadia)
      } else {
        this.descuento_reserva = 0
      }

      this.total_reserva = (this.total_estadia - this.descuento_reserva) + Number(this.reserva.servicio_reserva)

      this.reserva.check_in_reserva = this.fecha_llegada
      this.reserva.check_out_reserva = this.fecha_salida
      this.reserva.total_estadia_reserva = this.total_estadia
      this.reserva.descuento_reserva = this.descuento_reserva
      this.reserva.monto_total_reserva = this.total_reserva

      try {
        this.$nextTick(async () => {
          // Simular login
          this.overlay = true;
          setTimeout(async () => {
            this.overlay = false

            let res = await modifyBooking(this.reserva)
            if (res.status == 200) {
              this.$swal({
                title: "Reserva Modificada!",
                text: `se ha modificado los datos de la reserva CORRECTAMENTE!!!`,
                icon: "success",
                timer: 2500,
                didClose: () => {
                  this.overlay = false
                  this.$router.go(0)
                }
              })
            }
          }, 1000);
          return true
        })
      } catch (error) {
        this.overlay = false  // <-- cerrar overlay ANTES del swal

        this.$swal({
          title: "Error!",
          text: error.response?.data?.error || "Ocurrió un error",
          icon: "error",
          timer: 1500
        })
      }
    },
    getNumberNights(rangeDates) {
      if (rangeDates.length > 1) {
        const fechaInicio = moment(rangeDates[0])
        const fechaFin = moment(rangeDates[1])
        // Diferencia en milisegundos
        const diferenciaMs = fechaFin - fechaInicio;
        // Convertir a días
        return (diferenciaMs / (1000 * 60 * 60 * 24));
      }
    },

    async obtenerRestricciones() {
      try {
        let res = await getRestrictions(this.reserva.habitacion.id_habitacion)
        if (res.status == 200 && res.data.data.length > 0) {
          const arreglo = res.data.data
          this.restriccion = arreglo.find(item => item.id_restriccion == this.reserva.restriccion.id_restriccion)
          this.restricciones = arreglo.filter(item => item.id_restriccion != this.reserva.restriccion.id_restriccion)
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
  mounted() {
    this.obtenerRestricciones()
  }
}
</script>

<style lang="scss" scoped></style>
