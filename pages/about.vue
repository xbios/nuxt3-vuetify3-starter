<template>
    <div>
        <v-card>
            <v-card-title class="text-h4">Hakkında</v-card-title>
            <v-card-text>
                <p>
                    Bu proje Nuxt 3 ve Vuetify 3 teknolojilerini kullanarak
                    modern web uygulamaları geliştirmek için hazırlanmış bir starter projesidir.
                </p>

                <v-divider class="my-4"></v-divider>

                <h3>Kullanılan Teknolojiler</h3>
                <v-chip-group>
                    <v-chip>Nuxt 3</v-chip>
                    <v-chip>Vue 3</v-chip>
                    <v-chip>Vuetify 3</v-chip>
                    <v-chip>TypeScript</v-chip>
                    <v-chip>Sass</v-chip>
                </v-chip-group>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup>
useHead({
    title: 'Hakkında - Nuxt 3 + Vuetify 3'
})
</script>