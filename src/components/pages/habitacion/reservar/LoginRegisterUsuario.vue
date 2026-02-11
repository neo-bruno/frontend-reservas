<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="11" class="pa-0">
        <div class="d-flex justify-start cursor-pointer" @click="volverAtras">
          <v-icon color="primary" icon="mdi-undo"></v-icon> <span class="ms-3">volver atras</span>
        </div>
        <v-window v-model="paso" disabled>
          <v-window-item :value="1">
            <v-card>
              <v-card-text>
                <v-form v-model="valid" ref="form" @submit.prevent="">
                  <v-row>
                    <v-col cols="12">
                      <div class="text-grey-darken-1">
                        Ingresa el numero de telefono de whatsapp: <strong>{{ telefono }}</strong>
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <v-sheet class="" max-width="350" width="100%">
                        <v-phone-input ref="telefono" class="text-primary" v-model="telefono" variant="outlined"
                          label="Teléfono" default-country="BO" invalid-message="Número inválido"
                          @update:modelValue="onPhoneUpdate" cxcy />
                      </v-sheet>
                    </v-col>
                    <v-col cols="12">
                      <p class="mb-3 text-justify">
                        ¡Se le enviara un codigo a su numero de telefono whatsapp, <strong>para su confirmacion de
                          numero telefonico!</strong>
                      </p>
                    </v-col>
                  </v-row>

                </v-form>
              </v-card-text>
              <v-card-actions class="d-flex justify-end">

                <v-btn variant="elevated" color="primary" append-icon="mdi-chevron-right"
                  @click="adelante">siguiente</v-btn>
              </v-card-actions>
            </v-card>
          </v-window-item>
          <v-window-item :value="2">
            <v-card>
              <v-card-text>
                <v-form v-model="valid" ref="form" @submit.prevent="">
                  <v-row>
                    <v-col cols="12">
                      <div class="text-grey-darken-1 text-justify">
                        <strong>Verfica el codigo de validacion</strong>, Ingresa el codigo que enviamos por mensaje de
                        whatsapp al Telefono <strong>{{ telefono
                        }}</strong>.
                      </div>
                    </v-col>
                    <v-col cols="12">
                      <v-sheet class="" max-width="350" width="100%">
                        <v-otp-input ref="otp" v-model="codigo_ingresado" length="4" placeholder="-"
                          variant="underlined"></v-otp-input>
                      </v-sheet>
                      <!-- 🕒 Temporizador -->
                      <div class="text-center mt-2" :class="{
                        'text-success': tiempoRestante > 60,
                        'text-warning': tiempoRestante <= 60 && tiempoRestante > 20,
                        'text-error': tiempoRestante <= 20
                      }">
                        {{ tiempoRestante > 0
                          ? `Código válido por: ${minutos}:${segundosFormatted}`
                          : 'El código ha expirado' }}
                      </div>

                    </v-col>
                    <v-col cols="12">
                      <p class="mb-3">
                        Necesitas otro <strong>codigo</strong>?
                      </p>
                      <div class="d-flex justify-end">
                        <v-btn density="compact" color="success" variant="outlined" append-icon="mdi-update"
                          :disabled="tiempoRestante > 0" @click="reenviarCodigo">
                          Re-enviar código
                        </v-btn>

                      </div>
                    </v-col>
                  </v-row>

                </v-form>
              </v-card-text>
              <v-card-actions class="d-flex justify-end">
                <v-btn variant="elevated" append-icon="mdi-chevron-right" color="primary" @click="validarCodigo">validar
                  codigo</v-btn>
              </v-card-actions>
            </v-card>
          </v-window-item>

          <v-window-item :value="3">
            <v-card>
              <v-card-text>
                <v-card elevation="10" class="pa-5 rounded-xl">
                  <div class="text-center mb-6">
                    <v-icon color="primary" size="48">mdi-account-circle</v-icon>
                    <h2 class="text-h5 font-weight-bold mt-2">Registro Usuario</h2>
                    <p class="text-body-2 text-grey-darken-1">Bienvenido al registro de usuario</p>
                  </div>

                  <v-form ref="formulario" @submit.prevent="">
                    <v-phone-input ref="telefono" class="text-primary" v-model="telefono" variant="outlined"
                      country-label="" label="Telefono" country-aria-label="Pais para el Numero de Telefono"
                      invalid-message="El Numero de Telefono debe ser Valido (ejemplo: 01 23 45 67 89)."
                      default-country="BO" />

                    <v-text-field ref="nombre" v-model="usuario.nombre_usuario" label="nombre usuario"
                      :disabled="deshabilitar_campos"
                      :rules="[rules.required, rules.reglaDosPalabras, rules.soloLetrasYEspacios]"
                      prepend-inner-icon="mdi-account" variant="outlined" @input="validarNombre(usuario.nombre_usuario)"
                      @keyup.enter.prevent="setfocus('contrasena')" />

                    <v-text-field :type="mostrarPassword ? 'text' : 'password'" v-model="usuario.contrasena_usuario"
                      :disabled="deshabilitar_campos" ref="contrasena" label="contraseña usuario"
                      :append-inner-icon="mostrarPassword ? 'mdi-eye' : 'mdi-eye-off'" variant="outlined"
                      :rules="[rules.required, rules.reglaContieneLetra]"
                      :prepend-inner-icon="mostrarPassword ? 'mdi-lock-open' : 'mdi-lock'" autocomplete="contraseña"
                      required @click:append-inner="mostrarPassword = !mostrarPassword"
                      @keyup.enter.prevent="setfocus('re_contrasena')" />

                    <v-text-field :type="mostrarPassword ? 'text' : 'password'" v-model="contrasena_usuario"
                      ref="re_contrasena" :disabled="deshabilitar_campos" label="re-contraseña usuario"
                      :append-inner-icon="mostrarPassword ? 'mdi-eye' : 'mdi-eye-off'" variant="outlined"
                      :rules="[rules.required, rules.reglaContieneLetra]"
                      :prepend-inner-icon="mostrarPassword ? 'mdi-lock-open' : 'mdi-lock'" autocomplete="re-contraseña"
                      required @click:append-inner="mostrarPassword = !mostrarPassword"
                      @keyup.enter.prevent="setfocus('nombre')" />

                    <v-checkbox v-model="terminos_condiciones" ref="termino-condiciones" :disabled="deshabilitar_campos"
                      label="Acepta los Terminos y Condiciones" hide-details></v-checkbox>

                    <v-btn :disabled="!contrasenasIguales" block color="primary" class="mt-4" type="submit"
                      :loading="loading" append-icon="mdi-chevron-right" @click="registrarUsuario">
                      Registrar usuario
                    </v-btn>
                  </v-form>
                </v-card>
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>
      </v-col>
    </v-row>
  </v-container>

  <!-- capa protectora de proceso -->
  <v-overlay :model-value="overlay" class="align-center justify-center" persistent>
    <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
  </v-overlay>
