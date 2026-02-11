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
                      variant="outlined" :rules="[rules.required, rules.reglaContieneLetra]"
                      @keyup.enter.prevent="setfocus('titulo')">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field ref="titulo" v-model="seccion.titulo_seccion" density="compact"
                      label="titulo de la seccion" placeholder="modificar el titulo" prepend-inner-icon="mdi-text"
                      variant="outlined" :rules="[rules.required, rules.reglaContieneLetra]"
                      @keyup.enter.prevent="setfocus('descripcion')">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea ref="descripcion" v-model="seccion.descripcion_seccion" density="compact"
                      prepend-inner-icon="mdi-text" variant="outlined" label="descripcion de la seccoin"
                      :rules="[rules.required, rules.reglaContieneLetra]"
                      @keyup.enter.prevent="setfocus('nombre')"></v-textarea>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" class="d-flex justify-end">
                    <v-btn color="success" append-icon="mdi-chevron-right" prepend-icon="mdi-plus"
                      @click="abrirServicio">agregar servicio</v-btn>
                  </v-col>
                  <v-col cols="12" class="border">
                    <div class="mb-5 pa-3 rounded-lg bg-orange-lighten-5" v-for="(item, index) in seccion.iconos"
                      :key="index">

                      <!-- fila principal -->
                      <div class="d-flex align-center justify-space-between">

                        <!-- icono + titulo -->
                        <div class="d-flex align-center">
                          <v-icon color="secondary" class="mr-2">
                            mdi-{{ item.nombre_icono }}
                          </v-icon>

                          <strong>{{ item.titulo_icono }}</strong>
                        </div>

                        <!-- close -->
                        <v-icon color="error" class="cursor-pointer" @click="removeIcon(item.id_icono)">
                          mdi-close
                        </v-icon>
                      </div>

                      <!-- descripcion -->
                      <p class="mb-0 mt-2 text-body-2">
                        {{ item.descripcion_icono }}
                      </p>

                    </div>
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
                    @click="actualizarSeccion()">actualizar datos</v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-container class="py-12 px-4 px-md-12 bg-white">
          <v-row>
            <!-- Texto a la izquierda -->
            <v-col cols="12" md="6">
              <p class="font-weight-medium text-secondary">{{ seccion.nombre_seccion }}</p>
              <h2 class="text-h4 font-weight-bold mb-4">{{ seccion.titulo_seccion }}</h2>
              <p class="mb-6">
                {{ seccion.descripcion_seccion }}
              </p>

              <div class="mb-5" v-for="(item, index) in seccion.iconos" :key="index">
                <div class="d-flex align-center mb-2">
                  <v-icon color="secondary" class="mr-2">mdi-{{ item.nombre_icono }}</v-icon>
                  <strong>{{ item.titulo_icono }}</strong>
                </div>
                <p class="mb-4 text-body-2">{{ item.descripcion_icono }}</p>
              </div>

            </v-col>

            <!-- Imágenes con scroll a la derecha -->
            <v-col cols="12" md="6">
              <div class="image-scroll-container">
                <v-img v-for="(image, i) in seccion.fotos" :key="i" :src="image.url_foto" class="mb-4 rounded-lg"
                  height="250" cover />
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
                  :rules="[rules.required]" @keyup.enter.prevent="setfocus('titulo_icono')">
                </v-text-field>
              </v-col>
              <v-col cols="2">
                <v-icon size="40" color="success">mdi-{{ icono.nombre_icono }}</v-icon>
              </v-col>
              <v-col cols="12">
                <v-text-field ref="titulo_icono" v-model="icono.titulo_icono" density="compact"
                  label="titulo del servicio" placeholder="ingrese titulo" prepend-inner-icon="mdi-text"
                  variant="outlined" :rules="[rules.required]" @keyup.enter.prevent="setfocus('descripcion_icono')">
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
import { saveFile } from '@/services/imagen.service';
import { getSectionByType, modifySection } from '@/services/seccion.service';
import draggable from 'vuedraggable';

export default {
  components: {
    draggable,
  },
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
      files: [],
      dragging: false,
      dialogo_galeria: false,

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
    removeImage(index) {
      URL.revokeObjectURL(this.seccion.fotos[index].url_foto)
      this.seccion.fotos.splice(index, 1)
    },
    async actualizarSeccion() {
      try {
        if (this.seccion.fotos.length >= 4 && this.seccion.iconos.length > 0) {
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
                  this.setfocus('nombre')
                }
              })
            }
          })
        } else {
          this.$swal({
            title: "Error!",
            text: `debe haber al menos 4 imagenes y 1 caracteristica para esta seccion!`,
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
        if (foco === "titulo") {
          this.$refs.titulo?.select()
          this.$refs.titulo?.focus()
        }
        if (foco === "subtitulo") {
          this.$refs.subtitulo?.select()
          this.$refs.subtitulo?.focus()
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

    async obtenerSeccion() {
      try {
        const res = await getSectionByType(3)
        if (res.status == 201) {
          this.seccion = res.data.data
          console.log(this.seccion)
        }
      } catch (error) {
        console.log(error)
      }
    },

  },
  mounted() {
    this.obtenerSeccion()
  }
};
</script>

<style scoped>
.image-scroll-container {
  max-height: 600px;
  overflow-y: auto;
  padding-right: 8px;
}
</style>
