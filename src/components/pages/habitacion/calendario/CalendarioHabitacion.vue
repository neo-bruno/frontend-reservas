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
            disabled: isDisabled(day, getMonth(offset), getYear(offset)),
            unavailable: isUnavailable(day, getMonth(offset), getYear(offset)),
            restricted: !isPastDate(day, getMonth(offset), getYear(offset)) && isRestrictedMoment(getYear(offset), getMonth(offset), day),
          }" @click="selectDate(day, getMonth(offset), getYear(offset))">
            {{ day }}
          </span>
        </div>
      </div>
    </div>

    <v-btn class="mt-4" variant="outlined" @click="clearDates">Borrar selección</v-btn>
  </div>
</template>

<script>

import moment from 'moment'
import 'moment/locale/es'

moment.locale('es')

export default {
  emits: ['rangoSeleccionado', 'borrarFechas', 'rangoAnulado'],

  props: {
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

    // Ahora es un arreglo de rangos
    // restricciones: [
    //   { fecha_inicial_disponibilidad: '2025-06-25', fecha_final_disponibilidad: '2025-06-27' },
    //   { fecha_inicial_disponibilidad: '2025-06-18', fecha_final_disponibilidad: '2025-06-19' },
    //   { fecha_inicial_disponibilidad: '2025-06-28', fecha_final_disponibilidad: '2025-06-30' },
    //   { fecha_inicial_disponibilidad: '2025-07-02', fecha_final_disponibilidad: '2025-07-10' },
    // ],
  }),
  computed: {
    formattedRange() {
      if (this.selectedRange.length !== 2) return "Selecciona un rango de fechas"

      this.arrivalDate = this.selectedRange[0].format('YYYY-MM-DD')
      this.departureDate = this.selectedRange[1].format('YYYY-MM-DD')
      return `${this.selectedRange[0].format('D')} - ${this.selectedRange[1].format('D [de] MMMM')}`
    },
  },
  watch: {
    selectedRange(newVal) {
      if (newVal.length !== 2) {
        this.$emit('rangoAnulado')
      }
    }
  },
  methods: {
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
          this.$emit('rangoSeleccionado', this.selectedRange)
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
    isDisabledMoment(date) {
      const today = moment().startOf('day')
      const isBeforeToday = date.isBefore(today, 'day')

      const inDisabledRange = this.restricciones.some(rango => {
        const inicio = moment(rango.fecha_inicial_restriccion, 'YYYY-MM-DD')
        const fin = moment(rango.fecha_final_restriccion, 'YYYY-MM-DD')
        return date.isSameOrAfter(inicio, 'day') && date.isSameOrBefore(fin, 'day')
      })

      return isBeforeToday || inDisabledRange
    },
    isPastDate(day, month, year) {
      const today = moment().startOf('day')
      const date = moment({ year, month, day })
      return date.isBefore(today, 'day')
    },

    isUnavailableMoment(date) {
      return this.isDisabledMoment(date)
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
      return this.restricciones.some(({ fecha_inicial_restriccion, fecha_final_restriccion }) => {
        return currentDate.isSameOrAfter(moment(fecha_inicial_restriccion), 'day') &&
          currentDate.isSameOrBefore(moment(fecha_final_restriccion), 'day');
      });
    },
    clearDates() {
      this.selectedRange = []
      this.$emit('borrarFechas')
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

    // async obtenerDisponibilidades(){
    //   try {
    //     let res = await getAvailabilityReservation(this.habitacion.id_habitacion, 1) // obtener todas las restricciones referentes a la habitacion y que sean activas
    //     if(res.status == 201){
    //       this.restricciones = res.data.data
    //       console.log(this.restricciones)
    //     }
    //   } catch (error) {
    //     console.log(error)
    //   }
    // },
  },
  mounted() {
    // this.obtenerDisponibilidades()
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
  background-color: hsl(0, 73%, 90%) !important;
  /* rojo claro */
  color: #CC0E04 !important;
  text-decoration: line-through;
  /* rojo oscuro */
  border-radius: 50%;
}
</style>
