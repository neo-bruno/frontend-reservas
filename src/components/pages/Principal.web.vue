<template>
  <v-container fluid class="pa-0">
    <div class="hero">
      <!-- Video de fondo -->
      <!-- <video autoplay muted loop playsinline class="video-bg">
        <source :src="urlVideo" />
        Tu navegador no soporta el video.
      </video> -->
      <video v-if="urlVideo" autoplay muted loop playsinline class="video-bg">
        <source :src="urlVideo" type="video/mp4" />
        Tu navegador no soporta el video.
      </video>

      <!-- Capa oscura encima del video -->
      <div class="overlay">
        <v-container class="fill-height d-flex align-center justify-center text-center text-white">
          <div>
            <p class="mb-2 text-white opacity-60">{{ seccion.titulo_seccion }}</p>
            <h2 class="text-terceary font-weight-bold mb-6" v-html="seccion.subtitulo_seccion"></h2>
          </div>
        </v-container>

      </div>
    </div>

  </v-container>
</template>

<script>
import { getSectionByType } from '@/services/seccion.service';

export default {
  name: 'Principal',
  data: () => ({
    seccion: {},
  }),
  computed: {
    urlVideo() {
      if (this.seccion && this.seccion.video_seccion)
        return this.seccion.video_seccion
    }
  },
  methods: {
    async obtenerSeccion() {
      try {
        const res = await getSectionByType(1)
        if (res.status == 201) {
          this.seccion = res.data.data
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
  mounted() {
    this.obtenerSeccion()
  }
}
</script>

<style lang="scss" scoped>
/* imagen principal con video */
.hero {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.video-bg {
  position: absolute;
  top: 0;
  left: 0;
  min-width: 100%;
  min-height: 100%;
  object-fit: cover;
  z-index: 0;
}

.overlay {
  position: relative;
  z-index: 1;
  background-color: rgba(78, 78, 78, 0.5);
  /* Oscurece el video */
  height: 100%;
  width: 100%;
}
</style>
