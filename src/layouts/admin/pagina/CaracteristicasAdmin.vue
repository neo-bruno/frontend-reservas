<template>
  <v-container fluid>
    <v-row>
      <v-col cols="3">
        <v-card>
          <v-card-text>
            <v-container>
              <v-form ref="formulario" @submit.prevent="">
                <v-row>
                  <v-col cols="12">
                    <v-text-field ref="nombre" v-model="seccion.nombre_seccion" density="compact"
                      label="nombre de la seccion" placeholder="modificar el nombre" prepend-inner-icon="mdi-text"
                      variant="outlined" :rules="[rules.required , rules.reglaContieneLetra]" @keyup.enter.prevent="setfocus('titulo')">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field ref="titulo" v-model="seccion.titulo_seccion" density="compact"
                      label="titulo de la seccion" placeholder="modificar el titulo" prepend-inner-icon="mdi-text"
                      variant="outlined" :rules="[rules.required , rules.reglaContieneLetra]" @keyup.enter.prevent="setfocus('nombre')">
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" class="d-flex justify-end">
                    <v-btn color="success" append-icon="mdi-chevron-right" prepend-icon="mdi-plus"
                      @click="abrirServicio">agregar servicio</v-btn>
                  </v-col>
                  <v-col v-for="(item, i) in seccion.iconos" :key="i" cols="12" class="text-center mb-8 position-relative border">
                    <!-- BOTÓN X arriba a la derecha -->
                    <v-icon color="error" class="close-icon" @click="removeIcon(item.id_icono)"> mdi-close </v-icon>

                    <!-- ICONO PRINCIPAL -->
                    <v-icon size="70" class="mb-4" color="secondary">
                      mdi-{{ item.nombre_icono }}
                    </v-icon>

                    <div class="font-weight-bold mb-2" style="font-size: 1.5rem;">
                      {{ item.titulo_icono }}
                    </div>

                    <p>{{ item.descripcion_icono }}</p>
                  </v-col>
                </v-row>

              </v-form>
              <v-row>
                <v-col cols="12" class="d-flex justify-end">
                  <v-btn color="primary" variant="elevated" append-icon="mdi-chevron-right" prepend-icon="mdi-update"
                    @click="actualizarSeccion()">actualizar datos</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="9">
        <v-container fluid class="py-12 px-4 px-md-12 bg-white">
          <div class="text-center mb-10">
            <p class="font-weight-medium text-secondary">{{ seccion.nombre_seccion }}</p>
            <h2 class="text-h4 font-weight-bold">{{ seccion.titulo_seccion }}</h2>
          </div>

          <v-row dense justify="center">
            <v-col v-for="(item, i) in seccion.iconos" :key="i" cols="12" sm="6" md="3" class="text-center mb-8">
              <v-icon size="70" class="mb-4" color="secondary">mdi-{{ item.nombre_icono }}</v-icon>
              <div class="font-weight-bold mb-2" style="font-size: 1.5rem;">{{ item.titulo_icono }}</div>
              <p class="">{{ item.descripcion_icono }}</p>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>

  <!-- registrar nuevo icono -->
  <v-dialog v-model="dialogo_servicio" transition="dialog-bottom-transition" :fullscreen="$vuetify.display.xs"
    :max-width="$vuetify.display.xs ? undefined : 470" persistent scrollable>
    <v-card class="px-0">

      <v-toolbar class="text-center font-weight-medium text-wrap bg-primary" title="Nuevo Servicio"></v-toolbar>

      <v-card-text class="px-0 py-0">
        <v-form ref="form" @submit.prevent="">
          <v-container>
            <v-row>
              <v-col cols="10">
                <v-text-field ref="nombre_icono" v-model="icono.nombre_icono" density="compact" label="nombre del icono"
                  placeholder="ingrese icono" prefix="mdi-" prepend-inner-icon="mdi-text" variant="outlined"
                  :rules="[rules.required, rules.reglaContieneLetra]" @keyup.enter.prevent="setfocus('titulo_icono')">
                </v-text-field>
              </v-col>
              <v-col cols="2">
                <v-icon size="40" color="success">mdi-{{ icono.nombre_icono }}</v-icon>
              </v-col>
              <v-col cols="12">
                <v-text-field ref="titulo_icono" v-model="icono.titulo_icono" density="compact"
                  label="titulo del servicio" placeholder="ingrese titulo" prepend-inner-icon="mdi-text"
                  variant="outlined" :rules="[rules.required, rules.reglaContieneLetra]" @keyup.enter.prevent="setfocus('descripcion_icono')">
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea ref="descripcion_icono" v-model="icono.descripcion_icono" density="compact"
                  prepend-inner-icon="mdi-text" variant="outlined" label="descripcion del servicio"
                  :rules="[rules.required, rules.reglaContieneLetra]"
                  @keyup.enter.prevent="setfocus('nombre_icono')"></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="elevated" color="primary" prepend-icon="mdi-cancel"
          @click="dialogo_servicio = false">Salir</v-btn>
        <v-btn variant="elevated" color="success" prepend-icon="mdi-content-save" append-icon="mdi-chevron-right"
          @click="agregarServicio">guardar datos</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>

  <!-- capa protectora de proceso -->
  <v-overlay :model-value="overlay" class="align-center justify-center" persistent>
    <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
  </v-overlay>
