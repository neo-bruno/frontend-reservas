// stores/reserva.js
import { defineStore } from 'pinia'

export const useReservaStore = defineStore('reserva', {
  state: () => ({
    reserva: {
      fecha_llegada: null,
      fecha_salida: null,
      precio_noche: 0,
      numero_noches: 0,
      total_estadia: 0,
      descuento: 0,
      servicio_reserva: 0,
      total_reserva: 0
    }
  }),
  actions: {
    setReserva(payload) {
      this.reserva = {
        ...this.reserva,
        ...payload
      }
    },
    limpiarReserva() {
      this.reserva = {
        fecha_llegada: null,
        fecha_salida: null,
        precio_noche: 0,
        numero_noches: 0,
        total_estadia: 0,
        descuento: 0,
        servicio_reserva: 0,
        total_reserva: 0
      }
    }
  }
})
