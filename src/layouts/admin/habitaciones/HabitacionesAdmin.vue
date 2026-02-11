<template>
  <v-card class="pa-4" elevation="2">

    <div class="d-flex justify-space-between align-center mb-4">
      <h3 class="text-h6 text-error font-weight-regular">Lista de Habitaciones en el Hotel</h3>

      <v-btn color="success" prepend-icon="mdi-plus" @click="agregarNuevo">
        Añadir Habitacion
      </v-btn>
    </div>

    <!-- Controles -->
    <div class="d-flex justify-space-between align-center mb-2">
      <div>
        <v-select v-model="itemsPerPage" variant="outlined" :items="[5, 10, 20]" density="compact"
          style="max-width:100px" />
      </div>
      <v-text-field v-model="search" variant="outlined" density="compact" placeholder="Buscar..."
        style="max-width: 200px" prepend-inner-icon="mdi-magnify" />
    </div>

    <!-- Tabla -->
    <v-table class="tabla-custom" density="compact" hover>
      <thead>
        <tr>
          <th class="text-center">N°</th>
          <th class="text-center">Tipo</th>
          <th class="text-center">Detalle de la Habitacion</th>
          <th class="text-center">Adultos</th>
          <th class="text-center">Niños</th>
          <th class="text-center">Precio Ahora (en Bolivianos)</th>
          <th class="text-center">Precio Antes (en Bolivianos)</th>
          <th class="text-center">Estado</th>
          <th class="text-center">Acción</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, i) in paginatedItems" :key="item.id_habitacion" class="text-center">
          <td>{{ i + 1 + (page - 1) * itemsPerPage }}</td>
          <td class="text-left"><v-chip color="red" style="font-size: 1rem;" variant="elevated">{{
            item.nombre_habitacion }} ({{ item.categoria.nombre_categoria }})</v-chip></td>
          <td class="text-justify text-no-wrap w-50">
            <v-list lines="one">
              <v-list-item v-for="cama in item.camas" :key="cama.id_cama">
                <v-list-item-title>
                  <strong>cama - {{ cama.tipo_cama }}</strong>
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ cama.descripcion_cama }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </td>
          <td>{{ item.adultos_habitacion }}</td>
          <td>{{ item.ninos_habitacion }}</td>
          <td><v-chip style="font-size: 1rem;" color="red" variant="elevated">{{ item.categoria.precio_ahora_categoria
              }}</v-chip></td>
          <td><v-chip color="error" class="text-decoration-line-through">{{ item.categoria.precio_antes_categoria
              }}</v-chip></td>
          <td><v-chip
              :color="item.estado_habitacion == 1 ? 'success' : item.estado_habitacion == 2 ? 'error' : item.estado_habitacion == 3 ? 'warning' : item.estado_habitacion == 4 ? 'primary' : ''"
              variant="elevated" @click="cambiarEstado(item)">{{ item.estado_habitacion == 1 ? 'VACANTE' :
                item.estado_habitacion == 2 ? 'OCUPADO' :
                  item.estado_habitacion == 3 ? 'LIMPIEZA' : item.estado_habitacion == 4 ? 'FUERA S.' : '' }}</v-chip></td>
          <td class="text-center">
            <v-btn v-if="item.restriccion" icon color="indigo" size="small" @click="dialogoAbrirFechas(item)">
              <v-icon>mdi-calendar-check</v-icon>
            </v-btn>
            <v-btn v-else icon color="red" size="small" @click="dialogoCerrarFechas(item)">
              <v-icon>mdi-calendar-remove</v-icon>
            </v-btn>
            <v-btn icon color="warning" size="small" @click="editar(item)">
              <v-icon>mdi-pencil</v-icon>
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

  <!-- dialogo para modificar datos de la reserva -->
  <v-dialog v-model="dialogo_check_out" transition="dialog-bottom-transition" :fullscreen="$vuetify.display.xs"
    :max-width="$vuetify.display.xs ? undefined : 370" persistent scrollable>
    <v-card class="px-0">

      <v-toolbar class="text-center font-weight-medium text-wrap bg-primary" title="ELEJIR UN ESTADO"></v-toolbar>

      <v-card-text>
        <v-container>
          <v-row v-if="habitacion.estado_habitacion == 3">
            <v-col cols="12">
              <v-btn block color="success" @click="modificarEstado(1)">VACANTE</v-btn>
            </v-col>
            <v-col cols="12">
              <v-btn block color="primary" @click="modificarEstado(4)">FUERA SERVICIO</v-btn>
            </v-col>
          </v-row>
          <v-row v-if="habitacion.estado_habitacion == 2 || habitacion.estado_habitacion == 1">
            <v-col cols="12">
              <v-btn block color="yellow" @click="modificarEstado(3)">LIMPIEZA</v-btn>
            </v-col>
            <v-col cols="12">
              <v-btn block color="primary" @click="modificarEstado(4)">FUERA SERVICIO</v-btn>
            </v-col>
          </v-row>
          <v-row v-if="habitacion.estado_habitacion == 4">
            <v-col cols="12">
              <v-btn block color="success" @click="modificarEstado(1)">VACANTE</v-btn>
            </v-col>
            <v-col cols="12">
              <v-btn block color="yellow" @click="modificarEstado(3)">LIMPIEZA</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions class="justify-end bg-primary">
        <v-btn variant="elevated" color="red" @click="cerrarDialogoCheckOut" prepend-icon="mdi-close">Cerrar</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>

  <!-- dialogo para cerrar fechas para la habitacion -->
  <v-dialog v-model="dialogo_cerrar_fechas" transition="dialog-bottom-transition" :fullscreen="$vuetify.display.xs"
    :max-width="$vuetify.display.xs ? undefined : 770" persistent scrollable>
    <v-card class="px-0">

      <v-toolbar class="text-center font-weight-medium text-wrap bg-primary"
        title="CERRAR FECHAS - HABITACION"></v-toolbar>

      <v-card-text>
        <CalendarioAbrirCerrar :restricciones="habitacion.restricciones" @modificarFechasReserva="editarCerrarFechas" />
      </v-card-text>

      <v-card-actions class="justify-end bg-primary">
        <v-btn variant="elevated" color="red" @click="cerrarDialogoCerrarFechas" prepend-icon="mdi-close">Cerrar</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>

  <!-- dialogo para abrir fechas para la habitacion -->
  <v-dialog v-model="dialogo_abrir_fechas" transition="dialog-bottom-transition" :fullscreen="$vuetify.display.xs"
    :max-width="$vuetify.display.xs ? undefined : 770" persistent scrollable>
    <v-card class="px-0">

      <v-toolbar class="text-center font-weight-medium text-wrap bg-primary"
        title="ABRIR FECHAS - HABITACION"></v-toolbar>

      <v-card-text>
        <CalendarioReservas :restriccion="habitacion.restriccion" :restricciones="habitacion.restricciones"
          @modificarFechasReserva="abrirFechasHabitacion" />
      </v-card-text>

      <v-card-actions class="justify-end bg-primary">
        <v-btn variant="elevated" color="red" @click="cerrarDialogoAbrirFechas" prepend-icon="mdi-close">Cerrar</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>

  <!-- capa protectora de proceso -->
  <v-overlay :model-value="overlay" class="align-center justify-center" persistent>
    <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
  </v-overlay>

