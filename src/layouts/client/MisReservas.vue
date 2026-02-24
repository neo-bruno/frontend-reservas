<template>
  <v-container>
    <div class="d-flex justify-space-between">
      <h2>Mis Reservas</h2>
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
          <td class="text-decoration-underline text-info cursor-pointer" style="font-size: .8rem;">{{
            item.habitacion.nombre_habitacion }} ({{
              item.habitacion.categoria ? item.habitacion.categoria.nombre_categoria : '' }})</td>
          <td><v-chip style="font-size: .9rem;" color="yellow" variant="elevated">{{ fechaLiteral(item.check_in_reserva)
              }}</v-chip></td>
          <td><v-chip style="font-size: .9rem;" color="yellow" variant="elevated">{{
            fechaLiteral(item.check_out_reserva)
          }}</v-chip></td>
          <td
            :class="item.estado_reserva == 1 ? 'text-info' : item.estado_reserva == 2 ? 'text-warning' : item.estado_reserva == 3 ? 'text-success' : item.estado_reserva == 4 ? 'text-error' : item.estado_reserva == 5 ? 'text-info' : 'text-primary'">
            {{ item.estado_reserva == 1 ? 'PENDIENTE' : item.estado_reserva == 2 ? 'EN PROCESO...' : item.estado_reserva
              == 3 ? 'CONFIRMADO' : item.estado_reserva == 4 ? 'CANCELADO' : item.estado_reserva == 5 ? 'LLEGO' : 'NO LLEGO'}}
          </td>
          <td class="text-center d-flex justify-space-evenly">
            <v-btn size="34" density="compact" color="primary" small @click="abrirDialogoOpciones(item)"
              icon="mdi-application-edit-outline"></v-btn>
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

      <v-toolbar class="text-center font-weight-medium text-wrap bg-primary" title="Informacion - Reserva"></v-toolbar>

      <v-card-text class="px-0 py-0">
        <VerReserva :reserva="reserva" />
      </v-card-text>

      <v-card-actions class="justify-end bg-primary">
        <v-btn variant="elevated" color="red" @click="cerrarDialogVerReserva">Cerrar</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>

  <!-- dialogo para elejir opcion -->
  <v-dialog v-model="dialogo_opciones" transition="dialog-bottom-transition" :fullscreen="$vuetify.display.xs"
    :max-width="$vuetify.display.xs ? undefined : 470" persistent scrollable>
    <v-card class="px-0">

      <v-toolbar class="text-center font-weight-medium text-wrap bg-primary" title="Ver Opciones"></v-toolbar>

      <v-card-text class="px-0 py-0">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-btn color="grey-lighten-1" block prepend-icon="mdi-calendar" @click="cambiarDialogo(1)">cambiar
                fechas</v-btn>
            </v-col>
            <v-col cols="12">
              <v-btn color="grey-lighten-1" block prepend-icon="mdi-pencil" @click="cambiarDialogo(2)">editar
                reserva</v-btn>
            </v-col>
            <v-col v-if="reserva.pago && reserva.pago.id_pago <= 0" cols="12">
              <v-btn color="success" block prepend-icon="mdi-check" @click="cambiarDialogo(3)">confirmar reserva</v-btn>
            </v-col>
            <v-col cols="12">
              <v-btn color="error" block prepend-icon="mdi-cancel" @click="cambiarDialogo(4)">cancelar reserva</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="elevated" color="primary" @click="cerrarDialogOpciones">Cerrar</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>

  <!-- dialogo para cambiar las fecha de reserva -->
  <v-dialog v-model="dialogo_cambiar_fechas" transition="dialog-bottom-transition" :fullscreen="$vuetify.display.xs"
    :max-width="$vuetify.display.xs ? undefined : 470" persistent scrollable>
    <v-card class="px-0">

      <v-toolbar class="text-center font-weight-medium text-wrap bg-primary"
        title="Modificar Fechas de Reserva"></v-toolbar>

      <v-card-text class="px-0 py-0">
        <v-container>
          <v-row>
            <v-col cols="12">
              <CalendarioReservas :restriccion="reserva.restriccion" :restricciones="restricciones"
                @modificarFechasReserva="dialogo_mensaje = true" />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn v-if="!cambiar_fechas" variant="elevated" color="primary" prepend-icon="mdi-cancel"
          @click="cerrarDialogoFechas">Salir</v-btn>
        <v-btn v-else variant="elevated" color="success" prepend-icon="mdi-calendar-refresh"
          @click="modificarRangoFechas">Cambiar Fechas</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>

  <!-- dialogo para mostrar el mensaje de cambiar la fecha -->
  <v-dialog v-model="dialogo_mensaje" transition="dialog-bottom-transition" :fullscreen="$vuetify.display.xs"
    :max-width="$vuetify.display.xs ? undefined : 470" persistent scrollable>
    <v-card class="px-0">

      <v-toolbar class="text-center font-weight-medium text-wrap bg-primary"
        title="Mensaje de Solicitud"></v-toolbar>

      <v-card-text class="px-0 py-0">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-card>
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      Lo siento esta opcion se ha deshabilitado, para cambiar la fecha de su reserva, debe contactarse con el Hotel para solicitar su cambio de fecha. muchas gracias!
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="elevated" color="red" prepend-icon="mdi-cancel"
          @click="dialogo_mensaje = false">Salir</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>

  <!-- dialogo modificar datos de la reserva -->
  <v-dialog v-model="dialogo_editar_reserva" transition="dialog-bottom-transition" :fullscreen="$vuetify.display.xs"
    :max-width="$vuetify.display.xs ? undefined : 470" persistent scrollable>
    <v-card class="px-0">

      <v-toolbar class="text-center font-weight-medium text-wrap bg-primary"
        title="Modificar Datos de Reserva"></v-toolbar>

      <v-card-text class="px-0 py-0">
        <ModificarDatosReserva :reserva="reserva" />
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="elevated" color="primary" prepend-icon="mdi-cancel"
          @click="cerrarDialogoModificarReserva">Salir</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>

  <!-- dialogo para realizar el pago x QR -->
  <v-dialog v-model="dialogo_pagar_reserva" transition="dialog-bottom-transition" :fullscreen="$vuetify.display.xs"
    :max-width="$vuetify.display.xs ? undefined : 470" persistent scrollable>
    <v-card class="px-0">

      <v-toolbar class="text-center font-weight-medium text-wrap bg-primary"
        title="Confirma con un Pago x QR"></v-toolbar>

      <v-card-text class="px-0 py-0">
        <PagarPorQr :reserva="reserva" :montos="montos" />
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="elevated" color="primary" prepend-icon="mdi-cancel"
          @click="cerrarDialogoPagarReserva">Salir</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>

  <!-- dialogo para Cancelar la reserva -->
  <v-dialog v-model="dialogo_cancelar_reserva" transition="dialog-bottom-transition" :fullscreen="$vuetify.display.xs"
    :max-width="$vuetify.display.xs ? undefined : 470" persistent scrollable>
    <v-card class="px-0">

      <v-toolbar class="text-center font-weight-medium text-wrap bg-primary" title="Cancelar la reserva"></v-toolbar>

      <v-card-text>
        <div class="mb-6" style="font-size: 1.5rem;">
          ¿Esta seguro que desea cancelar la reserva? <br>
          con el codigo: <strong>{{ reserva.codigo_reserva }}</strong> <br>
        </div>

        <div class="text-body-2 font-weight-medium">Datos de Reserva</div>
        <div class="text-caption text-grey-darken-2">
          <span>codigo: </span>
          <span class="px-2 text-primary text-capitalize font-weight-medium">{{ reserva.codigo_reserva }}</span>
        </div>
        <div class="text-caption text-grey-darken-2">
          <span>nombre titular: </span>
          <span class="px-2 text-primary text-capitalize font-weight-medium">{{ reserva.usuario.nombre_usuario }}</span>
        </div>
        <div class="text-caption text-grey-darken-2">
          <span>Telefono: </span>
          <span class="px-2 text-primary text-capitalize font-weight-medium">({{ reserva.usuario.codigo_pais_usuario }})
            {{ reserva.usuario.telefono_usuario }}</span>
        </div>

        <v-divider class="my-3"></v-divider>

        <div class="text-caption text-grey-darken-2">
          <span>Check In: </span>
          <span class="px-2 text-primary text-capitalize font-weight-medium">{{ fechaLiteral(reserva.check_in_reserva)
          }}</span>
        </div>
        <div class="text-caption text-grey-darken-2">
          <span>Check Out: </span>
          <span class="px-2 text-primary text-capitalize font-weight-medium">{{ fechaLiteral(reserva.check_out_reserva)
          }}</span>
        </div>
        <div class="text-caption text-grey-darken-2">
          <span>Dias: </span>
          <span class="px-2 text-primary text-capitalize font-weight-medium">{{
            getNumberNights([reserva.check_in_reserva, reserva.check_out_reserva]) }}</span> noche(s)
        </div>

        <v-divider class="my-3"></v-divider>

        <div class="text-caption text-grey-darken-2">
          <span>Habitacion: </span>
          <span class="px-2 text-primary text-capitalize font-weight-medium">{{ reserva.habitacion.nombre_habitacion
          }}</span>
        </div>
        <div class="text-caption text-grey-darken-2">
          <span>Tipo: </span>
          <span class="px-2 text-primary text-capitalize font-weight-medium">{{
            reserva.habitacion.categoria.nombre_categoria }}</span>
        </div>

      </v-card-text>

      <v-card-actions class="d-flex justify-space-between">
        <v-btn variant="elevated" color="primary" prepend-icon="mdi-cancel"
          @click="cerrarDialogoCancelarReserva">Salir</v-btn>
        <v-btn variant="elevated" color="error" prepend-icon="mdi-check" @click="cancelarReserva">Si, Cancelar</v-btn>
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
import CalendarioHabitacion from '@/components/pages/habitacion/calendario/CalendarioHabitacion.vue';
import CalendarioReservas from '../admin/reservas/CalendarioReservas.vue';
import ModificarDatosReserva from './reservas/ModificarDatosReserva.vue';
import VerReserva from './reservas/VerReserva.vue';
import PagarPorQr from './reservas/PagarPorQr.vue';

