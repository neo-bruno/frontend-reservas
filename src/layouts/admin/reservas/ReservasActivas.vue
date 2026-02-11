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
          Reservas Activas - para confirmar
        </div>
        <p style="font-size: .8rem;" class="font-weight-regular text-center">(Las reservas estan activas y disponibles
          para realizar el check in)</p>
      </div>
      <v-text-field v-model="search" variant="outlined" density="compact" placeholder="Buscar..."
        style="max-width: 200px" prepend-inner-icon="mdi-magnify" />
    </div>

    <v-card elevation="7">
      <!-- Tabla -->
      <v-table class="tabla-custom" density="compact" hover>
        <thead>
          <tr>
            <th class="text-center">Codigo</th>
            <th class="text-center">Habitacion</th>
            <th class="text-center">Reserva</th>
            <th class="text-center">Faltan</th>
            <th class="text-center">Adelanto</th>
            <th class="text-center">Total</th>
            <th class="text-center">Estado</th>
            <th class="text-center">Acción</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, i) in paginatedItems" :key="item.id_habitacion" class="text-center"
            :class="item.estado_reserva == 3 ? 'bg-green-lighten-5' : ''">
            <td class="text-left">
              <v-chip color="red" style="font-size: 1rem;" variant="elevated">{{ item.codigo_reserva
              }}</v-chip>
            </td>
            <td class="text-center font-weight-medium text-no-wrap">
              <span class="bg-yellow rounded-xl pa-2">{{ item.habitacion.nombre_habitacion }} - {{
                item.categoria.nombre_categoria }}</span>
            </td>
            <td class="text-left" style="max-width: 350px; min-width: 350px;">
              <v-tooltip location="end">
                <template #activator="{ props }">
                  <div v-bind="props">
                    <v-list lines="one">
                      <v-list-item>
                        <v-list-item-title class="text-truncate">
                          <strong>
                            {{ fechasLiterales(item.check_in_reserva, item.check_out_reserva) }}
                          </strong>
                        </v-list-item-title>

                        <v-list-item-subtitle class="text-no-wrap text-truncate">
                          titular:
                          <strong class="text-capitalize">
                            {{ item.usuario.nombre_usuario }}
                          </strong>
                          -
                          telf.:
                          <strong>
                            ({{ item.usuario.codigo_pais_usuario }})
                            {{ item.usuario.telefono_usuario }}
                          </strong>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </div>
                </template>

                <!-- Contenido completo del tooltip -->
                <div>
                  <div>
                    <strong>
                      {{ fechasLiterales(item.check_in_reserva, item.check_out_reserva) }}
                    </strong>
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

            <td>
              <v-chip v-if="diasFaltantes(item.check_in_reserva) != 0" style="font-size: 1rem;" color="warning"
                variant="elevated">
                {{ diasFaltantes(item.check_in_reserva) }} dia(s)
              </v-chip>
              <v-chip v-else style="font-size: 1rem;" color="red" variant="elevated">
                Llega Hoy
              </v-chip>
            </td>
            <td><v-chip v-if="item.pago.monto_pago" style="font-size: 1rem;" color="success" variant="elevated">${{
              item.pago.monto_pago }} BOB.-</v-chip></td>
            <td><v-chip color="yellow" variant="elevated" style="font-size: 1rem;">${{ item.monto_total_reserva }}
                BOB.-</v-chip></td>
            <td>
              <v-chip
                :class="item.estado_reserva == 1 ? 'text-indigo' : item.estado_reserva == 2 ? 'text-warning' : item.estado_reserva == 3 ? 'text-success' : item.estado_reserva == 4 ? 'text-error' : item.estado_reserva == 5 ? 'text-info' : 'text-primary'"
                variant="outlined">
                {{ item.estado_reserva == 1 ? 'PENDIENTE' : item.estado_reserva == 2 ? 'EN PROCESO...' :
                  item.estado_reserva == 3 ? 'CONFIRMADO' : item.estado_reserva == 4 ? 'CANCELADO' :
                    item.estado_reserva == 5 ? 'LLEGO' : 'NO LLEGO' }}
              </v-chip>
            </td>
            <td class="text-center">
              <v-btn icon color="info" size="small" @click="abrirDialogVerReserva(item)">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
              <v-btn icon color="red" size="small" @click="abrirDialogoModificarReserva(item)">
                <v-icon>mdi-calendar-edit</v-icon>
              </v-btn>
              <v-btn v-if="esHoy(item.check_in_reserva)" icon color="primary" size="small"
                @click="abrirDialogoCheckIn(item)">
                <v-icon>mdi-account-arrow-right</v-icon>
              </v-btn>
              <v-btn icon color="success" size="small" @click="abrirWhatsapp(item)">
                <v-icon>mdi-whatsapp</v-icon>
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

  <!-- dialogo para ver la reserva -->
  <v-dialog v-model="dialogo_ver_reserva" transition="dialog-bottom-transition" :fullscreen="$vuetify.display.xs"
    :max-width="$vuetify.display.xs ? undefined : 470" persistent scrollable>
    <v-card class="px-0">

      <v-toolbar class="text-center font-weight-medium text-wrap bg-primary"
        :title="`Reserva - ${reserva.habitacion.nombre_habitacion} (${reserva.categoria.nombre_categoria})`"></v-toolbar>

      <v-card-text class="px-0 py-0">
        <VerReserva :reserva="reserva" />
      </v-card-text>

      <v-card-actions class="justify-end bg-primary">
        <v-btn variant="elevated" color="red" @click="cerrarDialogoVerReserva">Cerrar</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>

  <!-- dialogo para modificar datos de la reserva -->
  <v-dialog v-model="dialogo_modificar_reserva" transition="dialog-bottom-transition" :fullscreen="$vuetify.display.xs"
    :max-width="$vuetify.display.xs ? undefined : 770" persistent scrollable>
    <v-card class="px-0 bg-primary">

      <v-toolbar class="text-center font-weight-medium text-wrap bg-primary" title="Administrar la Reserva"></v-toolbar>

      <v-card-text class="px-0 py-0">
        <ModificarReserva :reserva="reserva" />
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="elevated" color="red" @click="cerrarDialogoModificarReserva"
          prepend-icon="mdi-close">Cerrar</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>

  <!-- dialogo el check in de la reserva -->
  <v-dialog v-model="dialogo_check_in" transition="dialog-bottom-transition" :fullscreen="$vuetify.display.xs"
    :max-width="$vuetify.display.xs ? undefined : 770" persistent scrollable>
    <v-card class="px-0">

      <v-toolbar class="text-center font-weight-medium text-wrap bg-primary text-success"
        title="Check In - Reserva"></v-toolbar>

      <v-card-text class="px-0 py-0">
        <CheckInReserva :reserva="reserva" />
      </v-card-text>

      <v-card-actions class="justify-end bg-primary">
        <v-btn variant="elevated" color="red" @click="cerrarDialogoCheckIn" prepend-icon="mdi-close">Cerrar</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script>
