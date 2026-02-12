<template>
  <div class="d-flex justify-start pa-2 pb-0">
    <v-btn variant="flat" density="compact" color="success" prepend-icon="mdi-undo" @click="volverAtras"> volver
      atras</v-btn>
  </div>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" lg="5" md="6" sm="7">

        <!-- DATOS PERSONALES -->
        <v-card class="mb-4" elevation="6">
          <v-card-title class="font-weight-bold mb-4">
            Datos personales
          </v-card-title>

          <v-card-text>
            <v-form ref="formulario" @submit.prevent="">
              <v-text-field ref="nombre" variant="outlined" v-model="usuario.nombre_usuario" label="Nombre"
                prepend-inner-icon="mdi-account" :rules="[rules.required, rules.reglaContieneLetra]"
                @keyup.enter.prevent="setfocus('telefono')" />

              <v-text-field variant="outlined" v-model="usuario.rol.nombre_rol" label="Rol"
                prepend-inner-icon="mdi-account-box" disabled />

              <v-text-field ref="telefono" variant="outlined" :prefix="'(' + usuario.codigo_pais_usuario + ')'"
                v-model="usuario.telefono_usuario" label="Teléfono" prepend-inner-icon="mdi-phone"
                :rules="[rules.required]" @keyup.enter.prevent="setfocus('correo')" />

              <v-text-field ref="correo" v-model="usuario.email_usuario" label="correo electronico"
                :rules="[rules.required, rules.emailRegex]"
                prepend-inner-icon="mdi-email" variant="outlined" @keyup.enter.prevent="setfocus('nombre')" />
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn variant="elevated" prepend-icon="mdi-content-save" append-icon="mdi-chevron-right" color="primary"
              @click="actualizarPerfil">
              Guardar datos
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- SEGURIDAD -->
        <v-card elevation="6">
          <v-card-title class="font-weight-bold mb-4">
            Seguridad
          </v-card-title>

          <v-card-text>
            <v-form ref="privados" @submit.prevent="">
              <v-text-field variant="outlined" readonly v-model="usuario.contrasena_usuario" label="Contraseña actual"
                type="password" prepend-inner-icon="mdi-lock" />

              <v-text-field ref="nueva" variant="outlined" v-model="password.nueva" label="Nueva contraseña"
                type="password" :rules="[rules.required, rules.letrasONumerosSinSoloEspacios]"
                prepend-inner-icon="mdi-lock-reset" @keyup.enter.prevent="setfocus('confirmar')" />

              <v-text-field ref="confirmar" variant="outlined" v-model="password.confirmar"
                label="Confirmar nueva contraseña" type="password" prepend-inner-icon="mdi-lock-plus"
                :rules="[rules.required, rules.letrasONumerosSinSoloEspacios]"
                @keyup.enter.prevent="setfocus('nueva')" />
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn :disabled="password.nueva != password.confirmar" variant="elevated" prepend-inner-icon="mdi-reload" append-icon="mdi-chevron-right" color="primary"
              @click="cambiarPassword">
              Cambiar contraseña
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- capa protectora de proceso -->
  <v-overlay :model-value="overlay" class="align-center justify-center" persistent>
    <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
  </v-overlay>

</template>


<script>
import { modifyUser } from '@/services/usuario.service';
import { useUsuarioStore } from '@/stores/usuario';

export default {
  name: 'ClienteDatos',

  data() {
    return {
      usuario: {
        rol: {
          nombre_rol: ''
        }
      },
      password: {
        nueva: '',
        confirmar: ''
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
        soloNumeroODecimal: v =>
          (!!v && /^[0-9]+(\.[0-9]+)?$/.test(v)) || 'Solo números enteros o decimales',
        emailRegex: v =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Correo Invalido',
      },

      // paralizando pantalla
      overlay: false,
      errores: false,
    }
  },

  computed: {
  },

  watch: {
    overlay(val) {
      val && setTimeout(() => {
        this.overlay = false
      }, 100000)
    },
  },

  mounted() {
    this.cargarUsuario()
    this.setfocus('nombre')
  },

  methods: {
    async cargarUsuario() {
      const usuarioStore = useUsuarioStore()
      this.usuario = usuarioStore.usuario
    },

    async actualizarPerfil() {
      try {
        const { valid } = await this.$refs.formulario.validate()
        this.$nextTick(async () => {
          // Simular login
          this.overlay = true;
          if (valid) {
            setTimeout(async () => {
              this.overlay = false

              let res = await modifyUser(this.usuario)
              if (res.status == 200) {
                const usuarioStore = useUsuarioStore()
                usuarioStore.setUser(this.usuario)
                this.$swal({
                  title: "Registro Guardado!",
                  text: `se ha modificado los datos del usuario CORRECTAMENTE!!!`,
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

    async cambiarPassword() {
      try {
        if (this.password.nueva !== this.password.confirmar) {
          this.$swal({
            title: "Error!",
            text: "Las contraseñas no coinciden",
            icon: "error",
            timer: 1500
          })
          return
        }
        this.usuario.contrasena_usuario = this.password.nueva
        const { valid } = await this.$refs.privados.validate()
        this.$nextTick(async () => {
          // Simular login
          this.overlay = true;
          if (valid) {
            setTimeout(async () => {
              this.overlay = false

              let res = await modifyUser(this.usuario)
              if (res.status == 200) {
                const usuarioStore = useUsuarioStore()
                usuarioStore.setUser(this.usuario)
                this.$swal({
                  title: "Registro Guardado!",
                  text: `se ha modificado los datos del usuario CORRECTAMENTE!!!`,
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
          this.$refs.nombre?.focus()
          this.$refs.nombre?.select()
        }

        if (foco === "telefono") {
          this.$refs.telefono?.select()
          this.$refs.telefono?.focus()
        }

        if (foco === "correo") {
          this.$refs.correo?.select()
          this.$refs.correo?.focus()
        }

        if (foco === "nueva") {
          this.$refs.nueva?.select()
          this.$refs.nueva?.focus()
        }

        if (foco === "confirmar") {
          this.$refs.confirmar?.select()
          this.$refs.confirmar?.focus()
        }

      })
    },

    obtenerUsuario() {
      const usuarioStore = useUsuarioStore()
      this.usuario = usuarioStore.usuario
    },

    volverAtras() {
      this.$router.go(-1)
    }
  },
}
</script>

<style lang="scss" scoped></style>
