import { http } from "./http.service";

export function getPerson(id_persona){
  return http().get(`/api/1.0/persona/${id_persona}`)
}

export function verifyCellphoneNumberDuplicate(numero_telefono){
  return http().get(`/api/1.0/persona/verificar/${numero_telefono}`)
}

export function savePerson(data){
  return http().post(`/api/1.0/persona`, data)
}

export function savePersonDetail(data){
  return http().post('/api/1.0/persona/detalle', data)
}
