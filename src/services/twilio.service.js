import { http } from "./http.service";

export function sendOtpController(data){
  return http().post('/api/1.0/twilio/send-otp', data)
}

export function sendCodeWhatsapp(data){
  return http().post('/api/1.0/twilio/verify-otp', data)
}
