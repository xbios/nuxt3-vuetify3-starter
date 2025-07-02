<template>
    <div>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title class="text-h4 text-center">
                        Nuxt 3 + Vuetify 3 Starter
                    </v-card-title>
                    <v-card-text>
                        <p class="text-center">
                            Modern web uygulaması geliştirmek için hazır starter proje
                        </p>
                        
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-row class="mt-4">
            <v-col cols="12" md="4" v-for="feature in features" :key="feature.title">
                <v-card height="200">
                    <v-card-title>
                        <v-icon :icon="feature.icon" class="mr-2"></v-icon>
                        {{ feature.title }}
                    </v-card-title>
                    <v-card-text>
                        {{ feature.description }}
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <v-row class="mt-4">
            <v-col cols="12">
                <v-card>
                    <v-card-title>Başlangıç</v-card-title>
                    <v-card-text>
                        <v-btn color="primary" size="large" class="mr-2">
                            Başla
                        </v-btn>
                        <v-btn variant="outlined" size="large">
                            Dokümantasyon
                        </v-btn>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
const features = [
    {
        title: 'Nuxt 3',
        icon: 'mdi-nuxt',
        description: 'Modern Vue.js framework ile güçlü web uygulamaları'
    },
    {
        title: 'Vuetify 3',
        icon: 'mdi-material-design',
        description: 'Material Design bileşenleri ile güzel arayüzler'
    },
    {
        title: 'TypeScript',
        icon: 'mdi-language-typescript',
        description: 'Tip güvenli kod yazımı için TypeScript desteği'
    }
]

useHead({
    title: 'Ana Sayfa - Nuxt 3 + Vuetify 3'
})


</script>