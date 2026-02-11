import { http } from "./http.service";

export function getYears(){
  return http().get('/api/1.0/reporte')
}

export function getReportMonth(ano){
  return http().get(`/api/1.0/reporte/${ano}`)
}

export function getReportGraphic(ano, mes){
  return http().get(`/api/1.0/reporte/obtener/reporte/grafico/${ano}/${mes}`)
}

export function getMonthsYear(ano){
  return http().get(`/api/1.0/reporte/meses/${ano}`)
}

export function getMonthlyReport(ano, mes){
  return http().get(`/api/1.0/reporte/obtener/${ano}/${mes}`)
}

export function getReport(ano, mes, where){
  return http().get(`/api/1.0/reporte/obtener/${ano}/${mes}/${where}`)
}

