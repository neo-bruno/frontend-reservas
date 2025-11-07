<template>
  <v-container class="py-12 px-4 px-md-12">
    <v-row>
      <!-- Texto a la izquierda -->
      <v-col cols="12" md="6">
        <p class="font-weight-medium text-secondary">Servicio de Desayuno</p>
        <h2 class="text-h4 font-weight-bold mb-4">Nuestra Cafeteria</h2>
        <p class="mb-6">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium...
        </p>

        <div class="mb-5" v-for="(item, index) in amenities" :key="index">
          <div class="d-flex align-center mb-2">
            <v-icon color="secondary" class="mr-2">mdi-bookmark-outline</v-icon>
            <strong>{{ item.title }}</strong>
          </div>
          <p class="mb-4 text-body-2">{{ item.description }}</p>
        </div>

      </v-col>

      <!-- Imágenes con scroll a la derecha -->
      <v-col cols="12" md="6">
        <div class="image-scroll-container">
          <v-img
            v-for="(image, i) in images"
            :key="i"
            :src="image"
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
export default {
  data() {
    return {
      amenities: [
        { title: "Jugos", description: "Agua Fria y Caliente, Juego de Papaya, Jugo de Piña, Jugo de Maracuya, Jugo de Naranja" },
        { title: "Masitas", description: "Queque, Rollo de queso, Pan tostada, Pan cacero." },
        { title: "Liquidos", description: "Te, Cafe, Chocolate, Mates, Leches." }
      ],
      images: [
        "https://media.gettyimages.com/id/1266155634/es/foto/lujosos-y-elegantes-interiores-de-dormitorio.jpg?s=1024x1024&w=gi&k=20&c=CzT_9g39vpyysJoMgqjvsGtEXKztoRjswiRLC3RLCMI=",
        "https://media.gettyimages.com/id/1334117334/es/foto/render-digital-de-una-gran-habitaci%C3%B3n-en-suite-de-hotel.jpg?s=612x612&w=0&k=20&c=qBkhTfkm4NCZbxj8PSy_8xbSSysqQcKBJNcdrASvvVU=",
        "https://media.gettyimages.com/id/1370825295/es/foto/moderna-habitaci%C3%B3n-de-hotel-con-cama-doble-mesas-de-noche-televisor-y-paisaje-urbano-desde-la.jpg?s=612x612&w=0&k=20&c=TvQ3P2DNP_3Y_owum8au9db1XmTbaaH5Pdt1aEmjUgI=",
        "https://media.gettyimages.com/id/1299710067/es/foto/habitaci%C3%B3n-doble-con-vistas-al-mar.jpg?s=1024x1024&w=gi&k=20&c=5JSZ_uj2q2ina8H23t_bkwG8AA8jVFBIs8wUDC8d6EU="
      ]
    };
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
