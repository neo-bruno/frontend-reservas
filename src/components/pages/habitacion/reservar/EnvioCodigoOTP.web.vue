<template>
  <v-form v-model="valid" ref="form" @submit.prevent="submitLogin">
    <v-row>
      <v-col cols="12">
        <div class="text-grey-darken-1">
          Ingresa el codigo que enviamos por mensaje de whatsapp al Telefono <strong>{{ telefono }}</strong>
        </div>
      </v-col>
      <v-col cols="12">
        <v-sheet class="" max-width="350" width="100%">
          <v-otp-input v-model="otp" length="4" placeholder="-" variant="underlined"></v-otp-input>
        </v-sheet>
      </v-col>
      <v-col cols="12">
        <p class="mb-3">
          Necesitas otro <strong>codigo</strong>?
        </p>
        <div class="d-flex justify-end">
          <v-btn density="compact" color="success" variant="outlined" append-icon="mdi-update" @click="otp = ''">volver
            a
            enviar</v-btn>
        </div>
      </v-col>
    </v-row>
    
  </v-form>
</template>

<script>
export default {
  data: () => ({
    telefono: '(+591) 77409001',
    otp: '',
    valid: false,
  }),
  methods: {
    submitLogin() {

    }
  },
  mounted() {

  }
}
</script>

<style lang="scss" scoped></style>
