import { http } from "./http.service";

export function getBeds(){
  return http().get('/api/1.0/cama/all')
}