</template>

<script>
import { sendCodeWhatsapp } from '@/services/auth.service';
import { register } from '@/services/usuario.service';
import { useUsuarioStore } from '@/stores/usuario';
import { VPhoneInput } from 'v-phone-input';

export default {
  emits: ['atras', 'registroFinalizado'],
  components: {
    VPhoneInput,
  },
  data: () => ({
    codigo_pais: '',
    telefono: '',

    codigo: '',
    codigo_ingresado: '',
    valid: false,
    tiempoRestante: 180, // 3 minutos (en segundos)
    temporizador: null,
    paso: 1,

    usuario: {
      id_rol: 2,
      id_persona: 0,
      nombre_usuario: '',
      telefono_usuario: '',
      codigo_pais_usuario: '',
      contrasena_usuario: '',
      verificado_usuario: '',
      codigo_verify_usuario: '',
      fecha_codigo_usuario: ''
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
    contrasena_usuario: '',
    terminos_condiciones: false,
    mostrarPassword: false,
    loading: false,
    deshabilitar_campos: false,

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
    minutos() {
      return Math.floor(this.tiempoRestante / 60)
    },
    segundos() {
      return this.tiempoRestante % 60
    },
    segundosFormatted() {
      return this.segundos < 10 ? '0' + this.segundos : this.segundos
    },
    contrasenasIguales() {
      if (this.contrasena_usuario === this.usuario.contrasena_usuario && this.contrasena_usuario != '') {
        return true
      }
      return false
    },
  },
  methods: {
    onPhoneUpdate(number) {
      // Ejemplo básico para extraer código país (asumiendo código con + y hasta 3 dígitos)
      const dialCodeMatch = number.match(/^\+(\d{1,3})/);
      const codigo_pais = dialCodeMatch ? '+' + dialCodeMatch[1] : '';
      const numberWithoutCode = codigo_pais ? number.replace(codigo_pais, '') : number;

      this.codigo_pais = codigo_pais;
      this.telefono = numberWithoutCode;
    },
    setfocus(foco) {
      this.$nextTick(() => {
        if (foco === "telefono") {
          const inputs = this.$refs.telefono?.$el?.querySelectorAll("input")
          if (inputs?.length) inputs[1].focus()
        }

        if (foco === "otp") {
          const inputs = this.$refs.otp?.$el?.querySelectorAll("input")
          if (inputs?.length) inputs[0].focus()
        }

        if (foco == 'nombre') {
          const inputs = this.$refs.nombre?.$el?.querySelectorAll("input")
          if (inputs?.length) inputs[0].focus()
        }

        if (foco === 'contrasena') {
          const inputs = this.$refs.contrasena?.$el?.querySelectorAll("input")
          if (inputs?.length) inputs[0].focus()
        }

        if (foco === 're_contrasena') {
          const inputs = this.$refs.re_contrasena?.$el?.querySelectorAll("input")
          if (inputs?.length) inputs[0].focus()
        }
      })
    },
    async adelante() {
      this.overlay = true
      try {
        if (!this.telefono || !this.codigo_pais) {
          this.$swal({
            title: "Error!",
            text: `Por favor ingresa un número válido ${this.codigo_pais, this.telefono}`,
            icon: "error",
            timer: 3000,
          })
          this.overlay = false  // cerrar aquí también
          return
        }

        if (this.paso === 1) {
          let res = await sendCodeWhatsapp({ telefono: this.codigo_pais+this.telefono })

          if (res.status === 200) {

            this.codigo = res.data.data.codigo
            this.paso = 2
            this.error = false

            // 👇 MUY IMPORTANTE
            this.overlay = false
            document.activeElement?.blur()

            this.$swal({
              title: "Correcto!",
              text: `Se ha enviado un código a su WhatsApp`,
              icon: "success",
              timer: 1500,
              didClose: () => {
                this.iniciarTemporizador()

                setTimeout(() => {
                  this.setfocus("otp")  // ahora sí, seguro
                }, 20)
              }
            })

          }
        }

      } catch (error) {
        this.overlay = false  // <-- cerrar overlay ANTES del swal
        document.activeElement?.blur()

        this.$swal({
          title: "Error!",
          text: error.response?.data?.error || "Ocurrió un error",
          icon: "error",
          timer: 3500
        })
      }
    },
    validarCodigo() {
      this.overlay = true
      try {
        if (!this.codigo_ingresado || !this.codigo) {
          this.overlay = false
          return
        }

        if (this.codigo == this.codigo_ingresado) {
          this.usuario.telefono_usuario = this.telefono
          this.usuario.codigo_pais_usuario = this.codigo_pais
          this.paso = 3
          this.error = false

          // 👇 MUY IMPORTANTE
          this.overlay = false
          document.activeElement?.blur()

          this.setfocus('nombre')

        } else
          this.overlay = false
      } catch (error) {
        this.overlay = false  // <-- cerrar overlay ANTES del swal
        document.activeElement?.blur()

        this.$swal({
          title: "Error!",
          text: error.response?.data?.error || "Ocurrió un error",
          icon: "error",
          timer: 2500
        })

      }
    },

    iniciarTemporizador() {
      // Si ya hay un temporizador activo, no volver a iniciar
      if (this.temporizador) return

      this.tiempoRestante = 180
      this.temporizador = setInterval(() => {
        if (this.tiempoRestante > 0) {
          this.tiempoRestante--
        } else {
          clearInterval(this.temporizador)
          this.temporizador = null
        }
      }, 1000)
    },

    volverAtras() {
      if (this.paso === 1) {
        // 🧹 Si sale completamente, reiniciamos el temporizador
        if (this.temporizador) {
          clearInterval(this.temporizador)
          this.temporizador = null
          this.tiempoRestante = 180
        }
        this.$emit('atras')
      } else {
        this.paso--
      }
    },

    reenviarCodigo() {
      this.codigo = ''
      this.iniciarTemporizador() // aquí sí debe reiniciarse
    },
    async registrarUsuario() {
      try {
        const { valid } = await this.$refs.formulario.validate()
        this.$nextTick(async () => {
          // Simular login
          this.loading = true;
          if (valid && this.terminos_condiciones) {
            setTimeout(async () => {
              this.loading = false
              let res = await register(this.usuario)
              if (res.status == 200) {
                console.log(res)
                const data = res.data.data;

                // cargar el token en pinia
                const usuarioStore = useUsuarioStore()
                usuarioStore.setToken(res.data.tokenSession)

                // Guardar datos del usuario
                localStorage.setItem("token", res.data.tokenSession);
                localStorage.id_usuario = data.id_usuario;
                localStorage.nombre_usuario = this.capitalizar(data.nombre_usuario);
                localStorage.telefono_usuario = data.telefono_usuario;
                localStorage.id_rol = data.id_rol;

                // Aquí rediriges al dashboard o ruta deseada
                // this.$router.push({ name: 'perfil-cliente' })
                this.$emit('registroFinalizado')
              }
            }, 1000);
            return true
          } else {
            this.loading = false
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    validarNombre(valor) {

    },
    capitalizar(palabra) {
      if (!palabra || typeof palabra !== "string") return ""

      return palabra.replace(/\w\S*/g, function (texto) {
        return texto.charAt(0).toUpperCase() + texto.substr(1).toLowerCase()
      })
    },
  },
  mounted() {
    this.setfocus('telefono')
  },
  beforeUnmount() {
    if (this.temporizador) clearInterval(this.temporizador)
  },
}
</script>

<style lang="scss" scoped></style>
