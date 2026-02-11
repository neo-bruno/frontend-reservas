<template>
  <v-container fluid class="pa-0">

    <!-- ===== KPIs ===== -->
    <v-row class="pa-1" dense>
      <v-col cols="12" sm="6" md="2" v-for="(kpi, i) in kpis" :key="i">
        <v-card elevation="3" class="pa-4 kpi-card">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-caption text-grey">{{ kpi.title }}</div>
              <div class="text-h5 font-weight-bold">{{ kpi.value }}</div>
            </div>
            <v-icon size="36" :color="kpi.color">{{ kpi.icon }}</v-icon>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- ===== CHECK-IN / CHECK-OUT ===== -->
    <v-row class="pa-1" dense>
      <v-col cols="12" md="6">
        <v-card elevation="3">
          <v-card-title class="bg-success mb-3">Próximos Check-in</v-card-title>
          <v-card-text>
            <v-table class="tabla-custom" density="compact" hover>
              <thead>
                <tr>
                  <th class="text-center">Codigo</th>
                  <th class="text-center">Reserva</th>
                  <th class="text-center">Estado</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(item, i) in proximoCheckIn" :key="item.id_habitacion" class="text-center"
                  :class="item.estado_reserva == 3 ? 'bg-green-lighten-5' : ''">
                  <td class="text-left">
                    <v-chip color="red" style="font-size: 1rem;" variant="elevated">{{ item.codigo_reserva
                    }}</v-chip>
                  </td>
                  <td class="text-left">
                    <v-list lines="one" :class="item.estado_reserva == 3 ? 'bg-green-lighten-5' : ''">
                      <v-list-item>
                        <v-list-item-title>
                          <strong>{{ fechasLiterales(item.check_in_reserva, item.check_out_reserva) }}</strong>
                        </v-list-item-title>
                        <v-list-item-subtitle class="text-no-wrap">
                          habitacion: <strong>{{ item.habitacion.nombre_habitacion }} - {{
                            item.categoria.nombre_categoria }}</strong>
                        </v-list-item-subtitle>
                        <v-list-item-subtitle class="text-no-wrap">
                          titular: <strong class="text-capitalize">{{ item.usuario.nombre_usuario }}</strong> -
                          telf.: <strong>({{ item.usuario.codigo_pais_usuario }}) {{ item.usuario.telefono_usuario
                          }}</strong>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </td>
                  <td>
                    <v-chip
                      :class="item.estado_reserva == 1 ? 'text-indigo' : item.estado_reserva == 2 ? 'text-warning' : item.estado_reserva == 3 ? 'text-success' : item.estado_reserva == 4 ? 'text-error' : item.estado_reserva == 5 ? 'text-info' : 'text-primary'"
                      variant="outlined">
                      {{ item.estado_reserva == 1 ? 'PENDIENTE' : item.estado_reserva == 2 ? 'EN PROCESO...' :
                        item.estado_reserva == 3 ? 'CONFIRMADO' : item.estado_reserva == 4 ? 'CANCELADO' :
                          item.estado_reserva == 5 ? 'LLEGO' : 'NO LLEGO' }}
                    </v-chip>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card elevation="3">
          <v-card-title class="bg-error mb-3">Próximos Check-out</v-card-title>
          <v-card-text>
            <v-table class="tabla-custom" density="compact" hover>
              <thead>
                <tr>
                  <th class="text-center">Codigo</th>
                  <th class="text-center">Reserva</th>
                  <th class="text-center">Estado</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(item, i) in proximoCheckOut" :key="item.id_habitacion" class="text-center"
                  :class="item.estado_reserva == 3 ? 'bg-red-lighten-5' : ''">
                  <td class="text-left">
                    <v-chip color="red" style="font-size: 1rem;" variant="elevated">{{ item.codigo_reserva
                    }}</v-chip>
                  </td>
                  <td class="text-left">
                    <v-list lines="one" :class="item.estado_reserva == 3 ? 'bg-red-lighten-5' : ''">
                      <v-list-item>
                        <v-list-item-title>
                          <strong>{{ fechasLiterales(item.check_in_reserva, item.check_out_reserva) }}</strong>
                        </v-list-item-title>
                        <v-list-item-subtitle class="text-no-wrap">
                          habitacion: <strong>{{ item.habitacion.nombre_habitacion }} - {{
                            item.categoria.nombre_categoria }}</strong>
                        </v-list-item-subtitle>
                        <v-list-item-subtitle class="text-no-wrap">
                          titular: <strong class="text-capitalize">{{ item.usuario.nombre_usuario }}</strong> -
                          telf.: <strong>({{ item.usuario.codigo_pais_usuario }}) {{ item.usuario.telefono_usuario
                          }}</strong>
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </td>
                  <td>
                    <v-chip
                      :class="item.estado_reserva == 1 ? 'text-indigo' : item.estado_reserva == 2 ? 'text-warning' : item.estado_reserva == 3 ? 'text-success' : item.estado_reserva == 4 ? 'text-error' : item.estado_reserva == 5 ? 'text-info' : 'text-primary'"
                      variant="outlined">
                      {{ item.estado_reserva == 1 ? 'PENDIENTE' : item.estado_reserva == 2 ? 'EN PROCESO...' :
                        item.estado_reserva == 3 ? 'CONFIRMADO' : item.estado_reserva == 4 ? 'CANCELADO' :
                          item.estado_reserva == 5 ? 'HOSPEDADO' : 'NO LLEGO' }}
                    </v-chip>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- ===== ALERTAS ===== -->
      <!-- <v-col cols="12" md="4">
        <v-card elevation="3" class="pa-4">
          <div class="text-subtitle-1 font-weight-medium mb-2">Alertas</div>

          <v-alert v-for="(alert, i) in alertas" :key="i" :type="alert.type" variant="tonal" class="mb-2">
            {{ alert.text }}
          </v-alert>
        </v-card>
      </v-col> -->
    </v-row>

    <!-- ===== GRAFICOS ===== -->
    <v-row class="pa-1" dense>
      <v-col cols="12" md="8">
        <v-card elevation="3" class="pa-4">
          <div class="text-subtitle-1 font-weight-medium">
            Reservas por Meses - <strong class="text-decoration-underline">{{ ano }}</strong>
          </div>
          <Bar :data="chartReservas" />
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="3" class="pa-4">
          <div class="d-flex justify-space-between">
            <div class="text-subtitle-1 font-weight-medium mb-2">
              Estados de reservas - <strong class="text-decoration-underline">{{ ano }}</strong>
            </div>
            <div>
              <v-select v-model="mes" variant="outlined" label="Mes" :items="meses" density="compact"
                prepend-inner-icon="mdi-chart-bar-stacked" style="max-width:250px" @update:modelValue="cargarDount" />
            </div>
          </div>
          <Doughnut :data="chartEstados" />
        </v-card>
      </v-col>
    </v-row>



    <!-- ===== ESTADO HABITACIONES + ACCESOS ===== -->
    <v-row class="pa-1" dense>
      <v-col cols="12" md="6">
        <v-card elevation="3" class="pa-4">
          <div class="text-subtitle-1 font-weight-medium mb-2">
            Estado de habitaciones
          </div>

          <v-row>
            <v-col cols="6" sm="3" v-for="(h, i) in estadoHabitaciones" :key="i">
              <v-sheet class="pa-3 text-center rounded" :color="h.color" elevation="1">
                <div class="text-h6 font-weight-bold">{{ h.value }}</div>
                <div class="text-caption">{{ h.title }}</div>
              </v-sheet>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card elevation="3" class="pa-4">
          <div class="text-subtitle-1 font-weight-medium mb-3">
            Accesos rápidos
          </div>

          <v-row dense>
            <v-col cols="6" v-for="(btn, i) in accesos" :key="i">
              <v-btn block :color="btn.color" variant="flat" @click="$router.push(btn.route)">
                <v-icon start>{{ btn.icon }}</v-icon>
                {{ btn.title }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import moment from 'moment'
import 'moment/locale/es'

import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { getMonthsYear, getReport, getReportGraphic, getReportMonth } from '@/services/reporte.service';
import { getAllRoom } from '@/services/habitacion.service';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
)

