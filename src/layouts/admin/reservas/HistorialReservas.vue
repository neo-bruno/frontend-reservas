<template>
  <v-sheet class="pa-3">
    <!-- Controles -->
    <div class="d-flex justify-space-between align-center">
      <div>
        <v-select v-model="itemsPerPage" variant="outlined" :items="[5, 10, 20]" density="compact"
          style="max-width:100px" />
      </div>
      <div class="px-7">
        <div style="font-size: 1.3rem;" class="font-weight-medium text-uppercase text-indigo">
          Reporte de Reservas: <strong class="text-decoration-underline">{{ mesLiteral(mes) }}</strong> - <strong
            class="text-decoration-underline">{{ ano }}</strong>
        </div>
        <p style="font-size: .8rem;" class="font-weight-regular text-center">(Se muestra la lista de reservas filtrado
          por mes y año)</p>
      </div>
      <div>
        <v-select v-model="ano" variant="outlined" label="elija el año" :items="anos" density="compact"
          prepend-inner-icon="mdi-finance" style="max-width:150px" />
      </div>

      <div>
        <v-select v-model="mes" variant="outlined" label="elija el mes" :items="meses" density="compact"
          prepend-inner-icon="mdi-chart-bar-stacked" style="max-width:200px" @update:modelValue="onChangeMes" />
      </div>

      <v-text-field v-model="search" variant="outlined" density="compact" placeholder="Buscar..."
        style="max-width: 200px" prepend-inner-icon="mdi-magnify" />
    </div>

    <v-card elevation="7" ref="tablaWrapper" class="tabla-wrapper">
      <!-- Tabla -->
      <v-table class="tabla-custom" density="compact" hover>
        <thead>
          <tr>
            <th class="text-center">Codigo</th>
            <th class="text-center">Reserva</th>
            <th class="text-center">Adelanto</th>
            <th class="text-center">Total</th>
            <th class="text-center">Servicios</th>
            <th class="text-center">Estado</th>
            <th class="text-center">Acción</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, i) in paginatedItems" :key="item.id_habitacion" class="text-center">
            <td class="text-left">
              <v-chip color="red" style="font-size: 1rem;" variant="elevated">{{ item.codigo_reserva
              }}</v-chip>
            </td>
            <td class="text-left">
              <v-list lines="three">
                <v-list-item>
                  <v-list-item-title>
                    <strong>{{ fechasLiterales(item.check_in_reserva, item.check_out_reserva) }}</strong>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    titular: <strong class="text-capitalize">{{ item.usuario.nombre_usuario }}</strong> -
                    telf.: <strong>({{ item.usuario.codigo_pais_usuario }}) {{ item.usuario.telefono_usuario
                    }}</strong>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    habitacion: <strong class="ms-1">{{ item.habitacion.nombre_habitacion }} ({{
                      item.categoria.nombre_categoria }})</strong>
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </td>
            <td v-if="item.pago.id_pago > 0">
              $<span class="font-weight-bold">{{ item.pago.monto_pago }}</span>
            </td>
            <td v-else></td>
            <td v-if="item.estado_reserva == 5">
              $<span class="font-weight-bold">{{ item.monto_total_reserva }}</span>
            </td>
            <td v-else>

            </td>
            <td>
              $<span class="font-weight-bold">{{ item.servicio_reserva }}</span>
            </td>
            <td>
              <v-chip
                :class="item.estado_reserva == 1 ? 'text-indigo' : item.estado_reserva == 2 ? 'text-warning' : item.estado_reserva == 3 ? 'text-success' : item.estado_reserva == 4 ? 'text-error' : item.estado_reserva == 5 ? 'text-success' : 'text-primary'"
                variant="outlined">
                {{ item.estado_reserva == 1 ? 'PENDIENTE' : item.estado_reserva == 2 ? 'EN PROCESO...' :
                  item.estado_reserva == 3 ? 'CONFIRMADO' : item.estado_reserva == 4 ? 'CANCELADO' :
                    item.estado_reserva == 5 ? 'LLEGO' : 'NO LLEGO' }}
              </v-chip>
            </td>
            <td class="text-center">
              <v-btn icon color="info" size="small" @click="abrirDialogoModificarReserva(item)">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>

        <!-- FOOTER REAL (SENTINELA) -->
        <tfoot class="footer-totales">
          <tr style="font-size: 1.2rem;">
            <td></td>
            <td class="text-right font-weight-medium">
              TOTALES
            </td>
            <td class="text-center font-weight-medium">
              ${{ totalAdelantos }}
            </td>
            <td class="text-center font-weight-medium bg-yellow text-primary">
              ${{ totalGeneral }}
            </td>
            <td class="text-center font-weight-medium bg-success text-primary">
              ${{ totalServicios }}
            </td>
            <td></td>
            <td></td>
          </tr>
        </tfoot>

      </v-table>


      <!-- Paginación -->
      <div class="d-flex justify-end mt-3">
        <v-pagination v-model="page" :length="totalPages" density="comfortable"></v-pagination>
      </div>
    </v-card>

  </v-sheet>

  <!-- dialogo para modificar datos de la reserva -->
  <v-dialog v-model="dialogo_modificar_reserva" transition="dialog-bottom-transition" :fullscreen="$vuetify.display.xs"
    :max-width="$vuetify.display.xs ? undefined : 770" persistent scrollable>
    <v-card class="px-0">

      <v-toolbar class="text-center font-weight-medium text-wrap bg-primary"
        :title="`Cod.: ${reserva.codigo_reserva} - Hab.: ${reserva.habitacion.nombre_habitacion} (${reserva.categoria.nombre_categoria})`"></v-toolbar>

      <v-card-text>
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
                  <div class="d-flex justify-space-between"
                    v-for="habitacion_cama in reserva.habitacion.habitacion_camas" :key="habitacion_cama.id_cama"
                    style="font-size: .8rem;">
                    <div>
                      <v-icon>mdi-bed</v-icon> - <span class="text-uppercase">{{ habitacion_cama.cant_habitacion_cama }}
                        {{
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
                    <span class="px-2 text-primary text-capitalize font-weight-medium">({{
                      reserva.usuario.codigo_pais_usuario
                    }}) {{ reserva.usuario.telefono_usuario }}</span>
                  </div>
                </div>

                <v-divider class="my-3"></v-divider>

                <div>
                  <div class="text-body-2 font-weight-medium">Informacion de Reserva</div>
                  <div class="text-caption text-grey-darken-2">
                    <span>Codigo: </span>
                    <span class="px-2 text-primary text-capitalize font-weight-medium">{{ reserva.codigo_reserva
                    }}</span>
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
                    <span class="px-2 text-primary text-capitalize font-weight-medium">{{ reserva.pago.metodo_pago == 1
                      ?
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
                      class="px-2 text-primary text-capitalize font-weight-medium">{{ reserva.pago.estado_pago == 1 ?
                        'EN REVISION' : 'PAGO CONFIRMADO' }}
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
                    <span class="text-primary text-capitalize font-weight-medium">{{ reserva.descuento_reserva == 0 ? ''
                      :
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
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions class="justify-end bg-primary">
        <v-btn variant="elevated" color="red" @click="cerrarDialogoModificarReserva"
          prepend-icon="mdi-close">Cerrar</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>

</template>

<script>

import CambiarDatosReserva from './CambiarDatosReserva.vue';
import moment from 'moment'
import 'moment/locale/es'
import { getBusiness } from '@/services/negocio.service';
import { getMonthlyReport, getMonthsYear, getYears } from '@/services/reporte.service';

export default {

  components: {
    CambiarDatosReserva,
  },

  data() {
    return {
      search: "",
      page: 1,
      itemsPerPage: 5,
      negocio: {},
      reserva: {},
      reservas: [],
      items: [{ title: 'NO LLEGO', value: 6 }],
      // ############################################
      // datos para ver reserva
      dialogo_modificar_reserva: false,
      // ############################################

      ano: 0,
      anos: [],
      mes: null,
      mesesCatalogo: [
        { title: 'Enero', value: 1 },
        { title: 'Febrero', value: 2 },
        { title: 'Marzo', value: 3 },
        { title: 'Abril', value: 4 },
        { title: 'Mayo', value: 5 },
        { title: 'Junio', value: 6 },
        { title: 'Julio', value: 7 },
        { title: 'Agosto', value: 8 },
        { title: 'Septiembre', value: 9 },
        { title: 'Octubre', value: 10 },
        { title: 'Noviembre', value: 11 },
        { title: 'Diciembre', value: 12 }
      ],
      meses: [],

      footerAnclado: false,
      observerFooter: null,
    }
  },
  computed: {
    imagenPrincipal() {
      return this.reserva.habitacion?.imagenes?.length > 0
        ? this.reserva.habitacion.imagenes[0].url_imagen
        : '/img/no-image.jpg'
    },
    totalAdelantos() {
      return this.datosFiltrados.reduce((acc, r) => {
        return acc + (r.pago?.monto_pago || 0)
      }, 0)
    },

    totalServicios() {
      return this.datosFiltrados.reduce((acc, r) => {
        return acc + (Number(r.servicio_reserva) || 0)
      }, 0)
    },

    totalGeneral() {
      return this.datosFiltrados.reduce((acc, r) => {
        if (r.estado_reserva == 5) {
          return acc + (Number(r.monto_total_reserva) || 0)
        }
        return acc
      }, 0)
    },

    datosFiltrados() {
      const ESTADOS_RESERVA = {
        1: 'PENDIENTE',
        2: 'EN PROCESO...',
        3: 'CONFIRMADO',
        4: 'CANCELADO',
        5: 'LLEGO',
        6: 'NO LLEGO',
      }

      if (!this.search) return this.reservas;

      const texto = this.search.toLowerCase();


      return this.reservas.filter(d => {
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
    mesLiteral(indice) {
      const ESTADOS_RESERVA = {
        1: 'ENERO',
        2: 'FEBRERO',
        3: 'MARZO',
        4: 'ABRIL',
        5: 'MAYO',
        6: 'JUNIO',
        7: 'JULIO',
        8: 'AGOSTO',
        9: 'SEPTIEMBRE',
        10: 'OCTUBRE',
        11: 'NOVIEMBRE',
        12: 'DICIEMBRE',
      }
      return ESTADOS_RESERVA[indice] || ''
    },
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
    // enviar mensaje al telefono de whatsapp
    abrirWhatsapp(item) {
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

      console.log(codigoPais, telefono, nombre, habitacion, codigo)
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

    async onChangeMes() {
      try {
        this.reservas = []
        const res = await getMonthlyReport(this.ano, this.mes)
        if (res.status == 201 && res.data.data.length > 0) {
          this.reservas = res.data.data
        }
      } catch (error) {
        console.log(error)
      }
    },

    async obtenerAnos() {
      try {
        const res = await getYears()

        if (res.status === 201 && res.data.data.length > 0) {
          this.anos = res.data.data.map(item => item.anos)
          this.ano = this.anos[0]
        }
      } catch (error) {
        console.log(error)
      }
    },

    async obtenerMesesAno() {
      try {
        const res = await getMonthsYear(this.ano)

        if (res.status === 201 && res.data.data.length > 0) {

          // Mes actual (1 - 12)
          const mesActual = new Date().getMonth() + 1

          // Meses que vienen del backend
          let mesesBackend = res.data.data.map(item => item.mes)

          // Si no está el mes actual, lo agregamos
          if (!mesesBackend.includes(mesActual)) {
            mesesBackend.push(mesActual)
          }

          // Ordenar los meses
          mesesBackend.sort((a, b) => a - b)

          // Filtrar desde el catálogo
          this.meses = this.mesesCatalogo.filter(m =>
            mesesBackend.includes(m.value)
          )

          // Seleccionar el mes actual si existe
          const mesSeleccionado = this.meses.find(
            m => m.value === mesActual
          )

          this.mes = mesSeleccionado
            ? mesSeleccionado.value
            : this.meses[0].value
        }

      } catch (error) {
        console.log(error)
      }
    },

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
  async mounted() {
    try {

      await this.obtenerNegocio()

      await this.obtenerAnos()

      await this.obtenerMesesAno()

      await this.onChangeMes()

    } catch (error) {
      console.error('Error en mounted:', error)
    }
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

.footer-totales {
  position: sticky;
  bottom: 0;
  background: #242322ff;
  color: white;
  z-index: 5;
}

.footer-totales td {
  padding: 12px;
  border-top: 2px solid #111;
}
</style>
