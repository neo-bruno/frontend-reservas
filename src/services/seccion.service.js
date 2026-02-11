import { http } from "./http.service";

export function getSectionByType(tipo_seccion){
  return http().get(`/api/1.0/seccion/${tipo_seccion}`)
}

export function modifySection(data){
  return http().put('/api/1.0/seccion', data)
}

export function modifyIconSeccion(data){
  return http().put('/api/1.0/seccion/icono', data)
}
