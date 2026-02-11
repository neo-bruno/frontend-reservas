<template>
  <div @click="volverAtras"><v-icon color="primary" class="ma-2" icon="mdi-undo"></v-icon>
    <span class="font-weight-light text-primary">volver atras</span>
  </div>
  <v-container class="pb-10 pt-0 text-center">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card elevation="6" class="pa-6 rounded-xl">

          <v-icon size="48" color="primary">mdi-qrcode</v-icon>
          <h2 class="text-h5 font-weight-bold mt-3">Pago por QR</h2>
          <p class="text-grey-darken-1">Escanea el siguiente código QR para realizar el pago.</p>

          <!-- Monto a pagar -->
          <div class="my-4 text-h6 font-weight-bold text-success">
            Total: {{ total }} Bs.-
          </div>

          <!-- QR -->
          <v-img v-if="tiempoRestante > 0" :src="qrImageUrl" max-width="250" class="mx-auto my-4"
            alt="Código QR de pago" aspect-ratio="1" contain></v-img>

          <div class="d-flex justify-center">
            <v-alert v-if="tiempoRestante > 0" max-width="300" type="info" color="terceary" class="mb-4" dense>
              Tiempo para pagar: <strong>{{ minutos }}:{{ segundos }}</strong>
            </v-alert>

            <v-alert v-else type="error" max-width="320" color="#D32F2F" class="mb-4">
              El tiempo de pago ha expirado.
            </v-alert>
          </div>
          <v-row>
            <v-col cols="12">
              <v-btn v-if="tiempoRestante > 0" color="success" variant="outlined" :href="qrImageUrl"
                download="qr-pago.png">
                <v-icon start icon="mdi-download" />
                Descargar QR
              </v-btn>

              <v-btn v-else color="primary" variant="flat" @click="reiniciar">
                <v-icon start icon="mdi-qrcode" /> Generar QR
              </v-btn>
            </v-col>

            <v-col cols="12">
              <!-- Confirmar pago -->
              <v-btn v-if="tiempoRestante > 0" color="primary" @click="confirmarPago">
                <v-icon start icon="mdi-check-circle-outline" />
                Ya realicé el pago
              </v-btn>
            </v-col>
          </v-row>


          <!-- Opcional: Detalles -->
          <!-- <v-row class="text-left mt-6">
            <v-col cols="12" sm="6">
              <div class="text-subtitle-2">Habitación</div>
              <div class="font-weight-medium">{{ habitacion.nombre }}</div>

              <div class="text-subtitle-2 mt-4">Fechas</div>
              <div>{{ checkIn }} → {{ checkOut }}</div>
            </v-col>

            <v-col cols="12" sm="6">
              <div class="text-subtitle-2">Teléfono</div>
              <div>{{ telefono }}</div>

              <div class="text-subtitle-2 mt-4">Código Provisional</div>
              <div class="text-grey">{{ codigoReserva }}</div>
            </v-col>
          </v-row> -->


        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import QRCode from "qrcode";

export default {

  data() {
    return {
      habitacion: { nombre: '102 - Matrimonial' },
      checkIn: '2025-06-21',
      checkOut: '2025-06-26',
      noches: 5,
      total: 3,
      telefono: '77409001',
      codigoReserva: 'DJL2',
      qrImageUrl: "", // Puedes usar una imagen local o generada
      tiempoRestante: 100, // 10 minutos en segundos
      timer: null,
    };
  },
  computed: {
    minutos() {
      return Math.floor(this.tiempoRestante / 60).toString().padStart(2, "0");
    },
    segundos() {
      return (this.tiempoRestante % 60).toString().padStart(2, "0");
    },
  },
  methods: {
    volverAtras() {
      this.$router.go(-1)
    },
    reiniciar() {
      this.$router.go(0)
    },
    generarQR() {
      const contenidoQR = this.generarQRSimple({
        cuenta: "12345678900",
        nombre: "FAMILIA FELIPEZ",
        ciudad: "SANTA CRUZ",
        monto: this.total,
      });

      QRCode.toDataURL(contenidoQR, (err, url) => {
        if (!err) this.qrImageUrl = url;
      });
    },
    generarQRSimple({ cuenta, nombre, ciudad, monto = "" }) {
      const payloadFormat = "000201";
      const initiationMethod = "010212";
      const boliviaID = "0016A000000677010112";
      const cuentaTag = `0117${"011450450000" + cuenta}`;
      const merchantAccount = `2637${boliviaID}${cuentaTag}`;
      const mcc = "52040000";
      const currency = "5303684";
      const montoFormateado = monto ? `5405${parseFloat(monto).toFixed(2)}` : "";
      const pais = "5802BO";
      const nombreTag = `59${nombre.length.toString().padStart(2, "0")}${nombre}`;
      const ciudadTag = `60${ciudad.length.toString().padStart(2, "0")}${ciudad}`;

      return [
        payloadFormat,
        initiationMethod,
        merchantAccount,
        mcc,
        currency,
        montoFormateado,
        pais,
        nombreTag,
        ciudadTag,
      ]
        .filter(Boolean)
        .join("");
    },
    confirmarPago() {
      if (this.tiempoRestante <= 0) {
        this.$toast?.error("El tiempo ha expirado. Por favor vuelve a generar tu reserva.");
        return;
      }
      // Aquí podrías validar en backend o simplemente pasar a la siguiente pantalla
      this.$router.push({
        name: "finalizar_reserva",
        // query: {
        //   habitacion: JSON.stringify(this.habitacion),
        //   checkIn: this.checkIn,
        //   checkOut: this.checkOut,
        //   noches: 2,
        //   total: this.total,
        //   telefono: this.telefono,
        //   codigoReserva: this.codigoTemporal,
        // },
      });
    },
  },
  mounted() {
    this.generarQR();

    this.timer = setInterval(() => {
      if (this.tiempoRestante > 0) {
        this.tiempoRestante--;
      } else {
        clearInterval(this.timer);
      }
    }, 1000);

    // const contenidoQR = this.generarQRSimple({
    //   cuenta: "12345678900", // Tu cuenta real del Banco Santa Cruz
    //   nombre: "FAMILIA FELIPEZ",
    //   ciudad: "SANTA CRUZ",
    //   monto: this.total,
    // });

    // QRCode.toDataURL(contenidoQR, (err, url) => {
    //   if (!err) {
    //     this.qrImageUrl = url;
    //   }
    // });
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
};
</script>
