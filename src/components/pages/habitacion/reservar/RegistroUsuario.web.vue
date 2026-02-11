<template>
  <v-row>
    <v-col lg="12" cols="12">
      <div class="text-grey-darken-1">
        Para registrar un nuevo usuario, debe llenar el formulario.
      </div>
    </v-col>
    <v-col lg="12" cols="12">
      <v-text-field hide-details ref="nombre" class="text-primary" v-model="nombre_persona" label="Nombre Completo"
        :rules="[rules.required, rules.reglaDosPalabras, rules.soloLetrasYEspacios]" prepend-inner-icon="mdi-account"
        variant="outlined" @input="validarNombre(nombre_persona)" @keyup.enter.prevent="" />
    </v-col>
    <v-col lg="12" cols="12">
      <v-text-field hide-details ref="password" class="text-primary" v-model="nombre_persona" label="Password"
        :rules="[rules.required, rules.reglaDosPalabras, rules.soloLetrasYEspacios]" prepend-inner-icon="mdi-lock"
        variant="outlined" @input="validarNombre(nombre_persona)" @keyup.enter.prevent="" />
    </v-col>
    <v-col lg="12" cols="12">
      <v-text-field ref="repassword" class="text-primary" v-model="nombre_persona" label="Re confirmar"
        :rules="[rules.required, rules.reglaDosPalabras, rules.soloLetrasYEspacios]" prepend-inner-icon="mdi-lock-open"
        variant="outlined" @input="validarNombre(nombre_persona)" @keyup.enter.prevent="" />
    </v-col>
    <v-divider></v-divider>
    <v-col cols="12">
      <div style="font-size: 12px;" class="text-grey-darken-1">
        Se guardara los datos del usuario y podra hacer seguimiento a su reserva, ver precios, disponibilidad de habitaciones, etc.
      </div>
    </v-col>
    <v-divider></v-divider>
  </v-row>

  <v-row>
    <v-col cols="12" class="d-flex justify-end mt-3">
      <v-btn color="success" prepend-icon="mdi-content-save" append-icon="mdi-chevron-right">registrarse</v-btn>
    </v-col>
  </v-row>

</template>

<script>
export default {
  data: () => ({
    nombre_persona: '',
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
  }),
  methods: {

  },
  mounted(){

  }
}
</script>

<style lang="scss" scoped></style>
