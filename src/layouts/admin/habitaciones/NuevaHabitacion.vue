<template>
  <v-container>
    <v-btn class="mb-1" color="success" @click="volverAtras"><v-icon>mdi-undo</v-icon> <span class="mx-2">volver
        atras</span></v-btn>
    <v-stepper color="primary" v-model="step" next-text="siguiente" prev-text="atras">
      <v-stepper-header>
        <v-stepper-item :complete="step == 2 || step == 3" title="Categorias y Camas" color="primary"
          :value="1"></v-stepper-item>
        <v-stepper-item :complete="step == 3" title="Servicios e Imagnes" color="primary" :value="2"></v-stepper-item>
        <v-stepper-item :complete="step == 4" title="Formulario Habitacion" color="primary" :value="3"></v-stepper-item>
      </v-stepper-header>

      <v-stepper-window class="ma-0">
        <v-stepper-window-item :value="1">
          <Paso1DatosGenerales v-model="habitacion" />
        </v-stepper-window-item>

        <v-stepper-window-item :value="2">
          <Paso2Servicios v-model="habitacion" />
        </v-stepper-window-item>

        <v-stepper-window-item :value="3">
          <Paso3Camas v-model="habitacion" />
        </v-stepper-window-item>

      </v-stepper-window>
      <v-stepper-actions>
        <template #prev>
          <v-btn variant="tonal" :disabled="step === 1" @click="atras">
            Atrás
          </v-btn>
        </template>

        <template #next>
          <v-btn color="primary" :disabled="esUltimoPaso && !habitacionCompleta" @click="siguiente">
            {{ esUltimoPaso ? 'Finalizar' : 'Siguiente' }}
          </v-btn>
        </template>
      </v-stepper-actions>

    </v-stepper>

  </v-container>

  <!-- capa protectora de proceso -->
  <v-overlay :model-value="overlay" class="align-center justify-center" persistent>
    <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
  </v-overlay>
</template>


<script>
import { saveFile } from '@/services/imagen.service';
import Paso1DatosGenerales from './pasos/Paso1DatosGenerales.vue';
import Paso2Servicios from './pasos/Paso2Servicios.vue';
import Paso3Camas from './pasos/Paso3Camas.vue';
import { saveRoom } from '@/services/habitacion.service';


export default {
  components: {
    Paso1DatosGenerales,
    Paso2Servicios,
    Paso3Camas,
  },


  data() {
    return {
      step: 1,
      totalSteps: 3,
      habitacion: {
        categoria: {
          id_categoria: 0,
          nombre_categoria: '',
          descripcion_categoria: '',
          precio_ahora_categoria: 0.0,
          precio_antes_categoria: 0.0
        },
        nivel: {
          id_nivel: 0,
          nombre_nivel: '',
          descripcion_nivel: '',
          icono_nivel: ''
        },
        habitacion_camas: [],
        servicios_habitacion: [],
        imagenes: [],
        numero_habitacion: '',
        nombre_habitacion: '',
        adultos_habitacion: 0,
        ninos_habitacion: 0,
        descripcion_habitacion: '',
        detalle_habitacion: '',
        estado_habitacion: 1,
      },

      // paralizando pantalla
      overlay: false,
      errores: false,
    }
  },

  computed: {
    esUltimoPaso() {
      return this.step === this.totalSteps
    },

    habitacionCompleta() {
      const h = this.habitacion

      return (
        h.numero_habitacion &&
        h.nombre_habitacion &&
        h.adultos_habitacion > 0 &&
        h.ninos_habitacion >= 0 &&
        h.detalle_habitacion &&
        h.descripcion_habitacion
      )
    },
  },
  watch: {
    overlay(val) {
      val && setTimeout(() => {
        this.overlay = false
      }, 100000)
    },
  },

  methods: {
    volverAtras() {
      this.$router.go(-1)
    },
    atras() {
      this.step--
    },
    siguiente() {
      if (this.step == 1 && this.habitacion.habitacion_camas.length > 0 && this.habitacion.nivel.id_nivel > 0 && this.habitacion.categoria.id_categoria > 0) {
        this.step++
      } else
        if (this.step == 2 && this.habitacion.servicios_habitacion.length > 0 && this.habitacion.imagenes.length > 0) {
          this.step++
        } else {
          if (this.habitacionCompleta) {
            this.finalizar()
          }
        }
    },
    async finalizar() {
      this.overlay = true

      try {
        // 1️⃣ Subir imágenes
        for (const image of this.habitacion.imagenes) {
          if (!image.file) continue

          const formdata = new FormData()
          formdata.append('file', image.file)

          const res = await saveFile(formdata)

          if (res.status !== 200) {
            throw new Error('Error al subir imagen')
          }

          image.url_imagen = res.data
          image.nombre_imagen = image.url_imagen.split('/').pop()
        }

        await new Promise(resolve => setTimeout(resolve, 500));

        // 2️⃣ Guardar habitación
        const res = await saveRoom(this.habitacion)

        if (res.status !== 200) {
          throw new Error('Error al guardar la habitación')
        }

        // 3️⃣ Éxito
        this.$router.push({ name: 'habitaciones-admin' })
        this.$swal({
          title: "Registro Guardado!",
          text: "La habitación se registró correctamente",
          icon: "success",
          timer: 2500,
          // didClose: () => {
          //   this.$router.go(0)
          // }
        })

      } catch (error) {
        console.error(error)

        this.$swal({
          title: "Error!",
          text: error.response?.data?.error || error.message || "Ocurrió un error",
          icon: "error",
          timer: 2500
        })

      } finally {
        // 4️⃣ Siempre cerrar overlay
        this.overlay = false
      }
    },
  }
}
</script>
<style></style>
