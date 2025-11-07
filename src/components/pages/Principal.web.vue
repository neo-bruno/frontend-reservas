<template>
  <v-container fluid class="pa-0">
    <div class="hero">
      <!-- Video de fondo -->
      <video autoplay muted loop playsinline class="video-bg">
        <source src="https://www.ansonika.com/paradise/html-menu-3/video/sunset.mp4" type="video/mp4" />
        Tu navegador no soporta el video.
      </video>

      <!-- Capa oscura encima del video -->
      <div class="overlay">
        <v-container class="fill-height d-flex align-center justify-center text-center text-white">
          <div>
            <p class="mb-2 text-secondary">Nuestros servicios nos caracteriza</p>
            <h2 class="text-terceary font-weight-bold mb-6">Convencete <br> y siente la calidez...!</h2>
          </div>
        </v-container>

      </div>
    </div>

  </v-container>
</template>

<script>
export default {
  name: 'Principal',
  data: () => ({

  }),
  methods: {
  },
  mounted() {

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
  background-color: rgba(50, 50, 50, 0.5);
  /* Oscurece el video */
  height: 100%;
  width: 100%;
}
</style>
