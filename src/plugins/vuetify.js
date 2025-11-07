/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
  },
  theme: {
    defaultTheme: 'myTheme',
    themes: {
      myTheme: {
        dark: false,
        colors: {
          cero: '#F5F5F5',
          primary: '#242322ff',     // gris oscuro
          secondary: '#A88C4D',   // beige
          terceary: '#FAF7F0',   // blanco
          // cuartary: '#767676',
          // quintary: '#bfa873',
          // sextary: '#f8f5f1',
          // septary: '#A88C4D',
          // octary: '#D6D6D6',
          accent: '#000000',
          error: '#b91300ff',
          info: '#2196f3',
          success: '#4caf50',
          warning: '#ff9800',
          background: '#ffffff',
          surface: '#f5f5f5',
        },
      },
    },
  },
});
