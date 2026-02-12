<template>
  <v-container class="pa-0" fluid>
    <v-row>
      <v-col cols="6">
        <v-card>
          <v-card-text>
            <v-container>
              <v-form ref="formulario" @submit.prevent="">
                <v-row>
                  <v-col cols="12">
                    <v-text-field ref="titulo" v-model="seccion.titulo_seccion" density="compact"
                      label="titulo de la seccion" placeholder="modificar el titulo" prepend-inner-icon="mdi-text"
                      variant="outlined" :rules="[rules.required]" @keyup.enter.prevent="setfocus('subtitulo')">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field ref="subtitulo" v-model="seccion.subtitulo_seccion" density="compact"
                      label="subtitulo de la seccion" placeholder="modificar el subtitulo" prepend-inner-icon="mdi-text"
                      variant="outlined" :rules="[rules.required]" @keyup.enter.prevent="setfocus('titulo')">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-file-input ref="video" label="Seleccione un video (*)" prepend-icon="mdi-video" variant="solo"
                      clearable accept="video/*" @update:model-value="onSelectVideo" clear />

                  </v-col>
                </v-row>
              </v-form>
              <v-row>
                <v-col cols="12" class="d-flex justify-end">
                  <v-btn color="primary" variant="elevated" append-icon="mdi-chevron-right" prepend-icon="mdi-update"
                    @click="actualizarSeccion">actualizar datos</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-container fluid class="pa-0">
          <div class="hero">
            <!-- Video de fondo -->
            <!-- <video ref="videoPreview" autoplay muted loop playsinline class="video-bg">
              <source :src="seccion.video_seccion" type="video/mp4" />
              Tu navegador no soporta el video.
            </video> -->
            <video ref="videoPreview" :key="seccion.video_seccion" class="video-bg" :src="seccion.video_seccion" autoplay muted loop
              playsinline></video>


            <!-- Capa oscura encima del video -->
            <div class="overlay">
              <v-container class="fill-height d-flex align-center justify-center text-center text-white">
                <div>
                  <p class="mb-2 text-white opacity-60">{{ seccion.titulo_seccion }}</p>
                  <h2 class="text-terceary font-weight-bold mb-6" v-html="seccion.subtitulo_seccion"></h2>
                </div>
              </v-container>

            </div>
          </div>
        </v-container>
      </v-col>
    </v-row>
  </v-container>

  <!-- capa protectora de proceso -->
  <v-overlay :model-value="overlay" class="align-center justify-center" persistent>
    <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
  </v-overlay>
</template>

<script>
import { saveFile } from '@/services/imagen.service';
import { getSectionByType, modifySection } from '@/services/seccion.service';


export default {
  data() {
    return {
      seccion: {
        nombre_seccion: '',
        titulo_seccion: '',
        subtitulo_seccion: '',
        descripcion_seccion: '',
        detalle_seccion: '',
        url_seccion: '',
        video_seccion: '', //https://www.ansonika.com/paradise/html-menu-3/video/sunset.mp4
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
        if (foco === "titulo") {
          this.$refs.titulo?.select()
          this.$refs.titulo?.focus()
        }
        if (foco === "subtitulo") {
          this.$refs.subtitulo?.select()
          this.$refs.subtitulo?.focus()
        }
      })
    },
    onSelectVideo(file) {
      // Limpiar anterior URL
      if (this.seccion.video_seccion?.startsWith('blob:')) {
        URL.revokeObjectURL(this.seccion.video_seccion)
      }
      if (!file) {
        this.seccion.video_file = null
        this.seccion.video_seccion = 'https://www.ansonika.com/paradise/html-menu-3/video/sunset.mp4'

        this.$nextTick(() => {
          this.$refs.videoPreview.load()
        })
        return
      }
      this.seccion.video_file = file
      this.seccion.video_seccion = URL.createObjectURL(file)

      this.$nextTick(() => {
        this.$refs.videoPreview.load()
      })
    },
    async actualizarSeccion() {
      try {
        const { valid } = await this.$refs.formulario.validate()

        if (!valid) {
          this.$swal({
            title: "Error!",
            text: "No puede estar vacío el campo requerido",
            icon: "error",
            timer: 2500,
            didClose: () => {
              this.overlay = false
              this.setfocus('titulo')
            }
          })
          return
        }
        this.overlay = true

        // Subir video si existe
        if (this.seccion.video_file) {
          const formdata = new FormData()
          formdata.append('file', this.seccion.video_file)

          const res = await saveFile(formdata)
          if (res.status !== 200) {
            throw new Error('Error al subir video')
          }

          // Guardar URL devuelta
          this.seccion.video_seccion = res.data
        }

        // Guardar sección
        const res = await modifySection(this.seccion)

        if (res.status === 200) {
          this.$swal({
            title: "Sección Actualizada!",
            text: "Se guardó correctamente",
            icon: "success",
            timer: 2500,
            didClose: () => {
              this.overlay = false
              this.$router.go(0)
            }
          })
        }

      } catch (error) {
        this.overlay = false

        this.$swal({
          title: "Error!",
          text: error.response?.data?.error || "Ocurrió un error",
          icon: "error",
          timer: 1500
        })
      }
    },
    async obtenerSeccionPrincipal() {
      try {
        const res = await getSectionByType(1)
        if (res.status == 201) {
          this.seccion = res.data.data
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
  mounted() {
    this.obtenerSeccionPrincipal()
  }
}
</script>

<style lang="scss" scoped>
.hero {
  position: relative;
  height: 100vh;
  overflow: hidden;
}

.video-bg {
  position: absolute;
  top: 0;
  left: 0;
  min-width: 100%;
  min-height: 100%;
  object-fit: cover;
  z-index: 0;
}

.overlay {
  position: relative;
  z-index: 1;
  background-color: rgba(78, 78, 78, 0.5);
  /* Oscurece el video */
  height: 100%;
  width: 100%;
}
</style>