</template>

<script>
import CalendarioAbrirCerrar from '../reservas/CalendarioAbrirCerrar.vue';
import CalendarioReservas from '../reservas/CalendarioReservas.vue';
import { getAllRoom, modifyOnlyRoom } from '@/services/habitacion.service';
import { getRestrictions, modifyRestriction, saveRestriction } from '@/services/restriccion.service';
import moment from 'moment'
import 'moment/locale/es'

moment.locale('es')

export default {
  name: "HabitacionesAdmin",
  components: {
    CalendarioAbrirCerrar,
    CalendarioReservas
  },
  data() {
    return {
      search: "",
      page: 1,
      itemsPerPage: 20,

      datosOriginales: [],
      restriccionOriginal: {},

      habitacion: {},
      dialogo_check_out: false,

      dialogo_cerrar_fechas: false,
      dialogo_abrir_fechas: false,

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
      if (!this.search) return this.datosOriginales;

      const texto = this.search.toLowerCase();

      return this.datosOriginales.filter(d =>
        d.categoria?.nombre_categoria?.toLowerCase().includes(texto) ||
        d.descripcion_habitacion?.toLowerCase().includes(texto) ||
        String(d.categoria?.precio_ahora_categoria).includes(texto) ||
        String(d.categoria?.precio_antes_categoria).includes(texto) ||
        String(d.numero_habitacion).includes(texto) ||
        d.nombre_habitacion?.toLowerCase().includes(texto) ||
        String(d.estado_habitacion).includes(texto)
      )
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
    agregarNuevo() {
      this.$router.push({ name: 'nueva-habitacion-admin' })
    },

    // ################### ABRIR FECHAS DE LA HABITACION #########################
    abrirFechasHabitacion(item) {
      if (this.restriccionOriginal.fecha_inicial_restriccion == item.fecha_inicial_restriccion && this.restriccionOriginal.fecha_final_restriccion == item.fecha_final_restriccion) {
        try {
          this.$nextTick(async () => {
            // Simular login
            this.overlay = true;
            setTimeout(async () => {
              this.overlay = false
              this.dialogo_abrir_fechas = false
              item.estado_restriccion = 2
              console.log(item)
              let res = await modifyRestriction(item)
              if (res.status == 200) {
                this.$swal({
                  title: "Fechas Abiertas!",
                  text: `se ha modificado las restriccion y se ha dejado abierto la disponibilidad de la habitacion CORRECTAMENTE!!!`,
                  icon: "success",
                  timer: 4500,
                  didClose: () => {
                    this.overlay = false
                    this.$router.go(0)
                  }
                })
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
      }
      else {
        this.$swal({
          title: "Error!",
          text: "debe elejir las mismas fechas para abrir y disponer de la habitacion",
          icon: "error",
          timer: 3500,
          didClose: () => {
            this.overlay = false
            this.$router.go(0)
          }
        })
      }
    },
    dialogoAbrirFechas(item) {
      this.habitacion = item
      this.restriccionOriginal = {
        fecha_final_restriccion: item.restriccion.fecha_final_restriccion,
        fecha_inicial_restriccion: item.restriccion.fecha_inicial_restriccion
      }
      this.dialogo_abrir_fechas = true
    },
    cerrarDialogoAbrirFechas() {
      this.dialogo_abrir_fechas = false
    },
    // #################### FIN ########################

    // #################### CERRAR FECHAS DE HABITACION ########################
    editarCerrarFechas(item) {
      const restriccion = {
        id_habitacion: this.habitacion.id_habitacion,
        fecha_inicial_restriccion: item.fecha_inicial,
        hora_inicial_restriccion: moment().format('HH:mm'),
        fecha_final_restriccion: item.fecha_final,
        hora_final_restriccion: '12:00',
        motivo_restriccion: 'se ha cerrado las fechas para la habitacion',
        estado_restriccion: 1
      }

      try {
        this.$nextTick(async () => {
          // Simular login
          this.overlay = true;
          setTimeout(async () => {
            this.overlay = false
            let res = await saveRestriction(restriccion)
            if (res.status == 200) {
              this.$swal({
                title: "Fechas Cerradas!",
                text: `se ha cerrado las fechas para restringir la habitacion CORRECTAMENTE!!!`,
                icon: "success",
                timer: 3500,
                didClose: () => {
                  this.overlay = false
                  this.$router.go(0)
                }
              })
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
    dialogoCerrarFechas(item) {
      this.habitacion = item
      this.dialogo_cerrar_fechas = true
    },
    cerrarDialogoCerrarFechas() {
      this.dialogo_cerrar_fechas = false
    },
    // #################### FIN ########################

    editar(item) {
      this.$router.push({
        name: 'editar-habitacion-admin',
        params: { id_habitacion: item.id_habitacion }
      })
    },
    cambiarEstado(item) {
      this.habitacion = item
      if(item.estado_habitacion != 2)
        this.dialogo_check_out = true
    },
    async modificarEstado(estado) {
      try {
        this.$nextTick(async () => {
          // Simular login
          this.overlay = true;
          setTimeout(async () => {
            this.overlay = false
            this.dialogo_check_out = false
            this.habitacion.estado_habitacion = estado
            let res = await modifyOnlyRoom(this.habitacion)
            if (res.status == 200) {
              this.$swal({
                title: "Estado Modificado!",
                text: `se ha modificado el estado de la habitacion CORRECTAMENTE!!!`,
                icon: "success",
                timer: 4500,
                didClose: () => {
                  this.overlay = false
                  this.$router.go(0)
                }
              })
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
    cerrarDialogoCheckOut() {
      this.dialogo_check_out = false
    },

    eliminar(item) {
      if (confirm("¿Eliminar " + item.titulo + "?")) {
        this.datosOriginales = this.datosOriginales.filter(
          (d) => d.id !== item.id
        );
      }
    },
    async obtenerTodasHabitaciones() {
      try {
        let res = await getAllRoom()
        if (res.status == 201 && res.data.data.length > 0) {
          this.datosOriginales = res.data.data

          this.datosOriginales.forEach(item => {
            const restricciones = item.restricciones.filter(item => item.reserva == null)
            if (restricciones) {
              item.restriccion = restricciones[0]
            }
            item.restricciones = item.restricciones.filter(ele => ele != restricciones[0])
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
  mounted() {
    this.obtenerTodasHabitaciones()
  }
};
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
