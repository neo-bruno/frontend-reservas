<template>
  <v-container>
    <v-card elevation="7">
      <!-- HEADER -->
      <v-card-title class="text-center font-weight-bold bg-primary">
        {{ resena.id_resena > 0 ? 'Mi reseña' : 'Agregar reseña' }}
      </v-card-title>

      <v-divider />

      <v-card-text>
        <v-form ref="formulario" @submit.prevent="">
          <!-- ⭐ PUNTUACIÓN -->
          <div class="text-center">
            <v-rating v-model="resena.puntuacion_resena" color="amber" background-color="grey" large
              :rules="[rules.required]" :readonly="resena.id_resena > 0" />
          </div>
          <!-- 💬 COMENTARIO -->
          <v-textarea ref="comentario" v-model="resena.comentario_resena" label="Comentario" auto-grow rows="3"
            :rules="[rules.required, rules.reglaContieneLetra]" variant="solo" :readonly="resena.id_resena > 0" />
          <!-- 📅 FECHA -->
          <small class="grey--text" v-if="resena.fecha_resena">
            {{ formatearFecha(resena.fecha_resena) }}
          </small>
        </v-form>
      </v-card-text>

      <v-divider />

      <!-- BOTONES -->
      <v-card-actions class="justify-end bg-primary">

        <!-- GUARDAR -->
        <v-btn variant="elevated" v-if="resena.id_resena == 0" color="success" prepend-icon="mdi-content-save"
          append-icon="mdi-chevron-right" dark @click="guardarResena"> Guardar </v-btn>

        <!-- EDITAR -->
        <v-btn variant="elevated" v-else color="warning" prepend-icon="mdi-pencil" append-icon="mdi-chevron-right"
          @click="modificarResena"> Editar </v-btn>

      </v-card-actions>

    </v-card>
  </v-container>

  <!-- capa protectora de proceso -->
  <v-overlay :model-value="overlay" class="align-center justify-center" persistent>
    <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
  </v-overlay>
</template>

<script>
import { getReview, modifyReview, saveReview } from '@/services/reserna.service';
import moment from 'moment'
import 'moment/locale/es'

export default {
  props: {
    reserva: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      resena: {
        id_resena: 0,
        id_habitacion: null,
        id_usuario: null,
        fecha_resena: null,
        puntuacion_resena: null,
        comentario_resena: '',
        estado_resena: false
      },
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
        soloNumeroODecimal: v =>
          (!!v && /^[0-9]+(\.[0-9]+)?$/.test(v)) || 'Solo números enteros o decimales',
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
    async guardarResena() {
      try {
        this.resena.id_habitacion = this.reserva.habitacion.id_habitacion
        this.resena.id_usuario = this.reserva.usuario.id_usuario
        this.resena.estado_resena = false

        const { valid } = await this.$refs.formulario.validate()
        this.$nextTick(async () => {
          // Simular login
          this.overlay = true;
          if (valid) {
            setTimeout(async () => {
              this.overlay = false

              let res = await saveReview(this.resena)
              if (res.status == 200) {
                this.$swal({
                  title: "Reseña Guardada!",
                  text: `se ha guardado los datos de la reseña CORRECTAMENTE!!!`,
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
    async modificarResena() {
      try {
        const { valid } = await this.$refs.formulario.validate()
        this.$nextTick(async () => {
          // Simular login
          this.overlay = true;
          if (valid) {
            setTimeout(async () => {
              this.overlay = false

              let res = await modifyReview(this.resena)
              if (res.status == 200) {
                this.$swal({
                  title: "Reseña Modificada!",
                  text: `se ha modificado los datos de la reseña CORRECTAMENTE!!!`,
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

    formatearFecha(fecha) {
      return moment(fecha).format('DD/MM/YYYY')
    },
    async obtenerResena() {
      try {
        let res = await getReview(this.reserva.habitacion.id_habitacion, this.reserva.usuario.id_usuario)
        if (res.status == 200) {
          this.resena = res.data.data
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
  mounted() {
    this.obtenerResena()
  }
}
</script>

<style lang="scss" scoped></style>
