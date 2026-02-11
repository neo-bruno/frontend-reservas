import { defineStore } from 'pinia'

export const useUsuarioStore = defineStore('usuario', {
  state: () => ({
    token: localStorage.getItem("token") || null,
    usuario: localStorage.getItem("usuario")
              ? JSON.parse(localStorage.getItem("usuario"))
              : null
  }),

  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem("token", token)
    },

    setUser(user) {
      this.usuario = user
      localStorage.setItem("usuario", JSON.stringify(user))
    },

    logout() {
      this.token = null
      this.usuario = null
      localStorage.removeItem("token")
      localStorage.removeItem("usuario")
    }
  }
})
