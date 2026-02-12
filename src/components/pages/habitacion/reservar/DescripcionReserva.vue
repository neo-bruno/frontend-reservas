<template>
  <!-- <div @click="volverAtras"><v-icon color="primary" class="ma-2" icon="mdi-undo"></v-icon>
    <span class="font-weight-light text-primary">volver atras</span>
  </div> -->

  <v-container>
    <!-- <v-row justify="center">
      <v-col cols="12" lg="5" sm="7" class="py-1">
        <div v-if="$vuetify.display.smAndUp" style="font-size: 2rem;" class="font-weight-medium">Solicitar Reserva
        </div>
        <div v-else style="font-size: 1.5rem;" class="font-weight-medium">Solicitar Reserva
        </div>
      </v-col>
    </v-row> -->

    <v-row justify="center">

      <!-- Columna izquierda mejorada -->
      <v-col cols="12" lg="5" sm="7" class="pb-0">

        <v-card v-if="habitacion" elevation="2" class="pa-4 rounded-xl">
          <v-row no-gutters>
            <v-col cols="5">
              <v-img :src="imagenPrincipal" class="rounded-lg" height="120" cover></v-img>
            </v-col>
            <v-col cols="7" class="pl-3 d-flex flex-column justify-center">
              <div class="text-subtitle-2 font-weight-medium">
                {{ habitacion.nombre_habitacion }} - {{ habitacion.categoria.nombre_categoria }}
              </div>
              <div class="text-caption text-grey-darken-1">
                ★ {{ puntuacion }} ({{ cantidad }}) · Favorito entre huéspedes
              </div>
            </v-col>
          </v-row>

          <v-divider class="my-3"></v-divider>

          <div v-if="pasoActual == 1">
            <div class="text-body-2 font-weight-medium mb-1">Cancelación gratuita</div>
            <div class="text-caption text-grey-darken-1">
              Si cancelas 3 dias antes del <strong>{{ obtenerFechaLiteral(habitacion.reserva.fecha_llegada) }}</strong>
              no tendra ninguna penalidad en la reserva.
              <a href="#" class="text-decoration-underline">Política completa</a>
            </div>
          </div>

          <div v-else>
            <div class="text-body-2 font-weight-medium mb-1">Descripcion habitacion</div>
            <div class="text-caption text-grey-darken-1 text-justify">
              <p class="descripcion" :class="{ 'descripcion--clamp': !mostrarCompleto }">
                {{ habitacion.descripcion_habitacion }}
              </p>

              <a v-if="habitacion.descripcion_habitacion.length > 200" class="ver-mas"
                @click="mostrarCompleto = !mostrarCompleto">
                {{ mostrarCompleto ? 'Ver menos' : 'Ver más' }}
              </a>
            </div>
          </div>

          <v-divider v-if="pasoActual == 2" class="my-3"></v-divider>

          <div v-if="pasoActual == 2">
            <div class="text-body-2 font-weight-medium">Informacion del Titular</div>
            <div class="d-flex justify-space-between text-caption text-grey-darken-2">
              <span>nombre del Titular: </span>
              <span class="text-primary text-capitalize font-weight-medium">{{ usuario.nombre_usuario }}</span>
            </div>
            <div class="d-flex justify-space-between text-caption text-grey-darken-2">
              <span>Telefono Referencia: </span>
              <span class="text-primary text-capitalize font-weight-medium">({{ usuario.codigo_pais_usuario }}) {{
                usuario.telefono_usuario }}</span>
            </div>
          </div>


          <v-divider class="my-3"></v-divider>

          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-body-2 font-weight-medium">Detalles de la Estadia</div>
              <div class="text-caption text-grey-darken-1">
                {{ fechasLiterales(habitacion.reserva.fecha_llegada, habitacion.reserva.fecha_salida) }}<br />
                {{ habitacion.adultos_habitacion }} adulto(s) - {{ habitacion.ninos_habitacion }} niño(s)
              </div>
            </div>
            <v-btn v-if="pasoActual == 1" size="small" variant="outlined" color="red" @click="atras">Cambiar</v-btn>
          </div>

          <v-divider class="my-3"></v-divider>

          <div>
            <div class="text-body-2 font-weight-medium mb-2">Información del precio</div>
            <div class="d-flex justify-space-between text-caption text-grey-darken-3">
              <span>${{ habitacion.reserva.precio_noche }} BOB.- x {{ habitacion.reserva.numero_noches }} noches</span>
              <span class="text-primary text-capitalize font-weight-medium">${{ habitacion.reserva.total_estadia }}
                BOB.-</span>
            </div>
            <div class="d-flex justify-space-between text-caption text-grey-darken-3">
              <span>Descuento (-)</span>
              <span class="text-primary text-capitalize font-weight-medium">{{ habitacion.reserva.descuento == 0 ? '' :
                '-' }}${{ habitacion.reserva.descuento }} BOB.-</span>
            </div>
            <div class="d-flex justify-space-between text-caption text-grey-darken-3">
              <span>Servicio de Reserva (+)</span>
              <span class="text-primary text-capitalize font-weight-medium">${{ habitacion.reserva.servicio_reserva }}
                BOB.-</span>
            </div>
          </div>

          <v-divider class="my-1"></v-divider>

          <div class="d-flex justify-space-between pb-1">
            <strong>Total a pagar</strong>
            <strong>${{ habitacion.reserva.total_reserva }} BOB.-</strong>
          </div>

        </v-card>
      </v-col>

    </v-row>
    <v-row justify="center">
      <v-col cols="12" lg="5" sm="7">
        <v-sheet elevation="6" class="pa-3 fixed-bottom d-flex justify-space-between align-center bg-white" height="80"
          style="z-index: 999;">
          <v-btn v-if="pasoActual == 2" color="primary" variant="outlined" @click="volverAtras">atras</v-btn>
          <v-progress-linear v-if="pasoActual == 1" :model-value="progreso" height="6" color="primary" rounded
            style="width: 55%;"></v-progress-linear>

          <v-btn v-if="pasoActual == 1" color="primary" @click="siguientePaso">Siguiente</v-btn>
          <v-btn v-else color="primary" @click="registrarReserva">Finalizar</v-btn>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>

  <!-- capa protectora de proceso -->
  <v-overlay :model-value="overlay" class="align-center justify-center" persistent>
    <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
  </v-overlay>

  <!-- loguearse antes de confirmar el metodo de pago -->
  <v-dialog v-model="dialog" transition="dialog-bottom-transition" :fullscreen="$vuetify.display.xs"
    :max-width="$vuetify.display.xs ? undefined : 370" persistent scrollable>
    <v-card class="px-0">

      <v-toolbar class="text-center font-weight-medium text-wrap bg-primary"
        title="Logueate para tu Reserva"></v-toolbar>

      <v-card-text class="px-0 py-0">
        <v-window v-model="pasos_login" disabled>
          <v-window-item :value="1">
            <LoginRegister v-on:registrar="registrar" v-on:ingresar="logueado" />
          </v-window-item>
          <v-window-item :value="2">
            <ReservaRegistrarUsuario v-on:atras="volverRegistro" v-on:registroFinalizado="registroTerminado">
            </ReservaRegistrarUsuario>
          </v-window-item>
        </v-window>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn @click="cerrarLogueo">Cerrar</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>



