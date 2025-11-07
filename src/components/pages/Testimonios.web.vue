<template>
  <v-container fluid class="mt-7">
    <div class="text-center mb-10">
      <p class="font-weight-medium text-secondary">Testimonios</p>
      <h2 class="text-h4 font-weight-bold">Nuestros Huespedes son Importantes</h2>
    </div>
    <div style="background-image: url('https://media.gettyimages.com/id/1334117334/es/foto/render-digital-de-una-gran-habitaci%C3%B3n-en-suite-de-hotel.jpg?s=612x612&w=0&k=20&c=qBkhTfkm4NCZbxj8PSy_8xbSSysqQcKBJNcdrASvvVU=');" class="parallax-container">
      <div class="overlay">
        <swiper :modules="modules" :slides-per-view="1" :loop="true" :autoplay="{ delay: 4000 }"
          :pagination="{ clickable: true }" class="mySwiper">
          <swiper-slide v-for="(testimonio, index) in testimonios" :key="index">
            <div class="testimonial-wrapper">
              <v-row justify="center">
                <v-col lg="2" sm="2" cols="12">
                  <div class="text-center">
                    <v-avatar size="70" class="avatar">
                      <v-img :src="testimonio.foto" />
                    </v-avatar>
                    <div class="name">{{ testimonio.nombre }}</div>
                    <div class="date">{{ testimonio.fecha }}</div>
                  </div>
                </v-col>
                <v-col lg="9" sm="9" cols="12" align-self="center">
                  <p class="espacio">"{{ testimonio.mensaje }}"</p>
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

export default {
  components: { Swiper, SwiperSlide },
  data() {
    return {
      modules: [Autoplay, Pagination],
      testimonios: [
        {
          nombre: "Roberta",
          fecha: "2 Nov",
          mensaje:
            "Mea ad postea meliore fuisset. Timeam repudiare id eum, ex paulo dictas elaboraret sed.",
          foto: "https://randomuser.me/api/portraits/women/44.jpg",
        },
        {
          nombre: "Carlos",
          fecha: "15 Ene",
          mensaje:
            "Un lugar espectacular, atención impecable y paisajes inolvidables. Repetiría sin dudarlo.",
          foto: "https://randomuser.me/api/portraits/men/32.jpg",
        },
      ],
    };
  },
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
