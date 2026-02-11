<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <span class="text-h5 font-weight-light text-error">Nivel de Piso, Categoria y Camas de la Habitacion</span>
          </v-card-title>
          <v-card-text>

            <!-- fila del nivel -->
            <v-row>
              <v-col cols="7">
                <v-select v-model="id_nivel" color="success" :base-color="id_nivel > 0 ? 'success' : 'primary'" clearable label="Elejir Nivel de Piso" :items="items"
                  @update:model-value="handleLevelChange" variant="outlined"></v-select>
              </v-col>
              <v-col cols="1">
                <v-icon :color="id_nivel > 0 ? 'success' : 'cero'" size="50">mdi-check</v-icon>
              </v-col>
            </v-row>

            <!-- fila de la categoria y precios -->
            <v-row>
              <v-col cols="7">
                <v-select v-model="id_categoria" color="success" :base-color="id_categoria > 0 ? 'success' : 'primary'" label="Eleja una Categoria" :items="itemsCategoria" variant="outlined"
                  @update:model-value="handleCategoriaChange"></v-select>
              </v-col>
              <v-col cols="2">
                <v-text-field label="precio ahora" class="text-success font-weight-bold" readonly
                  prepend-icon="mdi-cash" :model-value="categoriaSeleccionada.precio_ahora_categoria" suffix="Bs.-"
                  variant="underlined"></v-text-field>
              </v-col>
              <v-col cols="2">
                <v-text-field label="precio antes" class="text-decoration-line-through text-error" readonly
                  prepend-icon="mdi-cash" :model-value="categoriaSeleccionada.precio_antes_categoria" suffix="Bs.-"
                  variant="underlined"></v-text-field>
              </v-col>
              <v-col cols="1">
                <v-icon :color="id_categoria > 0 ? 'success' : 'cero'" size="50">mdi-check</v-icon>
              </v-col>
            </v-row>

            <!-- fila de las camas -->
            <v-row>
              <v-col cols="12" class="pt-0">
                <div class="d-flex justify-end pb-2">
                  <v-btn color="success" append-icon="mdi-chevron-right" prepend-icon="mdi-plus"
                    @click="mostrarDialogoCamaNuevo">agregar camas a la
                    habitacion</v-btn>
                </div>
                <v-table hover density="compact">
                  <thead>
                    <tr class="bg-primary">
                      <th>CANT</th>
                      <th>DESCRIPCION CAMA</th>
                      <th class="text-right">COSTO</th>
                      <th class="text-right">TOTAL</th>
                      <th class="text-right">ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(habitacion_cama, index) in habitacion_camas" :key="index">
                      <td class="text-center text-h4 font-weight-light">{{ habitacion_cama.cantidad_hab_cama }}</td>
                      <td>
                        <v-list select-strategy="single-independent">
                          <v-list-item active-class="text-septary" class="py-3">
                            <v-list-item-title class="font-weight-bold text-uppercase">{{ habitacion_cama.cama.tipo_cama
                            }}</v-list-item-title>

                            <v-list-item-subtitle class="mb-1 text-high-emphasis text-septary opacity-100">{{
                              habitacion_cama.cama.tipo_persona_cama }}</v-list-item-subtitle>
                            <v-list-item-subtitle class="text-high-emphasis">{{ habitacion_cama.cama.descripcion_cama
                            }}</v-list-item-subtitle>

                            <template v-slot:append="{ isSelected }">
                              <!-- <v-icon v-if="habitacion_cama.cama.estado_contenedor == 0" color="octary">mdi-eye-lock</v-icon> -->
                              <v-list-item-action class="flex-column align-end">
                                <small class="mb-4 text-high-emphasis opacity-60">{{
                                  habitacion_cama.cama.cant_persona_cama }}
                                  pers.</small>

                                <v-spacer></v-spacer>

                                <v-icon v-if="isSelected" color="septary">mdi-{{ habitacion_cama.cama.icono_persona_cama
                                }}</v-icon>

                                <v-icon v-else color="septary" class="opacity-90">mdi-{{
                                  habitacion_cama.cama.icono_persona_cama }}</v-icon>

                              </v-list-item-action>
                            </template>
                          </v-list-item>
                        </v-list>
                      </td>
                      <td class="text-right">
                        <span class="text-h5">{{ habitacion_cama.costo_hab_cama }}</span>
                      </td>
                      <td class="text-right">
                        <span class="text-h2">{{ habitacion_cama.total_hab_cama }}</span>
                      </td>
                      <td>
                        <div class="d-flex justify-end align-center">
                          <v-icon class="me-2" color="septary"
                            @click="mostrarDialogoCamaEditar(habitacion_cama)">mdi-pencil</v-icon>
                          <v-icon class="ms-2" color="red" @click="eliminarCama(habitacion_cama)">mdi-delete</v-icon>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- dialogo para agregar nueva cama -->
  <v-dialog v-model="dialogo_cama" width="600" persistent>
    <v-form ref="nuevo" @submit.prevent>
      <v-card rounded="lg">
        <template v-slot:append>
          <v-icon icon="mdi-close" @click="cerrarDialogoCama"></v-icon>
        </template>
        <v-card-title class="text-septary text-center">
          <div class="text-h4 text-success">
            {{ getFirstWord('Agregar') }}
            <span class="text-primary">{{ getSecondtWord(' Camas en la Habitacion') }}</span>
          </div>
        </v-card-title>
        <v-card-subtitle>
          <div class="text-center text-wrap">elija la(s) cama(s) que pertenece a la categoria. y ponga el precio de la
            habitacion con respecto a la(s) cama(s) que ha elejido.</div>
        </v-card-subtitle>
        <v-card-text class="pb-0 mb-0 d-flex flex-column" style="height: 100%;">
          <v-row>
            <v-window v-model="paso" style="width: 100%;">

              <v-window-item :value="1">
                <v-list select-strategy="single-leaf" rounded bg-color="cero">
                  <v-list-item color="octary" v-for="cama in camas" :key="cama.id_cama" :value="cama.id_cama"
                    class="py-3" @click="seleccionoCama(cama)">
                    <v-list-item-title class="font-weight-bold text-uppercase">{{ cama.tipo_cama
                    }}</v-list-item-title>

                    <v-list-item-subtitle class="mb-1 text-high-emphasis opacity-100 text-septary">{{
                      cama.tipo_persona_cama
                    }}</v-list-item-subtitle>

                    <v-list-item-subtitle class="text-high-emphasis">{{ cama.descripcion_cama
                    }}</v-list-item-subtitle>

                    <template v-slot:append="{ isSelected }">
                      <v-list-item-action class="flex-column align-end">
                        <small class="mb-4 text-high-emphasis">{{ cama.cant_persona_cama }}
                          pers.</small>

                        <v-spacer></v-spacer>

                        <v-icon v-if="isSelected" color="yellow-darken-3">mdi-{{ cama.icono_persona_cama }}</v-icon>

                        <v-icon v-else class="opacity-30">mdi-{{ cama.icono_persona_cama }}</v-icon>

                      </v-list-item-action>
                    </template>
                  </v-list-item>
                </v-list>
              </v-window-item>

              <v-window-item :value="2">
                <v-container fluid>
                  <v-row justify="end">
                    <v-col cols="6">
                      <v-text-field type="number" ref="cantidad" color="septary" class="text-primary" placeholder="1"
                        v-model="habitacion_cama.cantidad_hab_cama" label="cantidad camas (*)" hide-spin-buttons
                        :rules="[rules.required, rules.reglaLetrasONumeros]" prepend-icon="mdi-asterisk"
                        variant="underlined" append-icon="mdi-counter"
                        @keyup.enter.prevent="agregarCamaCosto(cama, habitacion_cama.cantidad_hab_cama)"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="1" class="d-flex align-center justify-end">
                      <span class="text-h4 font-weight-regular">{{ habitacion_cama.cantidad_hab_cama }}</span>
                    </v-col>
                    <v-col cols="11">
                      <v-list select-strategy="single-leaf" rounded="lg" elevation="7" bg-color="octary">
                        <v-list-item color="primary" class="py-3">

                          <v-list-item-title class="font-weight-bold text-uppercase text-primary">{{
                            habitacion_cama.cantidad_hab_cama > 1 ? 'CAMAS' : 'CAMA' }} - {{ cama.tipo_cama
                            }}</v-list-item-title>

                          <v-list-item-subtitle class="mb-1 text-high-emphasis opacity-100 text-septary">{{
                            cama.tipo_persona_cama
                          }}</v-list-item-subtitle>

                          <v-list-item-subtitle class="text-high-emphasis">{{ cama.descripcion_cama
                          }}</v-list-item-subtitle>

                          <template v-slot:append="{ isSelected }">
                            <v-list-item-action class="flex-column align-end">
                              <small class="mb-4 text-high-emphasis">{{ cama.cant_persona_cama }}
                                pers.</small>

                              <v-spacer></v-spacer>

                              <v-icon v-if="isSelected" color="yellow-darken-3">mdi-{{ cama.icono_persona_cama
                              }}</v-icon>

                              <v-icon v-else class="opacity-30">mdi-{{ cama.icono_persona_cama }}</v-icon>

                            </v-list-item-action>
                          </template>
                        </v-list-item>
                      </v-list>
                    </v-col>
                  </v-row>
                </v-container>
              </v-window-item>
            </v-window>
          </v-row>
        </v-card-text>
        <v-card-actions v-if="paso == 2" class="mt-4">
          <v-btn v-if="nuevo" text="atras" color="septary" prepend-icon="mdi-chevron-left" variant="tonal"
            @click="paso--"></v-btn>
          <v-spacer></v-spacer>
          <v-btn text="Agregar Cama" color="primary" prepend-icon="mdi-content-save" variant="flat"
            @click="agregarCamaCosto(cama, habitacion_cama.cantidad_hab_cama)" append-icon="mdi-chevron-right"></v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>

  <!-- dialogo para modificar la cama de la lista -->
  <v-dialog v-model="dialogo_editar_cama" width="600" persistent>
    <v-form ref="editar" @submit.prevent>
      <v-card rounded="lg">
        <template v-slot:append>
          <v-icon icon="mdi-close" @click="cerrarDialogoEditarCama"></v-icon>
        </template>
        <v-card-title class="text-septary text-center">
          <div class="text-h4 text-success">
            {{ getFirstWord('Agregar') }}
            <span class="text-primary">{{ getSecondtWord(' Camas en la Habitacion') }}</span>
          </div>
        </v-card-title>
        <v-card-subtitle>
          <div class="text-center text-wrap">elija la(s) cama(s) que pertenece a la categoria. y ponga el precio de la
            habitacion con respecto a la(s) cama(s) que ha elejido.</div>
        </v-card-subtitle>
        <v-card-text class="pb-0 mb-0 d-flex flex-column" style="height: 100%;">
          <v-container fluid>
            <v-row justify="end">
              <v-col cols="6">
                <v-text-field type="number" ref="cantidad" color="septary" class="text-primary" placeholder="1"
                  v-model="cantidad_hab_cama" label="cantidad camas (*)" hide-spin-buttons
                  :rules="[rules.required, rules.reglaLetrasONumeros]" prepend-icon="mdi-asterisk" variant="underlined"
                  append-icon="mdi-counter"
                  @keyup.enter.prevent="modificarCamaCosto(habitacion_cama.cama, cantidad_hab_cama)"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="1" class="d-flex align-center justify-end">
                <span class="text-h4 font-weight-regular">{{ cantidad_hab_cama }}</span>
              </v-col>
              <v-col cols="11">
                <v-list select-strategy="single-leaf" rounded="lg" elevation="7" bg-color="octary">
                  <v-list-item color="primary" class="py-3">

                    <v-list-item-title class="font-weight-bold text-uppercase text-primary">{{
                      cantidad_hab_cama > 1 ? 'CAMAS' : 'CAMA' }} - {{ habitacion_cama.cama.tipo_cama
                      }}</v-list-item-title>

                    <v-list-item-subtitle class="mb-1 text-high-emphasis opacity-100 text-septary">{{
                      habitacion_cama.cama.tipo_persona_cama
                    }}</v-list-item-subtitle>

                    <v-list-item-subtitle class="text-high-emphasis">{{ habitacion_cama.cama.descripcion_cama
                    }}</v-list-item-subtitle>

                    <template v-slot:append="{ isSelected }">
                      <v-list-item-action class="flex-column align-end">
                        <small class="mb-4 text-high-emphasis">{{ habitacion_cama.cama.cant_persona_cama }}
                          pers.</small>

                        <v-spacer></v-spacer>

                        <v-icon v-if="isSelected" color="yellow-darken-3">mdi-{{ habitacion_cama.cama.icono_persona_cama
                        }}</v-icon>

                        <v-icon v-else class="opacity-30">mdi-{{ habitacion_cama.cama.icono_persona_cama }}</v-icon>

                      </v-list-item-action>
                    </template>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions v-if="paso == 2" class="mt-4">
          <v-btn v-if="nuevo" text="atras" color="septary" prepend-icon="mdi-chevron-left" variant="tonal"
            @click="paso--"></v-btn>
          <v-spacer></v-spacer>
          <v-btn text="Modificar Cama" color="primary" prepend-icon="mdi-content-save" variant="flat"
            @click="modificarCamaCosto(habitacion_cama.cama, cantidad_hab_cama)"
            append-icon="mdi-chevron-right"></v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>

