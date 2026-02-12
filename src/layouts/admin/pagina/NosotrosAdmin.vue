<template>
  <v-container fluid>
    <v-row>
      <v-col cols="4">
        <v-card>
          <v-card-text>
            <v-container>
              <v-form ref="formulario" @submit.prevent="">
                <v-row>
                  <v-col cols="12">
                    <v-text-field ref="nombre" v-model="seccion.nombre_seccion" density="compact"
                      label="nombre de la seccion" placeholder="modificar el nombre" prepend-inner-icon="mdi-text"
                      variant="outlined" :rules="[rules.required, rules.reglaContieneLetra]" @keyup.enter.prevent="setfocus('titulo')">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field ref="titulo" v-model="seccion.titulo_seccion" density="compact"
                      label="titulo de la seccion" placeholder="modificar el titulo" prepend-inner-icon="mdi-text"
                      variant="outlined" :rules="[rules.required, rules.reglaContieneLetra]" @keyup.enter.prevent="setfocus('subtitulo')">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field ref="subtitulo" v-model="seccion.subtitulo_seccion" density="compact"
                      label="subtitulo de la seccion" placeholder="modificar el subtitulo" prepend-inner-icon="mdi-text"
                      variant="outlined" :rules="[rules.required, rules.reglaContieneLetra]" @keyup.enter.prevent="setfocus('descripcion')">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea ref="descripcion" v-model="seccion.descripcion_seccion" density="compact"
                      prepend-inner-icon="mdi-text" variant="outlined" label="descripcion de la seccoin"
                      :rules="[rules.required, rules.reglaContieneLetra]"
                      @keyup.enter.prevent="setfocus('detalle')"></v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field ref="detalle" v-model="seccion.detalle_seccion" density="compact"
                      prepend-inner-icon="mdi-text" variant="outlined" label="detalle de la seccion"
                      :rules="[rules.required, rules.reglaContieneLetra]"
                      @keyup.enter.prevent="setfocus('nombre')"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" style="max-height: 48vh; overflow-y: auto;">

                    <div class="upload-dropzone" @click="$refs.uploader.click()" @dragover.prevent="dragging = true"
                      @dragleave.prevent="dragging = false" @drop.prevent="handleDrop"
                      :class="{ 'upload-dropzone--active': dragging }">

                      <v-icon size="48" color="quintary">mdi-cloud-upload</v-icon>
                      <div class="upload-text">Haz clic o arrastra imágenes aquí</div>

                      <!-- Input oculto -->
                      <v-file-input ref="uploader" v-model="files" class="d-none" accept="image/*" multiple show-size
                        :rules="[validateFiles]" @update:model-value="onFilesChange" clearable />
                    </div>
                  </v-col>
                  <v-col cols="12">
                    <draggable v-model="seccion.fotos" item-key="url_imagen" tag="div" class="imagenes-grid"
                      :animation="500" ghost-class="dragging">
                      <template #item="{ element, index }">
                        <div v-if="index < 6" class="img-item">

                          <!-- CARD 6 (ver más) -->
                          <v-card v-if="index === 5" elevation="7">
                            <v-img :src="element.url_foto || ''" aspect-ratio="1" class="cursor-grab">
                              <v-icon color="red" size="30" @click="removeImage(index)" class="delete-icon">
                                mdi-delete
                              </v-icon>

                              <v-btn v-if="seccion.fotos.length > 6" size="small" elevation="2" color="primary"
                                class="ver-mas-btn" @click="showGaleryImages()">
                                <v-icon start>mdi-image-multiple</v-icon>
                                Ver {{ seccion.fotos.length - 6 }} más
                              </v-btn>
                            </v-img>
                          </v-card>

                          <!-- OTRAS -->
                          <v-card v-else elevation="7">
                            <v-img :src="element.url_foto || ''" aspect-ratio="1" class="cursor-grab">
                              <v-icon color="primary" size="30" @click="showGaleryImages()">mdi-eye</v-icon>
                              <v-icon color="red" size="30" @click="removeImage(index)" class="delete-icon">
                                mdi-delete
                              </v-icon>
                            </v-img>
                          </v-card>

                        </div>
                      </template>
                    </draggable>

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
      <v-col cols="8">
        <v-container class="about-section">
          <v-row>
            <!-- Texto -->
            <v-col cols="12" md="6">
              <p class="font-weight-medium text-secondary">{{ seccion.nombre_seccion }}</p>
              <h2 class="text-h4 font-weight-bold mb-4 text-primary">
                {{ seccion.titulo_seccion }}
              </h2>
              <p style="font-size: 1.3rem;" class="font-weight-light text-primary mb-4">
                {{ seccion.subtitulo_seccion }}
              </p>
              <p style="font-size: 1rem;" class="text-primary">
                {{ seccion.descripcion_seccion }}
              </p>
              <p class="font-italic mt-6 text-primary">{{ seccion.detalle_seccion }}</p>
            </v-col>

            <!-- Imagen -->
            <v-col cols="12" md="6" class="d-flex justify-center align-center">
              <div class="image-wrapper">
                <v-img v-if="seccion.fotos.length > 0" :src="seccion.fotos[1].url_foto || ''" class="main-image"
                  cover></v-img>
                <v-img v-if="seccion.fotos.length > 0" :src="seccion.fotos[0].url_foto || ''" class="overlay-image"
                  cover></v-img>
              </div>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col v-for="(foto, index) in imagenes" :key="index" cols="12" sm="6" md="6" lg="4" class="d-flex">
              <div class="room-card">
                <v-img :src="foto.url_foto || ''" height="380" class="room-img" cover>
                </v-img>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>

  <!-- mostrar las imagenes mas cerca -->
  <v-dialog v-model="dialogo_galeria" fullscreen transition="dialog-bottom-transition">
    <template #default>
      <!-- Botón cerrar -->
      <v-btn icon class="close-btn" @click="closeGaleryImages">
        <v-icon size="36" color="primary">mdi-close</v-icon>
      </v-btn>

      <!-- Contenedor galería -->
      <div class="galeria-container">
        <v-container fluid>
          <v-row dense>
            <draggable v-model="seccion.fotos" item-key="url_foto" tag="div" :animation="300" ghost-class="dragging"
              class="d-flex flex-wrap w-100">
              <template #item="{ element, index }">
                <v-col cols="12" sm="6" md="4" lg="3" xl="2" class="pa-2">
                  <v-card class="overflow-hidden">
                    <v-img :src="element.url_foto" height="200" class="cursor-grab">
                      <v-icon color="red" size="30" @click="removeImage(index)"
                        style="position: absolute; bottom: 80%; right: 1%; font-weight: bold;">
                        mdi-delete
                      </v-icon>
                    </v-img>
                  </v-card>
                </v-col>
              </template>
            </draggable>
          </v-row>
        </v-container>
      </div>
    </template>
  </v-dialog>

  <!-- capa protectora de proceso -->
  <v-overlay :model-value="overlay" class="align-center justify-center" persistent>
    <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
  </v-overlay>
