<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <v-card elevation="7" class="pa-4 rounded-xl">
          <v-row no-gutters>
            <v-col cols="5">
              <v-img :src="imagenPrincipal" class="rounded-lg" height="120" cover></v-img>
            </v-col>
            <v-col cols="7" class="pl-3 d-flex flex-column justify-center">
              <div class="text-subtitle-2 font-weight-medium">
                {{ reserva.habitacion.nombre_habitacion }} - {{ reserva.categoria.nombre_categoria }}
              </div>
              <div class="text-caption text-grey-darken-1">
                {{ reserva.categoria.descripcion_categoria }}
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
                reserva.categoria.nombre_categoria }}</span>
            </div>
            <div class="text-caption text-grey-darken-2">
              <span>Precio x Noche: </span>
              <span class="px-2 text-primary text-capitalize font-weight-medium">${{
                reserva.categoria.precio_ahora_categoria }} BOB.-</span>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card elevation="7" class="pa-4 rounded-xl">
          <v-divider class="my-3"></v-divider>

          <div class="align-center">
            <div>
              <div class="text-body-2 font-weight-medium">Observacion de Reserva</div>
              <div class=" d-flex justify-space-between text-caption text-grey-darken-1">
                <span class="font-weight-medium text-primary">{{ reserva.observacion_reserva }}</span>
              </div>
            </div>
          </div>

          <v-divider v-if="reserva.pago.id_pago != null" class="my-3"></v-divider>

          <div v-if="reserva.pago.id_pago != null">
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
              <span :class="reserva.pago.estado_pago == 1 ? 'bg-yellow ' : 'bg-success '"
                class="px-2 text-primary text-capitalize font-weight-medium">{{ reserva.pago.estado_pago == 1 ? 'EN REVISION' : 'PAGO CONFIRMADO' }}
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
              <span>$<span class="font-weight-bold">{{ reserva.categoria.precio_ahora_categoria }}</span>
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
            <div class="d-flex justify-space-between text-caption text-grey-darken-3">
              <span>Servicio de Reserva (+)</span>
              <span class="text-primary text-capitalize font-weight-medium">${{ reserva.servicio_reserva }}
                BOB.-</span>
            </div>
          </div>

          <v-divider class="my-1"></v-divider>

          <div class="d-flex justify-space-between pb-1">
            <strong>Total a pagar</strong>
            <strong>${{ reserva.monto_total_reserva }} BOB.-</strong>
          </div>
        </v-card>
        <v-container>
          <v-card elevation="7">
            <v-btn block prepend-icon="mdi-account-check" append-icon="mdi-chevron-right" color="error"
              variant="elevated" @click="checkOut">check out - habitacion</v-btn>
          </v-card>
        </v-container>
      </v-col>
    </v-row>
  </v-container>

  <!-- capa protectora de proceso -->
  <v-overlay :model-value="overlay" class="align-center justify-center" persistent>
    <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
  </v-overlay>
</template>

<script>
import { modifyOnlyRoom } from '@/services/habitacion.service';
import { modifyBooking } from '@/services/reserva.service';
import { modifyRestriction } from '@/services/restriccion.service';
import moment from 'moment'
import 'moment/locale/es'

export default {
  props: {
    reserva: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
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

    // realizar el check in de la habitacion
    async checkOut() {
      try {
        this.$swal({
          title: "¿Estas seguro que quieres realizar el CHECK OUT?",
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: "Si, quiero",
        }).then((result) => {
          if (result.isConfirmed) {

            const fecha_llegada = this.reserva.check_in_reserva
            const fecha_salida = this.reserva.check_out_reserva

            let descuento_reserva = 0

            const numero_noches = this.getNumberNights([fecha_llegada, fecha_salida])

            const total_estadia = this.reserva.categoria.precio_ahora_categoria * numero_noches

            // 🔥 descuento en número (no string)
            const descuentoPorcentaje = Number(this.reserva.categoria.descuento_categoria) / 100

            if (numero_noches >= this.reserva.categoria.cant_noches_categoria) {
              descuento_reserva = Math.round(descuentoPorcentaje * total_estadia)
            } else {
              descuento_reserva = 0
            }

            const total_reserva = (total_estadia - descuento_reserva) + Number(this.reserva.servicio_reserva)

            this.reserva.check_in_reserva = fecha_llegada
            this.reserva.check_out_reserva = fecha_salida
            this.reserva.total_estadia_reserva = total_estadia
            this.reserva.descuento_reserva = descuento_reserva
            this.reserva.monto_total_reserva = total_reserva


            this.reserva.restriccion.fecha_final_restriccion = fecha_salida
            this.reserva.restriccion.hora_final_restriccion = moment().format('HH:mm')
            this.reserva.restriccion.estado_restriccion = 2
            this.reserva.condicion_reserva = 2 // 1 = activo y 2 = inactivo
            this.reserva.habitacion.estado_habitacion = 3

            this.$nextTick(async () => {
              // Simular login
              this.overlay = true;
              setTimeout(async () => {
                this.overlay = false
                let resp = await modifyOnlyRoom(this.reserva.habitacion)
                if (resp.status == 200) {
                  let res = await modifyBooking(this.reserva)
                  if (res.status == 200) {
                    const respuesta = await modifyRestriction(this.reserva.restriccion)
                    if(respuesta.status == 200){
                      this.$swal({
                        title: "CHECK OUT - HABITACION!",
                        text: `se ha realizado el check out de la habitacion CORRECTAMENTE!!!`,
                        icon: "success",
                        timer: 2500,
                        didClose: () => {
                          this.overlay = false
                          this.$router.go(0)
                        }
                      })
                    }
                  }
                }
              }, 1000);
              return true
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
  },
  mounted() {

  }
}
</script>

<style lang="scss" scoped></style>
