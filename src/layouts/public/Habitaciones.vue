<template>
  <v-tabs v-model="tab" align-tabs="center" color="primary" show-arrows>
    <v-tab :value="1">Simples</v-tab>
    <v-tab :value="2">Matrimoniales</v-tab>
    <v-tab :value="3">Triple Matrimoniales</v-tab>
  </v-tabs>

  <v-tabs-window v-model="tab">
    <v-tabs-window-item :value="1">
      <v-container class="px-1">
        <v-row dense>
          <v-col v-for="(item, index) in alojamientos" :key="index" cols="12" sm="6" md="4" lg="3" xl="2">
            <HabitacionWeb :item="item" />
          </v-col>
        </v-row>
      </v-container>
    </v-tabs-window-item>

    <v-tabs-window-item :value="2">
    </v-tabs-window-item>

    <v-tabs-window-item :value="3">
    </v-tabs-window-item>
  </v-tabs-window>
</template>

<script>
import HabitacionWeb from '@/components/pages/Habitacion.web.vue';

export default {
  components: {
    HabitacionWeb,
  },
  data: () => ({
    tab: 1,
    alojamientos: [
      {
        imagenes: [
          'https://imgs.search.brave.com/-zgeYzKsPyRQKm2-EELs36WDC-qIZeePkGrGQyUkfFQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvOTM0/MTIzNTIwL2VzL2Zv/dG8vM2QtcmVuZGVy/LWx1am8tbW9kZXJu/by1kb3JtaXRvcmlv/LWVuLXN1aXRlLWVu/LWNvbXBsZWpvLWNv/bi1jdWFydG8tZGUt/YmElQzMlQjFvLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1M/OC05LTB1QWtLb0V4/dl9nSzNLejVNVUxO/REp6bF9zZlBxd2Ux/QXRlc193PQ',
          'https://imgs.search.brave.com/hmc5aL4K7YdxBjAKBH8_V0NgTc4VZyOqWLbqqxC9J4s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvOTU0/MTIxNDcwL2VzL2Zv/dG8vZGlzZSVDMyVC/MW8tYWNvZ2Vkb3It/YXBhcnRhbWVudG8t/dGlwby1lc3R1ZGlv/LWNvbi1kb3JtaXRv/cmlvLXktc2FsYS5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/cllNRUFHWW00cjdw/TXZKUWxmQ1J0NFhP/blVmZXY0NUdBc3RC/blZCVWp0VT0',
          'https://imgs.search.brave.com/2LQgpsGaftr5lflDvekYkWkDT8bsyBoyNNyfySI3CTg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTI2/OTQxNjcxNC9lcy9m/b3RvL2x1am9zby1h/cGFydGFtZW50by1w/cmluY2lwYWwtZG9y/bWl0b3Jpby1pbnRl/cmlvci1jb24tYmEl/QzMlQjFvLWNvbi1k/dWNoYS1ncmFuZGVz/LWF6dWxlam9zLWRl/LW0lQzMlQTFybW9s/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz1LX1ZGdzdJYnR1/Ti1UaUVsVmp1OHgy/THFqdjRERWdMYWsw/TnZJcVNZeUpnPQ',
          'https://imgs.search.brave.com/srfcKHCR92o0XG0IfGvyuLehnqX0bw3-xC7ANeIrqF4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/Zm90b3MtcHJlbWl1/bS9oYWJpdGFjaW9u/ZXMtaG90ZWwtbW9k/ZXJuYXMtZWxlZ2Fu/dGVzXzE0MTctODQ4/OC5qcGc_c2VtdD1h/aXNfaHlicmlkJnc9/NzQw',
        ],
        ubicacion: 'Castelldefels, España',
        nombre: 'Apartamento TW - Apartamentos de lujo',
        distancia: 9560,
        fecha: '18 – 23 de jun',
        precio: '$982 USD',
        noches: 5,
        rating: 4.74,
      },
      {
        imagenes: [
          'https://imgs.search.brave.com/uIxvQ0t_QZD2yCqcFscsMvOFp219hHdL9q-g0tw5HQc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTcz/NTg3MDQxL2VzL2Zv/dG8vZG9ybWl0b3Jp/by1kZWwtaG90ZWwu/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PU9CSzJyb0xpRUQ5/SlJyQUJreHppOGt2/OHdIanVtLU5oVVRt/Y29Mb3I3b1k9',
          'https://imgs.search.brave.com/bOQlGZ88cyXWhWwLF6HjJZ0lUi7VMYzM7yfnU5aAzBw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTIw/NzQ5MDI1NS9lcy9m/b3RvL3N0YW5kYXJk/LWhvdGVsLXJvb20t/aW4tYS1sdXh1cnkt/aG90ZWwtaW4tbW9z/Y293LmpwZz9zPTYx/Mng2MTImdz0wJms9/MjAmYz1TTFh6bFA0/Tm1tbk05REZySVRD/anN6dzZFM19xM2dp/WTQ3M2RnSE04WlJR/PQ',
          'https://imgs.search.brave.com/lv92cYlW-HCQeB1wpapaehzoJj2H8a0x115oezCzeHs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTMx/Mjg0MzI3My9lcy9m/b3RvL2ludGVyaW9y/LWZ1dHVyaXN0YS1k/ZS1sYS1oYWJpdGFj/aSVDMyVCM24tZGVs/LWhvdGVsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1ldkRa/Q2wwcUFJWEpFNm9v/VjJpUjhwdjNSeXNH/dDctYXI2eWRxYnU2/NVpNPQ',
        ],
        ubicacion: 'Madrid, España',
        nombre: 'Moderno loft con terraza',
        distancia: 10000,
        fecha: '16 – 21 de jun',
        precio: '$442 USD',
        noches: 5,
        rating: 4.89,
      },
      {
        imagenes: [
          'https://imgs.search.brave.com/-zgeYzKsPyRQKm2-EELs36WDC-qIZeePkGrGQyUkfFQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvOTM0/MTIzNTIwL2VzL2Zv/dG8vM2QtcmVuZGVy/LWx1am8tbW9kZXJu/by1kb3JtaXRvcmlv/LWVuLXN1aXRlLWVu/LWNvbXBsZWpvLWNv/bi1jdWFydG8tZGUt/YmElQzMlQjFvLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1M/OC05LTB1QWtLb0V4/dl9nSzNLejVNVUxO/REp6bF9zZlBxd2Ux/QXRlc193PQ',
          'https://imgs.search.brave.com/hmc5aL4K7YdxBjAKBH8_V0NgTc4VZyOqWLbqqxC9J4s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvOTU0/MTIxNDcwL2VzL2Zv/dG8vZGlzZSVDMyVC/MW8tYWNvZ2Vkb3It/YXBhcnRhbWVudG8t/dGlwby1lc3R1ZGlv/LWNvbi1kb3JtaXRv/cmlvLXktc2FsYS5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/cllNRUFHWW00cjdw/TXZKUWxmQ1J0NFhP/blVmZXY0NUdBc3RC/blZCVWp0VT0',
          'https://imgs.search.brave.com/2LQgpsGaftr5lflDvekYkWkDT8bsyBoyNNyfySI3CTg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTI2/OTQxNjcxNC9lcy9m/b3RvL2x1am9zby1h/cGFydGFtZW50by1w/cmluY2lwYWwtZG9y/bWl0b3Jpby1pbnRl/cmlvci1jb24tYmEl/QzMlQjFvLWNvbi1k/dWNoYS1ncmFuZGVz/LWF6dWxlam9zLWRl/LW0lQzMlQTFybW9s/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz1LX1ZGdzdJYnR1/Ti1UaUVsVmp1OHgy/THFqdjRERWdMYWsw/TnZJcVNZeUpnPQ',
          'https://imgs.search.brave.com/srfcKHCR92o0XG0IfGvyuLehnqX0bw3-xC7ANeIrqF4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/Zm90b3MtcHJlbWl1/bS9oYWJpdGFjaW9u/ZXMtaG90ZWwtbW9k/ZXJuYXMtZWxlZ2Fu/dGVzXzE0MTctODQ4/OC5qcGc_c2VtdD1h/aXNfaHlicmlkJnc9/NzQw',
        ],
        ubicacion: 'Castelldefels, España',
        nombre: 'Apartamento TW - Apartamentos de lujo',
        distancia: 9560,
        fecha: '18 – 23 de jun',
        precio: '$982 USD',
        noches: 5,
        rating: 4.74,
      },
      {
        imagenes: [
          'https://imgs.search.brave.com/uIxvQ0t_QZD2yCqcFscsMvOFp219hHdL9q-g0tw5HQc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTcz/NTg3MDQxL2VzL2Zv/dG8vZG9ybWl0b3Jp/by1kZWwtaG90ZWwu/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PU9CSzJyb0xpRUQ5/SlJyQUJreHppOGt2/OHdIanVtLU5oVVRt/Y29Mb3I3b1k9',
          'https://imgs.search.brave.com/bOQlGZ88cyXWhWwLF6HjJZ0lUi7VMYzM7yfnU5aAzBw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTIw/NzQ5MDI1NS9lcy9m/b3RvL3N0YW5kYXJk/LWhvdGVsLXJvb20t/aW4tYS1sdXh1cnkt/aG90ZWwtaW4tbW9z/Y293LmpwZz9zPTYx/Mng2MTImdz0wJms9/MjAmYz1TTFh6bFA0/Tm1tbk05REZySVRD/anN6dzZFM19xM2dp/WTQ3M2RnSE04WlJR/PQ',
          'https://imgs.search.brave.com/lv92cYlW-HCQeB1wpapaehzoJj2H8a0x115oezCzeHs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTMx/Mjg0MzI3My9lcy9m/b3RvL2ludGVyaW9y/LWZ1dHVyaXN0YS1k/ZS1sYS1oYWJpdGFj/aSVDMyVCM24tZGVs/LWhvdGVsLmpwZz9z/PTYxMng2MTImdz0w/Jms9MjAmYz1ldkRa/Q2wwcUFJWEpFNm9v/VjJpUjhwdjNSeXNH/dDctYXI2eWRxYnU2/NVpNPQ',
        ],
        ubicacion: 'Madrid, España',
        nombre: 'Moderno loft con terraza',
        distancia: 10000,
        fecha: '16 – 21 de jun',
        precio: '$442 USD',
        noches: 5,
        rating: 4.89,
      },
      {
        imagenes: [
          'https://imgs.search.brave.com/-zgeYzKsPyRQKm2-EELs36WDC-qIZeePkGrGQyUkfFQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvOTM0/MTIzNTIwL2VzL2Zv/dG8vM2QtcmVuZGVy/LWx1am8tbW9kZXJu/by1kb3JtaXRvcmlv/LWVuLXN1aXRlLWVu/LWNvbXBsZWpvLWNv/bi1jdWFydG8tZGUt/YmElQzMlQjFvLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1M/OC05LTB1QWtLb0V4/dl9nSzNLejVNVUxO/REp6bF9zZlBxd2Ux/QXRlc193PQ',
          'https://imgs.search.brave.com/hmc5aL4K7YdxBjAKBH8_V0NgTc4VZyOqWLbqqxC9J4s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvOTU0/MTIxNDcwL2VzL2Zv/dG8vZGlzZSVDMyVC/MW8tYWNvZ2Vkb3It/YXBhcnRhbWVudG8t/dGlwby1lc3R1ZGlv/LWNvbi1kb3JtaXRv/cmlvLXktc2FsYS5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/cllNRUFHWW00cjdw/TXZKUWxmQ1J0NFhP/blVmZXY0NUdBc3RC/blZCVWp0VT0',
          'https://imgs.search.brave.com/2LQgpsGaftr5lflDvekYkWkDT8bsyBoyNNyfySI3CTg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTI2/OTQxNjcxNC9lcy9m/b3RvL2x1am9zby1h/cGFydGFtZW50by1w/cmluY2lwYWwtZG9y/bWl0b3Jpby1pbnRl/cmlvci1jb24tYmEl/QzMlQjFvLWNvbi1k/dWNoYS1ncmFuZGVz/LWF6dWxlam9zLWRl/LW0lQzMlQTFybW9s/LmpwZz9zPTYxMng2/MTImdz0wJms9MjAm/Yz1LX1ZGdzdJYnR1/Ti1UaUVsVmp1OHgy/THFqdjRERWdMYWsw/TnZJcVNZeUpnPQ',
          'https://imgs.search.brave.com/srfcKHCR92o0XG0IfGvyuLehnqX0bw3-xC7ANeIrqF4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/Zm90b3MtcHJlbWl1/bS9oYWJpdGFjaW9u/ZXMtaG90ZWwtbW9k/ZXJuYXMtZWxlZ2Fu/dGVzXzE0MTctODQ4/OC5qcGc_c2VtdD1h/aXNfaHlicmlkJnc9/NzQw',
        ],
        ubicacion: 'Castelldefels, España',
        nombre: 'Apartamento TW - Apartamentos de lujo',
        distancia: 9560,
        fecha: '18 – 23 de jun',
        precio: '$982 USD',
        noches: 5,
        rating: 4.74,
      },
    ],
  }),
  methods: {
  },
  mounted() {

  }
}
</script>

<style lang="scss" scoped></style>
