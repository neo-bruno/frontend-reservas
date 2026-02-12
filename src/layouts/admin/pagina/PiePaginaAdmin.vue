<template>
  <v-container fluid>
    <v-row>
      <v-col cols="4" class="pa-0">
        <v-container class="py-0 ps-0">
          <v-card>
            <v-card-text>
              <v-container>
                <v-form ref="formulario" @submit.prevent="">
                  <v-row>
                    <v-col cols="12" class="px-0">
                      <v-text-field ref="url" v-model="seccion.url_seccion" density="compact"
                        label="ubicacion del hotel en google" placeholder="ingrese la url del mapa"
                        prepend-inner-icon="mdi-map-marker" variant="outlined"
                        :rules="[rules.required, rules.reglaContieneLetra]">
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" class="px-0">
                      <v-file-input v-model="nuevaImagen" density="compact" label="Imagen de fondo del footer"
                        prepend-inner-icon="mdi-image" variant="outlined" accept="image/*" show-size></v-file-input>
                    </v-col>
                  </v-row>
                </v-form>
                <v-row>
                  <v-col cols="12">
                    <v-btn block color="primary" class="rounded-lg" density="comfortable" icon="mdi-update"
                      @click="actualizarSeccion">actualizar datos</v-btn>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col v-for="(item, i) in seccion.iconos" :key="i" cols="12"
                    class="text-center mb-8 position-relative border">
                    <!-- BOTÓN X arriba a la derecha -->
                    <v-icon color="secondary" size="35" class="close-icon" @click="abrirEditorIcono(item)"> mdi-pencil
                    </v-icon>

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
              </v-container>
            </v-card-text>
          </v-card>
        </v-container>
      </v-col>
      <v-col cols="8" class="pa-0">
        <div class="espacio"></div>
        <section class="footer-parallax" :style="bgStyle">
          <div class="overlay"></div>
          <div class="contenido">
            <!-- Aquí va lo que quieras mostrar: testimonios, texto, botones, etc -->
            <v-row>
              <v-col lg="4" sm="6" cols="12">
                <p class="text-secondary text-h6 mb-4"><v-icon>mdi-{{ direccion.nombre_icono }}</v-icon> {{
                  direccion.titulo_icono }} </p>
                <p class="font-weight-light">{{ direccion.descripcion_icono }}</p>
                <br>
                <p class="text-secondary text-h6 my-4"><v-icon>mdi-{{ telefonos.nombre_icono }}</v-icon> {{
                  telefonos.titulo_icono }}</p>
                <p class="font-weight-light">{{ telefonos.descripcion_icono }}</p>
                <br>
                <p class="text-secondary text-h6 my-4"><v-icon>mdi-{{ lugar.nombre_icono }}</v-icon> {{
                  lugar.titulo_icono }}</p>
                <p class="font-weight-light">{{ lugar.descripcion_icono }}</p>
              </v-col>
              <v-col lg="2" sm="6" cols="12">
                <v-divider class="mb-4"></v-divider>
                <p class="text-secondary text-h6 mb-6">Explorar </p>
                <p class="font-weight-light mt-4">Inicio</p>
                <p class="font-weight-light mt-4">Habitaciones</p>
                <p class="font-weight-light mt-4">Perfil Usuario</p>
                <br>
              </v-col>
              <v-col lg="6" sm="12" cols="12">
                <div class="mapa-container">

                  <iframe class="mapa" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
                    :src="seccion.url_seccion" width="100%" height="300" style="border:0;" allowfullscreen>
                  </iframe>
                </div>
                <div class="text-center text-terceary mt-4 d-flex justify-space-around">
                  <span><v-icon class="mb-2 me-3" color="secondary">mdi-{{ hotel.nombre_icono }}</v-icon> {{
                    hotel.titulo_icono }} </span>
                  <span><v-icon class="mb-2 me-3" color="secondary">mdi-{{ celular.nombre_icono }}</v-icon> {{
                    celular.titulo_icono }}</span>

                </div>
              </v-col>
            </v-row>
          </div>

          <!-- <v-btn color="secondary" variant="outlined" icon="mdi-arrow-up-thin" class="scroll-to-top"
            @click="scrollToTop"></v-btn> -->
        </section>
        <div class="barra-extra">
          <p class="text-caption text-terceary font-weight-light text-center">
            Copyright &copy; {{ new Date().getFullYear() }} - Ing. Rudolf Felipez Mancilla - Full Stack Developer
          </p>
        </div>
      </v-col>
    </v-row>
  </v-container>

  <!-- registrar nuevo icono -->
  <v-dialog v-model="dialogo_editar" transition="dialog-bottom-transition" :fullscreen="$vuetify.display.xs"
    :max-width="$vuetify.display.xs ? undefined : 470" persistent scrollable>
    <v-card class="px-0">

      <v-toolbar class="text-center font-weight-medium text-wrap bg-primary" title="Nuevo Servicio"></v-toolbar>

      <v-card-text class="px-0 py-0">
        <v-container>
          <v-form ref="form" @submit.prevent="">
            <v-row>
              <v-col cols="10">
                <v-text-field ref="nombre_icono" v-model="icono.nombre_icono" density="compact" label="nombre del icono"
                  placeholder="ingrese icono" prefix="mdi-" prepend-inner-icon="mdi-text" variant="outlined"
                  :rules="[rules.required, rules.reglaContieneLetra]" @keyup.enter.prevent="setfocus('titulo_icono')">
                </v-text-field>
              </v-col>
              <v-col cols="2">
                <v-icon size="40" color="secondary">mdi-{{ icono.nombre_icono }}</v-icon>
              </v-col>
              <v-col cols="12">
                <v-text-field ref="titulo_icono" v-model="icono.titulo_icono" density="compact"
                  label="titulo del servicio" placeholder="ingrese titulo" prepend-inner-icon="mdi-text"
                  variant="outlined" :rules="[rules.required, rules.reglaContieneLetra]"
                  @keyup.enter.prevent="setfocus('descripcion_icono')">
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea ref="descripcion_icono" v-model="icono.descripcion_icono" density="compact"
                  prepend-inner-icon="mdi-text" variant="outlined" label="descripcion del servicio"
                  :rules="[rules.required]" @keyup.enter.prevent="setfocus('nombre_icono')"></v-textarea>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="elevated" color="primary" prepend-icon="mdi-cancel"
          @click="dialogo_editar = false">Salir</v-btn>
        <v-btn variant="elevated" color="success" prepend-icon="mdi-content-save" append-icon="mdi-chevron-right"
          @click="modificar(icono)">guardar datos</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>

  <!-- capa protectora de proceso -->
  <v-overlay :model-value="overlay" class="align-center justify-center" persistent>
    <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
  </v-overlay>
