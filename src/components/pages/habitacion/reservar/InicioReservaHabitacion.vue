<template>
  <DescripcionHabitacion v-on:siguiente="siguientePaso"></DescripcionHabitacion>
  <!-- <v-window v-model="paso" disabled>
    <v-window-item :value="1">
    </v-window-item>
    <v-window-item :value="2">
      <DescripcionReserva :habitacion="habitacion" v-on:atras="pasoAtras">
      </DescripcionReserva>
    </v-window-item>
  </v-window> -->
</template>

<script>
import DescripcionHabitacion from './DescripcionHabitacion.vue';
import DescripcionReserva from './DescripcionReserva.vue';

export default {
  components: {
    DescripcionHabitacion
  },
  data() {
    return {
      paso: 1,
      habitacion: {},

    }
  },
  methods: {
    siguientePaso(data) {
      this.habitacion = data
      console.log(data)
      if (this.habitacion.reserva.total_reserva > 0)
        this.paso++
    },
    pasoAtras() {
      this.paso--
    },
  },
  mounted() {

  }
}
</script>

<style scoped></style>
