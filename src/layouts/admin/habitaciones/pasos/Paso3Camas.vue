<template>
  <v-container>
    <v-card>
      <v-card-text>
        <v-form ref="formulario" @submit.prevent="">
          <v-container>
            <v-row>
              <v-col cols="12" class="py-0">
                <span class="text-h5 font-weight-light text-error">Formulario de Habitacion</span>
              </v-col>
              <v-col cols="3">
                <v-text-field ref="numero" v-model="model.numero_habitacion" density="compact"
                  label="numero habitacion (*)" placeholder="numero de la habitacion"
                  prepend-inner-icon="mdi-format-list-numbered" variant="outlined"
                  :rules="[rules.required, rules.soloLetrasONumerosConEspacios]"
                  @input="model.numero_habitacion = model.numero_habitacion.toUpperCase()"
                  @keyup.enter.prevent="setfocus('nombre')"></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field ref="nombre" v-model="model.nombre_habitacion" density="compact"
                  label="nombre habitacion (*)" placeholder="nombre de la habitacion" prepend-inner-icon="mdi-text"
                  variant="outlined" :rules="[rules.required, rules.soloLetrasONumerosConEspacios]"
                  @input="model.nombre_habitacion = model.nombre_habitacion.toUpperCase()"
                  @keyup.enter.prevent="setfocus('adultos')"></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field type="number" ref="adultos" v-model="model.adultos_habitacion" density="compact"
                  label="cap. adultos (*)" placeholder="cantidad de adultos" prepend-inner-icon="mdi-text"
                  variant="outlined" :rules="[rules.required, rules.soloEnterosPositivos]"
                  @keyup.enter.prevent="setfocus('ninos')"></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field type="number" ref="ninos" v-model="model.ninos_habitacion" density="compact"
                  label="cap. niños (*)" placeholder="cantidad de niños" prepend-inner-icon="mdi-text"
                  variant="outlined" :rules="[rules.soloEnterosPositivos]"
                  @keyup.enter.prevent="setfocus('detalle')"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="10">
                <v-text-field ref="detalle" v-model="model.detalle_habitacion" density="compact"
                  label="detalle en corto (*)" placeholder="detalle de la habitacion" prepend-inner-icon="mdi-text"
                  variant="outlined" @keyup.enter.prevent="setfocus('descripcion')"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="10">
                <v-textarea ref="descripcion" v-model="model.descripcion_habitacion" density="compact"
                  placeholder="descripcion de la habitacion" prepend-inner-icon="mdi-text" variant="outlined"
                  hide-details @keyup.ctrl.enter.prevent="setfocus('numero')"></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>


<script>
export default {
  props: { modelValue: Object },
  emits: ['update:modelValue'],


  computed: {
    model: {
      get() {
        return this.modelValue
      },
      set(v) {
        this.$emit('update:modelValue', v)
      }
    }
  },

  data() {
    return {
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
        soloLetrasONumerosConEspacios: v =>
          /^[a-zA-Z0-9 ]+$/.test(v) || 'Solo se permiten letras, números y espacios',
        letrasONumerosSinSoloEspacios: v =>
          (typeof v === 'string' && v.trim().length > 0) || 'No se permite solo espacios',
        soloNumeroODecimal: v =>
          (!!v && /^[0-9]+(\.[0-9]+)?$/.test(v)) || 'Solo números enteros o decimales',
        soloEnterosPositivos: v =>
          /^(0|[1-9]\d*)$/.test(v) || 'Solo se permiten números enteros (0 o mayores)'
      },
    }
  },

  methods: {
    setfocus(foco) {
      this.$nextTick(() => {
        if (foco === "numero") {
          this.$refs.numero?.focus()
          this.$refs.numero?.select()
        }

        if (foco === "nombre") {
          this.$refs.nombre?.focus()
          this.$refs.nombre?.select()
        }

        if (foco === "detalle") {
          this.$refs.detalle?.focus()
          this.$refs.detalle?.select()
        }

        if (foco === "descripcion") {
          this.$refs.descripcion?.focus()
        }

        if (foco === "adultos") {
          this.$refs.adultos?.select()
          this.$refs.adultos?.focus()
        }

        if (foco === "ninos") {
          this.$refs.ninos?.select()
          this.$refs.ninos?.focus()
        }
      })
    },
  },
  mounted(){
    this.setfocus('numero')
  }
}
</script>