import VerReserva from '@/layouts/client/reservas/VerReserva.vue';
import ModificarReserva from './ModificarReserva.vue';
import CheckInReserva from './CheckInReserva.vue';
import moment from 'moment'
import 'moment/locale/es'
import { getBusiness } from '@/services/negocio.service';

export default {

  components: {
    VerReserva,
    ModificarReserva,
    CheckInReserva,
  },
  props: {
    reservasTipoUno: {
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
      // ############################################
      // datos para ver reserva
      dialogo_ver_reserva: false,
      // ############################################

      // ############################################
      // datos para ver reserva
      dialogo_modificar_reserva: false,
      // ############################################

      // ############################################
      // datos para check in
      dialogo_check_in: false,
      // ############################################
    }
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

      if (!this.search) return this.reservasTipoUno;

      const texto = this.search.toLowerCase();


      return this.reservasTipoUno.filter(d => {
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
    // dialogo para mostrar la reserva
    abrirDialogVerReserva(item) {
      this.reserva = item
      this.reserva.habitacion.categoria = item.categoria
      this.dialogo_ver_reserva = true
    },
    cerrarDialogoVerReserva() {
      this.dialogo_ver_reserva = false
    },
    // fin
    // ############################################

    // ############################################
    // dialogo para modificar la reserva
    abrirDialogoModificarReserva(item) {
      this.reserva = item
      this.dialogo_modificar_reserva = true
    },
    cerrarDialogoModificarReserva() {
      this.dialogo_modificar_reserva = false
    },
    // fin
    // ############################################

    // ############################################
    // dialogo para modificar la reserva
    abrirDialogoCheckIn(item) {
      this.reserva = item
      this.dialogo_check_in = true
    },
    cerrarDialogoCheckIn() {
      this.dialogo_check_in = false
    },
    // fin
    // ############################################

    // ############################################
    // enviar mensaje al telefono de whatsapp
    abrirWhatsapp(item) {
      console.log(item)
      const checkIn = moment(item.check_in_reserva).format('dddd, DD [de] MMMM [de] YYYY')
      const checkOut = moment(item.check_out_reserva).format('dddd, DD [de] MMMM [de] YYYY')
      const horaLlegadaTexto = item.hora_llegada_reserva
        ? `⏰ Hora de llegada: ${item.hora_llegada_reserva}`
        : `⏰ Hora de llegada: Por confirmar`
      const codigoPais = item.usuario.codigo_pais_usuario      // ej: '591'
      const telefono = item.usuario.telefono_usuario   // ej: '70369766'
      const nombre = item.usuario.nombre_usuario       // ej: 'Bruno'
      const habitacion = item.habitacion.nombre_habitacion + ' - (' + item.categoria.nombre_categoria + ')'     // ej: '103 M - MATRIMONIAL'
      const codigo = item.codigo_reserva       // ej: 'YBN31'

      const mensaje = [
        `Hola ${nombre} 👋`,
        `Le escribimos desde *${this.negocio.nombre_negocio.toUpperCase()}* 🏨`,
        ``,
        `📌 Reserva: ${codigo}`,
        `🛏️ Habitación: ${habitacion}`,
        ``,
        `📅 Check-in: ${checkIn}`,
        `📅 Check-out: ${checkOut}`,
        horaLlegadaTexto,
        ``,
        `Quedamos atentos a cualquier consulta.`,
        `¡Gracias por preferirnos!`
      ].join('\n')

      const url = `https://wa.me/${codigoPais}${telefono}?text=${encodeURIComponent(mensaje)}`

      window.open(url, '_blank')
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
    }
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
