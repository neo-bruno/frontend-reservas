import { http } from "./http.service";

export function saveBusiness(data){
  return http().post('/api/1.0/negocio/register', data)
}

export function modifyBusiness(data){
  return http().put('/api/1.0/negocio', data)
}

export function getBusiness(tipo_negocio){
  return http().get(`/api/1.0/negocio/${tipo_negocio}`)
}
