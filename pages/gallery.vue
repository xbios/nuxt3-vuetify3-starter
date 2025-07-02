<template>
  <div class="text-center pa-4">
    <v-btn @click="dialog = true">
       Dialog Aç
    </v-btn>

    <NuxtExample dir="features/state-management">
    <p>Counter: {{ counter }}</p>
    <div class="flex gap-2 my-4">
      <v-btn @click="counter--">
        -
      </v-btn>
      <v-btn @click="counter++">
        +
      </v-btn>
    </div>    
    <p>Same Counter: {{ sameCounter }}</p>
  </NuxtExample>

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

<script setup>
const dialog = ref(false)
const loading = ref(false)
const counter = useState('counter', () => Math.round(Math.random() * 1000))
const sameCounter = useState('counter')
</script>
