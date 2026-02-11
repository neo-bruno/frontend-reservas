<template>
  <v-container fluid class="fill-height d-flex align-center justify-center px-4">
    <v-row justify="center" class="w-100">
      <v-col cols="12" sm="6" md="6" lg="3">
        <v-card elevation="10" class="pa-6 rounded-xl">
          <div class="text-center mb-6">
            <v-icon color="primary" size="48">mdi-account-circle</v-icon>
            <h2 class="text-h5 font-weight-bold mt-2">Iniciar sesión</h2>
            <p class="text-body-2 text-grey-darken-1">Bienvenido de nuevo</p>
          </div>

          <v-form ref="formulario" @submit.prevent="login">
            <v-phone-input ref="telefono" class="text-primary" v-model="usuario.telefono_usuario" variant="outlined"
              label="Teléfono" default-country="BO" invalid-message="Número inválido"
              @update:modelValue="onPhoneUpdate" />

            <v-text-field ref="contrasena" v-model="usuario.contrasena_usuario"
              :type="mostrarPassword ? 'text' : 'password'" label="Contraseña" variant="solo"
              prepend-inner-icon="mdi-lock" :append-inner-icon="mostrarPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="mostrarPassword = !mostrarPassword" autocomplete="current-password" required />

            <v-btn block color="primary" class="mt-4" type="submit" :loading="loading">
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

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="error_snackbar ? 'red-darken-4' : 'success'"
      :timeout="error_snackbar ? 4000 : 1500" location="bottom center">
      <div class="text-subtitle-1 pb-2">
        <v-icon>{{ error_snackbar ? 'mdi-alert' : 'mdi-check' }}</v-icon>
        {{ error_snackbar ? 'Error' : '¡Exitoso!' }}
      </div>
      <p>{{ texto }}</p>
    </v-snackbar>
  </v-container>
</template>

<script>
import { login } from '@/services/usuario.service';
import { useUsuarioStore } from '@/stores/usuario';
import { VPhoneInput } from 'v-phone-input';

export default {
  name: 'Login',
  components: { VPhoneInput },

  data() {
    return {
      usuario: {
        telefono_usuario: '',
        codigo_pais_usuario: '',
        contrasena_usuario: '',
      },

      mostrarPassword: false,
      loading: false,

      snackbar: false,
      error_snackbar: false,
      texto: '',
    };
  },

  methods: {
    mostrarSnackBar(error, detalle) {
      this.error_snackbar = error;
      this.texto = detalle;
      this.snackbar = true;
    },

    async login() {
      const form = this.$refs.formulario;
      const { valid } = await form.validate();
      if (!valid) return;

      this.loading = true;

      try {
        const res = await login(this.usuario);

        this.loading = false;

        if (res.status !== 200) {
          this.mostrarSnackBar(true, 'Usuario o contraseña incorrectos');
          return;
        }

        const data = res.data.data;

        // cargar el token en pinia
        const usuarioStore = useUsuarioStore()
        usuarioStore.setToken(res.data.tokenSession)
        usuarioStore.setUser(data)

        // Guardar datos del usuario
        localStorage.setItem("token", res.data.tokenSession);
        localStorage.setItem('rol', data.rol.nombre_rol) // 👈 CLAVE
        localStorage.id_usuario = data.id_usuario;
        localStorage.nombre_usuario = this.capitalizar(data.nombre_usuario);
        localStorage.telefono_usuario = data.telefono_usuario;
        localStorage.id_rol = data.id_rol;

        this.mostrarSnackBar(false, "Bienvenido " + this.capitalizar(data.nombre_usuario));

        // Redirección por rol
        switch (data.id_rol) {
          case 1:
            this.$router.push('/admin');
            break;
          case 2:
            this.$router.push({ name: 'perfil-cliente' })
            break;
          default:
            this.$router.push('/');
        }

      } catch (error) {
        console.error(error);
        this.loading = false;
        this.mostrarSnackBar(true, 'Ocurrió un error en el servidor');
      }
    },

    irARecuperar() {
      this.$router.push({ name: 'forgot-password'});
    },

    irARegistro() {
      this.$router.push({ name: 'registro-usuario'});
    },

    onPhoneUpdate(number) {
      // Ejemplo básico para extraer código país (asumiendo código con + y hasta 3 dígitos)
      const dialCodeMatch = number.match(/^\+(\d{1,3})/);
      const codigo_pais = dialCodeMatch ? '+' + dialCodeMatch[1] : '';
      const numberWithoutCode = codigo_pais ? number.replace(codigo_pais, '') : number;

      this.usuario.codigo_pais_usuario = codigo_pais;
      this.usuario.telefono_usuario = numberWithoutCode;

      if (this.usuario.codigo_pais_usuario != null && codigo_pais != '') {
        this.$nextTick(() => {
          this.$refs.contrasena.select()
          this.$refs.contrasena.focus()
        })
      }
    },

    capitalizar(txt) {
      return txt
        .toLowerCase()
        .replace(/\b\w/g, l => l.toUpperCase());
    },
  },

  mounted() {
    if (this.$refs.telefono) {
      const inputs = this.$refs.telefono.$el.querySelectorAll('input');
      if (inputs.length > 1) inputs[1].focus();
    }
  }
};
</script>
