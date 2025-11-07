import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    usuario: null
  }),
  actions: {
    setUsuario(data) {
      this.usuario = data
    },
    logout() {
      this.usuario = null
    }
  },
  getters: {
    isAdmin: (state) => state.usuario?.rol === 'admin',
    isCliente: (state) => state.usuario?.rol === 'cliente'
  }
})
