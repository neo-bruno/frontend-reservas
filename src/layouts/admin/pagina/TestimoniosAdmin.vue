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
                      variant="outlined" :rules="[rules.required]" @keyup.enter.prevent="setfocus('titulo')">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field ref="titulo" v-model="seccion.titulo_seccion" density="compact"
                      label="titulo de la seccion" placeholder="modificar el titulo" prepend-inner-icon="mdi-text"
                      variant="outlined" :rules="[rules.required]" @keyup.enter.prevent="setfocus('nombre')">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" class="px-0">
                    <!-- <v-file-input v-model="seccion.url_seccion" density="compact" label="Imagen de fondo"
                      variant="outlined" accept="image/*" :rules="[rules.required]" @change="actualizarImagen"
                      @click:clear="actualizarImagen"></v-file-input> -->
                    <v-file-input v-model="fileImagen" density="compact" label="Imagen de fondo" variant="outlined"
                      accept="image/*" @update:model-value="actualizarImagen" />
                  </v-col>
                </v-row>
                <v-row justify="center">
                  <v-col cols="12" class="d-flex justify-end">
                    <v-btn color="success" append-icon="mdi-chevron-right" prepend-icon="mdi-plus"
                      @click="abrirResena">agregar testimonio</v-btn>
                  </v-col>
                  <v-col v-for="(resena, i) in seccion.resenas" :key="i" cols="12"
                    class="text-center position-relative border">
                    <div class="testimonial-wrapper">

                      <!-- BOTÓN X arriba a la derecha del div -->
                      <v-icon size="35" color="error" class="close-icon" @click="removeResena(resena)">
                        mdi-close </v-icon>

                      <v-row justify="center">
                        <v-col cols="12">
                          <div class="text-center">
                            <v-avatar size="70" class="avatar">
                              <v-icon color="white" size="45">mdi-account</v-icon>
                            </v-avatar>

                            <div class="name">{{ resena.nombre_usuario }}</div>
                            <div class="date">{{ resena.mostrar_fecha_resena }}</div>
                          </div>
                        </v-col>

                        <v-col lg="9" sm="9" cols="12" align-self="center">
                          <p class="espacio">"{{ resena.comentario_resena }}"</p>
                        </v-col>
                      </v-row>
                    </div>

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
        <v-container fluid class="bg-white">
          <div class="text-center mb-10">
            <p class="font-weight-medium text-secondary">{{ seccion.nombre_seccion }}</p>
            <h2 class="text-h4 font-weight-bold">{{ seccion.titulo_seccion }}</h2>
          </div>
          <div :style="{ backgroundImage: `url(${seccion.url_seccion || ''})` }" class="parallax-container">
            <div class="overlay">
              <swiper v-if="seccion.resenas" :modules="modules" :slides-per-view="1" :loop="seccion.resenas.length > 3" :autoplay="{ delay: 4000 }"
                :pagination="{ clickable: true }" class="mySwiper">
                <swiper-slide v-for="(resena, index) in seccion.resenas" :key="index">
                  <div class="testimonial-wrapper">
                    <v-row justify="center">
                      <v-col lg="2" md="2" sm="2" cols="12">
                        <div class="text-center">
                          <v-avatar size="70" class="avatar">
                            <v-icon color="white" size="45">mdi-account</v-icon>
                          </v-avatar>
                          <div class="name">{{ resena.nombre_usuario }}</div>
                          <div class="date">{{ resena.mostrar_fecha_resena }}</div>
                        </div>
                      </v-col>
                      <v-col lg="9" sm="9" cols="12" align-self="center">
                        <p class="espacio">"{{ resena.comentario_resena }}"</p>
                      </v-col>
                    </v-row>
                  </div>
                </swiper-slide>
              </swiper>
            </div>
          </div>
        </v-container>
      </v-col>
    </v-row>
  </v-container>

  <!-- registrar nuevo testimonio -->
  <v-dialog v-model="dialogo_testimonios" transition="dialog-bottom-transition" :fullscreen="$vuetify.display.xs"
    :max-width="$vuetify.display.xs ? undefined : 1470" persistent scrollable>
    <v-card class="px-0">

      <v-toolbar class="text-center font-weight-medium text-wrap bg-primary" title="Agregar Testimonios"></v-toolbar>

      <v-card-text class="px-0 py-0">
        <v-container fluid>
          <v-row>
            <v-col v-for="(resena, i) in todasResenas" :key="i" cols="3" class="text-center position-relative border">
              <div class="testimonial-wrapper">

                <!-- BOTÓN X arriba a la derecha del div -->
                <v-checkbox style="font-size: 1.5rem;" v-model="resena.estado_resena" class="check_box"
                  color="success"></v-checkbox>
                <!-- <v-icon size="35" color="error" class="close-icon" @click="removeResena(resena.id_testimonio)">
                  mdi-close </v-icon> -->

                <v-row justify="center">
                  <v-col cols="12">
                    <div class="text-center">
                      <v-avatar color="white" size="70" class="avatar">
                        <v-icon size="60">mdi-account</v-icon>
                      </v-avatar>

                      <div class="name">{{ resena.nombre_usuario }}</div>
                      <div class="date">{{ fechaLiteral(resena.fecha_resena) }}</div>
                    </div>
                  </v-col>

                  <v-col lg="9" sm="9" cols="12" align-self="center">
                    <p class="espacio">"{{ resena.comentario_resena }}"</p>
                  </v-col>
                </v-row>
              </div>

            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="elevated" color="red" prepend-icon="mdi-cancel" class="me-6"
          @click="dialogo_testimonios = false">Salir</v-btn>

        <v-btn variant="elevated" color="success" prepend-icon="mdi-content-save" append-icon="mdi-check"
          @click="agregarResena">agregar resena(s)</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>
