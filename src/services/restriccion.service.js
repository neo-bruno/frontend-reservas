import { http } from "./http.service";

export function saveRestriction(data){
  return http().post('/api/1.0/restriccion/register', data)
}

export function getRestrictions(id_habitacion){
  return http().get(`/api/1.0/restriccion/${id_habitacion}`)
}

export function modifyRestriction(data){
  return http().put('/api/1.0/restriccion', data)
}