export default {
  name: 'DashboardAdmin',
  components: { Bar, Doughnut },

  data() {
    return {
      reservas: [],
      habitaciones: [],

      ano: 2026,
      mes: moment().month() + 1,
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
      meses: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],

      kpis: [
        { title: 'Check-In de Hoy', value: 0, icon: 'mdi-calendar-check', color: 'success' },
        { title: 'Check-Out de Hoy', value: 0, icon: 'mdi-calendar-remove', color: 'error' },
        { title: 'Reservas por llegar', value: 0, icon: 'mdi-calendar-end', color: 'blue' },
        { title: 'Reservas por salir', value: 0, icon: 'mdi-calendar-start', color: 'red' },
        { title: 'Habitaciones Ocupadas', value: '18 / 25', icon: 'mdi-bed', color: 'indigo' },
      ],
      reservas_hoy: 0,
      ingresos_mes: 0,
      cantidad_total_habitaciones: 0,
      cantidad_habitaciones_ocupadas: 0,
      reservas_pendientes: 0,

      chartReservas: {
        labels: [],
        datasets: [
          {
            label: 'Reservas',
            data: [],
            backgroundColor: '#1976D2'
          }
        ]
      },

      chartEstados: {
        labels: ['Llegaron', 'Cancelados', 'No Llegaron'],
        datasets: [
          {
            data: [],
            backgroundColor: ['#43A047', '#FB8C00', '#E53935']
          }
        ]
      },

      proximoCheckIn: [],
      proximoCheckOut: [],

      alertas: [
        { type: 'warning', text: '4 reservas pendientes de pago' },
        { type: 'error', text: '2 habitaciones en mantenimiento' },
        { type: 'info', text: 'Ocupación alta este fin de semana' }
      ],

      estadoHabitaciones: [
        { title: 'Libres', value: 7, color: 'green-lighten-3' },
        { title: 'Ocupadas', value: 15, color: 'red-lighten-3' },
        { title: 'Limpieza', value: 2, color: 'amber-lighten-3' },
        { title: 'Fuera Serv.', value: 1, color: 'grey-lighten-2' }
      ],

      accesos: [
        { title: 'Reservas', icon: 'mdi-calendar', color: 'primary', route: '/admin/reservas' },
        { title: 'Habitaciones', icon: 'mdi-bed', color: 'red', route: '/admin/habitaciones' },
        { title: 'Servicios', icon: 'mdi-room-service', color: 'grey-lighten-1', route: '/admin/servicios' },
        { title: 'Pagina', icon: 'mdi-web', color: 'secondary', route: '/admin/principal' }
      ]
    }
  },

  methods: {
    fechasLiterales(fechaLlegada, fechaSalida) {
      return `${moment(fechaLlegada, 'YYYY-MM-DD').format('dddd, D')} - ${moment(fechaSalida, 'YYYY-MM-DD').format('D [de] MMMM [del] YYYY')}`
    },
    async cargarChart() {
      this.ano = moment().year()
      const res = await getReportMonth(this.ano)
      let data = null
      if (res.status == 201)
        data = res.data.data

      const labels = []
      const valores = []

      const mesesCortos = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

      // Inicializamos en 0
      for (let i = 1; i <= 12; i++) {
        labels.push(mesesCortos[i - 1])
        valores.push(0)
      }

      // Llenamos con datos reales
      data.forEach(r => {
        valores[r.mes - 1] = Number(r.total)
      })

      this.chartReservas = {
        labels: labels,
        datasets: [
          {
            label: 'Reservas',
            data: valores,
            backgroundColor: '#1976D2'
          }
        ]
      }
    },
    async cargarDount() {
      try {
        /* =========================
           MES ACTUAL
        ========================= */
        const mesActual = this.mesesCatalogo.find(
          item => item.title == this.mes || item.value == this.mes
        )
        if (!mesActual) return

        this.mes = mesActual.title
        const mes_numero = mesActual.value

        /* =========================
           MESES DEL BACKEND
        ========================= */
        const res = await getMonthsYear(this.ano)

        if (res.status === 201) {

          const datos = res.data.data

          this.meses = datos.map(item =>
            this.meses[item.mes - 1]
          )
        }

        /* =========================
           REPORTE
        ========================= */
        const resp = await getReportGraphic(this.ano, mes_numero)

        if (resp.status === 201 && resp.data.data.length) {
          const item = resp.data.data[0]
          const valores = [
            item.hospedados,
            item.cancelados,
            item.no_llegaron
          ]
          this.chartEstados = {
            labels: ['llegaron', 'Cancelados', 'No Llegaron'],
            datasets: [
              {
                data: valores,
                backgroundColor: ['#43A047', '#E53935', '#FB8C00']
              }
            ]
          }
        }
      } catch (error) {
        console.error('Error en cargarDount:', error)
      }
    },
    async cargarDatosHabitacion(){
      try {
        this.estadoHabitaciones[0].value = this.habitaciones.filter(ele => ele.estado_habitacion == 1).length
        this.estadoHabitaciones[1].value = this.habitaciones.filter(ele => ele.estado_habitacion == 2).length
        this.estadoHabitaciones[2].value = this.habitaciones.filter(ele => ele.estado_habitacion == 3).length
        this.estadoHabitaciones[3].value = this.habitaciones.filter(ele => ele.estado_habitacion == 4).length
      } catch (error) {
        console.log(error)
      }
    },

    async obtenerReservas(tipo) {
      const mes = moment().month() + 1
      try {
        const res = await getReport(this.ano, mes, tipo)
        if (res.status == 201 && res.data.data.length > 0)
          return res.data.data
        return []
      } catch (error) {
        console.log(error)
      }
    },
    async obtenerHabitaciones() {
      try {
        const res = await getAllRoom()
        if (res.status == 201 && res.data.data.length > 0)
          this.habitaciones = res.data.data
      } catch (error) {
        console.log(error)
      }
    },
    async inicializarDatosKpin() {

      this.reservas = await this.obtenerReservas('pasado')

      const totales = this.reservas.reduce((acc, r) => {
        acc.servicios += Number(r.servicio_reserva) || 0

        if (r.estado_reserva === 5) {
          acc.reservas += Number(r.monto_total_reserva) || 0
        }

        return acc
      }, { servicios: 0, reservas: 0 })

      const contador = this.habitaciones.reduce((acc, r) => {
        if (r.estado_habitacion == 2)
          acc.ocupadas += 1
        return acc
      }, { ocupadas: 0 })

      const reservas_hoy = await this.obtenerReservas('hoy')
      const reservas_check_out = await this.obtenerReservas('check_out_hoy')

      this.proximoCheckIn = await this.obtenerReservas('entrada')

      this.proximoCheckOut = await this.obtenerReservas('salida')


      this.kpis[0].value = reservas_hoy.length
      this.kpis[1].value = reservas_check_out.length
      this.kpis[2].value = this.proximoCheckIn.length
      this.kpis[3].value = this.proximoCheckOut.length
      this.kpis[4].value = `${contador.ocupadas}/${this.habitaciones.length}`
    }
  },
  async mounted() {
    try {

      await this.obtenerHabitaciones()

      await this.inicializarDatosKpin()

      await this.cargarChart()

      await this.cargarDount()

      await this.cargarDatosHabitacion()

    } catch (error) {
      console.error('Error cargando dashboard:', error)
    }
  }

}
</script>

<style scoped>
.dashboard-bg {
  background: #b79b5b;
  min-height: 100vh;
}

.kpi-card {
  border-radius: 12px;
}

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
