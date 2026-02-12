<template>
  <v-container>
    <div class="d-flex justify-space-between">
      <h2 class="text-primary">Mi Historial</h2>
      <v-btn variant="flat" density="compact" color="success" prepend-icon="mdi-undo" @click="volverAtras">atras</v-btn>
    </div>
    <v-table class="tabla-custom" density="compact" hover>
      <thead>
        <tr>
          <!-- <th class="text-center">N°</th> -->
          <th class="text-center">Codigo</th>
          <th class="text-center">Habitacion</th>
          <th class="text-center">Check In</th>
          <th class="text-center">Check Out</th>
          <th class="text-center">Estado</th>
          <th class="text-center">Accion</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, i) in reservas" :key="i" class="text-center">
          <td class="text-center font-weight-bold text-decoration-underline cursor-pointer"
            @click="abrirDialogoVerReserva(item)">{{ item.codigo_reserva }}</td>
          <td class="text-decoration-underline font-weight-medium cursor-pointer" style="font-size: .8rem;">{{
            item.habitacion.nombre_habitacion }} ({{
              item.habitacion.categoria ? item.habitacion.categoria.nombre_categoria : '' }})</td>
          <td><v-chip style="font-size: .9rem;" color="yellow" variant="elevated">{{ fechaLiteral(item.check_in_reserva)
              }}</v-chip></td>
          <td><v-chip style="font-size: .9rem;" color="yellow" variant="elevated">{{
            fechaLiteral(item.check_out_reserva)
          }}</v-chip></td>
          <td
            :class="item.estado_reserva == 1 ? 'text-info' : item.estado_reserva == 2 ? 'text-yellow' : item.estado_reserva == 3 ? 'text-success' : item.estado_reserva == 4 ? 'text-error' : item.estado_reserva == 5 ? 'text-indigo' : 'text-primary'">
            {{ item.estado_reserva == 1 ? 'PENDIENTE' : item.estado_reserva == 2 ? 'EN PROCESO...' : item.estado_reserva
              == 3 ? 'CONFIRMADO' : item.estado_reserva == 4 ? 'CANCELADO' : item.estado_reserva == 5 ? 'LLEGASTE' :
            'FALTASTE'}}
          </td>
          <td class="text-center">
            <v-btn v-if="item.estado_reserva != 6" size="34" density="compact" color="primary" small
              @click="abrirDialogoResena(item)" icon="mdi-comment-edit"></v-btn>
            <v-btn size="34" density="compact" color="success" small :href="whatsappLink(item)" target="_blank"
              icon="mdi-whatsapp"></v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

  </v-container>

  <!-- dialogo para ver la reserva -->
  <v-dialog v-model="dialogo_ver_reserva" transition="dialog-bottom-transition" :fullscreen="$vuetify.display.xs"
    :max-width="$vuetify.display.xs ? undefined : 470" persistent scrollable>
    <v-card class="px-0">

      <v-toolbar class="text-center font-weight-medium text-wrap bg-primary" title="Tu Reserva"></v-toolbar>

      <v-card-text class="px-0 py-0">
        <VerReserva :reserva="reserva" />
      </v-card-text>

      <v-card-actions class="justify-end bg-primary">
        <v-btn variant="elevated" color="red" @click="cerrarDialogVerReserva">Cerrar</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>

  <!-- dialogo para mostrar resena -->
  <v-dialog v-model="dialogo_resena" transition="dialog-bottom-transition" :fullscreen="$vuetify.display.xs"
    :max-width="$vuetify.display.xs ? undefined : 470" persistent scrollable>
    <v-card class="px-0">

      <v-toolbar class="text-center font-weight-medium text-wrap bg-primary" title="Escribenos tu Opinion"></v-toolbar>

      <v-card-text class="px-0 py-0">
        <ResenaHabitacion :reserva="reserva" />
      </v-card-text>

      <v-card-actions class="justify-end bg-primary">
        <v-btn variant="elevated" color="red" @click="cerrarDialogoResena">Cerrar</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>

  <!-- capa protectora de proceso -->
  <v-overlay :model-value="overlay" class="align-center justify-center" persistent>
    <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
  </v-overlay>
</template>

