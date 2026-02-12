<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card width="420">
      <v-card-title>Nueva contraseña</v-card-title>

      <v-card-text>
        <v-form @submit.prevent="reset">
          <v-text-field v-model="password" label="Nueva contraseña" type="password" required />

          <v-text-field v-model="confirm" label="Confirmar contraseña" type="password" required />

          <v-btn type="submit" color="primary" block :loading="loading">
            Guardar contraseña
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { resetPassword } from '@/services/auth.service';

export default {
  data() {
    return {
      password: '',
      confirm: '',
      loading: false,
      token: this.$route.query.token
    }
  },
  mounted() {
    if (!this.token) {
      this.$router.push('/login')
    }
  },
  methods: {
    async reset() {
      if (this.password !== this.confirm) {
        this.$toast?.error('Las contraseñas no coinciden')
        return
      }

      this.loading = true
      try {
        await resetPassword({
          token: this.token,
          password: this.password
        }
        )

        this.$toast?.success('Contraseña actualizada')
        this.$router.push('/login')
      } catch (e) {
        this.$toast?.error('Token inválido o expirado')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
