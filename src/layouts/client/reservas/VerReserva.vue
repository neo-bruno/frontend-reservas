<template>

  <v-container>

    <v-row justify="center">
      <!-- Columna izquierda mejorada -->
      <v-col cols="12">
        <v-card elevation="2" class="pa-4 rounded-xl">
          <v-row no-gutters>
            <v-col cols="5">
              <v-img :src="imagenPrincipal" class="rounded-lg" height="120" cover></v-img>
            </v-col>
            <v-col cols="7" class="pl-3 d-flex flex-column justify-center">
              <div class="text-subtitle-2 font-weight-medium">
                {{ reserva.habitacion.nombre_habitacion }} - {{ reserva.habitacion.categoria.nombre_categoria }}
              </div>
              <div class="text-caption text-grey-darken-1">
                {{ reserva.habitacion.categoria.descripcion_categoria }}
              </div>
            </v-col>
          </v-row>

          <v-divider class="mt-3"></v-divider>

          <div class="mt-2">
            <!-- <div class="text-left text-h5 pb-2">Camas en la Habitacion</div> -->
            <div class="d-flex justify-space-between" v-for="habitacion_cama in reserva.habitacion.habitacion_camas"
              :key="habitacion_cama.id_cama" style="font-size: .8rem;">
              <div>
                <v-icon>mdi-bed</v-icon> - <span class="text-uppercase">{{ habitacion_cama.cant_habitacion_cama }} {{
                  habitacion_cama.cama.tipo_cama }}</span>
              </div>
              <div style="font-size: .8rem;">
                <v-icon>mdi-{{ habitacion_cama.cama.icono_persona_cama }}</v-icon> {{
                  habitacion_cama.cama.cant_persona_cama * habitacion_cama.cantidad_hab_cama
                }} pers.
              </div>
            </div>
          </div>

          <v-divider class="my-3"></v-divider>

          <div>
            <div class="text-body-2 font-weight-medium">Nombre del Titular</div>
            <div class="text-caption text-grey-darken-2">
              <span>Nombre: </span>
              <span class="px-2 text-primary text-capitalize font-weight-medium">{{ reserva.usuario.nombre_usuario
              }}</span>
            </div>
            <div class="text-caption text-grey-darken-2">
              <span>Telefono: </span>
              <span class="px-2 text-primary text-capitalize font-weight-medium">({{ reserva.usuario.codigo_pais_usuario
              }}) {{ reserva.usuario.telefono_usuario }}</span>
            </div>
          </div>

          <v-divider class="my-3"></v-divider>

          <div>
            <div class="text-body-2 font-weight-medium">Informacion de Reserva</div>
            <div class="text-caption text-grey-darken-2">
              <span>Codigo: </span>
              <span class="px-2 text-primary text-capitalize font-weight-medium">{{ reserva.codigo_reserva }}</span>
            </div>
            <div class="text-caption text-grey-darken-2">
              <span>Fecha: </span>
              <span class="px-2 text-primary text-capitalize font-weight-medium">{{
                obtenerFechaReserva(reserva.fecha_reserva) }}</span>
            </div>
            <v-divider class="my-3"></v-divider>
            <div class="text-caption text-grey-darken-2">
              <span>Check In: </span>
              <span class="px-2 text-primary text-capitalize font-weight-medium">{{
                obtenerCheckInOut(reserva.check_in_reserva) }}</span>
            </div>
            <div class="text-caption text-grey-darken-2">
              <span>Check Out: </span>
              <span class="px-2 text-primary text-capitalize font-weight-medium">{{
                obtenerCheckInOut(reserva.check_out_reserva) }}</span>
            </div>
            <div class="text-caption text-grey-darken-2">
              <span>Cantidad: </span>
              <span class="px-2 text-primary text-capitalize font-weight-medium">{{
                calcularNoches(reserva.check_in_reserva, reserva.check_out_reserva) }}</span> noche(s)
            </div>
            <div class="text-caption text-grey-darken-2">
              <span>Hora Llegada: </span>
              <span class="px-2 text-primary text-capitalize font-weight-medium">{{
                obtenerHoraLlegada(reserva.hora_llegada_reserva) }}</span>
            </div>
            <div class="text-caption text-grey-darken-2">
              <span>Tipo Habitacion: </span>
              <span class="px-2 text-primary text-capitalize font-weight-medium">{{
                reserva.habitacion.categoria.nombre_categoria }}</span>
            </div>
            <div class="text-caption text-grey-darken-2">
              <span>Precio x Noche: </span>
              <span class="px-2 text-primary text-capitalize font-weight-medium">${{
                reserva.habitacion.categoria.precio_ahora_categoria }} BOB.-</span>
            </div>
          </div>

          <v-divider class="my-3"></v-divider>

          <div class="align-center">
            <div>
              <div class="text-body-2 font-weight-medium">Observacion de Reserva</div>
              <div class=" d-flex justify-space-between text-caption text-grey-darken-1">
                <span class="font-weight-medium text-primary">{{ reserva.observacion_reserva }}</span>
              </div>
            </div>
          </div>

          <v-divider v-if="reserva.pago && reserva.pago.id_pago != null" class="my-3"></v-divider>

          <div v-if="reserva.pago && reserva.pago.id_pago != null">
            <div class="text-body-2 font-weight-medium">Pago Realizado</div>
            <div class="text-caption text-grey-darken-2">
              <span>Fecha de Pago: </span>
              <span class="px-2 text-primary text-capitalize font-weight-medium">{{
                obtenerFechaLiteral(reserva.pago.fecha_pago) }}</span>
            </div>
            <div class="text-caption text-grey-darken-2">
              <span>Tipo de Pago: </span>
              <span class="px-2 text-primary text-capitalize font-weight-medium">{{ reserva.pago.tipo_pago == 1 ?
                'Efectivo' : 'Online' }}</span>
            </div>
            <div class="text-caption text-grey-darken-2">
              <span>Metodo de Pago: </span>
              <span class="px-2 text-primary text-capitalize font-weight-medium">{{ reserva.pago.metodo_pago == 1 ?
                'Efectivo' : reserva.pago.metodo_pago == 2 ? 'por codigo QR' : 'Transaccion Bancaria' }}</span>
            </div>
            <div class="text-caption text-grey-darken-2">
              <span>Monto de Pago: </span>
              <span class="px-2 text-primary text-capitalize font-weight-medium">${{ reserva.pago.monto_pago }}
                BOB.-</span>
            </div>
            <div class="text-caption text-grey-darken-2">
              <span>Estado de Pago: </span>
              <span :class="reserva.pago.estado_pago == 1 ? 'bg-yellow ' : 'bg-success '" class="px-2 text-primary text-capitalize font-weight-medium">{{ reserva.pago.estado_pago == 1 ? 'EN REVISION' : 'PAGO CONFIRMADO' }}
                </span>
            </div>
            <div class="text-caption text-grey-darken-2 pt-1">
              <v-expansion-panels variant="accordion">
                <v-expansion-panel color="primary" title="Ver la Imagen del QR">
                  <v-expansion-panel-text>
                    <v-img :aspect-ratio="0" :src="reserva.pago?.url_pago || ''"></v-img>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
          </div>

          <v-divider class="my-3"></v-divider>

          <div>
            <div class="text-body-2 font-weight-medium mb-2">Información del precio</div>
            <div class="d-flex justify-space-between text-caption text-grey-darken-3">
              <span>$<span class="font-weight-bold">{{ reserva.habitacion.categoria.precio_ahora_categoria }}</span>
                BOB.- x <span class="font-weight-bold">{{
                  calcularNoches(reserva.check_in_reserva, reserva.check_out_reserva) }}</span> noches</span>
              <span class="text-primary text-capitalize font-weight-medium">${{ reserva.total_estadia_reserva }}
                BOB.-</span>
            </div>
            <div class="d-flex justify-space-between text-caption text-grey-darken-3">
              <span>Descuento (-)</span>
              <span class="text-primary text-capitalize font-weight-medium">{{ reserva.descuento_reserva == 0 ? '' :
                '-' }}${{ reserva.descuento_reserva }} BOB.-</span>
            </div>
            <!-- <div class="d-flex justify-space-between text-caption text-grey-darken-3">
              <span>Servicio de Reserva (+)</span>
              <span class="text-primary text-capitalize font-weight-medium">${{ reserva.servicio_reserva }}
                BOB.-</span>
            </div> -->
          </div>

          <v-divider class="my-1"></v-divider>

          <div class="d-flex justify-space-between pb-1">
            <strong>Total a pagar</strong>
            <strong>${{ reserva.monto_total_reserva }} BOB.-</strong>
          </div>

        </v-card>
      </v-col>

    </v-row>
  </v-container>

