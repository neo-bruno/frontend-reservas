import { http } from '@/services/http.service'

export function login(data) {
  return http().post('/api/1.0/usuario/login', data)
}

export function register(data) {
  return http().post('/api/1.0/usuario/register', data)
}

export function modifyUser(data){
  return http().put('/api/1.0/usuario', data)
}

export function getUserPerson(id_persona) {
  return http().get(`/api/1.0/usuario/${id_persona}`)
}

export function getUserCellphone(telefono_usuario){
  return http().get(`/api/1.0/usuario/buscar/${telefono_usuario}`)
}

export function verifyToken() {
  return http().post('/api/1.0/usuario/verificacion/token')
}
