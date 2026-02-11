import { http } from "./http.service";

export function saveReview(data){
  return http().post('/api/1.0/resena/register', data)
}

export function modifyReview(data){
  return http().put('/api/1.0/resena', data)
}

export function getReview(id_habitacion, id_usuario){
  return http().get(`/api/1.0/resena/${id_habitacion}/${id_usuario}`)
}

export function getAllRevies(){
  return http().get('/api/1.0/resena')
}