</template>

<script>
import { saveFile } from '@/services/imagen.service';
import { getSectionByType, modifyIconSeccion, modifySection } from '@/services/seccion.service';

export default {
  data: () => ({
    seccion: {},
    direccion: {},
    telefonos: {},
    lugar: {},
    hotel: {},
    celular: {},

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
    icono: null,
    dialogo_editar: false,
    file: null,

    nuevaImagen: null,  // SOLO File
    imagenPreview: null,

    // paralizando pantalla
    overlay: false,
    errores: false,
  }),
  computed: {
    bgStyle() {
      return {
        backgroundImage: `url(${this.seccion.video_seccion})`
      }
    }
  },

  watch: {
    overlay(val) {
      val && setTimeout(() => {
        this.overlay = false
      }, 100000)
    },
    nuevaImagen(file) {
      if (file instanceof File) {
        this.imagenPreview = URL.createObjectURL(file)
      }
    }
  },
  methods: {
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    setfocus(foco) {
      this.$nextTick(() => {
        if (foco === "url") {
          this.$refs.url?.select()
          this.$refs.url?.focus()
        }
        if (foco === "nombre_icono") {
          this.$refs.nombre_icono?.select()
          this.$refs.nombre_icono?.focus()
        }
        if (foco === "titulo_icono") {
          this.$refs.titulo_icono?.select()
          this.$refs.titulo_icono?.focus()
        }
        if (foco === "subtitulo_icono") {
          this.$refs.subtitulo_icono?.select()
          this.$refs.subtitulo_icono?.focus()
        }
        if (foco === "descripcion_icono") {
          this.$refs.descripcion_icono?.select()
          this.$refs.descripcion_icono?.focus()
        }
      })
    },
    actualizarImagen() {
      if (!this.seccion.video_seccion) {
        this.seccion.video_seccion = this.seccion.url_backup
        return
      }

      this.file = this.seccion.video_seccion

      // Si viene como array (Vuetify)
      if (Array.isArray(this.file)) {
        this.file = this.file[0]
      }

      // Crear URL temporal
      const url = URL.createObjectURL(this.file)

      // Guardar como fondo
      this.seccion.video_seccion = url
    },
    abrirEditorIcono(item) {
      this.icono = item
      this.dialogo_editar = true
      this.setfocus('nombre_icono')
    },
    async modificar(item) {
      try {
        const { valid } = await this.$refs.form.validate()
        this.$nextTick(async () => {
          // Simular login
          this.overlay = true;
          if (valid) {
            setTimeout(async () => {
              this.overlay = false
              console.log(item)
              let res = await modifyIconSeccion(item)
              if (res.status === 200) {
                this.$swal({
                  title: "Caracteristica Modificada!",
                  text: "Se ha modificado los datos de la caracteristica correctamente!!!",
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
    async obtenerSeccion() {
      try {
        const res = await getSectionByType(6)
        if (res.status == 201) {
          this.seccion = res.data.data
          this.imagenPreview = this.seccion.video_seccion

          this.seccion.url_backup = 'https://media.gettyimages.com/id/1266155634/es/foto/lujosos-y-elegantes-interiores-de-dormitorio.jpg?s=1024x1024&w=gi&k=20&c=CzT_9g39vpyysJoMgqjvsGtEXKztoRjswiRLC3RLCMI='
          if (this.seccion.iconos.length == 5) {
            this.direccion = this.seccion.iconos[0]
            this.telefonos = this.seccion.iconos[1]
            this.lugar = this.seccion.iconos[2]
            this.hotel = this.seccion.iconos[3]
            this.celular = this.seccion.iconos[4]
          }
        }
      } catch (error) {
        console.log(error)
      }
    },
    async actualizarSeccion() {
      try {
        const { valid } = await this.$refs.formulario.validate()
        this.$nextTick(async () => {
          // Simular login
          this.overlay = true;
          if (valid) {
            setTimeout(async () => {
              this.overlay = false

              let payload = { ...this.seccion }

              if (this.nuevaImagen instanceof File) {
                const formdata = new FormData()
                formdata.append('file', this.nuevaImagen)

                const res = await saveFile(formdata)

                payload.video_seccion = res.data
                this.imagenPreview = res.data
              }

              let res = await modifySection(payload)
              if (res.status === 200) {
                this.nuevaImagen = null
                this.$swal({
                  title: "Seccion Modificada!",
                  text: "Se ha modificado los datos de la seccion correctamente!!!",
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
  async mounted() {
    try {
      this.setfocus('url')
      await this.obtenerSeccion()
    } catch (error) {
      console.log('el error es: ', error)
    }
  }
}
</script>

<style lang="scss" scoped>
.espacio {
  height: 10rem;
  background-color: #f8f5f1;
}

.footer-parallax {
  position: relative;
  padding-top: 2rem;
  width: 100%;
  height: auto;

  background-attachment: fixed;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.footer-parallax .overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom,
      rgba(29, 31, 47, 0.4) 5%,
      rgba(29, 31, 47, 0.6) 10%,
      rgba(29, 31, 47, 0.9) 30%,
      rgba(29, 31, 47, 1) 60%,
      rgba(29, 31, 47, 1) 100%);
  z-index: 1;
}

.footer-parallax .contenido {
  position: relative;
  z-index: 2;
  text-align: left;
  width: 90%;

  color: white;
  padding: 2px;
}

.barra-extra {
  align-content: center;
  height: 100px;
  width: 100%;
  font-size: 1rem;
  background-color: #1d1f2f;
  /* O el color que tú quieras */
}


/* Botón scroll to top */
.scroll-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 999;
  border: 1px solid #f7c76e;
}

// mapa del hotel
.mapa-container {
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-top: 3px solid #1d1f2f;
}


/* responsive about */
@media (max-width: 693px) {
  .scroll-to-top {
    display: none;
  }
}

.close-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}
</style>