</template>

<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import { getAllRevies, modifyReview } from '@/services/reserna.service';
import moment from 'moment'
import 'moment/locale/es'
import { getSectionByType, modifySection } from '@/services/seccion.service';
import { saveFile } from '@/services/imagen.service';

export default {
  components: { Swiper, SwiperSlide },
  data() {
    return {
      modules: [Autoplay, Pagination],

      resenas: [],
      todasResenas: [],

      seccion: {
      },
      fileImagen: null,
      file: null,
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

      dialogo_testimonios: false,

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
    fechaLiteral(fecha) {
      return moment(fecha, 'YYYY-MM-DD').format('D MMM')
    },
    actualizarImagen(file) {
      let archivo = file

      if(!file){
        this.fileImagen = this.seccion.backup_url_seccion
        this.seccion.url_seccion = this.seccion.backup_url_seccion
        this.file = null
        return
      }

      if (Array.isArray(file)) {
        archivo = file[0]
      }

      if (!archivo) return

      if (!archivo.type?.startsWith('image/')) {
        console.log('No es imagen', archivo)
        return
      }

      this.overlay = true

      // liberar anterior
      if (this.seccion.url_seccion) {
        URL.revokeObjectURL(this.seccion.url_seccion)
      }

      this.seccion.url_seccion = URL.createObjectURL(archivo)
      this.file = archivo

      this.overlay = false

      console.log('URL:', this.seccion.url_seccion)
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

              if (this.file) {
                const formdata = new FormData()
                formdata.append('file', this.file)

                const res = await saveFile(formdata)

                if (res.status !== 200) {
                  throw new Error('Error al subir imagen')
                }
                this.seccion.url_seccion = res.data
              }

              let res = await modifySection(this.seccion)
              if (res.status === 200) {
                for (const item of this.seccion.resenas) {
                  await modifyReview(item)
                }
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

    async abrirResena() {
      await this.obtenerResenas()

      this.seccion.resenas.forEach(item => {
        this.todasResenas = this.todasResenas.filter(ele => ele.id_resena != item.id_resena)
      })
      this.dialogo_testimonios = true
    },
    agregarResena() {
      const arreglo = this.todasResenas.filter(item => item.estado_resena == true)

      arreglo.forEach(item => {
        const objeto = {
          id_resena: item.id_resena,
          id_habitacion: item.id_habitacion,
          id_usuario: item.id_usuario,
          nombre_usuario: item.nombre_usuario,
          fecha_resena: item.fecha_resena,
          mostrar_fecha_resena: this.fechaLiteral(item.fecha_resena),
          puntuacion_resena: item.puntuacion_resena,
          comentario_resena: item.comentario_resena,
          estado_resena: item.estado_resena
        }
        this.seccion.resenas.push(objeto)
      })
      this.dialogo_testimonios = false
    },
    removeResena(item) {
      // 1. Cambiar estado
      this.seccion.resenas = this.seccion.resenas.map(ele => {
        if (ele.id_resena === item.id_resena) {
          return {
            ...ele,
            estado_resena: false
          }
        }
        return ele
      })
      // 2. Eliminar del arreglo
      this.seccion.resenas = this.seccion.resenas.filter(
        ele => ele.id_resena !== item.id_resena
      )
    },
    async obtenerResenas() {
      try {
        const res = await getAllRevies()
        if (res.status == 200) {
          this.todasResenas = res.data.data
          this.resenas = this.todasResenas.filter(item => item.estado_resena != false)
          this.resenas.map(item => {
            item.mostrar_fecha_resena = this.fechaLiteral(item.fecha_resena)
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    async obtenerSeccion() {
      try {
        const res = await getSectionByType(5)
        if (res.status == 201) {
          this.seccion = res.data.data
          this.seccion.backup_url_seccion = 'https://planner5d.com/blog/content/images/size/w2000/2025/06/medidas.dormitorio.estandar.jpg'
          this.seccion.resenas = this.resenas
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  async mounted() {
    try {
      await this.obtenerResenas()

      await this.obtenerSeccion()
    } catch (error) {
      console.error('Error cargando dashboard:', error)
    }
  }

}

</script>

<style scoped>
.parallax-container {
  height: 500px;
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.overlay {
  background: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mySwiper {
  width: 100%;
  max-width: 800px;
}

.testimonial-wrapper {
  background-color: #21242b;
  padding: 30px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.avatar {
  border: 2px solid white;
}

.name {
  font-weight: bold;
  font-size: 1.1rem;
}

.date {
  font-size: 0.85rem;
  color: #ccc;
}

.message {
  font-style: italic;
  font-size: 1rem;
  line-height: 1.5;
}

.swiper-pagination-bullets {
  margin-top: 20px;
  text-align: center;
}

@media (max-width: 692px) {
  .testimonial-wrapper {
    padding: 20px;
  }

  .espacio {
    margin: 0.5rem;
  }

  .message {
    text-align: center;
  }

  .parallax-container {
    height: 380px;
  }
}

.testimonial-wrapper {
  position: relative;
  padding: 20px;
}

/* X en la esquina superior derecha */
.close-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.check_box {
  position: absolute;
  top: 0px;
  right: 10px;
  cursor: pointer;
}
</style>
