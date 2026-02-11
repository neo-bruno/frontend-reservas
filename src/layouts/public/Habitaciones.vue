<template>
  <v-tabs v-model="tab" align-tabs="center" color="primary" show-arrows>
    <v-tab v-for="(categoria, index) in categorias" :key="index" :value="categoria.id_categoria">{{ categoria.nombre_categoria }}</v-tab>
  </v-tabs>

  <v-tabs-window v-model="tab">

    <!-- Simples -->
    <v-tabs-window-item :value="tab">
      <v-container class="px-1">
        <v-row dense justify="center">
          <v-col v-for="(item, index) in alojamientosFiltrados" :key="index" cols="12" sm="6" md="5" lg="3" xl="2">
            <HabitacionWeb :habitacion="item" />
          </v-col>
        </v-row>
      </v-container>
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script>
import HabitacionWeb from '@/components/pages/Habitacion.web.vue';
import { getCategories } from '@/services/categoria.service';
import { getAllRoom } from '@/services/habitacion.service';

export default {
  components: {
    HabitacionWeb,
  },
  data(){
    return {
      tab: 1,
      categorias: [],
      habitaciones: [],
    }
  },
  computed: {
    alojamientosFiltrados() {
      return this.habitaciones.filter(a => a.categoria.id_categoria === this.tab)
    }
  },
  methods: {
    async obtenerHabitaciones(){
      try {
        let res = await getAllRoom()
        if(res.status == 201 && res.data.data.length > 0){
          this.habitaciones = res.data.data
        }
      } catch (error) {
        console.log(error)
      }
    },
    async obtenerCategorias(){
      try {
        let res = await getCategories()
        if(res.status == 201 && res.data.data.length > 0){
          this.categorias = res.data.data
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  mounted() {
    this.obtenerHabitaciones()
    this.obtenerCategorias()
  }
}
</script>

<style lang="scss" scoped></style>
