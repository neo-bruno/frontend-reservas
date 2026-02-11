<template>
  <v-card class="pa-4" elevation="2">

    <div class="d-flex justify-space-between align-center mb-4">
      <h3 class="text-h6 text-error font-weight-regular">Datos de la Empresa</h3>

      <v-btn v-if="negocio.id_negocio == 0" color="success" prepend-icon="mdi-plus" @click="abrirDialogoNegocio">
        Añadir nuevo
      </v-btn>
      <v-btn v-else color="success" prepend-icon="mdi-pencil" @click="abrirDialogoNegocio">
        Modificar datos
      </v-btn>
    </div>

    <v-container>
      <v-card elevation="7" class="pa-2">
        <v-card-text>
          <v-row>
            <v-col cols="4">
              <v-row>
                <v-col cols="12">
                  <div>Tipo de Negocio</div>
                  <div class="text-h6">{{ negocio.tipo_negocio == 1 ? 'Empresa Hotelera' : '' }}</div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <div>Nombre del Negocio</div>
                  <div class="text-h6">{{ negocio.nombre_negocio }}</div>
                </v-col>
                <v-col cols="12">
                  <div>Descripcion del Negocio</div>
                  <div v-if="negocio.descripcion_negocio?.length" class="font-weight-bold text-primary text-justify">
                    <p class="descripcion" :class="{ 'descripcion--clamp': !mostrarCompleto }">
                      {{ negocio.descripcion_negocio }}
                    </p>

                    <a v-if="negocio.descripcion_negocio.length > 80" class="ver-mas"
                      @click="mostrarCompleto = !mostrarCompleto">
                      {{ mostrarCompleto ? 'Ver menos' : 'Ver más' }}
                    </a>
                  </div>
                </v-col>
                <v-col cols="12">
                  <div>Telefonos del Negocio</div>
                  <div class="text-h6">{{ negocio.telefono_negocio }}</div>
                </v-col>
                <v-col cols="12">
                  <div>Telefono Unico del Negocio</div>
                  <div class="text-h6">{{ negocio.codigo_celular_negocio }}</div>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="4">
              <v-row>
                <v-col cols="12">
                  <div class="mb-2">QR para el cobro de Reservas</div>
                  <v-img :src="negocio.url_negocio" class="rounded-lg" height="420"></v-img>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="4">
              <v-row>
                <v-col cols="12">
                  <div class="mb-2">Ubicacion del Negocio</div>
                  <div class="text-h6">
                    <iframe width="100%" height="350" frameborder="0"
                      style="border:0; border-radius: 15px; box-shadow: 0px 4px 10px rgba(0,0,0,0.2);" allowfullscreen
                      loading="lazy" referrerpolicy="no-referrer-when-downgrade" :src="ubicacionNegocio"></iframe>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
  </v-card>

  <!-- registrar nuevo negocio -->
  <v-dialog v-model="dialogo_nuevo_negocio" transition="dialog-bottom-transition" :fullscreen="$vuetify.display.xs"
    :max-width="$vuetify.display.xs ? undefined : 1070" persistent scrollable>
    <v-card class="px-0">

      <v-toolbar class="text-center font-weight-medium text-wrap bg-primary"
        :title="negocio.id_negocio == 0 ? 'Registro de Datos del Negocio' : 'Modificar Datos del Negocio'"></v-toolbar>

      <v-card-text class="px-0 py-0">
        <v-container>
          <v-form ref="formulario" @submit.prevent="">
            <v-row>
              <v-col cols="4">
                <v-row>
                  <v-col cols="12">
                    <v-select ref="tipo" v-if="items.length" v-model="negocio.tipo_negocio" label="elija el tipo (*)"
                      variant="solo" prepend-inner-icon="mdi-format-list-bulleted-type" :items="items"
                      item-title="title" :rules="[rules.required]" item-value="value"></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field ref="nombre" v-model="negocio.nombre_negocio" label="Nombre del Negocio (*)"
                      variant="solo" prepend-inner-icon="mdi-rename-box" placeholder="ingrese un nombre del negocio"
                      :rules="[rules.required, rules.reglaContieneLetra]" required />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea ref="descripcion" v-model="negocio.descripcion_negocio"
                      label="Descripcion del Negocio (*)" :rules="[rules.required, rules.reglaContieneLetra]"
                      variant="solo" prepend-inner-icon="mdi-text" placeholder="ingrese una descripcion del negocio"
                      required />
                  </v-col>
                  <v-col cols="12">
                    <v-text-field ref="telefonos" v-model="negocio.telefono_negocio" label="Telefonos del Negocio (*)"
                      :rules="[rules.required]" variant="solo" prepend-inner-icon="mdi-phone-classic"
                      placeholder="ingrese los telefonos del negocio" required />
                  </v-col>
                  <v-col cols="12">
                    <v-phone-input ref="celular" class="text-primary" v-model="negocio.codigo_celular_negocio"
                      variant="outlined" label="Teléfono" default-country="BO" invalid-message="Número inválido"
                      @update:modelValue="onPhoneUpdate" />
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="4">
                <v-row>
                  <v-col cols="12">
                    <v-file-input ref="qr" label="Ingrese el QR estático del banco (*)" prepend-icon="mdi-image"
                      variant="solo" :rules="[rules.required, rules.reglaContieneLetra]" clearable accept="image/*"
                      @update:model-value="onSelectQR" />

                    <v-img v-if="negocio.url_negocio" :src="negocio.url_negocio" max-width="auto" aspect-ratio="0" />
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="4">
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-text-field ref="ubicacion" v-model="negocio.ubicacion_negocio" label="Ubicacion del Negocio (*)"
                      :rules="[rules.required, rules.reglaContieneLetra]" variant="solo"
                      prepend-inner-icon="mdi-map-marker" placeholder="ingrese la ubicacion del negocio" required />
                  </v-col>
                  <v-col cols="12">
                    <iframe width="100%" height="350" frameborder="0"
                      style="border:0; border-radius: 15px; box-shadow: 0px 4px 10px rgba(0,0,0,0.2);" allowfullscreen
                      loading="lazy" referrerpolicy="no-referrer-when-downgrade" :src="ubicacionNegocio"></iframe>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="elevated" color="primary" prepend-icon="mdi-cancel"
          @click="cerrarDialogNuevoNegocio">Salir</v-btn>
        <v-btn v-if="negocio.id_negocio == 0" variant="elevated" color="success" prepend-icon="mdi-content-save"
          append-icon="mdi-chevron-right" @click="guardarDatosNegocio">guardar datos</v-btn>
        <v-btn v-else variant="elevated" color="success" prepend-icon="mdi-content-save" append-icon="mdi-chevron-right"
          @click="modificarDatosNegocio">modificar datos</v-btn>
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
import { getBusiness, modifyBusiness, saveBusiness } from '@/services/negocio.service';
import { useUsuarioStore } from '@/stores/usuario';
import { VPhoneInput } from 'v-phone-input';

