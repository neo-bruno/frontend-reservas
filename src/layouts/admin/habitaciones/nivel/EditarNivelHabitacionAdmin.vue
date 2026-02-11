<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="6">
        <v-card>
          <v-card-title class="bg-primary">
            <div class="d-flex justify-space-between">
              <span class="font-weight-bold text-warning"> <v-icon>mdi-pencil</v-icon> Modificar Nivel </span>
              <v-btn variant="flat" density="compact" color="error" prepend-icon="mdi-undo" @click="volverAtras"> volver
                atras</v-btn>
            </div>
          </v-card-title>
          <v-card-text>
            <v-form ref="formulario" @submit.prevent="">
              <v-container>
                <v-row>
                  <v-col cols="4">
                    <p class="pt-4" style="font-size: 1rem;">nombre del nivel</p>
                  </v-col>
                  <v-col cols="8">
                    <v-text-field ref="nombre_nivel" v-model="nivel.nombre_nivel" density="compact"
                      placeholder="nombre del nivel" prepend-inner-icon="mdi-floor-plan" variant="outlined"
                      :rules="[rules.required, rules.reglaContieneLetra]"
                      @keyup.enter.prevent="setfocus('descripcion_nivel')"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <p class="pt-4" style="font-size: 1rem;">descripcion del nivel</p>
                  </v-col>
                  <v-col cols="8">
                    <v-textarea ref="descripcion_nivel" v-model="nivel.descripcion_nivel" density="compact"
                      placeholder="descripcion del nivel" prepend-inner-icon="mdi-text" variant="outlined"
                      @keyup.ctrl.enter.prevent="setfocus('nombre_nivel')"></v-textarea>
                  </v-col>
                </v-row>
                <v-row justify="end">
                  <v-col cols="7" class="d-flex justify-end">
                    <v-btn color="success" prepend-icon="mdi-content-save" append-icon="mdi-chevron-right"
                      @click="modificarDatos">modificar datos
                      nivel</v-btn>
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
import { getLevel, modifyLevel } from '@/services/nivel.service';

export default {
  data() {
    return {
      id_nivel: this.$route.params.id_nivel,
      nivel: {
        nombre_nivel: '',
        descripcion_nivel: '',
        icono_nivel: ''
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
        if (foco === "nombre_nivel") {
          this.$refs.nombre_nivel?.select()
          this.$refs.nombre_nivel?.focus()
        }

        if (foco === "descripcion_nivel") {
          this.$refs.descripcion_nivel?.select()
          this.$refs.descripcion_nivel?.focus()
        }
      })
    },
    // guardar datos del nivel
    async modificarDatos() {
      try {
        const { valid } = await this.$refs.formulario.validate()
        this.$nextTick(async () => {
          // Simular login
          this.overlay = true;
          if (valid) {
            setTimeout(async () => {
              this.overlay = false

              let res = await modifyLevel(this.nivel)
              if (res.status == 200) {
                this.$swal({
                  title: "Modificacion Guardada!",
                  text: `se ha modificado los datos del nivel CORRECTAMENTE!!!`,
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
                this.setfocus('nombre_nivel')
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
    async obtenerNivel() {
      try {
        let res = await getLevel(this.id_nivel)
        if (res.status == 201)
          this.nivel = res.data.data
      } catch (error) {
        console.log(error)
      }
    },
    volverAtras() {
      this.$router.go(-1)
    },
  },
  mounted() {
    this.setfocus('nombre_nivel')
    this.obtenerNivel()
  }

}
</script>

<style lang="scss" scoped></style>
