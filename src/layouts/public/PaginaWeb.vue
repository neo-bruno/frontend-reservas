<template>

  <PrincipalWeb />
  <NosotrosWeb />
  <ServiciosWeb />
  <CaracteristicasWeb />
  <TestimoniosWeb />
  <FooterWeb />
</template>

<script>

import PrincipalWeb from '@/components/pages/Principal.web.vue';
import NosotrosWeb from '@/components/pages/Nosotros.web.vue';
import ServiciosWeb from '@/components/pages/Servicios.web.vue';
import CaracteristicasWeb from '@/components/pages/Caracteristicas.web.vue';
import TestimoniosWeb from '@/components/pages/Testimonios.web.vue';
import FooterWeb from '@/components/pages/Footer.web.vue';

export default {
  components: {
    PrincipalWeb,
    NosotrosWeb,
    ServiciosWeb,
    CaracteristicasWeb,
    TestimoniosWeb,
    FooterWeb,
  },
  data: () => ({
    menu: false,

  }),
  methods: {
  },
  mounted() {

  }
}
</script>

<style lang="scss" scoped>
</style>
