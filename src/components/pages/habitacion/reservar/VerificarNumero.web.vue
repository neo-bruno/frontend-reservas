<template>
  <v-container>
    <v-row no-gutters dense>
      <v-col cols="12">
        <v-phone-input ref="telefono" class="text-primary" v-model="codigo_pais_telefono" variant="outlined"
          country-label="" label="Telefono" country-aria-label="Pais para el Numero de Telefono"
          invalid-message="El Numero de Telefono debe ser Valido (ejemplo: 01 23 45 67 89)." default-country="BO"
          @update:modelValue="onPhoneUpdate" @update:country="handleCountryUpdate" />
      </v-col>
      <v-col cols="12">
        <div class="text-caption text-grey-darken-1">
          Te vamos a confirmar el número por <strong>teléfono</strong> o mensaje de texto. Sujeto a las tarifas estándar
          para mensajes
          y datos.

        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { VPhoneInput } from 'v-phone-input';

export default {
  components: {
    VPhoneInput,
  },
  data: () => ({
    codigo_pais_telefono: '',
    nombre_persona: '',
  }),
  methods:{
    handleCountryUpdate(pais) {

    },
    onPhoneUpdate(number) {

    },
    validarNombre(valor) {

    },
  },
  mounted(){

  }
}
</script>

<style lang="scss" scoped></style>