</template>

<script>
import { saveFile } from '@/services/imagen.service';
import { getSectionByType, modifySection } from '@/services/seccion.service';
import draggable from 'vuedraggable';

export default {
  components: {
    draggable,
  },
  data: () => ({
    seccion: {
      nombre_seccion: '',
      titulo_seccion: '',
      subtitulo_seccion: '',
      descripcion_seccion: '',
      detalle_seccion: '',
      url_seccion: '',
      video_seccion: '',
      fotos: [
      ]
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

    files: [],
    dragging: false,
    dialogo_galeria: false,

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
  computed: {
    imagenes() {
      return this.seccion.fotos.slice(2, 5)
    }
  },
  methods: {
    showGaleryImages() {
      this.dialogo_galeria = true
    },
    closeGaleryImages() {
      this.dialogo_galeria = false
    },
    handleDrop(event) {
      this.dragging = false;
      const droppedFiles = event.dataTransfer.files;
      if (droppedFiles.length) {
        this.files = Array.from(droppedFiles);
        this.onFilesChange(this.files);
      }
    },
    moverImagen() {

    },
    validateFiles(files) {
      for (const file of files || []) {
        const sizeLimit = 2 * 1024 * 1024
        if (file.size > sizeLimit) return 'Uno de los archivos es muy grande (máx 2MB)'
        if (!file.type.startsWith('image/')) return 'Todos los archivos deben ser imágenes'
      }
      return true
    },
    async onFilesChange(files) {

      if (!files || files.length === 0) return

      this.overlay = true

      for (const file of files) {

        this.seccion.fotos.push({
          nombre_foto: file.name,
          url_foto: URL.createObjectURL(file),
          file: file
        })
      }

      this.overlay = false

      this.$nextTick(() => {
        this.files = []
      })
    },
    async uploadImage(imagen) {
      try {
        const formdata = new FormData()
        formdata.append('file', imagen.file)
        let res = await saveFile(formdata)
        if (res.status == 200) {
          imagen.url_imagen = res.data
          imagen.nombre_imagen = imagen.url_imagen.split('/').pop()
          this.imagenes.push(imagen)
        }
      } catch (error) {
        console.error('Error al subir la imagen:', error)
      }
    },
    removeImage(index) {
      URL.revokeObjectURL(this.seccion.fotos[index].url_foto)
      this.seccion.fotos.splice(index, 1)
    },
    async actualizarSeccion() {
      try {
        if (this.seccion.fotos.length >= 5) {

          const { valid } = await this.$refs.formulario.validate()
          this.$nextTick(async () => {
            // Simular login
            this.overlay = true;
            if (valid) {
              setTimeout(async () => {
                this.overlay = false

                // 1️⃣ Subir imágenes
                for (const foto of this.seccion.fotos) {
                  if (!foto.file) continue

                  const formdata = new FormData()
                  formdata.append('file', foto.file)

                  const res = await saveFile(formdata)

                  if (res.status !== 200) {
                    throw new Error('Error al subir imagen')
                  }

                  foto.url_foto = res.data
                  foto.nombre_foto = foto.url_foto.split('/').pop()
                }

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
                  this.setfocus('nombre_servicio')
                }
              })
            }
          })
        } else {
          this.$swal({
            title: "Error!",
            text: `debe haber 5 imagenes para esta seccion!`,
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
        if (foco === "subtitulo") {
          this.$refs.subtitulo?.select()
          this.$refs.subtitulo?.focus()
        }
        if (foco === "descripcion") {
          this.$refs.descripcion?.select()
          this.$refs.descripcion?.focus()
        }
        if (foco === "detalle") {
          this.$refs.detalle?.select()
          this.$refs.detalle?.focus()
        }
      })
    },
    async obtenerSeccion() {
      try {
        const res = await getSectionByType(2)
        if (res.status == 201) {
          this.seccion = res.data.data
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
  mounted() {
    this.obtenerSeccion()
    this.setfocus('nombre')
  }
}
</script>

<style lang="scss" scoped>
/* css de about */
.about-section {
  padding-top: 5rem;
  background: #fff;
}

.image-wrapper {
  position: relative;
  width: 100%;
  max-width: 500px;
  margin-bottom: 2rem;
}

.main-image {
  left: 30%;
  width: 80%;
  height: 100%;
  border-radius: 12px;
}

.overlay-image {
  position: absolute;
  width: 50%;
  height: 70%;
  left: 5%;
  top: 15%;
  border-radius: 12px;
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

// imagenes de nosotros
.room-card {
  width: 100%;
  overflow: hidden;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.room-img {
  transition: transform 0.4s ease;
}

.room-card:hover .room-img {
  transform: scale(1.07) translateY(-5px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.2);
}

.overlay {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.65), transparent 50%);
  color: white;
  height: 100%;
  border-radius: 18px;
  transition: background 0.3s ease;
}

/* responsive about */
@media (max-width: 600px) {
  .image-wrapper {
    margin-bottom: 9rem;
  }

  .main-image {
    left: 20%;
  }

  .overlay-image {
    width: 70%;
    left: 2%;
    top: 70%;
  }
}
</style>
