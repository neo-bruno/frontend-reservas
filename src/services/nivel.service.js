import { http } from "./http.service";

export function saveLevel(data){
  return http().post('/api/1.0/nivel/register', data)
}

export function getLevels(){
  return http().get('/api/1.0/nivel/todos')
}

export function getLevel(id_nivel){
  return http().get(`/api/1.0/nivel/${id_nivel}`)
}

export function modifyLevel(data){
  return http().put('/api/1.0/nivel', data)
}
