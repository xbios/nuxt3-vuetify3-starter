<template>
    <div>
        <v-card>
            <v-card-title class="text-h4">İletişim</v-card-title>
            <v-card-text>
                <v-form @submit.prevent="submitForm">
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="form.name" label="Ad Soyad" required></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="form.email" label="E-posta" type="email" required></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-textarea v-model="form.message" label="Mesaj" required></v-textarea>
                        </v-col>
                        <v-col cols="12">
                            <v-btn type="submit" color="primary">
                                Gönder
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup>
const form = reactive({
    name: '',
    email: '',
    message: ''
})

const submitForm = () => {
    console.log('Form gönderildi:', form)
    // Form gönderme işlemi
}

useHead({
    title: 'İletişim - Nuxt 3 + Vuetify 3'
})
</script>