</template>

<script>

import moment from 'moment'
import 'moment/locale/es'

import { useUsuarioStore } from '@/stores/usuario';


export default {

  components: {
  },
  props: {
    reserva: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    usuario: {},

    mostrarCompleto: false,

    // paralizando pantalla
    overlay: false,
    errores: false,
  }),
  watch: {
    overlay(val) {
      val && setTimeout(() => {
        this.overlay = false
      }, 100000)
    },
  },
  computed: {
    imagenPrincipal() {
      return this.reserva.habitacion?.imagenes?.length > 0
        ? this.reserva.habitacion.imagenes[0].url_imagen
        : '/img/no-image.jpg'
    }
  },
  methods: {
    fechasLiterales(fechaLlegada, fechaSalida) {
      return `${moment(fechaLlegada, 'YYYY-MM-DD').format('D')} - ${moment(fechaSalida, 'YYYY-MM-DD').format('D [de] MMMM [del] YYYY')}`
    },
    obtenerFechaLiteral(fecha) {
      return fecha ? moment(fecha, 'YYYY-MM-DD')
        .locale('es')
        .format('dddd, DD - MMMM - YYYY') : ''
    },
    obtenerFechaReserva(fecha) {
      return fecha ? moment(fecha, 'YYYY-MM-DD HH:mm:ss').local('es').format('ddd[,] DD MMM YYYY [ - ] HH:mm a') : ''
    },
    obtenerCheckInOut(fecha) {
      return fecha ? moment(fecha, 'YYYY-MM-DD HH:mm:ss').local('es').format('ddd[,] DD MMM YYYY') : ''
    },
    obtenerHoraLlegada(hora) {
      return hora ? moment(hora, 'HH:mm:ss').local('es').format('HH:mm a') : ''
    },
    calcularNoches(checkIn, checkOut) {
      if (!checkIn || !checkOut) return 0

      const inicio = moment(checkIn).startOf('day')
      const fin = moment(checkOut).startOf('day')

      const noches = fin.diff(inicio, 'days')

      return noches > 0 ? noches : 0
    },
    volverAtras() {
      this.pasoActual = 1
    },
    continua() {
      this.paso++
    },
    atras() {
      this.$emit('atras')
    },

    registrar() {
      this.pasos_login++
    },
    logueado() {
      this.dialog = false
    },

    volverRegistro() {
      this.pasos_login--
    },
    cerrarLogueo() {
      this.pasos_login = 1
      this.dialog = false
    },
    registroTerminado() {
      this.dialog = false
    },

    siguientePaso() {
      const token = localStorage.getItem('token')

      if (!token) {
        console.log('enviar a la reserva')
        this.dialog = true   // abre login
        return
      } else {
        this.pasoActual = 2
        const usuarioStore = useUsuarioStore()
        this.usuario = usuarioStore.usuario
      }
    },
    registrarReserva() {
      this.habitacion.usuario = this.usuario

      // console.log(this.habitacion)
    },
  },
  mounted() {
    this.pasoActual = 1
  }
}
</script>

<style lang="scss" scoped>
.text-caption {
  font-size: 12px;
}

.dialog-card {
  min-height: 80vh;
  /* altura real del modal */
  display: flex;
  flex-direction: column;
}

.dialog-content {
  flex: 1;
  /* ocupa todo el espacio */
  display: flex;
  justify-content: center;
  /* centra horizontal */
  align-items: center;
  /* centra vertical */
}

.descripcion {
  font-size: 13px;
  color: #474747;
  line-height: 1.4;
  transition: all 0.3s ease;
}

.descripcion--clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  /* 👈 SOLO 2 LÍNEAS */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ver-mas {
  display: inline-block;
  margin-bottom: 5px;
  font-size: 13px;
  font-weight: 500;
  color: #000;
  cursor: pointer;
  text-decoration: underline;
}
</style>
