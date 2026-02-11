<template>
  <v-container fluid class="py-12 px-4 px-md-12 bg-sextary">
    <div class="text-center mb-10">
      <p class="font-weight-medium text-secondary">{{ seccion.nombre_seccion }}</p>
      <h2 class="text-h4 font-weight-bold">{{ seccion.titulo_seccion }}</h2>
    </div>

    <v-row dense justify="center">
      <v-col
        v-for="(item, i) in seccion.iconos"
        :key="i"
        cols="12"
        sm="6"
        md="3"
        class="text-center mb-8"
      >
        <v-icon size="70" class="mb-4" color="secondary">mdi-{{ item.nombre_icono }}</v-icon>
        <div class="font-weight-bold mb-2" style="font-size: 1.5rem;">{{ item.titulo_icono }}</div>
        <p class="">{{ item.descripcion_icono }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getSectionByType } from '@/services/seccion.service';

export default {
  data() {
    return {
      seccion: {},
    };
  },
  methods:{
    async obtenerSeccion(){
      try {
        const res = await getSectionByType(4)
        if(res.status == 201){
          this.seccion = res.data.data
        }
      } catch (error) {
        console.log(error)
      }
    },

  },
  mounted(){
    this.obtenerSeccion()
  }
};
</script>
