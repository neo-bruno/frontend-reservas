import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// ------------ IMPORTA TUS VISTAS ------------------
import PaginaWeb from '@/layouts/public/PaginaWeb.vue'
import Home from '@/layouts/public/Home.vue'

import Habitaciones from '@/layouts/public/Habitaciones.vue'
import InicioReservaHabitacion from '@/components/pages/habitacion/reservar/InicioReservaHabitacion.vue'
import DescripcionHabitacion from '@/components/pages/habitacion/reservar/DescripcionHabitacion.vue'
import DescripcionReserva from '@/components/pages/habitacion/reservar/DescripcionReserva.vue'

// import DetalleHabitacion from '@/layouts/public/DetalleHabitacion.vue'
import Login from '@/layouts/public/Login.vue'
import RegistroUsuario from '@/components/layout/login/RegistroUsuario.vue'
import RecuperarUsuario from '@/components/layout/login/RecuperarUsuario.vue'
import RestaurarPassword from '@/components/layout/login/RestaurarPassword.vue'

// Cliente
import HistorialReservas from '@/layouts/client/HistorialReservas.vue'
import DatosPersonales from '@/layouts/client/DatosPersonales.vue'
import ReservaDetalle from '@/layouts/client/ReservaDetalle.vue'

import MisReservas from '@/layouts/client/MisReservas.vue'

import PerfilCliente from '@/layouts/client/PerfilCliente.vue'
import Notificaciones from '@/layouts/client/Notificaciones.vue'
import Preferencias from '@/layouts/client/Preferencias.vue'

// Admin
import AdminLayout from '@/layouts/admin/AdminLayout.vue'
import DashboardAdmin from '@/layouts/admin/DashboardAdmin.vue'
import ReservasAdmin from '@/layouts/admin/ReservasAdmin.vue'

import ServiciosHotelAdmin from '@/layouts/admin/servicios/ServiciosHotelAdmin.vue'
import NuevoServicioAdmin from '@/layouts/admin/servicios/NuevoServicioAdmin.vue'
import EditarServicioAdmin from '@/layouts/admin/servicios/EditarServicioAdmin.vue'

import PrincipalAdmin from '@/layouts/admin/pagina/PrincipalAdmin.vue'
import NosotrosAdmin from '@/layouts/admin/pagina/NosotrosAdmin.vue'
import ServiciosAdmin from '@/layouts/admin/pagina/ServiciosAdmin.vue'
import CaracteristicasAdmin from '@/layouts/admin/pagina/CaracteristicasAdmin.vue'
import TestimoniosAdmin from '@/layouts/admin/pagina/TestimoniosAdmin.vue'
import PiePaginaAdmin from '@/layouts/admin/pagina/PiePaginaAdmin.vue'

import HabitacionesAdmin from '@/layouts/admin/habitaciones/HabitacionesAdmin.vue'
import NuevaHabitacionAdmin from '@/layouts/admin/habitaciones/NuevaHabitacion.vue'
import EditarHabitacionAdmin from '@/layouts/admin/habitaciones/EditarHabitacionAdmin.vue'

import UsuariosAdmin from '@/layouts/admin/UsuariosAdmin.vue'
import NegociosAdmin from '@/layouts/admin/NegociosAdmin.vue'

import CategoriaHabitacionAdmin from '@/layouts/admin/habitaciones/categoria/CategoriaHabitacionAdmin.vue'
import NuevaCategoriaHabitacionAdmin from '@/layouts/admin/habitaciones/categoria/NuevaCategoriaHabitacionAdmin.vue'
import EditarCategoriaHabitacionAdmin from '@/layouts/admin/habitaciones/categoria/EditarCategoriaHabitacionAdmin.vue'

import NivelHabitacionesAdmin from '@/layouts/admin/habitaciones/nivel/NivelHabitacionesAdmin.vue'
import NuevoNivelHabitacionAdmin from '@/layouts/admin/habitaciones/nivel/NuevoNivelHabitacionAdmin.vue'
import EditarNivelHabitacionAdmin from '@/layouts/admin/habitaciones/nivel/EditarNivelHabitacionAdmin.vue'

import CamasHabitacionAdmin from '@/layouts/admin/habitaciones/camas/CamasHabitacionAdmin.vue'

