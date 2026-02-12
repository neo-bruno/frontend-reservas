<template>
  <div @click="volverAtras"><v-icon color="primary" class="ma-2" icon="mdi-undo"></v-icon>
    <span class="font-weight-light text-primary">volver atras</span>
  </div>

  <v-container class="pt-0">

    <!-- Galeria de Imagenes -->
    <v-row dense>
      <!-- Para escritorio -->
      <template v-if="!isMobile">
        <!-- GALERÍA -->
        <v-row dense v-if="habitacion?.imagenes?.length">
          <!-- Imagen principal -->
          <v-col cols="12" md="6">
            <v-img :src="habitacion.imagenes[0].url_imagen" class="rounded-lg" height="420" cover
              @click="abrirGaleria" />
          </v-col>

          <!-- Imágenes pequeñas -->
          <v-col cols="12" md="6">
            <v-row dense>
              <v-col cols="6" v-for="(image, index) in habitacion.imagenes.slice(1, 5)" :key="index">
                <div class="image-wrapper">
                  <v-img :src="image.url_imagen" class="rounded-lg" height="205" cover @click="abrirGaleria" />

                  <!-- BOTÓN SOLO EN LA 5TA IMAGEN -->
                  <div v-if="index === 3 && habitacion.imagenes.length > 4" class="overlay" @click.stop="abrirGaleria">
                    <v-btn color="black" variant="flat">
                      +{{ habitacion.imagenes.length - 4 }} fotos
                    </v-btn>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

      </template>

      <!-- Para móvil (Swiper) -->
      <template v-else>
        <swiper class="mySwiper" :style="{
          '--swiper-navigation-color': '#333',
          '--swiper-pagination-color': '#333',
        }" :slides-per-view="1" space-between="10" pagination navigation :modules="modules">
          <swiper-slide v-for="(image, index) in habitacion.imagenes" :key="index">
            <v-img :src="image.url_imagen" :alt="image.alt" class="rounded-lg" height="100%" cover
              @click.stop="abrirGaleria" />
          </swiper-slide>
        </swiper>
      </template>

    </v-row>

  </v-container>

  <!-- Seccion en detalle de la habitacion -->
  <v-container>
    <v-row>
      <!-- Columna izquierda, Información y Reseñas -->
      <v-col cols="12" lg="8" md="7" sm="6" class="pt-0">

        <!-- Titulo y subtitulo de la habitacion -->
        <div class="text-h6">{{ habitacion.nombre_habitacion }} - {{ habitacion.categoria.nombre_categoria }}</div>
        <div class="font-weight-regular text-grey-darken-1 text-justify">
          <p class="descripcion" :class="{ 'descripcion--clamp': !mostrarCompleto }">
            {{ habitacion.detalle_habitacion }}
          </p>

          <a v-if="habitacion.detalle_habitacion.length > 80" class="ver-mas"
            @click="mostrarCompleto = !mostrarCompleto">
            {{ mostrarCompleto ? 'Ver menos' : 'Ver más' }}
          </a>
        </div>


        <!-- Card de Reseñas de la habitacion -->
        <v-card class="pa-4 mt-3 d-flex flex-wrap align-center justify-space-between rounded-lg" elevation="10">
          <v-row>
            <v-col cols="12" md="4">
              <div class="d-flex align-center mb-2 mb-md-0">
                <v-icon class="gold-icon" color="texto">mdi-leaf-maple</v-icon>
                <span class="font-weight-bold mx-1 text-center" style="font-size: 16px;">Favorito entre
                  huéspedes</span>
                <v-icon class="gold-icon" color="texto">mdi-leaf-maple</v-icon>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="text-md-left flex-grow-1 mb-2 mb-md-0 font-weight-regular" style="font-size: 16px;">
                <span>Según los huéspedes, es el Hotel mas preferibles entre los hoteles</span>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <v-row>
                <v-col cols="6" lg="6" md="12" class="text-center">
                  <span class="text-h6 font-weight-bold mr-2">{{ puntuacion }}</span>
                  <v-rating v-model="puntuacion" dense readonly color="amber" size="20"></v-rating>
                </v-col>
                <v-col cols="6" lg="6" md="12" class="d-flex justify-center">
                  <span class="text-h6 text-center font-weight-medium">{{ cantidad }} <p
                      class="text-decoration-underline" style="font-size: 15px;">
                      Reseñas</p></span>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card>

        <br>
        <v-container>
          <div class="text-left text-h5 pb-2">Camas en la Habitacion</div>
          <div class="d-flex justify-space-between" v-for="habitacion_cama in habitacion.habitacion_camas"
            :key="habitacion_cama.id_cama" style="font-size: 1rem;">
            <div>
              <v-icon>mdi-bed</v-icon> - <span class="text-uppercase">{{ habitacion_cama.cant_habitacion_cama }} {{
                habitacion_cama.cama.tipo_cama }}</span>
            </div>
            <div style="font-size: 1rem;">
              <v-icon>mdi-{{ habitacion_cama.cama.icono_persona_cama }}</v-icon> {{
                habitacion_cama.cama.cant_persona_cama * habitacion_cama.cantidad_hab_cama
              }} pers.
            </div>
          </div>
        </v-container>


        <!-- Lista de Servicios del Hotel -->
        <!-- <div class="text-center text-h5 mx-4 pb-0">Servicios del Hotel</div>
        <v-list lines="five" class="pt-0">
          <v-list-item class="ps-0 pe-1" v-for="servicio in habitacion.servicios">
            <v-list-item-title>
              <span class="font-weight-medium text-wrap">{{ servicio.nombre_servicio }}</span>
            </v-list-item-title>

            <template v-slot:prepend>
              <v-btn size="45" color="texto" class="ma-2" variant="tonal"><v-icon>mdi-{{ servicio.icono_servicio
                  }}</v-icon></v-btn>
            </template>
          </v-list-item>
        </v-list> -->

        <!-- Titulo y Descripcion de la habitacion -->
        <v-container fluid>
          <v-row>
            <v-col cols="12" class="pb-1">
              <div class="text-h5">Acerca de la Habitacion</div>
            </v-col>
            <v-col cols="12" class="pt-1">
              <div class="font-weight-regular text-grey-darken-1 text-justify">
                <p class="descripcion" :class="{ 'descripcion--clamp': !mostrarCompleto }">
                  {{ habitacion.descripcion_habitacion }}
                </p>

                <a v-if="habitacion.descripcion_habitacion.length > 200" class="ver-mas"
                  @click="mostrarCompleto = !mostrarCompleto">
                  {{ mostrarCompleto ? 'Ver menos' : 'Ver más' }}
                </a>
              </div>
            </v-col>
          </v-row>
        </v-container>

        <!-- Servicios de la habitacion -->
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <div class="text-h5 mb-2">Servicios de la Habitación</div>
            </v-col>
            <v-col cols="12">
              <v-row>
                <v-col lg="6" md="6" cols="12">
                  <v-row>
                    <v-col cols="12" class="pt-0" v-for="servicio in habitacion.servicios">
                      <v-icon class="me-2">mdi-{{ servicio.icono_servicio }}</v-icon>
                      <span class="font-weight-light text-texto">{{ servicio.nombre_servicio }}</span>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-col>

          </v-row>
        </v-container>

        <v-container>
          <v-row no-gutters>
            <v-col cols="12">
              <div class="text-h5 mb-2">Precio de Habitación</div>
            </v-col>
            <v-col lg="6" md="6" cols="12" style="font-size: 1rem;">
              <span class="text-decoration-line-through text-grey">antes: ${{
                habitacion.categoria.precio_antes_categoria
              }}</span> - <span class="text-primary font-weight-bold bg-yellow pa-1 rounded-xl">ahora: ${{
                  habitacion.categoria.precio_ahora_categoria }} </span> (Bolivianos/noche)
            </v-col>
          </v-row>
        </v-container>

        <CalendarioHabitacion :restricciones="restricciones" @rangoSeleccionado="rangoFechas"
          @borrarFechas="borrarRangoFechas" />
      </v-col>

      <!-- Columna derecha, la parte de Reserva de la habitacion -->
      <v-col v-if="!isMobile" cols="12" lg="4" md="5" sm="6" class="sticky-reservation">
        <v-card class="pa-1" elevation="7">

          <v-card-title>
            <span style="font-size: 1.5rem;" class="font-weight-regular"><span class="font-weight-bold text-texto">${{
              reserva.total_reserva }}
                BOB.-</span>
            </span> <span style="font-size: 1rem;">por {{ this.reserva.numero_noches }} noches</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pb-2">
            <v-row>
              <v-col cols="12" md="6" sm="6">
                <v-text-field hide-details v-model="reserva.fecha_literal_llegada" label="Llegada" variant="solo"
                  density="comfortable" readonly></v-text-field>
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-text-field v-model="reserva.fecha_literal_salida" label="Salida" variant="solo" hide-details
                  density="comfortable" readonly></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-btn variant="flat" block color="primary" append-icon="mdi-chevron-right" class="text-center"
              prepend-icon="mdi-room-service" @click="descripcionReserva">reservar</v-btn>
          </v-card-actions>

          <v-divider class="my-3"></v-divider>
          <v-container class="pa-3">
            <v-row>
              <v-col cols="12" class="py-0">
                <div class="text-h5 font-weight-medium">Desglose del Precio</div>
              </v-col>
              <v-col cols="12">
                <p class="text-body-2">${{ reserva.precio_noche }} BOB x {{ reserva.numero_noches }} noches <span
                    class="float-right">$ {{ reserva.total_estadia }} BOB.-</span></p>
                <p class="text-body-2">Descuento total (-) <span class="float-right">$ {{ reserva.descuento == 0 ? '' :
                  '-' }}{{ reserva.descuento }} BOB.-</span></p>
                <p class="text-body-2">Tarifa por servicio de Reserva (+)<span class="float-right">$ {{
                  reserva.servicio_reserva }} BOB.-</span></p>
                <v-divider class="my-2"></v-divider>
                <p class="text-body-1 font-weight-bold">Total sin incluir impuestos <span class="float-right">$ {{
                  reserva.total_reserva }}
                    BOB.-</span></p>
              </v-col>
            </v-row>
            <v-row class="justify-space-between font-weight-light">
              <v-col cols="12" class="d-flex justify-space-between pt-0">
                <v-icon>mdi-account-group</v-icon>
                <span class="text-decoration-underline" @click="dialogo_galeria = true"> {{
                  habitacion.adultos_habitacion
                }}
                  adultos</span>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>

    </v-row>
  </v-container>

  <v-card class="pa-3 border rounded-0 elevation-0 price-box" width="100%">
    <v-row>
      <v-col cols="7">
        <!-- Precio -->
        <div class="d-flex justify-center text-decoration-underline" @click="sheet_reserva = true">
          <span class="text-h6 font-weight-bold">${{
            reserva.total_reserva }}
            BOB.-</span>
        </div>
        <span class="text-body-2 font-weight-medium">por {{ this.reserva.numero_noches }} noches.
          <p class="text-grey-darken-1" style="font-size: .8rem;">
            {{ obtenerFechaLiteral(this.reserva.fecha_llegada) }} - {{ obtenerFechaLiteral(this.reserva.fecha_salida) }}
          </p>
        </span>
      </v-col>
      <v-col cols="5" class="mt-4">
        <!-- Botón de reserva -->
        <v-btn block size="50" color="primary" @click="descripcionReserva">
          reservar
        </v-btn>
      </v-col>
    </v-row>

    <!-- "bottom sheet" que ocupa la mitad de la pantalla y se pega abajo -->
    <v-bottom-sheet v-model="sheet_reserva">
      <v-card class="pa-4 rounded-t-xl">
        <v-card-title class="d-flex justify-space-between align-center">
          <span class="text-h6 font-weight-bold">Desglose del precio</span>
          <v-icon @click="sheet_reserva = false">mdi-close</v-icon>
        </v-card-title>

        <v-card-text style="font-size: .9rem;">
          <v-row class="justify-space-between">
            <span>${{ reserva.precio_noche }} BOB.- x {{ reserva.numero_noches }} noches</span>
            <span class="font-weight-bold">${{ reserva.total_estadia }} BOB.-</span>
          </v-row>
          <v-row class="justify-space-between">
            <span>Descuento Total</span>
            <span class="font-weight-bold">$ {{ reserva.descuento == 0 ? '' : '-' }}{{ reserva.descuento }} BOB.-</span>
          </v-row>
          <v-row class="justify-space-between">
            <span>Servicio de Reserva</span>
            <span class="font-weight-bold">${{ reserva.servicio_reserva }} BOB.-</span>
          </v-row>

          <v-divider class="my-3"></v-divider>

          <v-row class="justify-space-between font-weight-bold">
            <span>Total sin impuestos</span>
            <span class="d-flex justify-end">${{ reserva.total_reserva }} BOB.-</span>
          </v-row>

          <v-divider class="my-3"></v-divider>

          <v-row class="justify-space-between font-weight-light">
            <v-icon>mdi-account-group</v-icon>
            <span class="text-decoration-underline"> {{ habitacion.adultos_habitacion }} adultos</span>
          </v-row>
          <v-row>
            <p class="mt-2 text-caption text-grey-darken-1" style="font-size: 12px;">Al aumentar personas a la
              habitacion agregas un precio adicional por noche</p>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-btn variant="tonal" prepend-icon="mdi-undo" block color="primary" @click="sheet_reserva = false">
            <span class="ms-3">Volver</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-bottom-sheet>
  </v-card>

  <!-- mostrar las imagenes mas cerca -->
  <v-dialog v-model="dialogo_galeria" fullscreen transition="dialog-bottom-transition">
    <template #default>
      <!-- Botón cerrar -->
      <v-btn icon class="close-btn" @click="dialogo_galeria = false">
        <v-icon size="36" color="primary">mdi-close</v-icon>
      </v-btn>

      <!-- Contenedor galería -->
      <div class="galeria-container">
        <v-container fluid>
          <v-row dense>
            <draggable v-model="habitacion.imagenes" item-key="url_imagen" tag="div" :animation="300"
              ghost-class="dragging" class="d-flex flex-wrap w-100">
              <template #item="{ element, index }">
                <v-col cols="12" sm="6" md="4" lg="3" xl="2" class="pa-2">
                  <v-card class="overflow-hidden">
                    <v-img :src="element.url_imagen" height="200" class="cursor-grab" @click="mostrarImagen(element)"></v-img>
                  </v-card>
                </v-col>
              </template>
            </draggable>
          </v-row>
        </v-container>
      </div>
    </template>
  </v-dialog>

  <v-dialog v-model="dialogo_imagenes" fullscreen transition="dialog-bottom-transition">
    <template #default>
      <!-- Botón cerrar -->
      <v-btn icon class="close-btn" @click="dialogo_imagenes = false">
        <v-icon size="36" color="primary">mdi-close</v-icon>
      </v-btn>

      <!-- Contenedor galería -->
      <div class="galeria-container">
        <v-container fluid>
          <v-row dense>
            <v-col cols="12">
              <swiper :slides-per-view="1" :loop="habitacion.imagenes.length > 1" :style="{
                '--swiper-navigation-color': '#333',
                '--swiper-pagination-color': '#333',
              }" :pagination="{ clickable: true }" :modules="modules" class="rounded-t-xl">
                <swiper-slide v-for="(img, i) in habitacion.imagenes" :key="i">
                  <v-img class="d-flex align-center justify-center" :src="img.url_imagen" height="80vh" contain />
                </swiper-slide>
                <!-- Paginación se muestra automáticamente con configuración -->
              </swiper>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </template>
  </v-dialog>

  <!-- <v-btn v-show="mostrarScrollTop" icon color="black" class="scroll-top-btn" elevation="6" @click="scrollToTop">
    <v-icon>mdi-arrow-up</v-icon>
  </v-btn> -->
  <v-btn color="quintary" variant="outlined" icon="mdi-arrow-up-thin" class="scroll-to-top"
    @click="scrollToTop"></v-btn>
