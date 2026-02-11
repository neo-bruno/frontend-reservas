import { http } from "./http.service";

export function saveService(data){
  return http().post('/api/1.0/servicio/register', data)
}

export function getServices(){
  return http().get('/api/1.0/servicio')
}

export function getService(id_servicio){
  return http().get(`/api/1.0/servicio/${id_servicio}`)
}

export function modifyService(data){
  return http().put('/api/1.0/servicio', data)
}
