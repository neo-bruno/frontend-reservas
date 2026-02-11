<template>
  <v-container class="about-section">
    <v-row>
      <!-- Texto -->
      <v-col cols="12" md="6">
        <p class="font-weight-medium text-secondary">{{ seccion.nombre_seccion }}</p>
        <h2 class="text-h4 font-weight-bold mb-4">
          {{ seccion.titulo_seccion }}
        </h2>
        <p style="font-size: 1.3rem;" class="font-weight-light text-primary mb-4">
          {{ seccion.subtitulo_seccion }}
        </p>
        <p style="font-size: 1rem;" class="text-cuartary">
          {{ seccion.descripcion_seccion }}
        </p>
        <p class="font-italic mt-6">{{ seccion.detalle_seccion }}</p>
      </v-col>

      <!-- Imagen -->
      <v-col cols="12" md="6" class="d-flex justify-center align-center">
        <div class="image-wrapper">
          <v-img v-if="seccion.fotos.length > 0" :src="seccion.fotos[1].url_foto || ''" class="main-image"
            cover></v-img>
          <v-img v-if="seccion.fotos.length > 0" :src="seccion.fotos[0].url_foto || ''" class="overlay-image"
            cover></v-img>
        </div>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col v-for="(foto, index) in imagenes" :key="index" cols="12" sm="6" md="6" lg="4" class="d-flex">
        <div class="room-card">
          <v-img :src="foto.url_foto || ''" height="380" class="room-img" cover>
          </v-img>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getSectionByType } from '@/services/seccion.service';

export default {
  data: () => ({
    seccion: {fotos: []},
  }),
  computed: {
    imagenes() {
      return this.seccion.fotos.slice(2, 5)
    }
  },
  methods: {
    async obtenerSeccion() {
      try {
        const res = await getSectionByType(2)
        if (res.status == 201)
          this.seccion = res.data.data
      } catch (error) {
        console.log(error)
      }
    }
  },
  mounted() {
    this.obtenerSeccion()
  }
}
</script>

<style lang="scss" scoped>
/* css de about */
.about-section {
  padding-top: 5rem;
  background: #fff;
}

.image-wrapper {
  position: relative;
  width: 100%;
  max-width: 500px;
  margin-bottom: 2rem;
}

.main-image {
  left: 30%;
  width: 80%;
  height: 100%;
  border-radius: 12px;
}

.overlay-image {
  position: absolute;
  width: 50%;
  height: 70%;
  left: 5%;
  top: 15%;
  border-radius: 12px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

// imagenes de nosotros
.room-card {
  width: 100%;
  overflow: hidden;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.room-img {
  transition: transform 0.4s ease;
}

.room-card:hover .room-img {
  transform: scale(1.07) translateY(-5px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.2);
}

.overlay {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.65), transparent 50%);
  color: white;
  height: 100%;
  border-radius: 18px;
  transition: background 0.3s ease;
}

/* responsive about */
@media (max-width: 600px) {
  .image-wrapper {
    margin-bottom: 9rem;
  }

  .main-image {
    left: 20%;
  }

  .overlay-image {
    width: 70%;
    left: 2%;
    top: 70%;
  }
}
</style>