</template>

<script>

import draggable from 'vuedraggable';
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";

// Import Swiper styles
import "swiper/swiper-bundle.css";
import 'swiper/css';

import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination, Navigation } from 'swiper/modules';

import CalendarioHabitacion from "../calendario/CalendarioHabitacion.vue";
import moment from 'moment'
import 'moment/locale/es'

// moment.locale('es')

import { getRoomById } from "@/services/habitacion.service";
import { getAllRevies } from "@/services/reserna.service";
import { useReservaStore } from "@/stores/reserva";

export default {
  name: "DescripcionHabitacion",
  emits: ['siguiente'],

  components: {
    Swiper,
    SwiperSlide,
    CalendarioHabitacion,
    draggable
  },
  data() {
    return {
      id_habitacion: this.$route.params.id_habitacion,
      habitacion: { detalle_habitacion: '', descripcion_habitacion: '', categoria: { nombre_categoria: '' }, nivel: null },

      mostrarCompleto: false,

      modules: [Pagination, Navigation],
      isMobile: false,

      // variable de card reserñas
      resena: {},
      puntuacion: 4.45,
      cantidad: 0,

      // variables del card de reservas
      reserva: {
        precio_noche: 0,
        fecha_llegada: '',
        fecha_salida: '',
        numero_noches: 0,
        fecha_literal_llegada: '',
        fecha_literal_salida: '',
        total_estadia: 0,
        servicio_reserva: 0,
        descuento: 0,
        total_reserva: 0,
      },

      pricePerNight: 150,
      arrivalDate: '2025-03-10',
      departureDate: '2025-03-15',
      nights: 0,

      sheet_reserva: false,
      dialogo_galeria: false,
      dialogo_imagenes: false,

      mostrarScrollTop: false,
    }
  },
  computed: {
    todasImagenes() {
      return [
        {
          src: "https://img.freepik.com/foto-gratis/suite-dormitorio-lujo-hotel-resort-gran-altura-mesa-trabajo_105762-1783.jpg",
          alt: "Vista principal",
        },
        ...this.imagenes,
      ];
    },
    restricciones() {
      return this.habitacion?.restricciones ?? []
    }
  },

  methods: {
    abrirGaleria() {
      this.dialogo_galeria = true
    },
    mostrarImagen() {
      this.dialogo_imagenes = true
    },
    obtenerFechaLiteral(fecha) {
      return fecha ? moment(fecha, 'YYYY-MM-DD')
        .locale('es')
        .format('DD [de] MMM') : ''
    },

    obtenerFechaLlegadaSalida(fecha) {
      return fecha ? moment(fecha, 'YYYY-MM-DD')
        .local('es')
        .format('ddd, DD-MMM-YY') : ''
    },

    handleScroll() {
      this.mostrarScrollTop = window.scrollY > 1200
    },

    volverAtras() {
      this.$router.go(-1)
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // verificador para modificar las imagenes
    checkIfMobile() {
      this.isMobile = window.innerWidth <= 600; //768
    },

    rangoFechas(fechas) {
      // this.nights = this.getNumberNights(fechas)
      // this.arrivalDate = moment(fechas[0]).format('YYYY-MM-DD')
      // this.departureDate = moment(fechas[1]).format('YYYY-MM-DD')
      this.reserva.fecha_llegada = moment(fechas[0]).format('YYYY-MM-DD')
      this.reserva.fecha_salida = moment(fechas[1]).format('YYYY-MM-DD')
      this.reserva.numero_noches = this.getNumberNights(fechas)
      this.reserva.precio_noche = this.habitacion.categoria.precio_ahora_categoria
      this.reserva.fecha_literal_llegada = this.obtenerFechaLlegadaSalida(moment(fechas[0]).format('YYYY-MM-DD'))
      this.reserva.fecha_literal_salida = this.obtenerFechaLlegadaSalida(moment(fechas[1]).format('YYYY-MM-DD'))
      this.reserva.total_estadia = this.reserva.precio_noche * this.reserva.numero_noches
      this.reserva.servicio_reserva = 0

      const total = this.reserva.precio_noche * this.reserva.numero_noches
      const descuento = parseFloat((this.habitacion.categoria.descuento_categoria / 100)).toFixed(2)

      if (this.reserva.numero_noches >= this.habitacion.categoria.cant_noches_categoria)
        this.reserva.descuento = parseFloat(descuento * total).toFixed(0)
      else
        this.reserva.descuento = 0

      this.habitacion.habitacion_camas.forEach(cama => {
        this.reserva.servicio_reserva = this.reserva.servicio_reserva + (cama.costo_hab_cama * cama.cantidad_hab_cama)
      });
      this.reserva.total_reserva = (total - this.reserva.descuento) + this.reserva.servicio_reserva
    },
    borrarRangoFechas() {
      this.reserva = {
        precio_noche: 0,
        fecha_llegada: '',
        fecha_salida: '',
        numero_noches: 0,
        fecha_literal_llegada: '',
        fecha_literal_salida: '',
        total_estadia: 0,
        servicio_reserva: 0,
        descuento: 0,
        total_reserva: 0,
      }
    },
    getNumberNights(rangeDates) {
      if (rangeDates.length > 1) {
        const fechaInicio = moment(rangeDates[0])
        const fechaFin = moment(rangeDates[1])
        // Diferencia en milisegundos
        const diferenciaMs = fechaFin - fechaInicio;
        // Convertir a días
        return (diferenciaMs / (1000 * 60 * 60 * 24));
      }
    },

    // metodos de login
    descripcionReserva() {
      const reservaStore = useReservaStore()

      if (this.reserva.fecha_llegada && this.reserva.fecha_salida) {
        console.log(this.reserva.fecha_llegada && this.reserva.fecha_salida)
        reservaStore.setReserva(
          this.reserva
        )

        this.$router.push({
          name: 'descripcion_reserva',
          params: { id_habitacion: this.habitacion.id_habitacion }
        })
      }
    },

    async obtenerHabitacion() {
      try {
        let res = await getRoomById(this.id_habitacion)

        if (res.status == 201) {
          this.habitacion = res.data.data
        }
      } catch (error) {
        console.log(error)
      }
    },
    async obtenerResena() {
      try {
        const res = await getAllRevies()
        if (res.status === 200) {
          const resenas = res.data.data;
          const resenas_habitacion = resenas.filter(
            item => item.id_habitacion == this.id_habitacion
          );
          this.cantidad = resenas_habitacion.length;
          if (this.cantidad > 0) {
            const total = resenas_habitacion.reduce(
              (sum, item) => sum + item.puntuacion_resena,
              0
            );
            this.puntuacion = total / this.cantidad;
          } else {
            this.puntuacion = 0;
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
  },

  async mounted() {
    try {
      window.addEventListener('scroll', this.handleScroll)
      this.checkIfMobile();
      window.addEventListener("resize", this.checkIfMobile);
      await this.obtenerHabitacion()
      await this.obtenerResena()
    } catch (error) {
      console.log(error)
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener("resize", this.checkIfMobile);
  },
}
</script>

<style lang="scss" scoped>
.mySwiper {
  width: 100%;
  height: 300px;
}


// estilos del card de reservas
.v-card {
  border-radius: 12px;
}

.sticky-container {
  position: relative;
  overflow: hidden;
}

.sticky-reservation {
  position: sticky;
  top: 200px;
  /* Ajusta según la altura del header */
  max-height: calc(100vh - 200px);
  /* Limita la altura para evitar que sobrepase el viewport */
}

// agregar una parte fija en el card de reservas
/* Estilo general para el precio */
.price-box {
  display: none;
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #fff;
  padding: 10px;
  text-align: center;
  box-shadow: 0 -2px 5px rgba(250, 250, 250, 0.7);
  z-index: 1000;
}

/* Bottom sheet que cubre toda la pantalla en ancho y la mitad en alto */
.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50vh;
  /* Ocupa la mitad de la pantalla */
  max-height: 50vh;
  overflow-y: auto;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}

// scroll del boton flotante
.scroll-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 999;
  border: 1px solid #f7c76e;
}

// para la descripcion del texto
.descripcion {
  font-size: 14px;
  color: #555;
  line-height: 1.4;
  transition: all 0.3s ease;
}

.descripcion--clamp {
  display: -webkit-box;
  //-webkit-line-clamp: 3;
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

.scroll-top-btn {
  position: fixed;
  bottom: 124px;
  right: 2px;
  z-index: 1000;
  border-radius: 50%;
}


/* Ajustes de responsividad */
@media (max-width: 1024px) {
  .sticky-reservation {
    position: sticky;
    top: 80px;
    /* Ajusta según la altura del header */
    max-height: calc(100vh - 80px);
    /* Limita la altura para evitar que sobrepase el viewport */
  }
}

// @media (max-width: 960px) {
//   .reserva-fixed {
//     position: static;
//     width: 100%;
//   }
// }


/* Ajustes de responsividad */
@media (max-width: 780px) {
  .sticky-reservation {
    position: sticky;
    top: 80px;
    /* Ajusta según la altura del header */
    max-height: calc(100vh - 80px);
    /* Limita la altura para evitar que sobrepase el viewport */
  }
}

/* Ajustes de responsividad */
@media (max-width: 600px) {
  .sticky-card {
    position: relative;
    /* Se mueve con el scroll en pantallas pequeñas */
  }

  .calendar-container {
    text-align: left;
    padding-bottom: 170px;
    max-width: 900px;
    margin: auto;
  }
}

/* Para pantallas de dispositivos móviles */
@media (max-width: 599px) {
  .price-box {
    display: block;
    /* Muestra la caja de precio solo en dispositivos móviles */
  }
}

/* responsive about */
@media (max-width: 693px) {
  .scroll-to-top {
    display: none;
  }
}
</style>
