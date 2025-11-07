<template>
  <div class="espacio"></div>
  <section class="footer-parallax">
    <div class="overlay"></div>
    <div class="contenido">
      <!-- Aquí va lo que quieras mostrar: testimonios, texto, botones, etc -->
      <v-row>
        <v-col lg="4" sm="6" cols="12">
          <p class="text-secondary text-h6 mb-4"><v-icon>mdi-map-marker</v-icon> Direccion </p>
          <p class="font-weight-light">Calle España #172 entre Av. Heroinas y C. Colombia</p>
          <br>
          <p class="text-secondary text-h6 my-4"><v-icon>mdi-phone-classic</v-icon> Telefonos</p>
          <p class="font-weight-light">(+591) 77409001 - 4 4510773</p>
          <br>
          <p class="text-secondary text-h6 my-4"><v-icon>mdi-map</v-icon> Lugar</p>
          <p class="font-weight-light">Cochabamba - Bolivia</p>
        </v-col>
        <v-col lg="2" sm="6" cols="12">
          <v-divider class="mb-4"></v-divider>
          <p class="text-secondary text-h6 mb-6">Explorar </p>
          <p class="font-weight-light mt-4">Inicio</p>
          <p class="font-weight-light mt-4">Habitaciones</p>
          <p class="font-weight-light mt-4">Perfil Usuario</p>
          <br>
        </v-col>
        <v-col lg="6" sm="12" cols="12">
          <div class="mapa-container">

            <iframe class="mapa" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d7614.852670528359!2d-66.15684499999996!3d-17.391316!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTfCsDIzJzI5LjAiUyA2NsKwMDknMjQuNSJX!5e0!3m2!1ses!2sbo!4v1750029148098!5m2!1ses!2sbo"
              width="100%" height="300" style="border:0;" allowfullscreen>
            </iframe>
          </div>
          <div class="text-center text-terceary mt-4 d-flex justify-space-around">
            <span><v-icon class="mb-2 me-3" color="secondary">mdi-warehouse</v-icon> Hotel Familia Felipez </span>
            <span><v-icon class="mb-2 me-3" color="secondary">mdi-whatsapp</v-icon> (+591) 77409001</span>

          </div>
        </v-col>
      </v-row>
    </div>

    <v-btn color="secondary" variant="outlined" icon="mdi-arrow-up-thin" class="scroll-to-top"
      @click="scrollToTop"></v-btn>
  </section>
  <div class="barra-extra">
    <p class="text-caption text-terceary font-weight-light text-center">
      Copyright &copy; {{ new Date().getFullYear() }} - Ing. Rudolf Felipez Mancilla - Full Stack Developer
    </p>
  </div>
</template>

<script>
export default {
  data: () => ({

  }),
  methods: {
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },
  mounted() {

  }
}
</script>

<style lang="scss" scoped>
.espacio {
  height: 10rem;
  background-color: #f8f5f1;
}

.footer-parallax {
  position: relative;
  padding-top: 2rem;
  width: 100%;
  height: auto;
  background-image: url('https://media.gettyimages.com/id/1266155634/es/foto/lujosos-y-elegantes-interiores-de-dormitorio.jpg?s=1024x1024&w=gi&k=20&c=CzT_9g39vpyysJoMgqjvsGtEXKztoRjswiRLC3RLCMI=');
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.footer-parallax .overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom,
      rgba(29, 31, 47, 0.4) 5%,
      rgba(29, 31, 47, 0.6) 10%,
      rgba(29, 31, 47, 0.9) 30%,
      rgba(29, 31, 47, 1) 60%,
      rgba(29, 31, 47, 1) 100%);
  z-index: 1;
}

.footer-parallax .contenido {
  position: relative;
  z-index: 2;
  text-align: left;
  width: 90%;

  color: white;
  padding: 2px;
}

.barra-extra {
  align-content: center;
  height: 100px;
  width: 100%;
  font-size: 1rem;
  background-color: #1d1f2f;
  /* O el color que tú quieras */
}


/* Botón scroll to top */
.scroll-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 999;
  border: 1px solid #f7c76e;
}

// mapa del hotel
.mapa-container {
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-top: 3px solid #1d1f2f;
}


/* responsive about */
@media (max-width: 693px) {
  .scroll-to-top {
    display: none;
  }
}
</style>
