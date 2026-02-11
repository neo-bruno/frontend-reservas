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
          <span
            class="font-weight-medium"
            v-for="day in weekDays"
            :key="day"
          >
            {{ day }}
          </span>
        </div>

        <div class="days">
          <span
            v-for="n in firstDayOfMonth(getMonth(offset), getYear(offset))"
            :key="'empty-' + n"
            class="empty"
          ></span>

          <span
            v-for="day in daysInMonth(getMonth(offset), getYear(offset))"
            :key="day"
            class="day"
            :class="{
              selected: isSelected(day, getMonth(offset), getYear(offset)),
              inRange: isInRange(day, getMonth(offset), getYear(offset)),
              restricted: isRestrictedMoment(getYear(offset), getMonth(offset), day),
              disabled: isDisabled(day, getMonth(offset), getYear(offset)),
              unavailable: isUnavailable(day, getMonth(offset), getYear(offset))
            }"
            @click="selectDate(day, getMonth(offset), getYear(offset))"
          >
            {{ day }}
          </span>
        </div>
      </div>
    </div>

    <div class="d-flex justify-space-between">
      <v-btn
        class="mt-4"
        variant="outlined"
        prepend-icon="mdi-delete"
        @click="clearDates"
      >
        Borrar selección
      </v-btn>

      <v-btn
        v-if="estado"
        class="mt-4"
        variant="elevated"
        color="primary"
        prepend-icon="mdi-content-save"
        append-icon="mdi-chevron-right"
        @click="emitDates"
      >
        Guardar fechas
      </v-btn>
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
    restricciones: {
      type: Array,
      default: () => []
    }
  },

  data: () => ({
    selectedRange: [],
    currentMonth: moment().month(),
    currentYear: moment().year(),
    weekDays: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    monthNames: moment.months(),
    estado: false
  }),

  computed: {
    formattedRange() {
      if (this.selectedRange.length !== 2) {
        return 'Selecciona un rango de fechas'
      }

      return `del ${this.selectedRange[0].format('D')} - ${this.selectedRange[1].format('D [de] MMMM YYYY')}`
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
      return moment({ year: this.currentYear, month: this.currentMonth })
        .add(offset, 'month')
        .month()
    },

    getYear(offset) {
      return moment({ year: this.currentYear, month: this.currentMonth })
        .add(offset, 'month')
        .year()
    },

    selectDate(day, month, year) {
      const date = moment({ year, month, day })

      if (this.isDisabledMoment(date) || this.isUnavailableMoment(date)) return

      if (this.selectedRange.length === 0 || this.selectedRange.length === 2) {
        this.selectedRange = [date]
        this.estado = false
      } else {
        if (date.isSame(this.selectedRange[0], 'day')) {
          this.selectedRange = []
          return
        }

        const newRange = [this.selectedRange[0], date].sort((a, b) => a - b)

        if (this.isInvalidRange(newRange)) {
          this.selectedRange = []
          this.estado = false
        } else {
          this.selectedRange = newRange
          this.estado = true
        }
      }
    },

    isSelected(day, month, year) {
      return this.selectedRange.some(d =>
        d.isSame(moment({ year, month, day }), 'day')
      )
    },

    isInRange(day, month, year) {
      if (this.selectedRange.length < 2) return false
      const date = moment({ year, month, day })
      return date.isAfter(this.selectedRange[0], 'day') &&
             date.isBefore(this.selectedRange[1], 'day')
    },

    isDisabledMoment(date) {
      return date.isBefore(moment().startOf('day'), 'day')
    },

    isUnavailableMoment(date) {
      return this.restricciones.some(r => {
        return date.isBetween(
          moment(r.fecha_inicial_restriccion),
          moment(r.fecha_final_restriccion),
          'day',
          '[]'
        )
      })
    },

    isRestrictedMoment(year, month, day) {
      const date = moment({ year, month, day })
      return this.isUnavailableMoment(date)
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

    clearDates() {
      this.selectedRange = []
      this.estado = false
    },

    emitDates() {
      this.$emit('modificarFechasReserva', {
        fecha_inicial: this.selectedRange[0].format('YYYY-MM-DD'),
        fecha_final: this.selectedRange[1].format('YYYY-MM-DD')
      })
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
    }
  }
}
</script>

<style lang="scss" scoped>
.calendar-container {
  padding: 20px;
  max-width: 900px;
  margin: auto;
}

.calendars {
  display: flex;
  gap: 20px;
  justify-content: center;
  padding-top: 1rem;
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
  align-items: center;
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
  background: #000 !important;
  color: #fff !important;
}

.inRange {
  background: rgba(0, 0, 0, 0.15) !important;
}

.disabled,
.unavailable {
  color: #dcdbd8;
  cursor: not-allowed;
  text-decoration: line-through;
}

.day.restricted {
  background-color: #ffd6d6 !important;
  color: #cc0e04 !important;
  outline: 2px solid red;
}
</style>
