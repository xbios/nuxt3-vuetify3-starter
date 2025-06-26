<template>
  <div class="text-center pa-4">
    <v-btn @click="dialog = true">
       Dialog Aç
    </v-btn>

    <v-dialog
      v-model="dialog"
      width="auto"
    >
      <v-card
        max-width="400"
        prepend-icon="mdi-update"
        text="Güncelleme tamamlandıktan sonra uygulamanız otomatik olarak yeniden başlayacaktır."
        title="Güncelleme devam ediyor"
      >
        <template v-slot:actions>
          <v-btn
            class="ms-auto"
            text="Tamam"
            @click="dialog = false"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        dialog: false,
      }
    },
  }
</script>