</template>

<script>
import LoginRegister from './LoginRegister.vue';
import ReservaRegistrarUsuario from './ReservaRegistrarUsuario.vue';

import moment from 'moment'
import 'moment/locale/es'
import { useUsuarioStore } from '@/stores/usuario';
import { saveBooking } from '@/services/reserva.service';
import { getRoomById } from '@/services/habitacion.service';
import { useReservaStore } from '@/stores/reserva';
import { getAllRevies } from '@/services/reserna.service';

export default {
  emits: ['atras'],
  components: {
    LoginRegister,
    ReservaRegistrarUsuario
  },
  props: {
    // habitacion: {
    //   type: Object,
    //   required: true
    // }
  },
  data: () => ({
    loading: true,
    habitacion: {
      categoria: {
        nombre_categoria: ''
      },
      reserva: {
        fecha_llegada: null,
        fecha_salida: null,
        precio_noche: 0,
        numero_noches: 0,
        total_estadia: 0,
        descuento: 0,
        servicio_reserva: 0,
        total_reserva: 0
      },
      imagenes: []
    },

    cantidad: 0,
    puntuacion: 0,

    paso: 1,
    pasoActual: 1,
    totalPasos: 1,
    dialog: false,
    pasos_login: 1,

    usuario: {},

    mostrarCompleto: false,

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
    reservaStore() {
      return useReservaStore()
    },
    idHabitacion() {
      return this.$route.params.id_habitacion
    },
    progreso() {
      return (this.pasoActual / this.totalPasos) * 100;
    },
    imagenPrincipal() {
      return this.habitacion?.imagenes?.length > 0
        ? this.habitacion.imagenes[0].url_imagen
        : '/img/no-image.jpg'
    },
  },
  methods: {
    fechasLiterales(fechaLlegada, fechaSalida) {
      return `${moment(fechaLlegada, 'YYYY-MM-DD').format('D')} - ${moment(fechaSalida, 'YYYY-MM-DD').format('D [de] MMMM [del] YYYY')}`
    },
    obtenerFechaLiteral(fecha) {
      return fecha ? moment(fecha, 'YYYY-MM-DD')
        .locale('es')
        .format('DD [de] MMM') : ''
    },
    volverAtras() {
      this.$router.go(-1)
    },
    continua() {
      this.paso++
    },
    atras() {
      this.$router.go(-1)
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
      this.pasoActual = 2
      const usuarioStore = useUsuarioStore()
      this.usuario = usuarioStore.usuario
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

    async registrarReserva() {
      try {
        const restriccion = {
          id_habitacion: this.habitacion.id_habitacion,
          fecha_inicial_restriccion: this.habitacion.reserva.fecha_llegada,
          hora_inicial_restriccion: '12:00',
          fecha_final_restriccion: this.habitacion.reserva.fecha_salida,
          hora_final_restriccion: '12:00',
          motivo_restriccion: 'reserva de habitacion',
          estado_restriccion: 1
        }
        const reserva = {
          id_usuario: this.usuario.id_usuario,
          id_persona: this.usuario.persona ? this.usuario.persona.id_persona : this.usuario.id_persona,
          id_habitacion: this.habitacion.id_habitacion,
          id_restriccion: 0,
          codigo_reserva: '',
          fecha_reserva: null,
          check_in_reserva: this.habitacion.reserva.fecha_llegada,
          check_out_reserva: this.habitacion.reserva.fecha_salida,
          hora_llegada_reserva: '12:00',
          total_estadia_reserva: this.habitacion.reserva.total_estadia,
          descuento_reserva: this.habitacion.reserva.descuento,
          servicio_reserva: this.habitacion.reserva.servicio_reserva,
          monto_total_reserva: this.habitacion.reserva.total_reserva,
          estado_reserva: 1,
          observacion_reserva: '',
          condicion_reserva: 1,  // 1=habilitado y 2=inabilitado
          telefono_cliente: this.usuario.codigo_pais_usuario + this.usuario.telefono_usuario,
          restriccion
        }
        this.$nextTick(async () => {
          // Simular login
          this.overlay = true;
          setTimeout(async () => {
            this.overlay = false

            let res = await saveBooking(reserva)
            if (res.status == 200) {
              this.$swal({
                title: "Reserva Guardada!",
                text: `se ha guardado los datos de la reserva CORRECTAMENTE!!!`,
                icon: "success",
                timer: 2500,
                didClose: () => {
                  this.overlay = false
                  this.$router.push({ name: 'perfil-cliente' })
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
    async obtenerHabitacion() {
      try {
        const { reserva } = this.reservaStore
        if (!reserva.fecha_llegada && !reserva.fecha_salida) {
          this.$router.replace({ name: 'home' })
          return
        } else {
          const res = await getRoomById(this.idHabitacion)
          if (res.status === 201) {
            this.habitacion = {
              ...res.data.data,
              reserva: {
                ...reserva
              }
            }
          }
        }

      } catch (error) {
        console.error(error)
      }
    },
    async obtenerResena() {
      try {
        const res = await getAllRevies()
        if (res.status === 200) {
          const resenas = res.data.data;
          const resenas_habitacion = resenas.filter(
            item => item.id_habitacion == this.habitacion.id_habitacion
          );
          this.cantidad = resenas_habitacion.length;
          if (this.cantidad > 0) {
            const total = resenas_habitacion.reduce(
              (sum, item) => sum + item.puntuacion_resena,
              0
            );
            this.puntuacion = total / this.cantidad;
          } else {
            this.puntuacion = 0;
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
  },

  async mounted() {
    try {
      this.pasoActual = 1
      await this.obtenerHabitacion()
      await this.obtenerResena()
      this.loading = false
    } catch (error) {
      console.log(error)
    }
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
  color: #555;
  line-height: 1.4;
  transition: all 0.3s ease;
}

.descripcion--clamp {
  display: -webkit-box;
  //-webkit-line-clamp: 3;
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
