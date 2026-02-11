<template>
  <v-container class="pa-4">

    <!-- OPCIONES DE PAGO -->
    <p class="pb-1" style="font-size: .9rem;"><strong>Para confirmar su reserva</strong> pague con uno de los
      siguientes montos (en bolivianos)</p>
    <div class="d-flex justify-space-evenly">
      <div class="bg-success text-center px-2">
        <p style="font-size: .7rem;">comision</p>
        <span style="font-size: 1.2rem;">${{ reserva.servicio_reserva }}</span>
      </div>
      <div class="bg-success text-center px-2">
        <p style="font-size: .7rem;">comision + 1 noche</p>
        <span style="font-size: 1.2rem;">${{ parseInt(reserva.servicio_reserva) +
          parseInt(reserva.habitacion.categoria.precio_ahora_categoria) }}</span>
      </div>
      <div class="bg-success text-center px-2">
        <p style="font-size: .7rem;">total reserva</p>
        <span style="font-size: 1.2rem;">${{ parseFloat(reserva.monto_total_reserva) }}</span>
      </div>
    </div>

    <!-- QR -->
    <div v-if="negocio" class="text-center my-4">
      <img :src="negocio.url_negocio" width="220" />
      <p style="font-size: .8rem;" class="mt-2 font-weight-light">
        <strong>Nota:</strong> Envíe el comprobante de pago por WhatsApp para confirmar su reserva.
      </p>
    </div>

    <!-- ACCIONES -->
    <v-row class="mt-4">
      <v-col cols="6">
        <v-btn block color="success" prepend-icon="mdi-content-save" @click="guardarQr">
          guardar
        </v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn block color="error" prepend-icon="mdi-file-pdf-box" @click="descargarPdf">
          descargar
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-btn block color="primary" prepend-icon="mdi-check" @click="abrirDialogoPago">
          Ya realize el pago!
        </v-btn>
      </v-col>
    </v-row>

  </v-container>

  <!-- dialogo para ver la reserva -->
  <v-dialog v-model="dialogoPago" transition="dialog-bottom-transition" :fullscreen="$vuetify.display.xs"
    :max-width="$vuetify.display.xs ? undefined : 470" persistent scrollable>
    <v-card class="px-0">

      <v-toolbar class="text-center font-weight-medium text-wrap bg-primary" title="Confirmacion de Pago"></v-toolbar>

      <v-card-text class="px-0 py-0">
        <v-container>
          <v-form ref="formulario" @submit.prevent="">
            <v-row>
              <v-col cols="12">
                <div class="d-flex justify-space-evenly">
                  <div class="bg-success text-center px-2" @click="elejirMonto(1)">
                    <p style="font-size: .7rem;">comision</p>
                    <span style="font-size: 1.2rem;">${{ reserva.servicio_reserva }}</span>
                  </div>
                  <div class="bg-success text-center px-2" @click="elejirMonto(2)">
                    <p style="font-size: .7rem;">comision + 1 noche</p>
                    <span style="font-size: 1.2rem;">${{ parseInt(reserva.servicio_reserva) +
                      parseInt(reserva.habitacion.categoria.precio_ahora_categoria) }}</span>
                  </div>
                  <div class="bg-success text-center px-2" @click="elejirMonto(3)">
                    <p style="font-size: .7rem;">total reserva</p>
                    <span style="font-size: 1.2rem;">${{ parseFloat(reserva.monto_total_reserva) }}</span>
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-row justify="end" no-gutters>
              <v-col cols="7" class="py-4">
                <v-text-field ref="monto" v-model="pago.monto_pago" density="compact" placeholder="ingrese"
                  prepend-inner-icon="mdi-cash-plus" variant="outlined" label="Monto de Pago (*)"
                  :rules="[rules.required, rules.soloNumeroODecimal]"
                  @keyup.enter.prevent="setFocus('url')"></v-text-field>
              </v-col>
              <v-col cols="6">

              </v-col>
              <v-col cols="12">
                <v-file-input label="subir el comprobante (*)" prepend-icon="mdi-upload" variant="outlined"
                  :rules="[rules.required, rules.reglaContieneLetra]" clearable accept="image/*"
                  @update:model-value="onSelectQR" @keyup.enter.prevent="setFocus('monto')"/>

                <v-img v-if="pago.url_pago" :src="pago.url_pago" max-width="auto" aspect-ratio="0" />
              </v-col>
            </v-row>
            <v-row justify="end">
              <v-btn variant="elevated" prepend-icon="mdi-content-save" append-icon="mdi-chevron-right" color="success" @click="cambiarEstadoReserva">guardar el comprobante</v-btn>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="elevated" color="primary" @click="cerrarDialogoPago">Cerrar</v-btn>
      </v-card-actions>

    </v-card>
  </v-dialog>

  <!-- capa protectora de proceso -->
  <v-overlay :model-value="overlay" class="align-center justify-center" persistent>
    <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
  </v-overlay>
