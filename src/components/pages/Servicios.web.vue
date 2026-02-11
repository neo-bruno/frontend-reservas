<template>
  <v-container class="py-12 px-4 px-md-12">
    <v-row>
      <!-- Texto a la izquierda -->
      <v-col cols="12" md="6">
        <p class="font-weight-medium text-secondary">{{ seccion.nombre_seccion }}</p>
        <h2 class="text-h4 font-weight-bold mb-4">{{ seccion.titulo_seccion }}</h2>
        <p class="mb-6">
          {{ seccion.descripcion_seccion }}
        </p>

        <div class="mb-5" v-for="(item, index) in seccion.iconos" :key="index">
          <div class="d-flex align-center mb-2">
            <v-icon color="secondary" class="mr-2">mdi-{{ item.nombre_icono }}</v-icon>
            <strong>{{ item.titulo_icono }}</strong>
          </div>
          <p class="mb-4 text-body-2">{{ item.descripcion_icono }}</p>
        </div>

      </v-col>

      <!-- Imágenes con scroll a la derecha -->
      <v-col cols="12" md="6">
        <div class="image-scroll-container">
          <v-img
            v-for="(foto, i) in seccion.fotos"
            :key="i"
            :src="foto.url_foto"
            class="mb-4 rounded-lg"
            height="250"
            cover
          />
        </div>
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
        const res = await getSectionByType(3)
        if(res.status == 201){
          this.seccion = res.data.data
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  mounted(){
    this.obtenerSeccion()
  }
};
</script>

<style scoped>
.image-scroll-container {
  max-height: 600px;
  overflow-y: auto;
  padding-right: 8px;
}
</style>
