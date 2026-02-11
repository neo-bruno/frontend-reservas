<template>
  <div></div>
  <v-row>
    <v-col cols="12" md="8">
      <v-card class="pa-4 mb-4">
        <div class="d-flex align-center justify-space-between">
          <div>
            <h3 class="mb-1">Bienvenido, {{ user?.nombre || 'amigo' }}</h3>
            <p class="mb-0">Resumen rápido de tus reservas y actividad</p>
          </div>
          <v-btn color="primary" @click="$router.push({ name: 'cliente-reservas' })">Ver mis reservas</v-btn>
        </div>
      </v-card>
      <v-card class="pa-4">
        <h4>Reservas recientes</h4>
        <v-skeleton-loader v-if="loading" type="list-item-two-line" :loading="loading" />


        <div v-else>
          <v-row>
            <v-col v-for="r in reservas.slice(0, 3)" :key="r.id" cols="12" md="6">
              <v-card class="pa-3">
                <v-row>
                  <v-col cols="4">
                    <v-img :src="r.habitacion?.imagen || '/placeholder.jpg'" height="90" />
                  </v-col>
                  <v-col cols="8">
                    <div class="text-subtitle-1">{{ r.habitacion?.titulo || 'Habitación' }}</div>
                    <div class="text-caption">{{ formatRange(r.check_in, r.check_out) }} · {{ r.noches }} noches</div>
                    <div class="mt-2">
                      <v-chip :color="statusColor(r.estado)" small>{{ r.estado }}</v-chip>
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>


          <div v-if="reservas.length === 0" class="py-6 text-center">No tienes reservas todavía.</div>
        </div>
      </v-card>
    </v-col>

    <v-col cols="12" md="4">
      <v-card class="pa-4 mb-4">
        <h4>Acciones rápidas</h4>
        <v-list dense>
          <v-list-item @click="$router.push({ name: 'cliente-reservas' })">
            <v-list-item-icon><v-icon>mdi-bed</v-icon></v-list-item-icon>
            <v-list-item-title>Ver reservas</v-list-item-title>
          </v-list-item>
          <v-list-item @click="$router.push({ name: 'cliente-pagos' })">
            <v-list-item-icon><v-icon>mdi-cash</v-icon></v-list-item-icon>
            <v-list-item-title>Revisar pagos</v-list-item-title>
          </v-list-item>
          <v-list-item @click="$router.push({ name: 'cliente-datos' })">
            <v-list-item-icon><v-icon>mdi-account</v-icon></v-list-item-icon>
            <v-list-item-title>Editar mis datos</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card>


      <v-card class="pa-4">
        <h4>Notificaciones</h4>
        <div v-if="notifs.length === 0" class="text-center py-4">Sin notificaciones</div>
        <v-list v-else dense>
          <v-list-item v-for="n in notifs.slice(0, 4)" :key="n.id">
            <v-list-item-content>
              <v-list-item-title>{{ n.titulo }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption">{{ n.fecha }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
</template>



<script>
import { useReservasStore } from '@/stores/reservas'
import { useNotificacionesStore } from '@/stores/notificaciones'
import { useAuthStore } from '@/stores/auth'


export default {
  name: 'DashboardHome',
  data() {
    return { loading: true }
  },
  computed: {
    reservas() {
      const s = useReservasStore()
      return s.misReservas
    },
    notifs() {
      const n = useNotificacionesStore()
      return n.items
    },
    user() {
      const a = useAuthStore()
      return a.user
    }
  },
  methods: {
    formatRange(i, o) {
      return `${i} → ${o}`
    },
    statusColor(e) {
      if (e === 'Pendiente') return 'orange'
      if (e === 'Confirmada') return 'green'
      if (e === 'Cancelada') return 'red'
      return 'grey'
    }
  },
  async mounted() {
    const r = useReservasStore()
    const n = useNotificacionesStore()
    await Promise.all([r.fetchMisReservas(), n.fetch()])
    this.loading = false
  }
}
</script>