import moment from 'moment'
import 'moment/locale/es'
import { getRestrictions, modifyRestriction } from '@/services/restriccion.service';
import { getBusiness } from '@/services/negocio.service';

export default {
  components: {
    VerReserva,
    CalendarioHabitacion,
    CalendarioReservas,
    ModificarDatosReserva,
    PagarPorQr,
  },
  data() {
    return {
      negocio: {},

      reserva: {},
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
      dialogo_opciones: false,

      dialogo_cambiar_fechas: false,
      cambiar_fechas: false,

      dialogo_editar_reserva: false,
      dialogo_pagar_reserva: false,
      dialogo_cancelar_reserva: false,

      // dialogo para ver la reserva
      dialogo_ver_reserva: false,

      dialogo_mensaje: false,

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
      console.log(numeroCompleto)
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
        let res = await reservasActivasInactivas(this.usuario.id_usuario, 'reservas_activas')
        if (res.status == 201 && res.data.data.length > 0) {
          this.reservas = res.data.data
        }
      } catch (error) {
        console.log(error)
      }
    },
    async obtenerRestricciones() {
      try {
        this.restricciones = []
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
    abrirDialogoOpciones(reserva) {
      this.reserva = reserva
      if (reserva.estado_reserva != 4)
        this.dialogo_opciones = true
      else {
        this.$swal({
          title: "Reserva Cancelada!",
          text: `La reserva ha sido cancelado, por eso no se mostrara ninguna opcion!`,
          icon: "error",
          timer: 4000,
          didClose: () => {
            this.overlay = false
          }
        })
      }
    },
    cerrarDialogOpciones() {
      this.dialogo_opciones = false
    },
    async cambiarDialogo(numero) {
      switch (numero) {
        case 1:
          this.dialogo_opciones = false
          await this.obtenerRestricciones()
          break

        case 2:
          this.dialogo_opciones = false
          this.dialogo_editar_reserva = true
          break

        case 3:
          this.dialogo_opciones = false
          this.dialogo_pagar_reserva = true
          break

        case 4:
          this.dialogo_opciones = false
          this.dialogo_cancelar_reserva = true
          break
      }
    },

    // dialogo para cambiar fechas
    cambiarFechasReserva(item) {
      const fecha_llegada = item.fecha_inicial_restriccion
      const fecha_salida = item.fecha_final_restriccion
      const numero_noches = this.getNumberNights([fecha_llegada, fecha_salida])
      let descuento_reserva = 0

      const total_estadia = this.reserva.habitacion.categoria.precio_ahora_categoria * numero_noches

      const descuento = parseFloat((this.reserva.habitacion.categoria.descuento_categoria / 100)).toFixed(2)

      if (numero_noches >= this.reserva.habitacion.categoria.cant_noches_categoria)
        descuento_reserva = parseFloat(descuento * total_estadia).toFixed(0)

      const total_reserva = (total_estadia - descuento_reserva) + this.reserva.servicio_reserva

      this.reserva.check_in_reserva = fecha_llegada
      this.reserva.check_out_reserva = fecha_salida
      this.reserva.total_estadia_reserva = total_estadia
      this.reserva.descuento_reserva = descuento_reserva
      this.reserva.monto_total_reserva = total_reserva

      this.reserva.restriccion.fecha_inicial_restriccion = fecha_llegada
      this.reserva.restriccion.fecha_final_restriccion = fecha_salida

      try {
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
                  this.reserva.restriccion.estado_restriccion = 2
                  const resp = await modifyRestriction(this.reserva.restriccion)
                  if (resp.status == 200)
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
