<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="6">
        <v-card>
          <v-card-title class="bg-primary">
            <div class="d-flex justify-space-between">
              <span class="font-weight-bold text-success"> <v-icon>mdi-plus</v-icon> Añadir Servicio </span>
              <v-btn variant="flat" density="compact" color="error" prepend-icon="mdi-undo" @click="volverAtras"> volver
                atras</v-btn>
            </div>
          </v-card-title>
          <v-card-text>
            <v-form ref="formulario" @submit.prevent="">
              <v-container>
                <v-row>
                  <v-col cols="4">
                    <p class="pt-3" style="font-size: 1rem;">nombre servicio (*)</p>
                  </v-col>
                  <v-col cols="8">
                    <v-text-field ref="nombre_servicio" v-model="servicio.nombre_servicio" density="compact"
                      placeholder="servicio de la habitacion" prepend-inner-icon="mdi-floor-plan" variant="outlined"
                      :rules="[rules.required, rules.reglaContieneLetra]"
                      @keyup.enter.prevent="setfocus('icono_servicio')"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="5">
                    <p class="pt-3" style="font-size: 1rem;">icono del servicio (*)</p>
                  </v-col>
                  <v-col cols="5">
                    <v-text-field ref="icono_servicio" v-model="servicio.icono_servicio"
                      density="compact" placeholder="icono" prepend-inner-icon="mdi-rename-box" variant="outlined"
                      :rules="[rules.required, rules.reglaContieneLetra]" prefix="mdi-"
                      @keyup.enter.prevent="setfocus('nombre_servicio')"></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-icon size="40">mdi-{{ servicio.icono_servicio }}</v-icon>
                  </v-col>
                </v-row>

                <v-row justify="end">
                  <v-col cols="auto" class="d-flex justify-end">
                    <v-btn color="success" block prepend-icon="mdi-content-save" append-icon="mdi-chevron-right"
                      @click="guardarDatos">guardar datos servicio</v-btn>
                  </v-col>
                </v-row>

              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- capa protectora de proceso -->
  <v-overlay :model-value="overlay" class="align-center justify-center" persistent>
    <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
  </v-overlay>

</template>

<script>
import { saveService } from '@/services/servicio.service';

export default {
  data: () => ({
    servicio: {
      nombre_servicio: '',
      icono_servicio: ''
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
  }),
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
        if (foco === "nombre_servicio") {
          this.$refs.nombre_servicio?.focus()
          this.$refs.nombre_servicio?.select()
        }

        if (foco === "icono_servicio") {
          this.$refs.icono_servicio?.select()
          this.$refs.icono_servicio?.focus()
        }

      })
    },
    // guardar datos del nivel
    async guardarDatos() {
      try {
        const { valid } = await this.$refs.formulario.validate()
        this.$nextTick(async () => {
          // Simular login
          this.overlay = true;
          if (valid) {
            setTimeout(async () => {
              this.overlay = false

              let res = await saveService(this.servicio)
              if (res.status == 200) {
                this.$swal({
                  title: "Registro Guardado!",
                  text: `se ha guardado los datos del servicio CORRECTAMENTE!!!`,
                  icon: "success",
                  timer: 2500,
                  didClose: () => {
                    this.overlay = false
                    this.volverAtras()
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
                this.setfocus('nombre_servicio')
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
    volverAtras() {
      this.$router.go(-1)
    },
  },
  mounted() {
    this.setfocus('nombre_servicio')
  }

}
</script>

<style lang="scss" scoped></style>
