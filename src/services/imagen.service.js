import { http } from '@/services/http.service'

export function deleteImage(id_imagen){
  return http().delete(`/api/1.0/imagen/${id_imagen}`)
}

export function modifyImage(data){
  return http().put('/api/1.0/imagen', data)
}

export function saveFile(data){
  return http().post('/api/1.0/imagen', data)
}

export function saveImage(data){
  return http().post('/api/1.0/imagen/register', data)
}
