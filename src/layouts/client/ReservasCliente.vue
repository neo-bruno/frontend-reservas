<template>
  <v-container>
    <h2 class="mb-4">Mis Reservas</h2>
    <v-card v-for="r in reservas" :key="r.id" class="mb-3" outlined>
      <v-card-title>{{ r.habitacion }}</v-card-title>
      <v-card-subtitle>Estado: {{ r.estado }}</v-card-subtitle>
      <v-card-text>
        Check-In: {{ r.check_in }} | Check-Out: {{ r.check_out }}
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" :to="`/cliente/reserva/${r.id}`">Ver Detalle</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    reservas: [
      { id: 1, habitacion: 'Suite Doble', estado: 'En proceso', check_in: '2025-11-05', check_out: '2025-11-08' },
      { id: 2, habitacion: 'Habitación Simple', estado: 'Confirmado', check_in: '2025-11-10', check_out: '2025-11-12' }
    ]
  }),
  methods: {

  },
  mounted() {

  }
}
</script>

<style lang="scss" scoped></style>
