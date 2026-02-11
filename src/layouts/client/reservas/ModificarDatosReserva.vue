<template>
  <v-form ref="formulario" @submit.prevent="">
    <v-container>
      <v-row>
        <v-col lg="7" cols="12">
          <p style="font-size: 1rem;">Hora de Llegada:</p>
          <v-text-field type="time" ref="hora_llegada" v-model="reserva.hora_llegada_reserva" density="compact"
            placeholder="nombre del nivel" prepend-inner-icon="mdi-calendar-clock" variant="outlined"
            :rules="[rules.required]" suffix="am/pm"
            @keyup.enter.prevent="setfocus('observacion_reserva')"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <p style="font-size: 1rem;">observacion de la reserva</p>
          <v-textarea ref="observacion_reserva" v-model="reserva.observacion_reserva" density="compact"
            placeholder="ingreser una observacion de la reserva" prepend-inner-icon="mdi-text" variant="outlined"
            @keyup.ctrl.enter.prevent="setfocus('hora_llegada')"></v-textarea>
        </v-col>
      </v-row>
      <v-row justify="end">
        <v-col cols="10" class="d-flex justify-end">
          <v-btn color="success" block prepend-icon="mdi-pencil" append-icon="mdi-chevron-right"
            @click="modificarReserva"> modificar reserva</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>

  <!-- capa protectora de proceso -->
  <v-overlay :model-value="overlay" class="align-center justify-center" persistent>
    <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
  </v-overlay>

</template>

<script>
import { modifyBooking } from '@/services/reserva.service';

export default {
  props: {
    reserva: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      hora_llegada: '',
      observacion_reserva: '',

      rules: {
        required: value => !!value || 'El campo es requerido.',
        reglaContieneLetra: v =>
          /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(v) || 'Debe contener al menos una letra',
        soloLetrasYEspacios: v =>
          /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(v) || 'Solo se permiten letras y espacios',
        soloLetrasSinEspacios: v =>
          /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/.test(v) || 'Solo se permiten letras sin espacios',
        reglaDosPalabras: v =>
          typeof v === 'string' && v.trim().split(/\s+/).length >= 2 || 'Debe contener al menos dos palabras',
        soloLetrasONumerosSinEspacios: v =>
          /^[a-zA-Z0-9]+$/.test(v) || 'Solo se permiten letras o números, sin espacios',
        letrasONumerosSinSoloEspacios: v =>
          (typeof v === 'string' && v.trim().length > 0) || 'No se permite solo espacios',
      },

      // paralizando pantalla
      overlay: false,
      errores: false,
    }
  },
  watch: {
    overlay(val) {
      val && setTimeout(() => {
        this.overlay = false
      }, 100000)
    },
  },
  methods: {
    setfocus(foco) {
      this.$nextTick(() => {
        if (foco === "hora_llegada") {
          this.$refs.hora_llegada?.select()
          this.$refs.hora_llegada?.focus()
        }
        if (foco === "observacion_reserva") {
          this.$refs.observacion_reserva?.select()
          this.$refs.observacion_reserva?.focus()
        }
      })
    },
    // guardar datos del nivel
    async modificarReserva() {
      try {
        const { valid } = await this.$refs.formulario.validate()
        this.$nextTick(async () => {
          // Simular login
          this.overlay = true;
          if (valid) {
            setTimeout(async () => {
              this.overlay = false

              let res = await modifyBooking(this.reserva)
              if (res.status == 200) {
                this.$swal({
                  title: "Reserva Modificada!",
                  text: `se ha modificado los datos de la reserva CORRECTAMENTE!!!`,
                  icon: "success",
                  timer: 2500,
                  didClose: () => {
                    this.overlay = false
                    this.$router.go(0)
                  }
                })
              }
            }, 1000);
            return true
          } else {
            this.$swal({
              title: "Error!",
              text: `No puede estar vacio el campo requerido`,
              icon: "error",
              timer: 2500,
              didClose: () => {
                this.overlay = false
                this.setfocus('hora_llegada')
              }
            })
          }
        })
      } catch (error) {
        this.overlay = false  // <-- cerrar overlay ANTES del swal

        this.$swal({
          title: "Error!",
          text: error.response?.data?.error || "Ocurrió un error",
          icon: "error",
          timer: 1500
        })
      }
    },
  },
  mounted() {
    this.setfocus('hora_llegada')
  }
}
</script>

<style lang="scss" scoped></style>
