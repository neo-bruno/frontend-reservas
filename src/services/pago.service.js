import { http } from "./http.service";

export function savePay(data){
  return http().post('/api/1.0/pago/register', data)
}

export function getPayments(){
  return http().get('/api/1.0/pago')
}

export function getAllPaymentsBooking(id_reserva){
  return http().get(`/api/1.0/pago/${id_reserva}`)
}

export function modifyPay(data){
  return http().put('/api/1.0/pago', data)
}