// --------------- DEFINICIÓN DE RUTAS -----------------------
const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    children: [
      { path: '', name: 'pagina', component: PaginaWeb },

      { path: 'habitaciones', name: 'habitaciones', component: Habitaciones },
      // { path: 'habitacion/reserva/:id_habitacion', name: 'inicio_reserva', component: InicioReservaHabitacion },
      { path: 'habitacion/:id_habitacion', name: 'descripcion_habitacion', component: DescripcionHabitacion },
      { path: 'habitacion/reserva/:id_habitacion', name: 'descripcion_reserva', component: DescripcionReserva },
      // { path: 'habitacion/reserva', name: 'detalle-habitacion', component: DetalleHabitacion },

      { path: 'login', name: 'login', component: Login },
      { path: 'registro', name: 'registro-usuario', component: RegistroUsuario },
      { path: '/forgot-password', name: 'forgot-password', component: RecuperarUsuario },
      { path: '/reset-password', name: 'reset-password', component: RestaurarPassword },

      // CLIENTE (hijos de Home)// drawer → goTo('perfil-cliente')
      { path: 'cliente/perfil', name: 'perfil-cliente', component: PerfilCliente },

      { path: 'cliente/reservas', name: 'cliente-reservas', component: MisReservas },

      { path: 'cliente/reserva/:id', name: 'cliente-reserva-detalle', component: ReservaDetalle, props: true },
      { path: 'cliente/datos', name: 'cliente-datos', component: DatosPersonales },

      { path: 'cliente/historial', name: 'cliente-historial', component: HistorialReservas },

      { path: 'cliente/notificaciones', name: 'cliente-notificaciones', component: Notificaciones },
      { path: 'cliente/preferencias', name: 'cliente-preferencias', component: Preferencias },
    ]
  },

  // ADMIN
  {
    path: '/admin',
    name: 'admin_layout',
    component: AdminLayout,
    children: [
      { path: '', name: 'dashboard-admin', component: DashboardAdmin },
      { path: 'reservas', name: 'reservas-admin', component: ReservasAdmin },

      { path: 'servicios', name: 'servicios-admin', component: ServiciosHotelAdmin },
      { path: 'servicios/nuevo', name: 'nuevo-servicios-admin', component: NuevoServicioAdmin },
      { path: 'servicios/editar/:id_servicio', name: 'editar-servicios-admin', component: EditarServicioAdmin },

      { path: 'principal', name: 'principal-admin', component: PrincipalAdmin },
      { path: 'nosotros', name: 'nosotros-admin', component: NosotrosAdmin },
      { path: 'serviciosweb', name: 'serviciosweb-admin', component: ServiciosAdmin },
      { path: 'caracteristicas', name: 'caracteristicas-admin', component: CaracteristicasAdmin },
      { path: 'testimonios', name: 'testimonios-admin', component: TestimoniosAdmin },
      { path: 'piePagina', name: 'piePagina-admin', component: PiePaginaAdmin },

      // ESTA ES LA LINEA QUE ESTABA MAL
      { path: 'nivel-habitacion', name: 'nivel-admin', component: NivelHabitacionesAdmin },
      { path: 'nivel-habitacion/nuevo', name: 'nuevo-nivel-admin', component: NuevoNivelHabitacionAdmin },
      { path: 'nivel-habitacion/editar/:id_nivel', name: 'editar-nivel-admin', component: EditarNivelHabitacionAdmin },

      { path: 'tipo-habitacion', name: 'tipo-admin', component: CategoriaHabitacionAdmin },
      { path: 'categoria-habitacion/nueva', name: 'nueva-categoria-admin', component: NuevaCategoriaHabitacionAdmin },
      { path: 'categoria-habitacion/editar/:id_categoria', name: 'editar-categoria-admin', component: EditarCategoriaHabitacionAdmin },

      { path: 'cama-habitacion', name: 'cama-admin', component: CamasHabitacionAdmin },

      { path: 'habitaciones', name: 'habitaciones-admin', component: HabitacionesAdmin },
      { path: 'habitaciones/nueva', name: 'nueva-habitacion-admin', component: NuevaHabitacionAdmin },
      { path: 'habitaciones/editar/:id_habitacion', name: 'editar-habitacion-admin', component: EditarHabitacionAdmin },

      { path: 'usuarios', name: 'usuarios-admin', component: UsuariosAdmin },
      { path: 'negocios', name: 'negocios-admin', component: NegociosAdmin },
    ]
  }
]

// --------------- CREA EL ROUTER (DEBE ESTAR ANTES DEL beforeEach) -----------
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // volver a posición anterior (back)
    if (savedPosition) {
      return savedPosition
    }

    // siempre arriba al cambiar de página
    return { top: 0 }
  }
})

// ---------------------- 🚀 beforeEach DESPUÉS DEL createRouter ----------------------------
router.beforeEach((to, from, next) => {
  const rutasPublicas = [
    'pagina',
    'home',
    'habitaciones',
    'descripcion_habitacion',
    'descripcion_reserva',
    'login',
    'inicio_reserva',
    'forgot-password',
    'reset-password',
    'registro-usuario',
  ]

  const token = localStorage.getItem('token')
  const rol = localStorage.getItem('rol')

  // ✅ Rutas públicas → siempre permitir
  if (rutasPublicas.includes(to.name)) {
    return next()
  }

  // ❌ No logueado → sacar de rutas privadas
  if (!token) {
    return next({ name: 'pagina' })
  }

  // 🔐 Admin protection
  if (to.path.startsWith('/admin') && rol !== 'Admin') {
    return next({ name: 'pagina' })
  }

  // ✅ Todo OK
  next()
})


export default router