</template>

<script>
import { saveFile } from '@/services/imagen.service';
import { getBusiness } from '@/services/negocio.service';
import { savePay } from '@/services/pago.service';
import { modifyBooking } from '@/services/reserva.service';
import jsPDF from 'jspdf'
import moment from 'moment'
import 'moment/locale/es'

export default {
  name: 'PagarPorQr',

  props: {
    reserva: Object,
    montos: Object
  },

  data() {
    return {
      opcionPago: null,
      qrData: null,

      negocio: {},
      pago: {
        monto_pago: 0,
        tipo_pago: 2, //efectivo = 1, online = 2
        metodo_pago: 2, //efectivo = 1, por qr = 2, transaccion = 3
        comision_pago: 0,
        fecha_pago: null,
        estado_pago: 1, // espera = 1, confirmado = 2, cancelado = 3
        url_pago: ''
      },

      rules: {
        required: value => !!value || 'El campo es requerido.',
        reglaContieneLetra: v =>
          /[a-zA-ZáéíóúÁÉÍÓÚñÑ]/.test(v) || 'Debe contener al menos una letra',
        soloLetrasYEspacios: v =>
          /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(v) || 'Solo se permiten letras y espacios',
        soloLetrasSinEspacios: v =>
          /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/.test(v) || 'Solo se permiten letras sin espacios',
        reglaDosPalabras: v =>
          typeof v === 'string' && v.trim().split(/\s+/).length >= 2 || 'Debe contener al menos dos palabras',
        soloLetrasONumerosSinEspacios: v =>
          /^[a-zA-Z0-9]+$/.test(v) || 'Solo se permiten letras o números, sin espacios',
        letrasONumerosSinSoloEspacios: v =>
          (typeof v === 'string' && v.trim().length > 0) || 'No se permite solo espacios',
        soloNumeroODecimal: v =>
          (!!v && /^[0-9]+(\.[0-9]+)?$/.test(v)) || 'Solo números enteros o decimales',
      },

      dialogoPago: false,

      // paralizando pantalla
      overlay: false,
      errores: false,
    }
  },
  watch: {
    overlay(val) {
      val && setTimeout(() => {
        this.overlay = false
      }, 100000)
    },
  },
  computed: {
  },

  methods: {

    async descargarPdf() {
      if (!this.negocio?.url_negocio) {
        alert('No hay QR para generar el PDF')
        return
      }

      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()

      // ===== HEADER =====
      pdf.setFontSize(16)
      pdf.setFont('helvetica', 'bold')
      pdf.text('CONFIRMACIÓN DE RESERVA - PAGO QR', pageWidth / 2, 20, { align: 'center' })

      pdf.setLineWidth(0.5)
      pdf.line(20, 25, pageWidth - 20, 25)

      // ===== DATOS =====
      pdf.setFontSize(11)
      pdf.setFont('helvetica', 'normal')

      let y = 30
      pdf.text(`Cliente: ${this.reserva.usuario.nombre_usuario || ''}`, 20, y)
      y += 8
      pdf.text(`Monto total: Bs ${this.reserva.monto_total_reserva}`, 20, y)
      y += 8
      pdf.text(`Check-in: ${this.formatearFecha(this.reserva.check_in_reserva)}`, 20, y)
      y += 8
      pdf.text(`Check-out: ${this.formatearFecha(this.reserva.check_out_reserva)}`, 20, y)

      // ===== QR =====
      const img = await this.cargarImagenBase64(this.negocio.url_negocio)

      const qrWidth = 90
      const qrHeight = 130  // <-- alto casi el doble
      const qrX = (pageWidth - qrWidth) / 2
      const qrY = y + 10

      pdf.addImage(img, 'PNG', qrX, qrY, qrWidth, qrHeight)

      // ===== TEXTO QR =====
      pdf.setFontSize(10)
      pdf.text(
        'Escanee este QR para realizar el pago',
        pageWidth / 2,
        qrY + qrHeight + 10,
        { align: 'center' }
      )

      pdf.setFont('helvetica', 'bold')
      pdf.text(
        this.negocio.nombre_titular || 'Cuenta del negocio',
        pageWidth / 2,
        qrY + qrHeight + 18,
        { align: 'center' }
      )

      // ===== NOTA =====
      pdf.setFont('helvetica', 'normal')
      pdf.setFontSize(9)
      pdf.text(
        'Nota: Envíe el comprobante de pago por WhatsApp para confirmar su reserva.',
        pageWidth / 2,
        230,
        { align: 'center', maxWidth: 160 }
      )

      // ===== DESCARGA =====
      pdf.save(`Reserva-QR-${this.reserva.id_reserva || Date.now()}.pdf`)
    },

    guardarQr() {
      if (!this.negocio?.url_negocio) {
        alert('No hay QR para guardar')
        return
      }

      const link = document.createElement('a')
      link.href = this.negocio.url_negocio
      link.download = `QR-reserva-${this.reserva.id_reserva || Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    cargarImagenBase64(url) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
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
    },
    formatearFecha(fecha) {
      return moment(fecha, 'YYYY-MM-DD').format('ddd, DD-MMM-YYYY')
    },
    setFocus(refName) {
      const el = this.$refs[refName]

      // Vuetify envuelve el input, por eso:
      if (el?.$el) {
        const input = el.$el.querySelector('input')
        input?.focus()
      }
    },
    elejirMonto(indice){
      this.setFocus('monto')
      switch(indice){
        case 1:
          this.pago.monto_pago = this.reserva.servicio_reserva
        break;
        case 2:
          this.pago.monto_pago = parseInt(this.reserva.servicio_reserva) + parseInt(this.reserva.habitacion.categoria.precio_ahora_categoria)
        break;
        case 3:
          this.pago.monto_pago = this.reserva.monto_total_reserva
        break;
      }
    },

    // dialogo de pago para confirmar la reserva
    onSelectQR(file) {
      // 🔴 Presionó la X o no hay archivo
      if (!file) {
        if (this.pago.url_pago) {
          URL.revokeObjectURL(this.pago.url_pago)
        }
        this.pago.url_pago = null
        this.pago.file = null
        return
      }

      // 🔴 Validar tipo (ya sabemos que file existe)
      if (!file.type || !file.type.startsWith('image/')) {
        alert('Solo imágenes')
        return
      }

      // 🟢 Seleccionó archivo válido
      this.pago.file = file
      this.pago.url_pago = URL.createObjectURL(file)
    },
    async abrirDialogoPago() {
      this.dialogoPago = true
      await this.$nextTick(() => {
        this.setFocus('monto')
      })
    },
    cerrarDialogoPago() {
      this.dialogoPago = false
    },

    async cambiarEstadoReserva() {
      this.reserva.estado_reserva = 2
      this.pago.id_reserva = this.reserva.id_reserva

      try {
        const { valid } = await this.$refs.formulario.validate()
        this.$nextTick(async () => {
          // Simular login
          this.overlay = true;
          if (valid) {

            if (this.pago.file) {
              const formdata = new FormData()
              formdata.append('file', this.pago.file)

              const res = await saveFile(formdata)

              if (res.status !== 200) {
                throw new Error('Error al subir imagen')
              }

              this.pago.url_pago = res.data

              setTimeout(async () => {
                this.overlay = false
                let resp = await savePay(this.pago)
                if(resp.status == 200){
                    let res = await modifyBooking(this.reserva)
                    if (res.status == 200) {
                    this.$swal({
                      title: "Reserva en Proceso de Verificacion!",
                      text: `una notificacion le llego al administrador, encuanto lo verifique la reserva cambiara de estado a CONFIRAMDO!!!`,
                      icon: "success",
                      timer: 4000,
                      didClose: () => {
                        this.overlay = false
                        this.$router.go(0)
                      }
                    })
                  }
                }
              }, 1000);
            }
            return true
          } else {
            this.$swal({
              title: "Error!",
              text: `No puede estar vacio el campo requerido`,
              icon: "error",
              timer: 2500,
              didClose: () => {
                this.overlay = false
                this.setfocus('monto')
              }
            })
          }
        })
      } catch (error) {
        this.overlay = false  // <-- cerrar overlay ANTES del swal

        this.$swal({
          title: "Error!",
          text: error.response?.data?.error || "Ocurrió un error",
          icon: "error",
          timer: 1500
        })
      }
    },

    async obtenerNegocio() {
      try {
        let res = await getBusiness(1)
        if (res.status == 201 && res.data.data.length > 0) {
          this.negocio = res.data.data[0]
        }
      } catch (error) {
        console.log(error)
      }
    },
  },
  mounted() {
    this.obtenerNegocio()
  }
}
</script>
