import { createRouter, createWebHistory } from 'vue-router'
import PaginaWeb from '@/layouts/public/PaginaWeb.vue'
import Home from '@/layouts/public/Home.vue'
import Habitaciones from '@/layouts/public/Habitaciones.vue'
import DetalleHabitacion from '@/layouts/public/DetalleHabitacion.vue'
import Login from '@/layouts/public/Login.vue'

// Cliente
import DashboardCliente from '@/layouts/client/DashboardCliente.vue'
import ReservasCliente from '@/layouts/client/ReservasCliente.vue'
import DetalleReserva from '@/layouts/client/DetalleReserva.vue'
import PerfilCliente from '@/layouts/client/PerfilCliente.vue'

// Admin
import DashboardAdmin from '@/layouts/admin/DashboardAdmin.vue'
import ReservasAdmin from '@/layouts/admin/ReservasAdmin.vue'
import HabitacionesAdmin from '@/layouts/admin/HabitacionesAdmin.vue'
import UsuariosAdmin from '@/layouts/admin/UsuariosAdmin.vue'
import NegociosAdmin from '@/layouts/admin/NegociosAdmin.vue'

const routes = [
  // Público
  {
    path: '/', name: 'home', component: Home,
    children: [
      { path: '', name: 'pagina', component: PaginaWeb },
      { path: '/habitaciones', name: 'habitaciones', component: Habitaciones },
      { path: '/habitacion/:id', name: 'detalle-habitacion', component: DetalleHabitacion },
      { path: '/login', name: 'login', component: Login },
    ]
  },


  // Cliente
  {
    path: '/cliente',
    name: 'cliente_dashboard',
    component: DashboardCliente,
    children: [
      { path: 'reservas', name: 'reservas-cliente', component: ReservasCliente },
      { path: 'reserva/:id', name: 'detalle-reserva', component: DetalleReserva },
      { path: 'perfil', name: 'perfil-cliente', component: PerfilCliente }
    ]
  },

  // Admin
  {
    path: '/admin',
    name: 'admin_dashboard',
    component: DashboardAdmin,
    children: [
      { path: 'reservas', name: 'reservas-admin', component: ReservasAdmin },
      { path: 'habitaciones', name: 'habitaciones-admin', component: HabitacionesAdmin },
      { path: 'usuarios', name: 'usuarios-admin', component: UsuariosAdmin },
      { path: 'negocios', name: 'negocios-admin', component: NegociosAdmin }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