</template>

<script>
import { getSectionByType, modifySection } from '@/services/seccion.service';

export default {
  data() {
    return {
      seccion: {},
      icono: {},

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

      dialogo_servicio: false,

      // paralizando pantalla
      overlay: false,
      errores: false,
    };
  },
  watch: {
    overlay(val) {
      val && setTimeout(() => {
        this.overlay = false
      }, 100000)
    },
  },
  methods: {
    async actualizarSeccion() {
      try {
        if (this.seccion.iconos.length >= 4) {
          const { valid } = await this.$refs.formulario.validate()
          this.$nextTick(async () => {
            // Simular login
            this.overlay = true;
            if (valid) {
              setTimeout(async () => {
                this.overlay = false

                let res = await modifySection(this.seccion)
                if (res.status == 200) {
                  this.$swal({
                    title: "Seccion Modificada!",
                    text: `se ha modificado los datos de la seccion CORRECTAMENTE!!!`,
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
                  this.setfocus('nombre')
                }
              })
            }
          })
        } else {
          this.$swal({
            title: "Error!",
            text: `debe haber al menos 4 servicios para esta seccion!`,
            icon: "error",
            timer: 2500,
            didClose: () => {
              this.overlay = false
            }
          })
        }

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
    setfocus(foco) {
      this.$nextTick(() => {
        if (foco === "nombre") {
          this.$refs.nombre?.select()
          this.$refs.nombre?.focus()
        }
        if (foco === "titulo") {
          this.$refs.titulo?.select()
          this.$refs.titulo?.focus()
        }
        if (foco === "titulo_icono") {
          this.$refs.titulo_icono?.select()
          this.$refs.titulo_icono?.focus()
        }
        if (foco === "nombre_icono") {
          this.$refs.nombre_icono?.select()
          this.$refs.nombre_icono?.focus()
        }
        if (foco === "descripcion_icono") {
          this.$refs.descripcion_icono?.select()
          this.$refs.descripcion_icono?.focus()
        }
      })
    },

    abrirServicio() {
      this.icono = { subtitulo_icono: '' }
      this.dialogo_servicio = true
      this.setfocus('nombre_icono')
    },
    async agregarServicio() {
      try {
        const { valid } = await this.$refs.form.validate()
        this.$nextTick(async () => {
          // Simular login
          this.overlay = true;
          if (valid) {
            setTimeout(async () => {
              this.overlay = false
              this.seccion.iconos.push(this.icono)
              this.dialogo_servicio = false
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
                this.setfocus('nombre_icono')
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
    removeIcon(item) {
      this.seccion.iconos = this.seccion.iconos.filter(ele => ele.id_icono != item)
    },
    async obtenerSeccion(){
      try {
        const res = await getSectionByType(4)
        if(res.status == 201){
          this.seccion = res.data.data
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
  mounted(){
    this.obtenerSeccion()
  }
};
</script>
<style lang="css" scoped>
.close-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

</style>