</template>

<script>
import { getBeds } from '@/services/cama.service';
import { getCategories } from '@/services/categoria.service';
import { getLevels } from '@/services/nivel.service';

export default {
  props: {
    modelValue: {
      type: Object,
      required: true
    }
  },
  emits: ['update:modelValue'],

  data() {
    return {
      id_nivel: null,
      niveles: [],

      rules: {
        required: value => !!value || 'El campo es requerido.',
        reglaContieneLetra: v =>
          /[a-zA-Z]/.test(v) || 'Debe contener al menos una letra',
        reglaLetrasONumeros: v =>
          (/^[1-9]+$/.test(v)) && !/\s/.test(v) || 'Debe contener letras o números, sin espacios ni cero',
        reglaSoloEnteros: v =>
          v === '' || /^[0-9]+$/.test(v) || 'Solo se permiten números enteros sin espacios'
      },
      nuevo: true,

      id_categoria: null,
      categorias: [],
      categoriaSeleccionada: {},

      paso: 1,
      camas: [],
      cama: {},
      habitacion_cama: {},
      habitacion_camas: [],
      cantidad_hab_cama: 0,
      dialogo_cama: false,
      dialogo_editar_cama: false,
    }
  },
  computed: {
    habitacion: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
    items() {
      let arreglo = []
      this.niveles.forEach(item => {
        arreglo.push({ value: item.id_nivel, title: item.nombre_nivel + ' - ' + item.descripcion_nivel })
      });
      return arreglo
    },
    itemsCategoria() {
      let arreglo = []
      this.categorias.forEach(item => {
        arreglo.push({ value: item.id_categoria, title: item.nombre_categoria + ' - ' + item.descripcion_categoria })
      })
      return arreglo
    },
  },
  methods: {
    handleLevelChange(id) {
      const nivel = this.niveles.find(
        item => item.id_nivel === id
      )

      if (!nivel) return

      this.habitacion = {
        ...this.habitacion,
        nivel: {
          ...this.habitacion.nivel,
          id_nivel: nivel.id_nivel,
          nombre_nivel: nivel.nombre_nivel,
          descripcion_nivel: nivel.descripcion_nivel,
          icono_nivel: nivel.icono_nivel
        }
      }
    },

    handleCategoriaChange(id) {
      const categoria = this.categorias.find(
        item => item.id_categoria === id
      )

      if (!categoria) return
      this.categoriaSeleccionada = categoria
      this.habitacion = {
        ...this.habitacion,
        categoria: {
          ...this.habitacion.categoria,
          id_categoria: categoria.id_categoria,
          nombre_categoria: categoria.nombre_categoria,
          descripcion_categoria: categoria.descripcion_categoria,
          precio_ahora_categoria: categoria.precio_ahora_categoria,
          precio_antes_categoria: categoria.precio_antes_categoria
        }
      }
    },
    setFocus(foco) {
      switch (foco) {
        case 'numero':
          this.$nextTick(() => {
            this.$refs.numero.focus()
            this.$refs.numero.select()
          })
          break
        case 'nombre':
          this.$nextTick(() => {
            this.$refs.nombre.focus()
            this.$refs.nombre.select()
          })
          break
        case 'piso':
          this.$nextTick(() => {
            this.$refs.piso.focus()
            this.$refs.piso.select()
          })
          break
        case 'telefono':
          this.$nextTick(() => {
            this.$refs.telefono.focus()
            this.$refs.telefono.select()
          })
          break
        case 'precio':
          this.$nextTick(() => {
            this.$refs.precio.focus()
            this.$refs.precio.select()
          })
          break
        case 'cantidad':
          this.$nextTick(() => {
            this.$refs.cantidad.focus()
            this.$refs.cantidad.select()
          })
          break
        case 'adultos':
          this.$nextTick(() => {
            this.$refs.adultos.focus()
            this.$refs.adultos.select()
          })
          break
        case 'ninos':
          this.$nextTick(() => {
            this.$refs.ninos.focus()
            this.$refs.ninos.select()
          })
          break
        case 'estado':
          this.$nextTick(() => {
            this.$refs.estado.focus()
          })
          break
      }
    },
    getFirstWord(texto) {
      return texto?.split(" ")[0] || "";
    },
    getSecondtWord(texto) {
      return texto?.split(" ").slice(1).join(" ") || "";
    },
    async agregarCamaCosto(cama, cantidad) {
      try {
        const { valid } = await this.$refs.nuevo.validate()
        if (!valid) return

        const total = cantidad * cama.costo_cama

        const habitacion_cama = {
          id_habitacion: 0,
          id_cama: cama.id_cama,
          cantidad_hab_cama: cantidad,
          costo_hab_cama: cama.costo_cama,
          total_hab_cama: total.toFixed(2),
          cama
        }

        this.habitacion_camas.push(habitacion_cama)

        this.habitacion = {
          ...this.habitacion,
          habitacion_camas: [
            ...this.habitacion.habitacion_camas,
            habitacion_cama
          ]
        }

        this.dialogo_cama = false
      } catch (error) {
        console.log(error)
      }
    },
    mostrarDialogoCamaNuevo() {
      this.nuevo = true
      this.habitacion_camas.forEach(ele => {
        this.camas = this.camas.filter(item => item.id_cama != ele.cama.id_cama)
      })
      this.dialogo_cama = true
      this.paso = 1
    },
    seleccionoCama(cama) {
      this.cama = cama
      this.paso = 2
      this.setFocus('cantidad')
    },
    cerrarDialogoCama() {
      this.dialogo_cama = false
    },

    mostrarDialogoCamaEditar(data) {
      this.nuevo = false
      this.habitacion_cama = data
      this.cantidad_hab_cama = data.cantidad_hab_cama
      this.habitacion_camas.forEach(ele => {
        this.camas = this.camas.filter(item => item.id_cama != ele.cama.id_cama)
      })
      this.dialogo_editar_cama = true
      this.setFocus('cantidad')
    },
    cerrarDialogoEditarCama() {
      this.dialogo_editar_cama = false
    },
    async modificarCamaCosto(cama, cantidad) {
      try {
        const { valid } = await this.$refs.editar.validate()
        if (!valid) return

        const index = this.habitacion_camas.findIndex(
          item => item.cama.id_cama === cama.id_cama
        )

        if (index !== -1) {
          const total = cantidad * cama.costo_cama

          this.habitacion_camas[index] = {
            ...this.habitacion_camas[index],
            cantidad_hab_cama: cantidad,
            costo_hab_cama: cama.costo_cama,
            total_hab_cama: total.toFixed(2)
          }
        }

        const total = cantidad * cama.costo_cama

        const camasActualizadas = this.habitacion.habitacion_camas.map(item =>
          item.id_cama === cama.id_cama
            ? {
              ...item,
              cantidad_hab_cama: cantidad,
              costo_hab_cama: cama.costo_cama,
              total_hab_cama: total.toFixed(2)
            }
            : item
        )

        this.habitacion = {
          ...this.habitacion,
          habitacion_camas: camasActualizadas
        }

        this.dialogo_editar_cama = false
      } catch (error) {
        console.log(error)
      }
    },

    eliminarCama(data) {
      this.$swal({
        title: "¿Estás seguro?",
        text: "¿Quieres eliminar esta cama de la habitación?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar"
      }).then((result) => {
        if (!result.isConfirmed) return

        const camasFiltradas = this.habitacion.habitacion_camas.filter(
          item => item.id_cama !== data.cama.id_cama
        )
        this.habitacion = {
          ...this.habitacion,
          habitacion_camas: camasFiltradas
        }
        this.$swal({
          title: "Eliminado",
          text: "La cama fue eliminada correctamente",
          icon: "success",
          timer: 2000
        }).then(() => {
          this.habitacion_camas = this.habitacion_camas.filter(item => item.cama.id_cama != data.cama.id_cama)
          this.obtenerCamas()
        })
      })
    },

    async obtenerNiveles() {
      try {
        let res = await getLevels()
        if (res.status == 201 && res.data.data.length > 0) {
          this.niveles = res.data.data
        }
      } catch (error) {
        console.log(error)
      }
    },
    async obtenerCategorias() {
      try {
        let res = await getCategories()
        if (res.status == 201 && res.data.data.length > 0) {
          this.categorias = res.data.data
        }
      } catch (error) {
        console.log(error)
      }
    },
    async obtenerCamas() {
      try {
        let res = await getBeds()
        if (res.status == 201 && res.data.data.length > 0) {
          this.camas = res.data.data
        }
      } catch (error) {
        console.log(error)
      }
    }
  },
  mounted() {
    this.obtenerNiveles()
    this.obtenerCategorias()
    this.obtenerCamas()
  }
}
</script>

<style lang="scss" scoped></style>
