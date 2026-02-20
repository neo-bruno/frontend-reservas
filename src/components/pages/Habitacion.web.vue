<template>
  <swiper :slides-per-view="1" :space-between="0" :loop="false" class="pa-2">
    <swiper-slide>
      <v-card class="rounded-xl" elevation="5">
        <!-- Carrusel interno de imágenes -->
        <swiper :slides-per-view="1" :loop="habitacion.imagenes.length > 1" :style="{
          '--swiper-navigation-color': '#333',
          '--swiper-pagination-color': '#333',
        }" :pagination="{ clickable: true }" :modules="modules" class="rounded-t-xl">
          <swiper-slide v-for="(img, i) in habitacion.imagenes" :key="i">
            <v-img :src="img.url_imagen" height="180" cover @click="mostrarDescripcion(habitacion.id_habitacion)">
              <template #append>
                <v-btn icon="mdi-heart-outline" variant="flat" size="small" class="ma-2" color="white" />
              </template>
              <template #placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular indeterminate color="grey" />
                </div>
              </template>
            </v-img>
          </swiper-slide>
          <!-- Paginación se muestra automáticamente con configuración -->
        </swiper>
        <!-- Contenido de la tarjeta -->
        <v-card-text class="pb-0 pt-2">
          <v-row>
            <v-col cols="5">
              <span class="text-subtitle-2 font-weight-medium">
                {{ habitacion.nombre_habitacion }} - {{ habitacion.categoria.nombre_categoria }}
              </span>
            </v-col>
            <v-col cols="4">
              <span class="font-weight-medium">
                <!-- <v-icon size="14" color="amber-darken-2" class="mr-1">mdi-star</v-icon>
                 {{ habitacion.rating }} -->
                <v-icon class="me-1">mdi-floor-plan</v-icon> <span class="font-weight-medium">{{
                  habitacion.nivel.nombre_nivel
                  }}</span>
              </span>
            </v-col>
          </v-row>
          <!-- <div class="d-flex justify-space-between align-center">
           </div> -->


          <div class="text-caption text-justify">
            <p class="descripcion" :class="{ 'descripcion--clamp': !mostrarCompleto }">
              {{ habitacion.detalle_habitacion }}
            </p>

            <a v-if="habitacion.detalle_habitacion.length > 80" class="ver-mas"
              @click="mostrarCompleto = !mostrarCompleto">
              {{ mostrarCompleto ? 'Ver menos' : 'Ver más' }}
            </a>
          </div>

          <div class="text-caption d-flex justify-space-between" v-for="cama in habitacion.camas" :key="cama.id_cama"
            style="font-size: .5rem;">
            <div>
              <v-icon>mdi-bed</v-icon> - <span class="text-uppercase">{{ cama.cantidad }} {{ cama.tipo_cama }}</span>
            </div>
            <div>
              <v-icon>mdi-{{ cama.icono_persona_cama }}</v-icon> {{ cama.cant_persona_cama }} pers.
            </div>
          </div>
          <div style="font-size: 1rem;" class="mt-1">
            <span class="mt-1 font-weight-light text-grey text-decoration-line-through">${{
              habitacion.categoria.precio_antes_categoria }}</span> - <span class="mt-1 text- font-weight-medium">${{
                habitacion.categoria.precio_ahora_categoria }}</span> <span
              class="text-caption font-weight-bold">(bolivianos por
              {{ habitacion.noches }} noche)</span>
          </div>
        </v-card-text>
        <v-card-actions class="py-0 d-flex justify-end">
          <v-btn variant="tonal" color="primary" density="compact" append-icon="mdi-chevron-right"
            @click="mostrarDescripcion(habitacion.id_habitacion)">ver mas</v-btn>
        </v-card-actions>
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
    habitacion: Object,
  },
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      modules: [Navigation, Pagination],
      mostrarCompleto: false,
      paso: 1,
    };
  },
  methods: {
    mostrarDescripcion(id_habitacion) {
      this.$router.push({
        name: 'descripcion_habitacion',
        params: { id_habitacion: id_habitacion }
      })
    },
  }
};

</script>

<style scoped>
.descripcion {
  font-size: 14px;
  color: #555;
  line-height: 1.4;
  transition: all 0.3s ease;
}

.descripcion--clamp {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /* 👈 SOLO 2 LÍNEAS */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ver-mas {
  display: inline-block;
  margin-bottom: 5px;
  font-size: 13px;
  font-weight: 500;
  color: #000;
  cursor: pointer;
  text-decoration: underline;
}
</style>
