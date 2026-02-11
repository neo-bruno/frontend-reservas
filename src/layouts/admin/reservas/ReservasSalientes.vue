<template>
  <v-sheet class="pa-5">
    <!-- Controles -->
    <div class="d-flex justify-space-between align-center">
      <div>
        <v-select v-model="itemsPerPage" variant="outlined" :items="[5, 10, 20]" density="compact"
          style="max-width:100px" />
      </div>
      <div class="px-7 rounded-lg">
        <div style="font-size: 1.3rem;" class="font-weight-medium text-uppercase text-success">
          Reservas Salientes - CHECK OUT
        </div>
        <p style="font-size: .8rem;" class="font-weight-regular text-center">(Resevas que pronto haran CHECK OUT, debe
          modificar el estado de la habitacion.)</p>
      </div>
      <v-text-field v-model="search" variant="outlined" density="compact" placeholder="Buscar..."
        style="max-width: 200px" prepend-inner-icon="mdi-magnify" />
    </div>

    <v-card elevation="7">
      <!-- Tabla -->
      <v-table class="tabla-custom" density="compact" hover>
        <thead>
          <tr>
            <th class="text-center">Reserva</th>
            <th class="text-center">Check In</th>
            <th class="text-center">Check Out</th>
            <th class="text-center">Falta</th>
            <th class="text-center">Adelanto</th>
            <th class="text-center">Total</th>
            <th class="text-center">Servicio</th>
            <th class="text-center">Acción</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, i) in paginatedItems" :key="item.id_habitacion" class="text-center">
            <td class="text-left" style="max-width: 280px; min-width: 280px;">
              <v-tooltip location="end">
                <template #activator="{ props }">
                  <div v-bind="props">
                    <v-list lines="three">
                      <v-list-item>
                        <v-list-item-title class="text-truncate">
                          <strong>
                            {{ fechasLiterales(item.check_in_reserva, item.check_out_reserva) }}
                          </strong>
                        </v-list-item-title>

                        <v-list-item-subtitle class="text-truncate">
                          habitacion:
                          <strong>
                            {{ item.habitacion.nombre_habitacion }}
                            ({{ item.categoria.nombre_categoria }})
                          </strong>
                        </v-list-item-subtitle>

                        <v-list-item-subtitle class="text-no-wrap text-truncate">
                          codigo:
                          <strong>{{ item.codigo_reserva }}</strong>
                          -
                          titular:
                          <strong class="text-capitalize">
                            {{ item.usuario.nombre_usuario }}
                          </strong>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </div>
                </template>

                <!-- CONTENIDO COMPLETO -->
                <div style="min-width: 250px;">
                  <div>
                    <strong>
                      {{ fechasLiterales(item.check_in_reserva, item.check_out_reserva) }}
                    </strong>
                  </div>

                  <div class="mt-2">
                    Habitación:
                    {{ item.habitacion.nombre_habitacion }}
                    ({{ item.categoria.nombre_categoria }})
                  </div>

                  <div class="mt-2">
                    Código: {{ item.codigo_reserva }}
                  </div>

                  <div>
                    Titular:
                    {{ item.usuario.nombre_usuario }}
                  </div>

                  <div>
                    Teléfono:
                    ({{ item.usuario.codigo_pais_usuario }})
                    {{ item.usuario.telefono_usuario }}
                  </div>
                </div>
              </v-tooltip>
            </td>


            <td class="text-center font-weight-medium text-no-wrap">
              <span class="bg-indigo rounded-xl pa-2">{{ fechaLiteral(item.check_in_reserva, item.hora_llegada_reserva)
              }}</span>
            </td>

            <td class="text-center font-weight-medium text-no-wrap">
              <span class="bg-red rounded-xl pa-2">{{ fechaSalida(item.check_out_reserva) }}</span>
            </td>

            <td>
              <v-chip v-if="diasFaltantes(item.check_out_reserva) != 0" style="font-size: 1rem;"
                :color="diasFaltantes(item.check_out_reserva) < 0 ? 'yellow' : 'success'" variant="elevated">
                {{ diasFaltantes(item.check_out_reserva) }} dia(s)
              </v-chip>
              <v-chip v-else style="font-size: 1rem;" color="error" variant="elevated">
                Salida Hoy
              </v-chip>
            </td>

            <td>
              <strong v-if="item.pago.id_pago > 0">${{ item.pago.monto_pago }}</strong>
            </td>
            <td>
              <strong>${{ item.monto_total_reserva }}</strong>
            </td>
            <td>
              <strong>${{ item.servicio_reserva }}</strong>
            </td>
            <td class="text-center">
              <v-btn v-if="diasFaltantes(item.check_out_reserva) > -1" icon color="success" size="small"
                @click="abrirDialogoModificarFechas(item)">
                <v-icon>mdi-calendar-refresh</v-icon>
              </v-btn>
              <v-btn v-if="diasFaltantes(item.check_out_reserva) <= 0" icon color="error" size="small"
                @click="abrirDialogoCheckOut(item)">
                <v-icon>mdi-export</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>

      <!-- Paginación -->
      <div class="d-flex justify-end mt-3">
        <v-pagination v-model="page" :length="totalPages" density="comfortable"></v-pagination>
      </div>
    </v-card>

  </v-sheet>

  <!-- dialogo para modificar las fechas de la reserva -->
  <v-dialog v-model="dialogo_modificar_fechas" transition="dialog-bottom-transition" :fullscreen="$vuetify.display.xs"
    :max-width="$vuetify.display.xs ? undefined : 770" persistent scrollable>
    <v-card class="px-0">

      <v-toolbar class="text-center font-weight-medium text-wrap bg-primary" title="Modificar Reserva"></v-toolbar>

      <v-card-text>
        <CalendarioReservas :restriccion="restriccion" :restricciones="restricciones"
          @modificarFechasReserva="modificarRestriccion" />
      </v-card-text>

      <v-card-actions class="justify-end bg-primary">
        <v-btn variant="elevated" color="red" @click="cerrarDialogoModificarReserva"
          prepend-icon="mdi-close">Cerrar</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>

  <!-- dialogo para modificar datos de la reserva -->
  <v-dialog v-model="dialogo_check_out" transition="dialog-bottom-transition" :fullscreen="$vuetify.display.xs"
    :max-width="$vuetify.display.xs ? undefined : 770" persistent scrollable>
    <v-card class="px-0">

      <v-toolbar class="text-center font-weight-medium text-wrap bg-primary" title="CHECK OUT - Reserva"></v-toolbar>

      <v-card-text>
        <CheckOutReserva :reserva="reserva" />
      </v-card-text>

      <v-card-actions class="justify-end bg-primary">
        <v-btn variant="elevated" color="red" @click="cerrarDialogoCheckOut" prepend-icon="mdi-close">Cerrar</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>

  <!-- capa protectora de proceso -->
  <v-overlay :model-value="overlay" class="align-center justify-center" persistent>
    <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
  </v-overlay>

