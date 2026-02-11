import { http } from "./http.service";

export function saveBooking(data){
  return http().post('/api/1.0/reserva/register', data)
}

export function getReservations(){
  return http().get('/api/1.0/reserva')
}

export function reservasActivasInactivas(id_usuario, tipo){
  return http().get(`/api/1.0/reserva/${id_usuario}/${tipo}`)
}

export function getReservationsType(id_usuario, tipo){
  return http().get(`/api/1.0/reserva/obtener/${id_usuario}/${tipo}`)
}

export function modifyBooking(data){
  return http().put('/api/1.0/reserva', data)
}
