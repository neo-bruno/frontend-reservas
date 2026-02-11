<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="pb-0 pt-1">
        <span class="text-h5 font-weight-light text-error">Servicios e Imagenes de la Habitacion</span>
      </v-col>
      <v-col cols="4" class="pt-0">
        <v-list select-strategy="single-independent" lines="two" rounded>
          <v-toolbar color="primary">
            <v-toolbar-title>Lista de Servicios</v-toolbar-title>
            <v-btn density="default" color="success" variant="text"
              @click="abrirDialogoServicio"><v-icon>mdi-plus</v-icon> añadir</v-btn>
          </v-toolbar>

          <v-list-item color="octary" v-for="(servicio, index) in lista_servicios" :key="servicio.id_servicio"
            :value="servicio.id_servicio" class="py-3">
            <v-list-item-subtitle class="font-weight-bold text-uppercase">{{ servicio.nombre_servicio
            }}</v-list-item-subtitle>

            <template v-slot:prepend>
              <v-avatar color="primary">
                <v-icon color="white">mdi-{{ servicio.icono_servicio }}</v-icon>
              </v-avatar>
            </template>

            <template v-slot:append>
              <div>
                <v-btn color="error" icon="mdi-delete" variant="tonal" @click="eliminarServicio(servicio)"></v-btn>
              </div>
            </template>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col cols="8">
        <v-row>
          <v-col cols="4" style="max-height: 48vh; overflow-y: auto;">

            <div class="upload-dropzone" @click="$refs.uploader.click()" @dragover.prevent="dragging = true"
              @dragleave.prevent="dragging = false" @drop.prevent="handleDrop"
              :class="{ 'upload-dropzone--active': dragging }">

              <v-icon size="48" color="quintary">mdi-cloud-upload</v-icon>
              <div class="upload-text">Haz clic o arrastra imágenes aquí</div>

              <!-- Input oculto -->
              <v-file-input ref="uploader" v-model="files" class="d-none" accept="image/*" multiple show-size
                :rules="[validateFiles]" @change="onFilesChange" clearable />
            </div>
          </v-col>
          <v-col cols="8">
            <draggable v-model="imagenes" item-key="url_imagen" tag="div" class="imagenes-grid" :animation="500"
              ghost-class="dragging">
              <template #item="{ element, index }">
                <div v-if="index < 6" class="img-item">

                  <!-- CARD 6 (ver más) -->
                  <v-card v-if="index === 5" elevation="7">
                    <v-img :src="element.preview || element.url_imagen" aspect-ratio="1" class="cursor-grab">
                      <v-icon color="red" size="30" @click="removeImage(index)" class="delete-icon">
                        mdi-delete
                      </v-icon>

                      <v-btn v-if="imagenes.length > 6" size="small" elevation="2" color="primary" class="ver-mas-btn"
                        @click="showGaleryImages()">
                        <v-icon start>mdi-image-multiple</v-icon>
                        Ver {{ imagenes.length - 6 }} más
                      </v-btn>
                    </v-img>
                  </v-card>

                  <!-- OTRAS -->
                  <v-card v-else elevation="7">
                    <v-img :src="element.preview || element.url_imagen" aspect-ratio="1" class="cursor-grab">
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
      </v-col>
    </v-row>
  </v-container>

  <!-- dialogo para elejir los servicios de la habitacion -->
  <v-dialog v-model="dialogo_servicios" width="600" persistent>

    <v-card rounded="lg">
      <template v-slot:append>
        <v-icon icon="mdi-close" @click="cerrarDialogoServicios"></v-icon>
      </template>
      <v-card-title class="text-septary text-center">
        <div class="text-h4 text-success">
          {{ getFirstWord('Selecciona') }}
          <span class="text-primary">{{ getSecondtWord(' un Servicio') }}</span>
        </div>
      </v-card-title>
      <v-card-subtitle>
        <div class="text-center text-wrap">haga click en un item de la lista para agregar un servicio a la habitacion.
        </div>
      </v-card-subtitle>
      <v-card-text class="pb-0 mb-0 d-flex flex-column" style="height: 100%;">
        <v-row>
          <v-col cols="12">
            <v-list select-strategy="single-leaf" rounded bg-color="">
              <v-list-item color="" v-for="servicio in servicios" :key="servicio.id_servicio"
                :value="servicio.id_servicio" class="py-3" @click="seleccionoServicio(servicio)">
                <v-list-item-title class="font-weight-bold text-uppercase">{{ servicio.nombre_servicio
                }}</v-list-item-title>

                <v-list-item-subtitle class="mb-1 text-high-emphasis opacity-100 text-septary">{{
                  servicio.nombre_servicio
                }}</v-list-item-subtitle>

                <v-list-item-subtitle class="text-high-emphasis">{{ servicio.nombre_servicio
                }}</v-list-item-subtitle>

                <template v-slot:append>
                  <div>
                    <v-icon class="opacity-30">mdi-{{ servicio.icono_servicio }}</v-icon>
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

  </v-dialog>

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
            <draggable v-model="imagenes" item-key="url_imagen" tag="div" :animation="300" ghost-class="dragging"
              class="d-flex flex-wrap w-100">
              <template #item="{ element, index }">
                <v-col cols="12" sm="6" md="4" lg="3" xl="2" class="pa-2">
                  <v-card class="overflow-hidden">
                    <v-img :src="element.preview" height="200" class="cursor-grab">
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
import draggable from 'vuedraggable';
import { getServices } from '@/services/servicio.service';
import { saveFile } from '@/services/imagen.service';
import { getBusiness } from '@/services/negocio.service';

