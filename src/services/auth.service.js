import { http } from "./http.service";

export function verifyCode(data){
  return http().post('/api/1.0/auth/verify', data)
}

export function sendCodeWhatsapp(data){
  return http().post('/api/1.0/auth/enviar-codigo', data)
}

export function forgotPassword(data){
  return http().post('/api/1.0/auth/forgot-password', data)
}

export function resetPassword(data){
  return http().post('/api/1.0/auth/reset-password', data)
}
