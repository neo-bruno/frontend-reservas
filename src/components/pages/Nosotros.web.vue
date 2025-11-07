<template>
  <v-container class="about-section">
    <v-row>
      <!-- Texto -->
      <v-col cols="12" md="6">
        <p class="font-weight-medium text-secondary">Sobre Nosotros</p>
        <h2 class="text-h4 font-weight-bold mb-4">
          Tailored services and the experience of unique holidays
        </h2>
        <p style="font-size: 1.3rem;" class="font-weight-light text-primary mb-4">
          Vivamus volutpat eros pulvinar velit laoreet, sit amet egestas erat dignissim.
        </p>
        <p style="font-size: 1rem;" class="text-cuartary">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
          aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
        </p>
        <p class="font-italic mt-6">Maria...the Owner</p>
      </v-col>

      <!-- Imagen -->
      <v-col cols="12" md="6" class="d-flex justify-center align-center">
        <div class="image-wrapper">
          <v-img src="@/assets/img/foto1.jpg" class="main-image" cover></v-img>
          <v-img src="@/assets/img/foto2.jpg" class="overlay-image" cover></v-img>
        </div>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col v-for="(room, index) in rooms" :key="index" cols="12" sm="6" md="6" lg="4" class="d-flex">
        <div class="room-card">
          <v-img :src="room.image" height="380" class="room-img" cover>
          </v-img>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    rooms: [
      {
        image: "https://media.gettyimages.com/id/1266155634/es/foto/lujosos-y-elegantes-interiores-de-dormitorio.jpg?s=1024x1024&w=gi&k=20&c=CzT_9g39vpyysJoMgqjvsGtEXKztoRjswiRLC3RLCMI=",
        title: "Junior Suite",
        price: "$250"
      },
      {
        image: "https://media.gettyimages.com/id/1334117334/es/foto/render-digital-de-una-gran-habitaci%C3%B3n-en-suite-de-hotel.jpg?s=612x612&w=0&k=20&c=qBkhTfkm4NCZbxj8PSy_8xbSSysqQcKBJNcdrASvvVU=",
        title: "Deluxe Room",
        price: "$190"
      },
      {
        image: "https://media.gettyimages.com/id/1370825295/es/foto/moderna-habitaci%C3%B3n-de-hotel-con-cama-doble-mesas-de-noche-televisor-y-paisaje-urbano-desde-la.jpg?s=612x612&w=0&k=20&c=TvQ3P2DNP_3Y_owum8au9db1XmTbaaH5Pdt1aEmjUgI=",
        title: "Superior Room",
        price: "$240"
      },

    ]
  }),
  methods: {

  },
  mounted() {

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