<script>
import { modifyBooking, reservasActivasInactivas } from '@/services/reserva.service';
import { useUsuarioStore } from '@/stores/usuario';
import VerReserva from './reservas/VerReserva.vue';
import ResenaHabitacion from './reservas/ResenaHabitacion.vue';

import moment from 'moment'
import 'moment/locale/es'
import { getRestrictions } from '@/services/restriccion.service';
import { getBusiness } from '@/services/negocio.service';

export default {
  components: {
    VerReserva,
    ResenaHabitacion,
  },
  data() {
    return {
      reserva: {},
      negocio: {},
      montos: {
        comision: 100,
        unaNoche: 250,
        total: 750
      },

      fecha_llegada: '',
      fecha_salida: '',
      total_estadia: 0,
      descuento_reserva: 0,
      total_reserva: 0,

      reservas: [],
      usuario: {},
      restricciones: [],

      // dialogo para selccionar una opcion
      dialogo_resena: false,

      dialogo_cambiar_fechas: false,
      cambiar_fechas: false,

      dialogo_editar_reserva: false,
      dialogo_pagar_reserva: false,
      dialogo_cancelar_reserva: false,

      // dialogo para ver la reserva
      dialogo_ver_reserva: false,

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
    volverAtras() {
      this.$router.go(-1)
    },
    fechaLiteral(fecha) {
      return moment(fecha, 'YYYY-MM-DD').format('ddd, DD-MMM-YYYY')
    },
    fechasLiterales(checkIn, checkOut) {
      const opciones = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }

      const entrada = new Date(checkIn).toLocaleDateString("es-ES", opciones)
      const salida = new Date(checkOut).toLocaleDateString("es-ES", opciones)

      return `${entrada} - ${salida}`
    },
    whatsappLink(reserva) {
      const numeroCompleto = `${this.negocio.codigo_celular_negocio}`.replace(/\D/g, '')
      
      const mensaje = `
        Hola ${this.negocio?.nombre_negocio},

        Le escribo respecto a mi reserva:

        📅 ${this.fechasLiterales(reserva.check_in_reserva, reserva.check_out_reserva)}
        🧾 Código: ${reserva.codigo_reserva}

        Espero su pronta respuesta, muchas gracias.
        `
      return `https://wa.me/${numeroCompleto}?text=${encodeURIComponent(mensaje)}`
    },
    async obtenerReservas() {
      try {
        const usuarioStore = useUsuarioStore()
        this.usuario = usuarioStore.usuario
        let res = await reservasActivasInactivas(this.usuario.id_usuario, 'reservas_inactivas')
        if (res.status == 201 && res.data.data.length > 0) {
          this.reservas = res.data.data
        }
      } catch (error) {
        console.log(error)
      }
    },
    async obtenerRestricciones() {
      try {
        let res = await getRestrictions(this.reserva.habitacion.id_habitacion)
        if (res.status == 200 && res.data.data.length > 0) {
          const arreglo = res.data.data
          this.restricciones = arreglo.filter(item => item.id_restriccion != this.reserva.restriccion.id_restriccion)
          this.dialogo_cambiar_fechas = true
        }
      } catch (error) {
        console.log(error)
      }
    },

    // dialogo para ver reserva
    abrirDialogoVerReserva(item) {
      this.reserva = item
      this.dialogo_ver_reserva = true
    },
    cerrarDialogVerReserva() {
      this.dialogo_ver_reserva = false
    },

    // dialogo para ver opciones
    abrirDialogoResena(reserva) {
      this.reserva = reserva
      this.dialogo_resena = true
    },
    cerrarDialogoResena() {
      this.dialogo_resena = false
    },

    // dialogo para cambiar fechas
    cerrarDialogoFechas() {
      this.borrarRangoFechas()
      this.dialogo_cambiar_fechas = false
    },
    async modificarRangoFechas() {
      try {
        this.reserva.check_in_reserva = this.fecha_llegada
        this.reserva.check_out_reserva = this.fecha_salida
        this.reserva.total_estadia_reserva = this.total_estadia
        this.reserva.descuento_reserva = this.descuento_reserva
        this.reserva.monto_total_reserva = this.total_reserva

        this.reserva.restriccion.fecha_inicial_restriccion = this.fecha_llegada
        this.reserva.restriccion.fecha_final_restriccion = this.fecha_salida

        this.$nextTick(async () => {
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
            } else {
              this.$swal({
                title: "Error!",
                text: `hay un error al modificar los datos!`,
                icon: "error",
                timer: 2500,
                didClose: () => {
                  this.overlay = false
                }
              })
            }
          }, 1000);
        })
      } catch (error) {
        this.overlay = false  // <-- cerrar overlay ANTES del swal
        console.log(error)
        this.$swal({
          title: "Error!",
          text: error.response?.data?.error || "Ocurrió un error",
          icon: "error",
          timer: 1500
        })
      }
    },
    rangoFechas(fechas) {
      this.fecha_llegada = moment(fechas[0]).format('YYYY-MM-DD')
      this.fecha_salida = moment(fechas[1]).format('YYYY-MM-DD')
      const numero_noches = this.getNumberNights(fechas)

      this.total_estadia = this.reserva.habitacion.categoria.precio_ahora_categoria * numero_noches

      const descuento = parseFloat((this.reserva.habitacion.categoria.descuento_categoria / 100)).toFixed(2)

      if (numero_noches >= this.reserva.habitacion.categoria.cant_noches_categoria)
        this.descuento_reserva = parseFloat(descuento * this.total_estadia).toFixed(0)
      else
        this.descuento_reserva = 0
      this.total_reserva = (this.total_estadia - this.descuento_reserva) + this.reserva.servicio_reserva

      this.cambiar_fechas = true
    },
    borrarRangoFechas() {
      this.fecha_llegada = ''
      this.fecha_salida = ''
      this.total_estadia = 0
      this.descuento_reserva = 0
      this.total_reserva = 0
    },
    fechasAnuladas() {
      this.cambiar_fechas = false
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

    // dialogo para modificar datos de la reserva
    cerrarDialogoModificarReserva() {
      this.dialogo_editar_reserva = false
    },

    // dialogo para confirmar reserva
    cerrarDialogoPagarReserva() {
      this.dialogo_pagar_reserva = false
    },

    // dialogo para cancelar la reserva
    cerrarDialogoCancelarReserva() {
      this.dialogo_cancelar_reserva = false
    },
    async cancelarReserva() {
      try {
        this.$swal({
          title: "¿Estas seguro que quieres cancelar la reserva?",
          icon: 'error',
          showCancelButton: true,
          confirmButtonText: "Si, quiero",

        }).then((result) => {
          if (result.isConfirmed) {
            this.reserva.estado_reserva = 4
            this.$nextTick(async () => {
              // Simular login
              this.overlay = true;
              setTimeout(async () => {
                this.overlay = false

                let res = await modifyBooking(this.reserva)
                if (res.status == 200) {
                  this.$swal({
                    title: "Reserva Cancelada!",
                    text: `se ha cancelado la reserva CORRECTAMENTE!!!`,
                    icon: "success",
                    timer: 2500,
                    didClose: () => {
                      this.overlay = false
                      this.$router.go(0)
                    }
                  })
                } else {
                  this.$swal({
                    title: "Error!",
                    text: `No puede estar vacio el campo requerido`,
                    icon: "error",
                    timer: 2500,
                    didClose: () => {
                      this.overlay = false
                      this.setfocus('nombre_servicio')
                    }
                  })
                }
              }, 1000);
            })
          }
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
    async obtenerNegocio() {
      try {
        const res = await getBusiness(1)
        if (res.status == 201) {
          this.negocio = res.data.data[0]
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
  mounted() {
    this.obtenerReservas()
    this.obtenerNegocio()
  }
}
</script>
<style scoped>
/* ==== ESTILO DE TABLA PERSONALIZADO ==== */

.tabla-custom thead {
  background: #242322ff;
  /* Azul tipo Hotel ARC */
  color: white;
}

.tabla-custom th {
  padding: 10px;
  font-weight: bold;
  border-bottom: 2px solid #242322ff;
}

.tabla-custom td {
  padding: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.tabla-custom tbody tr:hover {
  background-color: #f1f5f9;
}
</style>
