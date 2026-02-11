<template>
  <v-container class="pa-0">
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
      </v-col>
      <v-col cols="6">
        <v-form ref="formulario" @submit.prevent="">
          <v-container>
            <v-row>
              <v-col lg="9" cols="12">
                <p style="font-size: 1rem;">Hora de Llegada:</p>
                <v-text-field type="time" ref="hora_llegada" v-model="reserva.hora_llegada_reserva" density="compact"
                  placeholder="nombre del nivel" prepend-inner-icon="mdi-calendar-clock" variant="outlined"
                  suffix="am/pm" @keyup.enter.prevent="setfocus('observacion_reserva')"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <p style="font-size: 1rem;">observacion de la reserva</p>
                <v-textarea ref="observacion_reserva" v-model="reserva.observacion_reserva" density="compact"
                  placeholder="ingreser una observacion de la reserva" prepend-inner-icon="mdi-text" variant="outlined"
                  @keyup.ctrl.enter.prevent="setfocus('hora_llegada')"></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-select v-model="estado_reserva" :items="items" item-title="title" item-value="value"
                  :rules="[rules.required]" variant="outlined" label="Estado de la Reserva" single-line />
              </v-col>
            </v-row>
            <v-row justify="end">
              <v-col cols="10" class="d-flex justify-end">
                <v-btn color="success" block prepend-icon="mdi-pencil" append-icon="mdi-chevron-right"
                  @click="modificarReserva"> modificar reserva</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
  <!-- capa protectora de proceso -->
  <v-overlay :model-value="overlay" class="align-center justify-center" persistent>
    <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
  </v-overlay>
</template>

<script>
import { modifyPay } from '@/services/pago.service';
import { modifyBooking } from '@/services/reserva.service';
import { modifyRestriction } from '@/services/restriccion.service';
import moment from 'moment'
import 'moment/locale/es'

export default {
  components: {

  },
  props: {
    reserva: {
      type: Object,
      required: true
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      estado_reserva: null,//this.reserva.estado_reserva,

      rules: {
        required: value => !!value || 'El campo es requerido.',
        reglaContieneLetra: v =>
          /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(v) || 'Debe contener al menos una letra',
        soloLetrasYEspacios: v =>
          /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(v) || 'Solo se permiten letras y espacios',
        soloLetrasSinEspacios: v =>
          /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/.test(v) || 'Solo se permiten letras sin espacios',
        reglaDosPalabras: v =>
          typeof v === 'string' && v.trim().split(/\s+/).length >= 2 || 'Debe contener al menos dos palabras',
        soloLetrasONumerosSinEspacios: v =>
          /^[a-zA-Z0-9]+$/.test(v) || 'Solo se permiten letras o números, sin espacios',
        letrasONumerosSinSoloEspacios: v =>
          (typeof v === 'string' && v.trim().length > 0) || 'No se permite solo espacios',
      },

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
    setfocus(foco) {
      this.$nextTick(() => {
        if (foco === "hora_llegada") {
          this.$refs.hora_llegada?.select()
          this.$refs.hora_llegada?.focus()
        }
        if (foco === "observacion_reserva") {
          this.$refs.observacion_reserva?.select()
          this.$refs.observacion_reserva?.focus()
        }
      })
    },
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

    async modificarReserva() {
      this.reserva.restriccion.hora_inicial_restriccion = this.reserva.hora_llegada_reserva
      let mensaje = ''
      if (this.estado_reserva == 6) {
        const ESTADOS_RESERVA = {
          1: 'PENDIENTE',
          2: 'EN PROCESO...',
          3: 'CONFIRMADO',
          4: 'CANCELADO',
          5: 'LLEGO',
          6: 'NO LLEGO',
        }
        mensaje = ESTADOS_RESERVA[this.reserva.estado_reserva] + ' -> ' + ESTADOS_RESERVA[this.estado_reserva] + ' \n'
        this.reserva.observacion_reserva = mensaje + this.reserva.observacion_reserva
      }
      
      this.estado_reserva == 4 ? this.reserva.condicion_reserva = 2 : this.estado_reserva == 6 ? this.reserva.condicion_reserva = 2 : this.reserva.condicion_reserva = 1
      this.reserva.estado_reserva = this.estado_reserva

      try {
        const { valid } = await this.$refs.formulario.validate()
        this.$nextTick(async () => {
          // Simular login
          this.overlay = true;
          if (valid && this.estado_reserva) {
            setTimeout(async () => {
              this.overlay = false

              let res = await modifyBooking(this.reserva)
              if (res.status == 200) {
                if (this.estado_reserva == 3 && this.reserva.pago.id_pago > 0) {
                  this.reserva.pago.estado_pago = 2
                  await modifyPay(this.reserva.pago)
                }
                if(this.reserva.estado_reserva == 4 || this.reserva.estado_reserva == 6){
                  this.reserva.restriccion.estado_restriccion = 2
                  await modifyRestriction(this.reserva.restriccion)
                }
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
          } else {
            this.$swal({
              title: "Error!",
              text: `No puede estar vacio el campo requerido...!!!`,
              icon: "error",
              timer: 3500,
              didClose: () => {
                this.overlay = false
                this.setfocus('hora_llegada')
              }
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
    }
  },
  mounted() {

  }
}
</script>

<style lang="scss" scoped></style>
