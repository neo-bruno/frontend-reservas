<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-row justify="center">
      <v-col class="pa-2" cols="12" lg="4" md="6" sm="6">
        <v-card elevation="7">
          <v-card-title>Recuperar contraseña</v-card-title>

          <v-card-text>
            <v-form @submit.prevent="send">
              <v-text-field v-model="email" label="Correo electrónico" type="email" prepend-inner-icon="mdi-mail"
                variant="outlined" required />

              <v-btn type="submit" color="primary" block :loading="loading">
                Enviar enlace
              </v-btn>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-btn color="primary" variant="outlined" prepend-icon="mdi-undo" @click="$router.go(-1)">
              Volver al atras
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { forgotPassword } from '@/services/auth.service';

export default {
  data() {
    return {
      email: '',
      loading: false
    }
  },
  methods: {
    async send() {
      this.loading = true
      try {
        const res = await forgotPassword({ email_usuario: this.email })
        if (res.status == 200) {
          this.$swal({
            title: "Enlace Enviado Correctamente!",
            text: `Si el correo existe, se envió un enlace al correo electronico ingresado!`,
            icon: "success",
            timer: 2500,
            didClose: () => {
              this.$router.go(-1)
            }
          })
          this.email = ''
        }
        this.$toast?.success('Si el correo existe, se envió un enlace')
      } catch (e) {
        this.$toast?.error('Error al enviar solicitud')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