export default {
  props: {
    modelValue: {
      type: Object,
      required: true,
      default: () => ({
        servicios_habitacion: [],
        imagenes: []
      })
    }
  },
  emits: ['update:modelValue'],

  components: {
    draggable,
  },

  computed: {
    habitacion: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
      }
    }
  }
  ,

  data() {
    return {
      servicios: [],
      lista_servicios: [],
      dialogo_servicios: false,

      imagenes: [],
      files: [],
      dragging: false,
      dialogo_galeria: false,

      negocio: {},

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
    getFirstWord(texto) {
      return texto?.split(" ")[0] || "";
    },
    getSecondtWord(texto) {
      return texto?.split(" ").slice(1).join(" ") || "";
    },
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
      this.$emit('seleccionoImagenes', this.imagenes)
    },
    validateFiles(files) {
      for (const file of files || []) {
        const sizeLimit = 2 * 1024 * 1024
        if (file.size > sizeLimit) return 'Uno de los archivos es muy grande (máx 2MB)'
        if (!file.type.startsWith('image/')) return 'Todos los archivos deben ser imágenes'
      }
      return true
    },
    async onFilesChange() {
      if (!this.files || !this.files.length) return

      this.overlay = true

      const nuevasImagenes = this.files.map(file => ({
        id_negocio: this.negocio.id_negocio,
        nombre_imagen: file.name,
        url_imagen: '',
        file,
        preview: URL.createObjectURL(file)
      }))

      this.imagenes.push(...nuevasImagenes)

      this.habitacion = {
        ...this.habitacion,
        imagenes: [
          ...(this.habitacion.imagenes || []),
          ...nuevasImagenes
        ]
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      this.overlay = false

      // 👇 IMPORTANTE: limpiar después del push
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
    async removeImage(index,) {
      try {
        this.imagenes.splice(index, 1)
        const copia = [...(this.habitacion.imagenes || [])]
        copia.splice(index, 1)

        this.habitacion = {
          ...this.habitacion,
          imagenes: copia
        }
      } catch (error) {
        console.log(error)
      }
    },

    abrirDialogoServicio() {
      this.lista_servicios.forEach(item => {
        this.servicios = this.servicios.filter(ele => ele.id_servicio != item.id_servicio)
      })
      this.dialogo_servicios = true
    },
    cerrarDialogoServicios() {
      this.dialogo_servicios = false
    },
    seleccionoServicio(item) {
      this.lista_servicios.push(item)

      const existe = this.habitacion.servicios_habitacion.some(
        s => s.id_servicio === item.id_servicio
      )

      if (existe) return

      this.habitacion = {
        ...this.habitacion,
        servicios_habitacion: [
          ...this.habitacion.servicios_habitacion,
          item
        ]
      }

      this.dialogo_servicios = false
    },
    eliminarServicio(servicio) {
      this.lista_servicios = this.lista_servicios.filter(item => item.id_servicio != servicio.id_servicio)
      this.habitacion = {
        ...this.habitacion,
        servicios_habitacion: this.habitacion.servicios_habitacion.filter(
          item => item.id_servicio !== servicio.id_servicio
        )
      }
      this.obtenerServicios()
    },
    async obtenerServicios() {
      try {
        let res = await getServices()
        if (res.status == 201 && res.data.data.length > 0) {
          this.servicios = res.data.data
        }
      } catch (error) {
        console.log(error)
      }
    },
    async obtenerNegocio(){
      try {
        let res = await getBusiness(1)
        if(res.status == 201 && res.data.data.length > 0){
          this.negocio = res.data.data[0]
          console.log(this.negocio)
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  mounted() {
    this.obtenerServicios()
    this.obtenerNegocio()
  }
}
</script>
<style scope>
.galeria-container {
  background-color: #000;
  height: 100vh;
  overflow-y: auto;
  padding-top: 60px;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 999;
  background-color: white;
}

.dragging {
  opacity: 0.5;
}

.upload-dropzone {
  border: 2px dashed #FF9800;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
  background-color: #f5f5f5;
  height: 300px;
  /* altura fija */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-dropzone--active {
  background-color: #FF9800;
}

.upload-text {
  margin-top: 12px;
  font-size: 16px;
  color: #666;
}

.imagenes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.img-item {
  width: 100%;
}

.delete-icon {
  position: absolute;
  top: 6px;
  right: 6px;
  cursor: pointer;
}

.ver-mas-btn {
  position: absolute;
  bottom: 6px;
  right: 6px;
  font-size: 11px;
}


.d-none {
  display: none;
}
</style>
