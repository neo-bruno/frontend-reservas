<template>
  <v-container fluid class="fill-height d-flex align-center justify-center px-4">
    <v-row justify="center" class="w-100">
      <v-col cols="12" sm="10" md="6" lg="3">
        <v-card elevation="10" class="pa-6 rounded-xl">
          <div class="text-center mb-6">
            <v-icon color="primary" size="48">mdi-account-circle</v-icon>
            <h2 class="text-h5 font-weight-bold mt-2">Iniciar sesión</h2>
            <p class="text-body-2 text-grey-darken-1">Bienvenido de nuevo</p>
          </div>

          <v-form ref="formulario" @submit.prevent>
            <v-phone-input ref="telefono" autocomplete="telefono" class="text-primary" v-model="usuario.telefono"
              variant="outlined" country-label="" label="Telefono" country-aria-label="Pais para el Numero de Telefono"
              invalid-message="El Numero de Telefono debe ser Valido (ejemplo: 01 23 45 67 89)." default-country="BO"
              @update:modelValue="onPhoneUpdate" @update:country="handleCountryUpdate" />

            <v-text-field ref="contrasena" v-model="usuario.contrasena_usuario"
              :type="mostrarPassword ? 'text' : 'password'" label="Contraseña" variant="solo"
              prepend-inner-icon="mdi-lock" :append-inner-icon="mostrarPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="mostrarPassword = !mostrarPassword" autocomplete="current-password" required />

            <v-btn block color="primary" class="mt-4" type="submit" :loading="loading" @click="login">
              Iniciar sesión
            </v-btn>
          </v-form>

          <div class="text-center mt-4">
            <v-btn variant="text" class="text-caption" @click="irARecuperar">
              ¿Olvidaste tu contraseña?
            </v-btn>
            <v-btn variant="text" class="text-caption ml-2" @click="irARegistro">
              Registrarme
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-snackbar v-model="snackbar" :color="error_snackbar ? 'red-darken-4' : 'success'"
    :timeout="error_snackbar ? 4000 : 1500" :location="error_snackbar ? 'bottom center' : 'top end'" :top="true">
    <div class="text-subtitle-1 pb-2"><v-icon>mdi-check</v-icon> {{ error_snackbar ? 'Error...!' : '¡Exitoso!' }}</div>
    <p>{{ texto }}</p>
  </v-snackbar>
</template>

<script>
import { login } from '@/services/usuario.service';
import { VPhoneInput } from 'v-phone-input';

export default {
  name: 'Login',
  components: {
    VPhoneInput,
  },
  data() {
    return {
      usuario: {
        id_persona: 0,
        id_cargo: 1,
      },
      mostrarPassword: false,
      loading: false,

      // datos de snackbar
    error_snackbar: '',
    snackbar: false,
    texto: '',
    };
  },
  methods: {
    mostrarSnackBar(error_snackbar, detalle) {
      this.error_snackbar = error_snackbar
      this.snackbar = true
      this.texto = detalle
    },
    async login() {
      try {
        this.$nextTick(async () => {
          // Simular login
          this.loading = true;
          const { valid } = await this.$refs.formulario.validate()
          if (valid) {
            // Simular login
            setTimeout(async () => {
              this.loading = false;
              let res = await login(this.usuario)
              if (res.status == 200) {

                this.usuario = res.data.data
                localStorage.clear()
                console.log('token es: ', res.data.tokenSession)
                localStorage.setItem("token", JSON.stringify(res.data.tokenSession))
                localStorage.id_usuario = this.usuario.id_usuario
                localStorage.nombre_usuario = this.capitalizar(this.usuario.nombre_usuario)
                localStorage.telefono_usuario = this.usuario.telefono_usuario
                localStorage.id_cargo = this.usuario.id_cargo

                // Aquí rediriges al dashboard o ruta deseada
                switch (this.usuario.posicion_cargo) {
                  case 1:
                    this.$router.push('/admin')
                    break
                  case 2:
                    this.$router.push('/cliente');
                    break
                }
              }else{
                this.mostrarSnackBar(true, 'No existe el usuario o contraseña')
              }
            }, 1000);
          } else {
            this.loading = false
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    irARecuperar() {
      this.$router.push('/recuperar'); // Ajusta a tu ruta real
    },
    irARegistro() {
      this.$router.push('/registro'); // Ajusta a tu ruta real
    },
    setFocus(foco) {
      switch (foco) {

        case 'telefono':
          this.$nextTick(() => {
            // Selecciona el segundo input (usualmente el del número)
            const inputs = this.$refs.telefono?.$el?.querySelectorAll('input');
            if (inputs && inputs.length > 1) {
              inputs[1].focus(); // Este suele ser el del número
            } else {
              console.warn('No se pudo encontrar el input del número');
            }
          })
          break;
        case 'nombre':
          this.$nextTick(() => {
            this.$refs.nombre.select()
            this.$refs.nombre.focus()
          })
          break;
        case 'contrasena':
          this.$nextTick(() => {
            this.$refs.contrasena.select()
            this.$refs.contrasena.focus()
          })
          break;
        case 're-contrasena':
          this.$nextTick(() => {
            this.$refs.re - contrasena.select()
            this.$refs.re - contrasena.focus()
          })
          break;
        case 'termino-condiciones':
          this.$nextTick(() => {
            this.$refs.termino - condiciones.select()
            this.$refs.termino - condiciones.focus()
          })
          break;

      }
    },
    handleCountryUpdate(pais) {
      if (pais) {
        this.setFocus('')
      }
    },
    onPhoneUpdate(number) {
      // Ejemplo básico para extraer código país (asumiendo código con + y hasta 3 dígitos)
      const dialCodeMatch = number.match(/^\+(\d{1,3})/);
      const codigo_pais = dialCodeMatch ? '+' + dialCodeMatch[1] : '';
      const numberWithoutCode = codigo_pais ? number.replace(codigo_pais, '') : number;

      this.usuario.codigo_pais_usuario = codigo_pais;
      this.usuario.telefono_usuario = numberWithoutCode;

      if (this.usuario.codigo_pais_usuario != null && codigo_pais != '')
        this.setFocus('contrasena')
    },
    validarNombre(valor) {

    },
    capitalizar(palabra) {
      return palabra.replace(/\w\S*/g, function (texto) {
        return texto.charAt(0).toUpperCase() + texto.substr(1).toLowerCase();
      })
    },
  },
  mounted() {
    this.setFocus('telefono')
  }
};
</script>
