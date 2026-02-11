<!-- ReservaConfirmada.vue -->
<template>
  <v-container class="pb-10 text-center">
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card elevation="8" class="pa-6 rounded-xl">

          <v-icon color="green" size="60">mdi-check-circle</v-icon>
          <h2 class="text-h5 font-weight-bold mt-4">¡Reserva Confirmada!</h2>

          <p class="text-grey-darken-1">
            Te hemos enviado los detalles por WhatsApp al número <strong>{{ telefono }}</strong>.
          </p>

          <v-divider class="my-4"></v-divider>

          <!-- Detalles de la reserva -->
          <v-row>
            <v-col cols="6" class="text-left">
              <div class="text-subtitle-2">Habitación</div>
              <div class="font-weight-medium">{{ habitacion.nombre }}</div>

              <div class="text-subtitle-2 mt-4">Fechas</div>
              <div>{{ checkIn }} → {{ checkOut }}</div>

              <div class="text-subtitle-2 mt-4">Cantidad de noches</div>
              <div>{{ noches }} noche(s)</div>
            </v-col>

            <v-col cols="6" class="text-left">
              <div class="text-subtitle-2">Total</div>
              <div class="text-h6 font-weight-bold text-success">{{ total }} Bs</div>

              <div class="text-subtitle-2 mt-4">Código de reserva</div>
              <div class="text-grey">{{ codigoReserva }}</div>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <v-btn color="primary" class="ma-2" @click="descargarPDF">
            <v-icon start icon="mdi-file-pdf-box" />
            Descargar PDF
          </v-btn>


          <v-btn variant="text" @click="irInicio">
            Volver al Inicio
          </v-btn>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

import logoPNG from '@/assets/fenix.jpg'


export default {
  data: () => ({
    habitacion: { nombre: '102 - Matrimonial' },
    checkIn: '2025-06-21',
    checkOut: '2025-06-26',
    noches: 5,
    total: 1200,
    telefono: '77409001',
    codigoReserva: 'DJL2',
    logoUrl: 'https://i.ibb.co/NKYbB6G/logo-felipez.png' // Reemplaza por el logo real de tu hotel
  }),
  methods: {
    volverAtras() {
      this.$router.go(-1)
    },
    enviarWhatsApp() {
      const mensaje = `✅ Reserva Confirmada
🏨 Habitación: ${this.habitacion.nombre}
📆 Fechas: ${this.checkIn} → ${this.checkOut}
🛏 Noches: ${this.noches}
💵 Total: ${this.total} Bs
🔢 Código: ${this.codigoReserva}`

      const url = `https://wa.me/${this.telefono.replace('+', '')}?text=${encodeURIComponent(mensaje)}`
      window.open(url, "_blank")
    },
    irInicio() {
      this.$router.push("/cliente")
    },
    async descargarPDF() {
      const doc = new jsPDF()

      // Cargar imagen del logo
      const logo = await this.convertImgToBase64(logoPNG)

      if (logo) {
        doc.addImage(logo, 'PNG', 80, 10, 50, 20) // (imgData, format, x, y, width, height)
      }

      doc.setFontSize(18)
      doc.text('Confirmación de Reserva', 105, 40, { align: 'center' })

      doc.setFontSize(12)
      doc.text(`Nombre del cliente: Bruno`, 20, 60)
      doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 20, 68)

      autoTable(doc, {
        startY: 80,
        head: [['Habitación', 'Check-In', 'Check-Out', 'Noches', 'Total (Bs)', 'Código']],
        body: [[
          this.habitacion.nombre,
          this.checkIn,
          this.checkOut,
          this.noches,
          this.total + ' Bs',
          this.codigoReserva,
        ]],
        theme: 'striped',
        styles: { halign: 'center' },
        headStyles: {
          fillColor: [25, 118, 210],
          textColor: 255,
        },
      })

      doc.setFontSize(10)
      doc.text('Gracias por reservar con nosotros. ¡Te esperamos!', 20, doc.lastAutoTable.finalY + 20)

      doc.save(`reserva-${this.codigoReserva}.pdf`)
    },
    convertImgToBase64(url) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = function () {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0)
          resolve(canvas.toDataURL('image/png'))
        }
        img.onerror = reject
        img.src = url
      })
    }
  }
}
</script>
