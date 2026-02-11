<template>
  <v-container fluid class="mt-7">
    <div class="text-center mb-10">
      <p class="font-weight-medium text-secondary">{{ seccion.nombre_seccion }}</p>
      <h2 class="text-h4 font-weight-bold">{{ seccion.titulo_seccion }}</h2>
    </div>
    <div :style="{ backgroundImage: `url(${seccion.url_seccion || ''})` }" class="parallax-container">
      <div class="overlay">
        <swiper :modules="modules" :slides-per-view="1" :loop="false" :autoplay="{ delay: 4000 }"
          :pagination="{ clickable: true }" class="mySwiper">
          <swiper-slide v-for="(resena, index) in resenas" :key="index">
            <div class="testimonial-wrapper">
              <v-row justify="center">
                <v-col lg="2" sm="2" cols="12">
                  <div class="text-center">
                    <v-avatar size="70" class="avatar">
                      <!-- <v-img :src="resena.foto" /> -->
                       <v-icon color="white" size="45">mdi-account</v-icon>
                    </v-avatar>
                    <div class="name">{{ resena.nombre_usuario }}</div>
                    <div class="date">{{ fechaLiteral(resena.fecha_resena) }}</div>
                  </div>
                </v-col>
                <v-col lg="9" sm="9" cols="12" align-self="center">
                  <p class="espacio">"{{ resena.comentario_resena }}"</p>
                </v-col>
              </v-row>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </v-container>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import { getSectionByType } from '@/services/seccion.service';
import { getAllRevies } from '@/services/reserna.service';

import moment from 'moment'
import 'moment/locale/es'

export default {
  components: { Swiper, SwiperSlide },
  data() {
    return {
      modules: [Autoplay, Pagination],
      seccion: {},
      resenas: [],
    }
  },
  methods:{
    fechaLiteral(fecha) {
      return moment(fecha, 'YYYY-MM-DD').format('D MMM')
    },
    async obtenerSeccion(){
      try {
        const res = await getSectionByType(5)
        if(res.status == 201)
          this.seccion = res.data.data
      } catch (error) {
        console.log(error)
      }
    },
    async obtenerResenas(){
      try {
        const res = await getAllRevies()
        if(res.status == 200){
          let todasResenas = res.data.data
          this.resenas = todasResenas.filter(item => item.estado_resena != false)
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
  async mounted(){
    try {
      await this.obtenerSeccion()

      await this.obtenerResenas()

    } catch (error) {
      console.log(error)
    }
  }
};
</script>

<style scoped>
.parallax-container {
  height: 500px;
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.overlay {
  background: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mySwiper {
  width: 100%;
  max-width: 800px;
}

.testimonial-wrapper {
  background-color: #21242b;
  padding: 30px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.avatar {
  border: 2px solid white;
}

.name {
  font-weight: bold;
  font-size: 1.1rem;
}

.date {
  font-size: 0.85rem;
  color: #ccc;
}

.message {
  font-style: italic;
  font-size: 1rem;
  line-height: 1.5;
}

.swiper-pagination-bullets {
  margin-top: 20px;
  text-align: center;
}

@media (max-width: 692px) {
  .testimonial-wrapper {
    padding: 20px;
  }

  .espacio{
    margin: 0.5rem;
  }

  .message {
    text-align: center;
  }

  .parallax-container {
    height: 380px;
  }
}
</style>
