import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import vuetify from './plugins/vuetify'

import './assets/styles.css'

import moment from 'moment'

moment.locale('es', {
  months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
  monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
  weekdays: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
  weekdaysShort: 'Dom_Lun_Mar_Mie_Jue_Vier_Sab'.split('_'),
  weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
}
)

// banderas de paises
import 'flag-icons/css/flag-icons.min.css';
import 'v-phone-input/dist/v-phone-input.css';
import { createVPhoneInput } from 'v-phone-input';
import { VAutocomplete } from 'vuetify/components';

// Ventana Dialogo Sweetalert2
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

const options = {
  confirmButtonColor: '#242322ff',
  cancelButtonColor: '#b91300ff',
}

const app = createApp(App)

const vPhoneInput = createVPhoneInput({
  countryIconMode: 'svg',
  enableSearchingCountry: true
});

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.component('VAutocomplete', VAutocomplete);
app.use(vPhoneInput);
app.use(VueSweetalert2, options)
app.mount('#app')
