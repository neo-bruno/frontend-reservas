<template>
  <swiper :slides-per-view="1" :space-between="0" :loop="false" class="pa-2">
    <swiper-slide>
      <v-card class="rounded-xl" elevation="5">
        <!-- Carrusel interno de imágenes -->
        <swiper :slides-per-view="1" :loop="item.imagenes.length > 1" :style="{
          '--swiper-navigation-color': '#333',
          '--swiper-pagination-color': '#333',
        }" :pagination="{ clickable: true }" :modules="modules" class="rounded-t-xl">
          <swiper-slide v-for="(img, i) in item.imagenes" :key="i">
            <v-img :src="img" height="180" cover @click="mostrarDescripcion">
              <template #append>
                <v-btn icon="mdi-heart-outline" variant="flat" size="small" class="ma-2" color="white" />
              </template>
            </v-img>
          </swiper-slide>
          <!-- Paginación se muestra automáticamente con configuración -->
        </swiper>

        <!-- Contenido de la tarjeta -->
        <v-card-text>
          <div class="d-flex justify-space-between align-center">
            <span class="text-subtitle-2 font-weight-medium">
              {{ item.ubicacion }}
            </span>
            <span class="d-flex align-center text-subtitle-2 font-weight-medium">
              <v-icon size="14" color="amber-darken-2" class="mr-1">mdi-star</v-icon>
              {{ item.rating }}
            </span>
          </div>

          <div class="text-caption text-truncate">
            {{ item.nombre }}
          </div>
          <div class="text-caption text-grey">
            A {{ item.distancia }} km de distancia<br />
            {{ item.fecha }}
          </div>
          <div class="mt-1 font-weight-bold">
            {{ item.precio }} <span class="text-caption">por {{ item.noches }} noches</span>
          </div>
        </v-card-text>
      </v-card>
    </swiper-slide>
  </swiper>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules'; // ✅ FIX
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default {
  name: 'HabitacionAdmin',
  props: {
    item: Object,
  },
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      modules: [Navigation, Pagination],
    };
  },
  methods:{
    mostrarDescripcion(){
      this.$router.push({ name: 'descripcion_habitacion'})
    }
  }
};

</script>

<style scoped>
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
