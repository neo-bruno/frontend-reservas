<template>
  <div class="calendar-container">
    <div class="text-h5 font-weight-medium">Fechas Disponibles</div>
    <p class="text-grey-darken-1">{{ formattedRange }}</p>

    <div class="calendars">
      <div class="calendar" v-for="offset in [0, 1]" :key="offset">
        <div class="calendar-header">
          <button v-if="offset === 0" @click="prevMonth">◀</button>
          <h3>{{ monthNames[getMonth(offset)] }} - {{ getYear(offset) }}</h3>
          <button v-if="offset === 1" @click="nextMonth">▶</button>
        </div>

        <div class="week-days">
          <span class="font-weight-medium" v-for="day in weekDays" :key="day">{{ day }}</span>
        </div>

        <div class="days">
          <span v-for="n in firstDayOfMonth(getMonth(offset), getYear(offset))" :key="'empty-' + n"
            class="empty"></span>

          <span v-for="day in daysInMonth(getMonth(offset), getYear(offset))" :key="day" class="day" :class="{
            selected: isSelected(day, getMonth(offset), getYear(offset)),
            inRange: isInRange(day, getMonth(offset), getYear(offset)),

            /* 🔴 PRIMERO restricciones */
            restricted:
              isRestrictedMoment(getYear(offset), getMonth(offset), day) &&
              !isEditableRestrictionMoment(
                getMomentFromDay({ year: getYear(offset), month: getMonth(offset), day })
              ),

            editableRestriction:
              this.isEditableRestrictionMoment(
                this.getMomentFromDay(getYear(offset), getMonth(offset), day)
              ),

            /* 🔴 AL FINAL disabled / unavailable */
            disabled: isDisabled(day, getMonth(offset), getYear(offset)),
            unavailable: isUnavailable(day, getMonth(offset), getYear(offset))
          }" @click="selectDate(day, getMonth(offset), getYear(offset))">
            {{ day }}
          </span>

        </div>
      </div>
    </div>
    <div>
      <v-row no-gutters>
        <v-col cols="12">
          <v-btn class="mt-4" variant="outlined" prepend-icon="mdi-delete" @click="clearDates">Borrar selección</v-btn>
        </v-col>
        <v-col cols="12" class="d-flex justify-end">
          <v-btn v-if="estado" class="mt-4" variant="elevated" color="primary" prepend-icon="mdi-content-save"
            append-icon="mdi-chevron-right" @click="saveDates">modificar fechas</v-btn>
        </v-col>
      </v-row>

    </div>

  </div>
</template>

<script>

import moment from 'moment'
import 'moment/locale/es'

moment.locale('es')