export default {
  name: "ServiciosHotel",
  components: { VPhoneInput },
  data() {
    return {
      negocio: { rol_usuario_negocio: 'Admin', tipo_negocio: null, qr_file: null, url_negocio: null },
      usuario: {},
      mostrarCompleto: false,
      dialogo_nuevo_negocio: false,
      items: [{ title: "Empresa Hotelera", value: "1" }, { title: "Alojamiento", value: "2" }, { title: "Residencial", value: "3" }, { title: "Hostal", value: "4" }],

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
    ubicacionNegocio() {
      // Si pie o pie.mapa_pie aún no existe, devuelve null
      return this.negocio && this.negocio.ubicacion_negocio ? this.negocio.ubicacion_negocio : null;
    },
  },

  methods: {
    setfocus(foco) {
      this.$nextTick(() => {
        if (foco === "tipo") {
          this.$refs.tipo?.focus()
        }

        if (foco === "nombre") {
          this.$refs.nombre?.select()
          this.$refs.nombre?.focus()
        }

        if (foco === "ubicacion") {
          this.$refs.ubicacion?.select()
          this.$refs.ubicacion?.focus()
        }

        if (foco === "descripcion") {
          this.$refs.descripcion?.select()
          this.$refs.descripcion?.focus()
        }

        if (foco === "telefono") {
          this.$refs.telefono?.select()
          this.$refs.telefono?.focus()
        }

        if (foco === "qr") {
          this.$refs.qr?.select()
          this.$refs.qr?.focus()
        }

      })
    },
    onSelectQR(file) {
      // 🔴 Presionó la X o no hay archivo
      if (!file) {
        if (this.negocio.url_negocio) {
          URL.revokeObjectURL(this.negocio.url_negocio)
        }
        this.negocio.url_negocio = null
        this.negocio.qr_file = null
        return
      }

      // 🔴 Validar tipo (ya sabemos que file existe)
      if (!file.type || !file.type.startsWith('image/')) {
        alert('Solo imágenes')
        return
      }

      // 🟢 Seleccionó archivo válido
      this.negocio.qr_file = file
      this.negocio.url_negocio = URL.createObjectURL(file)
    },

    cerrarDialogNuevoNegocio() {
      this.dialogo_nuevo_negocio = false
    },
    abrirDialogoNegocio() {
      this.negocio.tipo_negocio = this.items[0].value
      this.dialogo_nuevo_negocio = true
    },
    onPhoneUpdate(number) {
      // Ejemplo básico para extraer código país (asumiendo código con + y hasta 3 dígitos)
      const dialCodeMatch = number.match(/^\+(\d{1,3})/);
      const codigo_pais = dialCodeMatch ? '+' + dialCodeMatch[1] : '';
      const numberWithoutCode = codigo_pais ? number.replace(codigo_pais, '') : number;

      this.negocio.codigo_celular_negocio = codigo_pais+numberWithoutCode;

      if (this.negocio.codigo_celular_negocio != null && codigo_pais != '') {
        this.$nextTick(() => {
          this.$refs.nombre.select()
          this.$refs.nombre.focus()
        })
      }
    },

    async modificarDatosNegocio() {
      try {
        const usuarioStore = useUsuarioStore()
        this.usuario = usuarioStore.usuario
        this.negocio.id_usuario = this.usuario.id_usuario

        const { valid } = await this.$refs.formulario.validate()
        this.$nextTick(async () => {
          // Simular login
          this.overlay = true;
          if (valid) {

            if (this.negocio.qr_file) {
              const formdata = new FormData()
              formdata.append('file', this.negocio.qr_file)

              const res = await saveFile(formdata)

              if (res.status !== 200) {
                throw new Error('Error al subir imagen')
              }

              this.negocio.url_negocio = res.data
              this.negocio.nombre_url_negocio = this.negocio.url_negocio.split('/').pop()
            }

            setTimeout(async () => {
              this.overlay = false

              let res = await modifyBusiness(this.negocio)
              if (res.status == 200) {
                this.$swal({
                  title: "Registro Modificado!",
                  text: `se ha modificado los datos del negocio CORRECTAMENTE!!!`,
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
                this.setfocus('tipo')
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
    async guardarDatosNegocio() {
      try {
        const usuarioStore = useUsuarioStore()
        this.usuario = usuarioStore.usuario
        this.negocio.id_usuario = this.usuario.id_usuario

        const { valid } = await this.$refs.formulario.validate()
        this.$nextTick(async () => {
          // Simular login
          this.overlay = true;
          if (valid) {

            if (this.negocio.qr_file) {
              const formdata = new FormData()
              formdata.append('file', this.negocio.qr_file)

              const res = await saveFile(formdata)

              if (res.status !== 200) {
                throw new Error('Error al subir imagen')
              }

              this.negocio.url_negocio = res.data
              this.negocio.nombre_url_negocio = this.negocio.url_negocio.split('/').pop()
            }

            setTimeout(async () => {
              this.overlay = false

              let res = await saveBusiness(this.negocio)
              if (res.status == 200) {
                this.$swal({
                  title: "Registro Guardado!",
                  text: `se ha guardado los datos del negocio CORRECTAMENTE!!!`,
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
                this.setfocus('tipo')
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

    async obtenerNegocio() {
      try {
        let res = await getBusiness(1)
        if (res.status == 201 && res.data.data.length > 0) {
          this.negocio = res.data.data[0]
          this.setfocus('tipo')
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  mounted() {
    this.obtenerNegocio()
  }
};
</script>

<style scoped>
.descripcion {
  font-size: 16px;
  color: #000;
  line-height: 1.4;
  transition: all 0.3s ease;
}

.descripcion--clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  /* 👈 SOLO 2 LÍNEAS */
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ver-mas {
  display: inline-block;
  margin-bottom: 5px;
  font-size: 13px;
  font-weight: 500;
  color: #000;
  cursor: pointer;
  text-decoration: underline;
}
</style>
