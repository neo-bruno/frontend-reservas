import axios from "axios"
import { url } from '@/utils/config'

export function http() {
  const token = localStorage.getItem('token')

  return axios.create({
    baseURL: url,
    headers: {
      Authorization: token ? `Bearer ${token}` : ""
    }
  })
}

export function httpFiles() {
  const token = localStorage.getItem('token')

  return axios.create({
    baseURL: url,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "multipart/form-data"
    }
  })
}