export default {
  emits: ['modificarFechasReserva'],

  props: {
    restriccion: {
      type: Object,
      required: true
    },
    restricciones: {
      type: Array,
      default: () => []
    }
  },

  data: () => ({
    selectedRange: [],
    currentMonth: moment().month(),
    currentYear: moment().year(),
    weekDays: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    monthNames: moment.months(),

    arrivalDate: null,
    departureDate: null,

    estado: false,
  }),
  computed: {
    formattedRange() {
      if (this.selectedRange.length !== 2) return "Selecciona un rango de fechas"

      this.arrivalDate = this.selectedRange[0].format('YYYY-MM-DD')
      this.departureDate = this.selectedRange[1].format('YYYY-MM-DD')
      return `del ${this.selectedRange[0].format('D')} - ${this.selectedRange[1].format('D [de] MMMM YYYY')}`
    },
    restriccionesVisuales() {
      if (!this.restriccion) return this.restricciones

      return [
        ...this.restricciones,
        {
          ...this.restriccion,
          __editable: true
        }
      ]
    }
  },
  watch: {
    selectedRange(newVal) {
      if (newVal.length !== 2) {
        this.estado = false
      }
    }
  },
  methods: {
    getMomentFromDay(year, month, day) {
      return moment({ year, month, day })
    },
    daysInMonth(month, year) {
      return moment({ year, month }).daysInMonth()
    },
    firstDayOfMonth(month, year) {
      return (moment({ year, month, day: 1 }).day() + 6) % 7
    },
    getMonth(offset) {
      return moment({ year: this.currentYear, month: this.currentMonth }).add(offset, 'month').month()
    },
    getYear(offset) {
      return moment({ year: this.currentYear, month: this.currentMonth }).add(offset, 'month').year()
    },
    selectDate(day, month, year) {
      const date = moment({ year, month, day })

      if (this.isDisabledMoment(date) || this.isUnavailableMoment(date)) return

      if (this.selectedRange.length === 0 || this.selectedRange.length === 2) {
        this.selectedRange = [date]
      } else {

        if (date.isSame(this.selectedRange[0], 'day')) {
          // ❌ No permitir seleccionar la misma fecha como rango
          this.selectedRange = []
          return
        }
        const newRange = [this.selectedRange[0], date].sort((a, b) => a - b)

        if (this.isInvalidRange(newRange)) {
          this.selectedRange = []
        } else {
          this.selectedRange = newRange
          this.estado = true
        }
      }
    },
    isSelected(day, month, year) {
      return this.selectedRange.some((d) =>
        d.isSame(moment({ year, month, day }), 'day')
      )
    },
    isInRange(day, month, year) {
      if (this.selectedRange.length < 2) return false
      const date = moment({ year, month, day })
      return date.isAfter(this.selectedRange[0], 'day') && date.isBefore(this.selectedRange[1], 'day')
    },
    isEditableRestrictionMoment(date) {
      if (!this.restriccion) return false

      return date.isBetween(
        moment(this.restriccion.fecha_inicial_restriccion),
        moment(this.restriccion.fecha_final_restriccion),
        'day',
        '[]'
      )
    },
    isDisabledMoment(date) {
      // ✅ si pertenece a la restricción editable, NO deshabilitar
      if (this.isEditableRestrictionMoment(date)) return false

      // ❌ todo lo demás pasado sigue bloqueado
      return date.isBefore(moment().startOf('day'), 'day')
    },


    isPastDate(day, month, year) {
      const today = moment().startOf('day')
      const date = moment({ year, month, day })
      return date.isBefore(today, 'day')
    },

    isUnavailableMoment(date) {
      return this.restriccionesVisuales.some(r => {
        if (r.__editable) return false // ❌ NO bloquear editable

        const inicio = moment(r.fecha_inicial_restriccion)
        const fin = moment(r.fecha_final_restriccion)

        return date.isBetween(inicio, fin, 'day', '[]')
      })
    },

    isDisabled(day, month, year) {
      return this.isDisabledMoment(moment({ year, month, day }))
    },
    isUnavailable(day, month, year) {
      return this.isUnavailableMoment(moment({ year, month, day }))
    },
    isInvalidRange([start, end]) {
      const current = start.clone()
      while (current.isSameOrBefore(end, 'day')) {
        if (this.isUnavailableMoment(current)) return true
        current.add(1, 'day')
      }
      return false
    },
    isRestrictedMoment(year, month, day) {
      const currentDate = moment({ year, month, day });

      return this.restriccionesVisuales.some(r => {
        if (r.__editable) return false  // ❌ NO pintar editable como restringido

        return currentDate.isSameOrAfter(moment(r.fecha_inicial_restriccion), 'day') &&
          currentDate.isSameOrBefore(moment(r.fecha_final_restriccion), 'day');
      });
    },

    clearDates() {
      this.selectedRange = []
      this.estado = false
    },
    saveDates() {
      this.restriccion.fecha_inicial_restriccion = this.arrivalDate
      this.restriccion.fecha_final_restriccion = this.departureDate
      this.$emit('modificarFechasReserva', this.restriccion)
    },


    formatDate(date) {
      return date.format('D [de] MMMM [de] YYYY')
    },
    getFormatDate(date) {
      return date.format('YYYY-MM-DD')
    },
    prevMonth() {
      const date = moment({ year: this.currentYear, month: this.currentMonth }).subtract(1, 'month')
      this.currentMonth = date.month()
      this.currentYear = date.year()
    },
    nextMonth() {
      const date = moment({ year: this.currentYear, month: this.currentMonth }).add(1, 'month')
      this.currentMonth = date.month()
      this.currentYear = date.year()
    },
  },
  mounted() {
  }
}
</script>
<style lang="scss" scoped>
// estilo del calendario
.calendar-container {
  text-align: left;
  padding: 20px;
  max-width: 900px;
  margin: auto;
}

.calendars {
  padding-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}

.calendar {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  width: 300px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
}

.week-days,
.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
}

.day {
  width: 35px;
  height: 35px;
  line-height: 35px;
  cursor: pointer;
  border-radius: 50%;
}

.selected {
  background: black;
  color: white;
}

.inRange {
  background: rgba(0, 0, 0, 0.1);
}

.disabled,
.unavailable {
  color: #DCDBD8;
  text-decoration: line-through;
  cursor: not-allowed;
}

// estilos del card de reservas
.v-card {
  border-radius: 12px;
}

.sticky-container {
  position: relative;
  overflow: hidden;
}

.sticky-reservation {
  position: sticky;
  top: 200px;
  /* Ajusta según la altura del header */
  max-height: calc(100vh - 200px);
  /* Limita la altura para evitar que sobrepase el viewport */
}

.restricted {
  background-color: #FFD6D6 !important;
  color: #CC0E04 !important;
  text-decoration: line-through;
}

.day.restricted {
  outline: 2px solid red !important;
}

/* 1) Rango editable verde suave */
.day.editableRestriction {
  background: rgba(76, 175, 80, 0.25) !important;
  border: 2px solid #8ac58c !important;
  color: #2d7a2d !important;
  z-index: 1;
}

/* 2) Restricción normal sigue igual */
.day.restricted {
  background-color: #FFD6D6 !important;
  color: #CC0E04 !important;
  text-decoration: line-through;
  z-index: 1;
}

/* 3) Selección siempre sobrepone */
.day.selected {
  background: #000 !important;
  color: #fff !important;
  z-index: 4;
}

.day.inRange {
  background: rgba(0, 0, 0, 0.15) !important;
  color: #000 !important;
  z-index: 3;
}

/* 4) Si hay editableRestriction + selección, selección gana */
.day.editableRestriction.selected,
.day.editableRestriction.inRange {
  background: #000 !important;
  color: #fff !important;
  z-index: 5;
}
</style>
