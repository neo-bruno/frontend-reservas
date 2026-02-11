import { http } from "./http.service";

export function saveRoom(data){
  return http().post('/api/1.0/habitacion/register', data)
}

export function getAllRoom(){
  return http().get('/api/1.0/habitacion/all')
}

export function getRoomById(id_habitacion){
  return http().get(`/api/1.0/habitacion/obtener/${id_habitacion}`)
}

export function modifyRoom(data){
  return http().put('/api/1.0/habitacion', data)
}

export function modifyOnlyRoom(data){
  return http().put('/api/1.0/habitacion/only', data)
}
