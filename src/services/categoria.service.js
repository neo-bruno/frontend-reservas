import { http } from "./http.service";

export function saveCategory(data){
  return http().post('/api/1.0/categoria/register', data)
}

export function getCategories(){
  return http().get('/api/1.0/categoria/all')
}

export function getCategory(id_categoria){
  return http().get(`/api/1.0/categoria/${id_categoria}`)
}

export function modifyCategory(data){
  return http().put('/api/1.0/categoria', data)
}