</template>

<script>

import CambiarDatosReserva from './CambiarDatosReserva.vue';
import CalendarioReservas from './CalendarioReservas.vue';
import CheckOutReserva from './CheckOutReserva.vue';
import moment from 'moment'
import 'moment/locale/es'
import { getBusiness } from '@/services/negocio.service';
import { getRestrictions, modifyRestriction } from '@/services/restriccion.service';
import { modifyBooking } from '@/services/reserva.service';

export default {

  components: {
    CambiarDatosReserva,
    CalendarioReservas,
    CheckOutReserva,
  },
  props: {
    reservasTipoTres: {
      type: Array,     // ✅ ES UN ARRAY
      default: () => [] // ✅ evita undefined
    }
  },
  data() {
    return {
      search: "",
      page: 1,
      itemsPerPage: 20,
      negocio: {},
      reserva: {},
      items: [{ title: 'NO LLEGO', value: 6 }],
      // ############################################
      // datos para ver reserva
      dialogo_modificar_fechas: false,
      restricciones: [],
      restriccion: {},
      // ############################################

      // ############################################
      // datos para ver reserva
      dialogo_check_out: false,
      // ############################################

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
    datosFiltrados() {
      const ESTADOS_RESERVA = {
        1: 'PENDIENTE',
        2: 'EN PROCESO...',
        3: 'CONFIRMADO',
        4: 'CANCELADO',
        5: 'LLEGO',
        6: 'NO LLEGO',
      }

      if (!this.search) return this.reservasTipoTres;

      const texto = this.search.toLowerCase();


      return this.reservasTipoTres.filter(d => {
        const estadoTexto = ESTADOS_RESERVA[d.estado_reserva]?.toLowerCase() || ''

        return (
          d.codigo_reserva?.toLowerCase().includes(texto) ||
          d.categoria?.nombre_categoria?.toLowerCase().includes(texto) ||
          d.habitacion?.nombre_habitacion?.toLowerCase().includes(texto) ||
          d.usuario?.nombre_usuario?.toLowerCase().includes(texto) ||
          String(d.usuario?.telefono_usuario).includes(texto) || // buscar por número
          String(d.estado_reserva).includes(texto) || // buscar por número
          estadoTexto.includes(texto) // 🔥 buscar por texto
        )
      })
    },

    totalPages() {
      return Math.ceil(this.datosFiltrados.length / this.itemsPerPage);
    },

    paginatedItems() {
      const start = (this.page - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.datosFiltrados.slice(start, end);
    },
  },
  methods: {
    esHoy(fecha) {
      return moment(fecha).isSame(moment(), 'day')
    },
    fechaLiteral(fecha, hora) {
      return `${moment(fecha, 'YYYY-MM-DD').format('dddd, D/MMM/YYYY')} - ${moment(hora, 'HH:mm:ss').format('HH:mm a')}`
    },
    fechaSalida(fecha) {
      return `${moment(fecha, 'YYYY-MM-DD').format('dddd, D/MMM/YYYY')}`
    },

    fechasLiterales(fechaLlegada, fechaSalida) {
      return `${moment(fechaLlegada, 'YYYY-MM-DD').format('dddd, D')} - ${moment(fechaSalida, 'YYYY-MM-DD').format('D [de] MMMM [del] YYYY')}`
    },
    diasFaltantes(fechaObjetivo) {
      const hoy = new Date()
      const fecha = new Date(fechaObjetivo)

      // Normalizar horas para evitar errores
      hoy.setHours(0, 0, 0, 0)
      fecha.setHours(0, 0, 0, 0)

      const diffMs = fecha - hoy
      const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

      return diffDias
    },

    // ############################################
    // dialogo para modificar la reserva
    abrirDialogoModificarFechas(item) {
      this.reserva = item
      this.obtenerRestricciones()
      this.dialogo_modificar_fechas = true
    },
    cerrarDialogoModificarReserva() {
      this.dialogo_modificar_fechas = false
    },
    async modificarRestriccion(item) {
      this.restriccion = item
      const fecha_llegada = this.restriccion.fecha_inicial_restriccion
      const fecha_salida = this.restriccion.fecha_final_restriccion
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

      try {
        this.$nextTick(async () => {
          // Simular login
          this.overlay = true;
          setTimeout(async () => {
            this.overlay = false

            let res = await modifyRestriction(this.restriccion)
            if (res.status == 200) {
              const resp = await modifyBooking(this.reserva)
              if (resp.status == 200) {
                this.$swal({
                  title: "Fechas Modificadas!",
                  text: `se ha modificado las fechas de la reserva CORRECTAMENTE!!!`,
                  icon: "success",
                  timer: 2500,
                  didClose: () => {
                    this.overlay = false
                    this.$router.go(0)
                  }
                })
              }
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
    // fin
    // ############################################

    // ############################################
    // enviar mensaje al telefono de whatsapp
    abrirDialogoCheckOut(item) {
      this.reserva = item
      this.dialogo_check_out = true
    },
    cerrarDialogoCheckOut() {
      this.dialogo_check_out = false
    },

    // fin
    // ############################################

    async obtenerNegocio() {
      try {
        let res = await getBusiness(1)
        if (res.status == 201) {
          this.negocio = res.data.data[0]
        }
      } catch (error) {
        console.log(error)
      }
    },
    async obtenerRestricciones() {
      try {
        // 👉 la restricción que estás modificando
        this.restriccion = this.reserva.restriccion

        const res = await getRestrictions(this.reserva.habitacion.id_habitacion)

        if (res.status === 200) {
          // 👉 todas las restricciones MENOS la actual
          this.restricciones = res.data.data.filter(r =>
            r.id_restriccion !== this.restriccion.id_restriccion
          )
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
  mounted() {
    this.obtenerNegocio()
  }
}
</script>

<style lang="scss" scoped>
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

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

</style>
