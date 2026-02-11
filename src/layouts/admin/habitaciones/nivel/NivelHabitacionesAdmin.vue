<template>
  <v-card class="pa-4" elevation="2">

    <div class="d-flex justify-space-between align-center mb-4">
      <h3 class="text-h6 text-error font-weight-regular">Niveles en las Habitaciones</h3>

      <v-btn color="success" prepend-icon="mdi-plus" @click="agregarNuevo">
        Añadir nuevo
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
          <th class="text-center">Nivel</th>
          <th class="text-left">Descripcion</th>
          <th class="text-center">Acción</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, i) in paginatedItems" :key="item.id_nivel" class="text-center">
          <td>{{ i + 1 + (page - 1) * itemsPerPage }}</td>
          <td>{{ item.nombre_nivel }}</td>
          <td class="text-left">{{ item.descripcion_nivel }}</td>

          <td class="text-center">
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
</template>

<script>
import { getLevels } from '@/services/nivel.service';

export default {
  name: "TablaAdmin",

  data() {
    return {
      search: "",
      page: 1,
      itemsPerPage: 10,

      datosOriginales: [],
    };
  },

  computed: {
    datosFiltrados() {
      if (!this.search) return this.datosOriginales;
      return this.datosOriginales.filter((d) =>
        d.nombre_nivel.toLowerCase().includes(this.search.toLowerCase()) ||
        d.descripcion_nivel.toLowerCase().includes(this.search.toLowerCase())
      );
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
      this.$router.push({ path: 'nivel-habitacion/nuevo' })
    },

    editar(item) {
      this.$router.push({
        name: 'editar-nivel-admin',
        params: { id_nivel: item.id_nivel }
      })
    },

    eliminar(item) {
      if (confirm("¿Eliminar " + item.titulo + "?")) {
        this.datosOriginales = this.datosOriginales.filter(
          (d) => d.id !== item.id
        );
      }
    },
    async obtenerTodosNiveles() {
      try {
        let res = await getLevels()
        if (res.status == 201 && res.data.data.length > 0) {
          this.datosOriginales = res.data.data
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
  mounted() {
    this.obtenerTodosNiveles()
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
