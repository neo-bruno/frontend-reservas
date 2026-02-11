<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="6">
        <v-card>
          <v-card-title class="bg-primary">
            <div class="d-flex justify-space-between">
              <span class="font-weight-bold text-warning"> <v-icon>mdi-pencil</v-icon> Modificar Categoria </span>
              <v-btn variant="flat" density="compact" color="error" prepend-icon="mdi-undo" @click="volverAtras"> volver
                atras</v-btn>
            </div>
          </v-card-title>
          <v-card-text>
            <v-form ref="formulario" @submit.prevent="">
              <v-container>
                <v-row>
                  <v-col cols="4">
                    <p class="pt-3" style="font-size: 1rem;">categoria (*)</p>
                  </v-col>
                  <v-col cols="8">
                    <v-text-field ref="nombre_categoria" v-model="categoria.nombre_categoria" density="compact"
                      placeholder="categoria de la habitacion" prepend-inner-icon="mdi-floor-plan" variant="outlined"
                      :rules="[rules.required, rules.reglaContieneLetra]" @input="categoria.nombre_categoria = categoria.nombre_categoria.toUpperCase()"
                      @keyup.enter.prevent="setfocus('descripcion_categoria')"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4">
                    <p class="pt-3" style="font-size: 1rem;">descripcion</p>
                  </v-col>
                  <v-col cols="8">
                    <v-textarea ref="descripcion_categoria" v-model="categoria.descripcion_categoria" density="compact"
                      placeholder="descripcion de la categoria" prepend-inner-icon="mdi-text" variant="outlined" hide-details
                      @keyup.ctrl.enter.prevent="setfocus('precio_ahora')"></v-textarea>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <p class="pt-3" style="font-size: 1rem;">precio de categoria (*)</p>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field ref="precio_ahora" type="number" v-model="categoria.precio_ahora_categoria"
                      density="compact" placeholder="precio de ahora" prepend-inner-icon="mdi-cash" variant="outlined"
                      :rules="[rules.required, rules.soloNumeroODecimal]" suffix="Bs.-"
                      @keyup.enter.prevent="setfocus('precio_anterior')"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6">
                    <p class="pt-3" style="font-size: 1rem;">precio anterior (*)</p>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field ref="precio_anterior" type="number" v-model="categoria.precio_antes_categoria"
                      density="compact" placeholder="nombre anterior" prepend-inner-icon="mdi-cash" variant="outlined"
                      :rules="[rules.required, rules.soloNumeroODecimal]" suffix="Bs.-"
                      @keyup.enter.prevent="setfocus('nombre_categoria')"></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="6">
                    <p class="pt-3" style="font-size: 1rem;">descuento por noches (*)</p>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field ref="descuento" type="number" v-model="categoria.descuento_categoria"
                      density="compact" placeholder="descuento %" prepend-inner-icon="mdi-percent" variant="outlined"
                      :rules="[rules.required, rules.soloNumeroODecimal]" suffix="%"
                      @keyup.enter.prevent="setfocus('cantidad_noches')"></v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="6">
                    <p class="pt-3" style="font-size: 1rem;">cant noches descuento (*)</p>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field ref="cantidad_noches" type="number" v-model="categoria.cant_noches_categoria"
                      density="compact" placeholder="cant de noches" prepend-inner-icon="mdi-calendar-today" variant="outlined"
                      :rules="[rules.required, rules.soloNumeroODecimal]" suffix=""
                      @keyup.enter.prevent="setfocus('nombre_categoria')"></v-text-field>
                  </v-col>
                </v-row>

                <v-row justify="end">
                  <v-col cols="auto" class="d-flex justify-end">
                    <v-btn color="warning" block prepend-icon="mdi-content-save" append-icon="mdi-chevron-right"
                      @click="guardarDatos">modificar datos categoria</v-btn>
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
import { getCategory, modifyCategory, saveCategory } from '@/services/categoria.service';

export default {
  data(){
    return {
      id_categoria: this.$route.params.id_categoria,

      categoria: {
        nombre_categoria: '',
        descripcion_categoria: '',
        precio_ahora_categoria: 0,
        precio_antes_categoria: 0
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
    setfocus(foco) {
      this.$nextTick(() => {
        if (foco === "nombre_categoria") {
          this.$refs.nombre_categoria?.select()
          this.$refs.nombre_categoria?.focus()
        }

        if (foco === "descripcion_categoria") {
          this.$refs.descripcion_categoria?.focus()
        }

        if (foco === "precio_ahora") {
          this.$refs.precio_ahora?.select()
          this.$refs.precio_ahora?.focus()
        }

        if (foco === "precio_anterior") {
          this.$refs.precio_anterior?.select()
          this.$refs.precio_anterior?.focus()
        }

        if (foco === "descuento") {
          this.$refs.descuento?.select()
          this.$refs.descuento?.focus()
        }

        if (foco === "cantidad_noches") {
          this.$refs.cantidad_noches?.select()
          this.$refs.cantidad_noches?.focus()
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

              let res = await modifyCategory(this.categoria)
              if (res.status == 200) {
                this.$swal({
                  title: "Registro Modificado!",
                  text: `se ha modificado los datos de la categoria CORRECTAMENTE!!!`,
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
                this.setfocus('nombre_categoria')
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
    async obtenerCategoria(){
      try {
        let res = await getCategory(this.id_categoria)
        if(res.status == 201)
          this.categoria = res.data.data
        console.log(this.categoria)
      } catch (error) {
        console.log(error)
      }
    },
    volverAtras() {
      this.$router.go(-1)
      this.obtenerCategoria()
    },
  },
  mounted() {
    this.setfocus('nombre_categoria')
    this.obtenerCategoria()
  }

}
</script>

<style lang="scss" scoped></style>
